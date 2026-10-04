import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const CategoryFilter = () => {
  const { categories, selectedCategory, setSelectedCategory, foods } = useRestaurant();

  const getCategoryCount = (catId) => {
    if (catId === 'all') return foods.length;
    return foods.filter(f => f.category_id === catId).length;
  };

  return (
    <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
      <button
        onClick={() => setSelectedCategory('all')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.1rem',
          borderRadius: '9999px',
          fontFamily: 'inherit',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'pointer',
          border: '1px solid',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
          backgroundColor: selectedCategory === 'all' ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
          color: selectedCategory === 'all' ? 'white' : '#94a3b8',
          borderColor: selectedCategory === 'all' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <span>🍽️ All Categories</span>
        <span style={{
          background: selectedCategory === 'all' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
          padding: '0.1rem 0.45rem',
          borderRadius: '999px',
          fontSize: '0.75rem'
        }}>
          {getCategoryCount('all')}
        </span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = getCategoryCount(cat.id);

        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.1rem',
              borderRadius: '9999px',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: '1px solid',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              backgroundColor: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.05)',
              color: isSelected ? 'white' : '#94a3b8',
              borderColor: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <span>{cat.icon || '🍽️'} {cat.name}</span>
            <span style={{
              background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
              padding: '0.1rem 0.45rem',
              borderRadius: '999px',
              fontSize: '0.75rem'
            }}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
