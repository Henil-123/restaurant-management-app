import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import CategoryFilter from '../components/CategoryFilter';
import FoodCard from '../components/FoodCard';
import StatsOverview from '../components/StatsOverview';
import { ShoppingCart, Receipt, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const POSBilling = () => {
  const {
    foods,
    selectedCategory,
    searchQuery,
    cartItemsList,
    cartSubtotal,
    totalCartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setIsCartModalOpen
  } = useRestaurant();

  // Filter foods by category & search
  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory === 'all' || food.category_id === parseInt(selectedCategory);
    const matchesSearch = searchQuery === '' ||
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.description && food.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <StatsOverview />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Category Pills + Food Items Grid */}
        <div>
          <CategoryFilter />

          {filteredFoods.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No food items match your criteria.</p>
              <p style={{ fontSize: '0.85rem' }}>Try choosing another category or clearing search filters!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '1.25rem'
            }}>
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} food={food} showManagerActions={false} />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Live Order Summary Sidebar */}
        <div className="glass-panel" style={{ position: 'sticky', top: '1rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={18} color="#38bdf8" /> Live Order Cart ({totalCartCount})
            </h2>
            {cartItemsList.length > 0 && (
              <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>

          {cartItemsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <p style={{ fontSize: '0.9rem' }}>Cart is currently empty.</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>Click '+' on any food card to select items for billing.</p>
            </div>
          ) : (
            <div>
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.2rem' }}>
                {cartItemsList.map((item) => (
                  <div
                    key={item.food_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ flex: 1, pr: '0.5rem' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#f8fafc' }}>
                        {item.food.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        ${item.food.price.toFixed(2)} each
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.15rem' }}>
                        <button
                          className="btn btn-ghost"
                          onClick={() => updateCartQuantity(item.food_id, -1)}
                          style={{ width: '22px', height: '22px', padding: 0 }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontWeight: '700', fontSize: '0.8rem', width: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-primary"
                          onClick={() => updateCartQuantity(item.food_id, 1)}
                          style={{ width: '22px', height: '22px', padding: 0 }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#38bdf8', minWidth: '55px', textAlign: 'right' }}>
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  <span>Subtotal:</span>
                  <span style={{ color: '#f8fafc', fontWeight: '600' }}>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                  <span>Est. Tax (5%):</span>
                  <span>${(cartSubtotal * 0.05).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', marginTop: '0.5rem', color: '#38bdf8' }}>
                  <span>Total:</span>
                  <span>${(cartSubtotal * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setIsCartModalOpen(true)}
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                Proceed to Bill <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default POSBilling;
