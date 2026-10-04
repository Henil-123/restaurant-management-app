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
    activeBillDetail,
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
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '540px', background: '#ffffff', color: '#000000', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid var(--accent-dark)', paddingBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '900', color: 'var(--accent-dark)' }}>
            🛒 YOUR ORDER CART
          </h2>
          <button 
            onClick={() => { setIsCartOpen(false); setActiveBillDetail(null); }}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>

        {/* Bill Receipt View (if bill just created) */}
        {activeBillDetail ? (
          <div className="printable-receipt" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '22px' }}>Order Confirmed!</h3>
            <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '16px' }}>
              Bill Number: <strong>{activeBillDetail.bill_number}</strong>
            </p>

            <div style={{ background: 'rgba(153,156,104,0.1)', padding: '16px', borderRadius: '8px', textAlign: 'left', marginBottom: '16px', fontSize: '13px' }}>
              <p><strong>Customer:</strong> {activeBillDetail.customer_name}</p>
              <p><strong>Table / Order:</strong> {activeBillDetail.table_number}</p>
              <p><strong>Payment Method:</strong> {activeBillDetail.payment_method}</p>
              <p><strong>Date:</strong> {new Date(activeBillDetail.created_at || Date.now()).toLocaleString()}</p>
            </div>

            <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', marginBottom: '16px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <th style={{ padding: '6px' }}>Item</th>
                  <th style={{ padding: '6px' }}>Qty</th>
                  <th style={{ padding: '6px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {activeBillDetail.items?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '6px' }}>{item.food_name}</td>
                    <td style={{ padding: '6px' }}>x{item.quantity}</td>
                    <td style={{ padding: '6px', textAlign: 'right' }}>₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: '1.6', fontWeight: 'bold' }}>
              <p>Subtotal: ₹{activeBillDetail.subtotal}</p>
              <p>Tax (5%): ₹{activeBillDetail.tax}</p>
              <p style={{ fontSize: '18px', color: 'var(--accent-dark)' }}>Grand Total: ₹{activeBillDetail.grand_total}</p>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={handlePrint} 
                style={{ flex: 1, padding: '12px', background: 'var(--black)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🖨️ PRINT RECEIPT
              </button>
              <button 
                onClick={() => { setActiveBillDetail(null); setIsCartOpen(false); }} 
                style={{ flex: 1, padding: '12px', background: 'var(--accent-dark)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                DONE
              </button>
            </div>
          </div>
        ) : cartItemsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
            <p style={{ color: 'var(--gray)', fontSize: '15px' }}>Your cart is empty.</p>
            <p style={{ color: 'var(--gray)', fontSize: '13px', marginTop: '4px' }}>Explore our menu and add items to your order!</p>
          </div>
        ) : (
          <div>
            {/* Cart Items List */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px' }}>
              {cartItemsList.map((item) => (
                <div 
                  key={item.food_id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{item.food.name}</div>
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
                    <span style={{ fontWeight: '700', fontSize: '14px', width: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateCartQuantity(item.food_id, 1)}
                      style={{ width: '28px', height: '28px', border: '1px solid #ccc', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                    <span style={{ fontWeight: '800', width: '60px', textAlign: 'right', fontSize: '14px' }}>
                      ₹{item.subtotal}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.food_id)}
                      style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', marginLeft: '6px' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div style={{ background: '#f9f9f9', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Subtotal:</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>GST / Tax (5%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px', borderTop: '1px solid #ddd', paddingTop: '6px', color: 'var(--accent-dark)' }}>
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Details Form */}
            <form onSubmit={handleCheckout}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Customer Name</label>
                  <input 
                    type="text" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Table / Location</label>
                  <input 
                    type="text" 
                    value={tableNumber} 
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Payment Method</label>
                <select 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '4px' }}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ width: '100%', padding: '14px', background: 'var(--accent-dark)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', letterSpacing: '1px', cursor: 'pointer' }}
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
