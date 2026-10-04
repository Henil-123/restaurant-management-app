import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import BookTable from './pages/BookTable';
import MyOrders from './pages/MyOrders';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';

const MainApp = () => {
  const { activePage, toast } = useRestaurant();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: toast.type === 'error' ? '#dc2626' : toast.type === 'info' ? '#0284c7' : '#1a3c34',
          color: 'white',
          padding: '12px 22px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          fontWeight: '700',
          fontSize: '14px',
          zIndex: 3000,
          animation: 'slideUp 0.3s ease'
        }}>
          {toast.message}
        </div>
      )}

      {/* Main Dynamic Page Container */}
      <main style={{ flex: 1, width: '100%' }}>
        {activePage === 'home' && <Home />}
        {activePage === 'menu' && <Menu />}
        {activePage === 'book-table' && <BookTable />}
        {activePage === 'my-orders' && <MyOrders />}
        {activePage === 'about' && <About />}
        {activePage === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <AuthModal />
      <CartDrawer />

      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <MainApp />
      </RestaurantProvider>
    </AuthProvider>
  );
}

export default App;
