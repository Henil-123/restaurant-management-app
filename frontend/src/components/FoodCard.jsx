import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Plus, Minus, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const FoodCard = ({ food, showManagerActions = false }) => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    openEditFoodModal,
    deleteFood,
    toggleAvailability
  } = useRestaurant();

  const quantity = cart[food.id] || 0;
  const isAvailable = food.is_available === 1 || food.is_available === true;

  const defaultImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      opacity: isAvailable ? 1 : 0.65
    }}>
      {/* Image & Badge Overlay */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img
          src={food.image_url || defaultImg}
          alt={food.name}
          onError={(e) => { e.target.src = defaultImg; }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
        />
        <div style={{
          position: 'absolute',
          top: '0.6rem',
          left: '0.6rem',
          display: 'flex',
          gap: '0.4rem'
        }}>
          <span className="badge badge-primary">
            {food.category_icon || '🍽️'} {food.category_name || 'General'}
          </span>
        </div>

        <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem' }}>
          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', lineHeight: 1.3 }}>
              {food.name}
            </h3>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#38bdf8', whiteSpace: 'nowrap' }}>
              ${parseFloat(food.price).toFixed(2)}
            </span>
          </div>

          <p style={{
            fontSize: '0.8rem',
            color: '#94a3b8',
            marginTop: '0.4rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}>
            {food.description || 'No detailed description available.'}
          </p>
        </div>

        {/* Manager Actions or POS Quantity Buttons (Week 8 Deliverable) */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {showManagerActions ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className="btn btn-ghost"
                onClick={() => toggleAvailability(food.id)}
                style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem' }}
              >
                {isAvailable ? <XCircle size={14} color="#f43f5e" /> : <CheckCircle2 size={14} color="#10b981" />}
                {isAvailable ? 'Disable' : 'Enable'}
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => openEditFoodModal(food)}
                style={{ padding: '0.4rem 0.6rem', color: '#38bdf8' }}
              >
                <Edit3 size={15} />
              </button>

              <button
                className="btn btn-danger"
                onClick={() => deleteFood(food.id)}
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <div>
              {quantity === 0 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => addToCart(food.id)}
                  disabled={!isAvailable}
                  style={{ width: '100%', opacity: isAvailable ? 1 : 0.5 }}
                >
                  <Plus size={16} /> Add to Order
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(99, 102, 241, 0.15)', padding: '0.3rem', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => updateCartQuantity(food.id, -1)}
                    style={{ width: '32px', height: '32px', padding: 0, borderRadius: '8px' }}
                  >
                    <Minus size={16} />
                  </button>

                  <span style={{ fontWeight: '700', fontSize: '1rem', color: '#a5b4fc', minWidth: '30px', textAlign: 'center' }}>
                    {quantity}
                  </span>

                  <button
                    className="btn btn-primary"
                    onClick={() => updateCartQuantity(food.id, 1)}
                    style={{ width: '32px', height: '32px', padding: 0, borderRadius: '8px' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
