import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/user/login', form);
      console.log('Login response:', res.data);
      
      if (res.data.success && res.data.data && res.data.data.token) {
        localStorage.setItem('token', res.data.data.token);
        navigate('/dashboard');
      } else {
        setError('Format response tidak sesuai. Silakan hubungi admin.');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || 'Login gagal';
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
          <h3 className="text-center mb-4">Login</h3>
          <p className="text-center text-muted mb-4">Masuk ke Dashboard Admin</p>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
              />
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
                'Login'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Belum punya akun?{' '}
              <Link to="/register" className="text-decoration-none">
                Daftar di sini
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;