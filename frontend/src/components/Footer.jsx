import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { setActivePage } = useRestaurant();
  const { isAdmin, openAuthModal } = useAuth();

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-logo" style={{ textAlign: 'center' }}>
        <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 180 97" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill="#000" d="M92 75c0-12.15 9.85-22 22-22h22v22c0 12.15-9.85 22-22 22H92V75Z"/>
          <path fill="#000" d="M136 31c0-12.15 9.85-22 22-22h22v22c0 12.15-9.85 22-22 22h-22V31Z"/>
          <path fill="#000" d="M88 75c0-12.15-9.85-22-22-22H44v22c0 12.15 9.85 22 22 22h22V75Z"/>
          <path fill="#000" d="M44 31c0-12.15-9.85-22-22-22H0v22c0 12.15 9.85 22 22 22h22V31Z"/>
          <path fill="#000" d="M74.556 46.67c-8.591-8.592-8.591-22.522 0-31.113L90.113 0l15.556 15.556c8.592 8.591 8.592 22.521 0 31.113L90.113 62.226 74.556 46.67Z"/>
        </svg>
      </div>

      <div className="footer-box">
        <div className="footer-box1">
          <p>INDIAN RESTAURANT<br />&amp; CAFFE</p>
          <b>SPICE HAVEN</b>
        </div>
        
        <div className="footer-box2">
          A: 500 Terry Francine St.<br />
          San Francisco CA 94158<br />
          T: 123-456-7890<br />
          E: hello@spicehaven.com<br /><br />
          Mon–Sun: 12:00 PM – 10:30 PM
        </div>

        <div className="footer-box3">
          <button onClick={() => navigateTo('home')}>HOME</button>
          <button onClick={() => navigateTo('menu')}>MENU</button>
          <button onClick={() => navigateTo('about')}>ABOUT</button>
          <button onClick={() => navigateTo('book-table')}>BOOK A TABLE</button>
          <button onClick={() => {
            if (isAdmin) navigateTo('admin-dashboard');
            else openAuthModal('login');
          }}>
            MANAGER
          </button>
        </div>
      </div>

      <p>
        &copy; 2026 Spice Haven. All rights reserved. <br />
        Authentic Indian Dining &amp; Management System
      </p>
    </footer>
  );
};

export default Footer;
