// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import AdminPanel from './AdminPanel';
import LoginPage from './LoginPage';
import ScanQrCode from './ScanQrCode';

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) navigate('/login');
  }, [navigate]);
  return children;
};

const App = () => {
  const token = localStorage.getItem('admin_token');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPanel token={token} />} />
        <Route path="/scan" element={
          <RequireAuth>
            <ScanQrCode token={token} />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
};

export default App;