import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(email, password);
      localStorage.setItem('admin_token', res.token);
      if (res.user && res.user.id) {
        localStorage.setItem('admin_userId', res.user.id);
      }
      navigate('/admin');
    } catch (err) {
      setError('Login gagal, cek email & password!');
    }
  };

  const handleGoogleLogin = () => {
    // window.location.href = '/api/v1/users/auth/google';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4 0%,#dbeafe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 360, width: '100%', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: 32 }}>
        <h2 style={{ textAlign: 'center', color: '#166534', marginBottom: 24, letterSpacing: 1 }}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }} />
          <button type="submit" style={{ background: '#166534', color: 'white', padding: '12px 0', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 16, marginTop: 8, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}>Login</button>
        </form>
        <button type="button" style={{ width: '100%', marginTop: 16, background: '#4285F4', color: 'white', padding: '12px 0', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }} onClick={handleGoogleLogin}>
          <svg width="20" height="20" viewBox="0 0 48 48" style={{ display: 'inline', verticalAlign: 'middle' }}><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.09 30.13 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.36 13.13 17.73 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.03l7.19 5.6C43.98 37.09 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29c-1.01-2.99-1.01-6.21 0-9.2l-7.98-6.2C.99 17.09 0 20.43 0 24c0 3.57.99 6.91 2.69 11.09l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.13 0 11.64-2.09 15.85-5.7l-7.19-5.6c-2.01 1.35-4.59 2.15-8.66 2.15-6.27 0-11.64-3.63-13.33-8.59l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/></g></svg>
          Login dengan Google
        </button>
        {error && <div style={{ color: '#dc2626', marginTop: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
