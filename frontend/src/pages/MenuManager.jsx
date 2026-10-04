import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import CategoryFilter from '../components/CategoryFilter';
import FoodCard from '../components/FoodCard';
import { Plus, Grid, List } from 'lucide-react';

const MenuManager = () => {
  const { foods, selectedCategory, searchQuery, openAddFoodModal } = useRestaurant();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory === 'all' || food.category_id === parseInt(selectedCategory);
    const matchesSearch = searchQuery === '' ||
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.description && food.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f8fafc' }}>
            📋 Food Menu Manager
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Add, update, or remove restaurant food items and control stock availability
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'rgba(9, 13, 22, 0.6)', padding: '0.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('grid')}
              style={{ padding: '0.4rem 0.75rem' }}
            >
              <Grid size={15} /> Grid
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('table')}
              style={{ padding: '0.4rem 0.75rem' }}
            >
              <List size={15} /> Table
            </button>
          </div>

          <button className="btn btn-primary" onClick={openAddFoodModal}>
            <Plus size={16} /> Add Food Item
          </button>
        </div>
      </div>

      <CategoryFilter />

      {/* Grid or Table Display */}
      {filteredFoods.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No food items found.</p>
          <p style={{ fontSize: '0.85rem' }}>Click "Add Food Item" above to add new items to the menu!</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} showManagerActions={true} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 13, 22, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>#</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>Item Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>Price ($)</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((food, idx) => (
                  <tr key={food.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{idx + 1}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                          alt={food.name}
                          style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div>{food.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>{food.description || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-primary">{food.category_icon || '🍽️'} {food.category_name}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#38bdf8' }}>
                      ${parseFloat(food.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge ${food.is_available ? 'badge-success' : 'badge-danger'}`}>
                        {food.is_available ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-ghost"
                          onClick={() => toggleAvailability(food.id)}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          {food.is_available ? 'X Disable' : '✓ Enable'}
                        </button>
                        <button
                          className="btn btn-ghost"
                          onClick={() => openEditFoodModal(food)}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: '#38bdf8' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteFood(food.id)}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
