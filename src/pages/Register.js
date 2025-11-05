import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';

function Register() {
  const [form, setForm] = useState({ 
    fullname: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/user/register', form);
      console.log('Register response:', res.data);
      
      if (res.data.success) {
        alert('Registrasi berhasil! Silakan login.');
        navigate('/login');
      } else {
        setError(res.data.message || 'Registrasi gagal');
      }
    } catch (err) {
      console.error('Register error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || 'Registrasi gagal';
        setError(errorMsg);
      } else if (err.request) {
        setError('Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.');
      } else {
        setError('Terjadi kesalahan: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '450px' }} className="shadow">
        <Card.Body className="p-5">
          <h3 className="text-center mb-4">Register</h3>
          <p className="text-center text-muted mb-4">Buat akun baru</p>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                name="fullname"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={form.fullname}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Password minimal 6 karakter
              </Form.Text>
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 mt-3" 
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Loading...
                </>
              ) : (
                'Daftar'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-decoration-none">
                Login di sini
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register;