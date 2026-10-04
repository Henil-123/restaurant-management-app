import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { activePage, setActivePage, totalCartCount, setIsCartOpen } = useRestaurant();
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`topnav ${mobileMenuOpen ? 'open' : ''}`}>
      {/* Row 1: Logo + Hamburger */}
      <div className="nav-top-row">
        <div className="logo-container" onClick={() => navigateTo('home')}>
          <div className="logo">SPICE HAVEN</div>
        </div>
        <button 
          className="nav-hamburger" 
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          &#9776;
        </button>
      </div>

      {/* Row 2: Navigation Links */}
      <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        <button className={activePage === 'home' ? 'active' : ''} onClick={() => navigateTo('home')}>
          HOME
        </button>
        <button className={activePage === 'menu' ? 'active' : ''} onClick={() => navigateTo('menu')}>
          MENU
        </button>
        <button className={activePage === 'book-table' ? 'active' : ''} onClick={() => navigateTo('book-table')}>
          BOOK A TABLE
        </button>
        <button className={activePage === 'my-orders' ? 'active' : ''} onClick={() => navigateTo('my-orders')}>
          MY ORDERS {totalCartCount > 0 && <span className="nav-cart-badge">{totalCartCount}</span>}
        </button>
        <button className={activePage === 'about' ? 'active' : ''} onClick={() => navigateTo('about')}>
          ABOUT & CONTACT
        </button>

        {/* Admin Dashboard link (Visible to admin or click to log in as admin) */}
        <button 
          className={activePage === 'admin-dashboard' ? 'active' : ''} 
          onClick={() => {
            if (isAdmin) {
              navigateTo('admin-dashboard');
            } else {
              openAuthModal('login');
            }
          }}
          style={{ color: '#6a6a3a', fontWeight: '800' }}
        >
          {isAdmin ? '👑 ADMIN DASHBOARD' : 'MANAGER'}
        </button>

        {/* User Auth state / Logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="nav-user-badge">
              {user.role === 'admin' ? '👑 Admin' : '👤 User'}: {user.name.split(' ')[0]}
            </span>
            <button 
              onClick={() => {
                logout();
                navigateTo('home');
              }}
              style={{ color: '#f43f5e' }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <button 
            onClick={() => openAuthModal('login')}
            style={{ color: 'var(--accent-dark)', fontWeight: '800' }}
          >
            LOGIN / REGISTER
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
