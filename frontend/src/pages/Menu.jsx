import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const Menu = () => {
  const { 
    foods, 
    categories, 
    addToCart, 
    totalCartCount, 
    setIsCartOpen 
  } = useRestaurant();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categoryNames = ['All', 'All Time Favourites', 'Starters', 'Main Course', 'Mains', 'Fast Food', 'Desserts', 'Beverages', "Chef's Specials"];

  const filteredFoods = foods.filter((food) => {
    const matchCategory = 
      activeCategory === 'All' || 
      food.category_name?.toLowerCase() === activeCategory.toLowerCase() ||
      (activeCategory === 'Mains' && food.category_name?.toLowerCase() === 'main course');

    const matchSearch = 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* MENU HERO */}
      <div className="menu-hero">
        <video src="/videos/menu.mp4" autoPlay loop muted playsInline></video>
        <div className="menu-hero-title">MENU</div>
      </div>

      <section className="menu-panel">
        {/* Category Tabs & Search Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <input 
                type="text" 
                placeholder="🔍 Search appetizers, curries, desserts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid var(--black)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'var(--white)'
                }}
              />
            </div>

            {totalCartCount > 0 && (
              <button 
                onClick={() => setIsCartOpen(true)}
                style={{
                  background: 'var(--accent-dark)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                🛒 VIEW CART ({totalCartCount} ITEMS)
              </button>
            )}
          </div>

          <div className="category-tabs">
            {categoryNames.map((cat) => (
              <button
                key={cat}
                className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* FOOD ITEMS CARDS GRID */}
        {filteredFoods.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--white)', borderRadius: '12px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍲</div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)' }}>No food items found</h3>
            <p style={{ color: 'var(--gray)', marginTop: '6px' }}>Try adjusting your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="food-card-grid">
            {filteredFoods.map((item) => (
              <div key={item.id} className="food-card">
                <img 
                  src={item.image_url || '/images/gallery-13.webp'} 
                  alt={item.name} 
                  className="food-card-img"
                  onError={(e) => { e.target.src = '/images/gallery-13.webp'; }}
                />
                
                <div className="food-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 className="food-card-title">{item.name}</h3>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: '800', 
                      background: item.is_available ? '#dcfce7' : '#fee2e2', 
                      color: item.is_available ? '#166534' : '#991b1b',
                      padding: '3px 8px',
                      borderRadius: '12px'
                    }}>
                      {item.is_available ? 'AVAILABLE' : 'OUT OF STOCK'}
                    </span>
                  </div>

                  <p className="food-card-desc">
                    {item.description || 'Authentic dish handcrafted with aromatic Indian spices.'}
                  </p>

                  <div className="food-card-footer">
                    <span className="food-price">₹{item.price}</span>
                    <button 
                      className="add-cart-btn"
                      onClick={() => addToCart(item.id)}
                      disabled={!item.is_available}
                      style={{ opacity: item.is_available ? 1 : 0.5 }}
                    >
                      + ADD TO ORDER
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Menu;
