import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';

const AuthModal = () => {
  const { 
    authModalOpen, 
    closeAuthModal, 
    authMode, 
    setAuthMode, 
    login, 
    register, 
    authError, 
    authLoading 
  } = useAuth();

  const { showToast, setActivePage } = useRestaurant();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      const res = await login(formData.email, formData.password);
      if (res?.success) {
        showToast(res.message);
        if (formData.email.toLowerCase().includes('admin')) {
          setActivePage('admin-dashboard');
        } else {
          setActivePage('my-orders');
        }
      }
    } else {
      // New registered accounts are standard Users
      const res = await register(formData.name, formData.email, formData.password, 'user');
      if (res?.success) {
        showToast(res.message);
        setActivePage('my-orders');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="auth-box" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: '420px', background: '#ffffff', borderRadius: '16px', padding: '36px 28px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', margin: 'auto' }}>
        <button 
          onClick={closeAuthModal} 
          style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ✕
        </button>

        <h2 className="auth-title" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', textAlign: 'center', fontSize: '28px', fontWeight: '900', marginBottom: '6px' }}>
          {authMode === 'login' ? 'Welcome Back' : 'Create Customer Account'}
        </h2>
        <p className="auth-subtitle" style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '13px', marginBottom: '24px' }}>
          {authMode === 'login' 
            ? 'Sign in to access your orders and bookings' 
            : 'Register for food ordering & table reservations'}
        </p>

        {authError && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>
            ⚠️ {authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="auth-input" 
                placeholder="Enter your full name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="auth-input" 
              placeholder="e.g. rahul@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              className="auth-input" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn" 
            disabled={authLoading}
            style={{ width: '100%', padding: '12px', background: 'var(--accent-dark)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '800', letterSpacing: '1px', cursor: 'pointer' }}
          >
            {authLoading ? 'Processing...' : authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* System Credentials note */}
        {authMode === 'login' && (
          <div style={{ marginTop: '16px', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
            👑 System Admin Login: <strong>admin@spicehaven.com</strong> / <strong>admin123</strong>
          </div>
        )}

        {/* Mode Switcher */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px' }}>
          {authMode === 'login' ? (
            <p style={{ color: 'var(--gray)' }}>
              Don't have an account?{' '}
              <button 
                onClick={() => setAuthMode('register')} 
                style={{ color: 'var(--accent-dark)', fontWeight: '800', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register here
              </button>
            </p>
          ) : (
            <p style={{ color: 'var(--gray)' }}>
              Already have an account?{' '}
              <button 
                onClick={() => setAuthMode('login')} 
                style={{ color: 'var(--accent-dark)', fontWeight: '800', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
