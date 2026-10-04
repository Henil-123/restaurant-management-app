import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItemsList, 
    cartSubtotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    createBill,
    setActiveBillDetail
  } = useRestaurant();

  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || 'Walk-in Customer');
  const [tableNumber, setTableNumber] = useState('T-1');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const tax = parseFloat((cartSubtotal * 0.05).toFixed(2));
  const grandTotal = parseFloat((cartSubtotal + tax).toFixed(2));

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItemsList.length === 0) return;

    setIsSubmitting(true);

    const billData = {
      customer_name: customerName,
      table_number: tableNumber,
      payment_method: paymentMethod,
      items: cartItemsList.map(item => ({
        food_id: item.food_id,
        food_name: item.food.name,
        price: item.food.price,
        quantity: item.quantity
      })),
      tax,
      discount: 0
    };

    const res = await createBill(billData);
    setIsSubmitting(false);

    if (res) {
      setIsCartOpen(false);
      setActiveBillDetail(res);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={() => setIsCartOpen(false)}
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.75)', 
        zIndex: 99999, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '540px', 
          width: '100%', 
          background: '#ffffff', 
          color: '#000000', 
          padding: '28px', 
          borderRadius: '16px', 
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)', 
          margin: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid var(--accent-dark)', paddingBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '900', color: 'var(--accent-dark)', margin: 0 }}>
            🛒 YOUR ORDER CART
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', fontWeight: 'bold', color: '#666' }}
          >
            ✕
          </button>
        </div>

        {cartItemsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
            <p style={{ color: 'var(--gray)', fontSize: '16px', fontWeight: '700' }}>Your cart is empty.</p>
            <p style={{ color: 'var(--gray)', fontSize: '13px', marginTop: '6px' }}>Explore our menu and add delicious dishes to your order!</p>
          </div>
        ) : (
          <div>
            {/* Cart Items List */}
            <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
              {cartItemsList.map((item) => (
                <div 
                  key={item.food_id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}
                >
                  <div style={{ flex: 1, paddingRight: '12px' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--accent-dark)' }}>{item.food.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray)' }}>₹{item.food.price} each</div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => updateCartQuantity(item.food_id, -1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #ccc', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: '700', fontSize: '14px', width: '24px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateCartQuantity(item.food_id, 1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #ccc', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                    <span style={{ fontWeight: '800', width: '70px', textAlign: 'right', fontSize: '14px' }}>
                      ₹{item.subtotal}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.food_id)}
                      style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', marginLeft: '6px', fontSize: '16px' }}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', border: '1px solid #e2e8f0', lineHeight: '1.7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Subtotal:</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>GST / Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '17px', borderTop: '1px solid #cbd5e1', paddingTop: '8px', marginTop: '4px', color: 'var(--accent-dark)' }}>
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Details Form */}
            <form onSubmit={handleCheckout}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Customer Name *</label>
                  <input 
                    type="text" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Table / Location *</label>
                  <input 
                    type="text" 
                    value={tableNumber} 
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--gray)' }}>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px', fontSize: '14px' }}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ width: '100%', padding: '15px', background: 'var(--accent-dark)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '15px', letterSpacing: '1px', cursor: 'pointer' }}
              >
                {isSubmitting ? 'Placing Order...' : `PLACE ORDER (₹${grandTotal})`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
