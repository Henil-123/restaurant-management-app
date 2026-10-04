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
      }
    } else {
      const res = await register(formData.name, formData.email, formData.password, formData.role);
      if (res?.success) {
        showToast(res.message);
      }
    }
  };

  const fillDemoAdmin = () => {
    setFormData({ name: 'Spice Haven Admin', email: 'admin@spicehaven.com', password: 'admin123', role: 'admin' });
  };

  const fillDemoUser = () => {
    setFormData({ name: 'Rahul Sharma', email: 'user@spicehaven.com', password: 'user123', role: 'user' });
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="auth-box" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button 
          onClick={closeAuthModal} 
          style={{ position: 'absolute', right: '16px', top: '16px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}
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
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
            ⚠️ {authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="auth-input" 
                placeholder="Enter your name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="auth-input" 
              placeholder="e.g. user@spicehaven.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              className="auth-input" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          {authMode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: '6px' }}>Account Role</label>
              <select 
                name="role" 
                className="auth-input" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="user">User (Order food &amp; Book table)</option>
                <option value="admin">Admin (Manage food, bookings &amp; bills)</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={authLoading}>
            {authLoading ? 'Processing...' : authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '11px', color: 'var(--gray)', textAlign: 'center', marginBottom: '8px', fontWeight: '700' }}>
            ⚡ 1-CLICK DEMO LOGIN ACCOUNTS:
          </p>
          <div className="demo-btn-group">
            <button className="demo-btn" onClick={fillDemoAdmin}>
              👑 Admin Demo
            </button>
            <button className="demo-btn" onClick={fillDemoUser}>
              👤 User Demo
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
                style={{ color: 'var(--accent-dark)', fontWeight: '800', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => setAuthMode('login')} 
                style={{ color: 'var(--accent-dark)', fontWeight: '800', border: 'none', background: 'none', cursor: 'pointer' }}
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
