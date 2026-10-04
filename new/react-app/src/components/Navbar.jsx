import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top py-3">
      <div className="container">
        <a className="navbar-brand" href="/index.html">SpiceHaven</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item"><a className="nav-link" href="/index.html">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/menu.html">Menu</a></li>
            <li className="nav-item"><a className="nav-link" href="/about.html">About</a></li>
            <li className="nav-item"><a className="nav-link" href="/#contact">Contact</a></li>
            <li className="nav-item"><a className="nav-link" href="/book-a-table.html">Book A Table</a></li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname.startsWith('/manager') ? 'active' : ''}`} to="/manager">Manager</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
