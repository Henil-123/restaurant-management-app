import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('spice_haven_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('spice_haven_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('spice_haven_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      setAuthLoading(true);
      setAuthError('');
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setAuthModalOpen(false);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      setAuthLoading(true);
      setAuthError('');
      const res = await api.post('/auth/register', { name, email, password, role });
      if (res.data.success) {
        setUser(res.data.user);
        setAuthModalOpen(false);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spice_haven_user');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthError('');
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthError('');
  };

  const isAdmin = user?.role === 'admin';
  const isUser = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isUser,
        login,
        register,
        logout,
        authModalOpen,
        authMode,
        setAuthMode,
        authError,
        authLoading,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
