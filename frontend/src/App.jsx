import React from 'react';
import { useRestaurant, RestaurantProvider } from './context/RestaurantContext';
import Navbar from './components/Navbar';
import POSBilling from './pages/POSBilling';
import MenuManager from './pages/MenuManager';
import BillHistoryModal from './components/BillHistoryModal';
import FoodModal from './components/FoodModal';
import CartBillModal from './components/CartBillModal';

const AppContent = () => {
  const { activeTab, toast, loading, error } = useRestaurant();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          background: toast.type === 'error' ? '#f43f5e' : toast.type === 'info' ? '#0ea5e9' : '#10b981',
          color: 'white',
          padding: '0.8rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          fontWeight: '600',
          fontSize: '0.9rem',
          zIndex: 2000,
          animation: 'slideUp 0.3s ease'
        }}>
          {toast.message}
        </div>
      )}

      <main style={{ flex: 1, padding: '0 1.5rem 2rem 1.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⌛</div>
            <p>Loading restaurant menu & system data...</p>
          </div>
        ) : error ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#f43f5e', maxWidth: '500px', margin: '2rem auto' }}>
            <h3>⚠️ Server Connection Notice</h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              {error}. Make sure backend Express server is running on port 5000!
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'pos' && <POSBilling />}
            {activeTab === 'menu' && <MenuManager />}
            {activeTab === 'bills' && <BillHistoryModal />}
          </>
        )}
      </main>

      {/* Modals */}
      <FoodModal />
      <CartBillModal />
    </div>
  );
};

function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}

export default App;
