import React from 'react';

function Footer() {
  return (
    <footer className="text-center no-print">
      <div className="container">
        <h4 className="mb-3">SpiceHaven</h4>
        <p className="mb-0 text-muted">© {new Date().getFullYear()} SpiceHaven Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
