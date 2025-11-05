import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    stock: '', 
    price: '', 
    description: '',
    photo: null 
  });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      console.log('API Response:', res.data);
      let productsData = [];
      
      if (Array.isArray(res.data)) {
        productsData = res.data;
      } else if (res.data.data) {
        if (Array.isArray(res.data.data)) {
          productsData = res.data.data;
        } else if (res.data.data.rows) {
          productsData = res.data.data.rows;
        }
      } else if (res.data.rows) {
        productsData = res.data.rows;
      }
      
      console.log('Products Data:', productsData);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Gagal memuat data produk');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('stock', form.stock);
      formData.append('price', form.price);
      formData.append('description', form.description);
      
      if (form.photo) {
        formData.append('photo', form.photo);
      }

      if (editId) {
        await api.put(`/products/${editId}`, {
          name: form.name,
          stock: Number(form.stock),
          price: Number(form.price),
          description: form.description
        });
        setSuccess('Produk berhasil diupdate!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Produk berhasil ditambahkan!');
      }

      setForm({ name: '', stock: '', price: '', description: '', photo: null });
      setEditId(null);
      setShow(false);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        setLoading(true);
        await api.delete(`/products/${id}`);
        setSuccess('Produk berhasil dihapus!');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Gagal menghapus produk');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      stock: product.stock,
      price: product.price,
      description: product.description || '',
      photo: null
    });
    setEditId(product.id);
    setShow(true);
  };

  const handleAdd = () => {
    setForm({ name: '', stock: '', price: '', description: '', photo: null });
    setEditId(null);
    setShow(true);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Dashboard Admin</span>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      <Container className="py-4">
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Data Produk</h3>
          <Button variant="primary" onClick={handleAdd} disabled={loading}>
            + Tambah Produk
          </Button>
        </div>

        {loading && <div className="text-center my-3"><div className="spinner-border"></div></div>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Stok</th>
              <th>Harga</th>
              <th>Deskripsi</th>
              <th>Foto</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {!loading && products.length === 0 ? (
              <tr><td colSpan="7" className="text-center">Tidak ada data produk</td></tr>
            ) : (
              products.map((product, i) => (
                <tr key={product.id || i}>
                  <td>{i + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                  <td>{product.description || '-'}</td>
                  <td>
                    {product.photo ? (
                      <img src={product.photo} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    ) : '-'}
                  </td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(product)} disabled={loading}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)} disabled={loading}>Hapus</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Produk' : 'Tambah Produk'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nama Produk *</Form.Label>
                <Form.Control type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Stok *</Form.Label>
                <Form.Control type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Harga *</Form.Label>
                <Form.Control type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Form.Group>
              {!editId && (
                <Form.Group className="mb-3">
                  <Form.Label>Foto Produk *</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} required={!editId} />
                </Form.Group>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSave} disabled={loading || !form.name || !form.stock || !form.price || (!editId && !form.photo)}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default Dashboard;