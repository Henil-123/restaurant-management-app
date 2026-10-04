import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Utensils, Receipt, ShoppingCart, Plus, Search, Grid } from 'lucide-react';

const Navbar = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    openAddFoodModal,
    totalCartCount,
    setIsCartModalOpen,
    cartSubtotal
  } = useRestaurant();

  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '0.85rem 1.5rem', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('pos')}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Utensils size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
              BistroPulse
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Restaurant Manager & POS</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', background: 'rgba(9, 13, 22, 0.6)', padding: '0.3rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            className={`btn ${activeTab === 'pos' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('pos')}
          >
            <Utensils size={16} /> POS & Order
          </button>
          <button
            className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('menu')}
          >
            <Grid size={16} /> Menu Manager
          </button>
          <button
            className={`btn ${activeTab === 'bills' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            onClick={() => setActiveTab('bills')}
          >
            <Receipt size={16} /> Bills History
          </button>
        </div>

        {/* Search Bar & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.3rem', height: '40px', fontSize: '0.85rem' }}
            />
          </div>

          <button className="btn btn-primary" onClick={openAddFoodModal} style={{ height: '40px' }}>
            <Plus size={18} /> Add Food Item
          </button>

          <button
            className="btn btn-accent"
            onClick={() => setIsCartModalOpen(true)}
            style={{ position: 'relative', height: '40px' }}
          >
            <ShoppingCart size={18} />
            <span>${cartSubtotal.toFixed(2)}</span>
            {totalCartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#f43f5e',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '700',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #090d16'
              }}>
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
