import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={
          <div className="container text-center mt-5">
            <h1>404</h1>
            <h3>Page Not Found</h3>
            <p className="text-muted">Halaman yang Anda cari tidak ditemukan</p>
            <a href="/login" className="btn btn-primary mt-3">Kembali ke Login</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;