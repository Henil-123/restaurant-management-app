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
    password: '',
    role: 'user'
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
        if (formData.email.includes('admin')) {
          setActivePage('admin-dashboard');
        } else {
          setActivePage('my-orders');
        }
      }
    } else {
      const res = await register(formData.name, formData.email, formData.password, formData.role);
      if (res?.success) {
        showToast(res.message);
        if (formData.role === 'admin') {
          setActivePage('admin-dashboard');
        } else {
          setActivePage('my-orders');
        }
      }
    }
  };

  const fillDemoAdmin = async () => {
    setFormData({ name: 'Spice Haven Admin', email: 'admin@spicehaven.com', password: 'admin123', role: 'admin' });
    const res = await login('admin@spicehaven.com', 'admin123');
    if (res?.success) {
      showToast('Logged in as Admin! 👑');
      setActivePage('admin-dashboard');
    }
  };

  const fillDemoUser = async () => {
    setFormData({ name: 'Rahul Sharma', email: 'user@spicehaven.com', password: 'user123', role: 'user' });
    const res = await login('user@spicehaven.com', 'user123');
    if (res?.success) {
      showToast('Logged in as User! 👤');
      setActivePage('my-orders');
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="auth-box" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: '16px', padding: '36px 28px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', margin: 'auto' }}>
        <button 
          onClick={closeAuthModal} 
          style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ✕
        </button>

        <h2 className="auth-title">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {authMode === 'login' 
            ? 'Sign in as Admin or User to continue' 
            : 'Join Spice Haven for orders & table reservations'}
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
                placeholder="Enter your name" 
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
              placeholder="e.g. user@spicehaven.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
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

          {authMode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: '4px' }}>Account Role</label>
              <select 
                name="role" 
                className="auth-input" 
                value={formData.role} 
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '6px' }}
              >
                <option value="user">User (Order food &amp; Book table)</option>
                <option value="admin">Admin (Manage food, bookings &amp; bills)</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-btn" 
            disabled={authLoading}
            style={{ width: '100%', padding: '12px', background: 'var(--accent-dark)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '800', letterSpacing: '1px', cursor: 'pointer', marginTop: '8px' }}
          >
            {authLoading ? 'Processing...' : authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '11px', color: 'var(--gray)', textAlign: 'center', marginBottom: '10px', fontWeight: '800' }}>
            ⚡ 1-CLICK DEMO LOGIN ACCOUNTS:
          </p>
          <div className="demo-btn-group" style={{ display: 'flex', gap: '10px' }}>
            <button className="demo-btn" onClick={fillDemoAdmin} style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: '800', border: '1.5px solid var(--accent-dark)', background: '#f4f4f5', color: 'var(--accent-dark)', borderRadius: '6px', cursor: 'pointer' }}>
              👑 Admin Demo Login
            </button>
            <button className="demo-btn" onClick={fillDemoUser} style={{ flex: 1, padding: '10px', fontSize: '12px', fontWeight: '800', border: '1.5px solid var(--accent-dark)', background: '#f4f4f5', color: 'var(--accent-dark)', borderRadius: '6px', cursor: 'pointer' }}>
              👤 User Demo Login
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px' }}>
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button 
                onClick={() => setAuthMode('register')} 
                style={{ color: 'var(--accent-dark)', fontWeight: '800', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
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
