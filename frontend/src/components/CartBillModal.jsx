import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { X, Receipt, Trash2, Printer, Plus, Minus, CreditCard, DollarSign, CheckCircle, User, Hash } from 'lucide-react';

const CartBillModal = () => {
  const {
    isCartModalOpen,
    setIsCartModalOpen,
    cartItemsList,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    createBill,
    activeBillDetail,
    setActiveBillDetail
  } = useRestaurant();

  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [tableNumber, setTableNumber] = useState('T-1');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [taxRate, setTaxRate] = useState(5); // 5% default tax
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isCartModalOpen && !activeBillDetail) return null;

  // Calculate Subtotal, Tax, Discount, Grand Total
  const subtotal = cartSubtotal;
  const taxAmount = (subtotal * (taxRate / 100));
  const discount = parseFloat(discountAmount) || 0;
  const grandTotal = Math.max(0, subtotal + taxAmount - discount);

  const handleGenerateBill = async () => {
    if (cartItemsList.length === 0) return;

    setIsGenerating(true);

    const billPayload = {
      customer_name: customerName,
      table_number: tableNumber,
      payment_method: paymentMethod,
      tax_rate: taxRate,
      discount_amount: discount,
      items: cartItemsList.map((item) => ({
        food_id: item.food_id,
        quantity: item.quantity
      }))
    };

    const created = await createBill(billPayload);
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setIsCartModalOpen(false);
    setActiveBillDetail(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={20} color="#38bdf8" />
            {activeBillDetail ? '🧾 Invoice & Receipt' : '🛒 Current Order & Bill Generator'}
          </h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {activeBillDetail ? (
          /* Created Bill / Receipt Printable View */
          <div style={{ padding: '1.5rem' }}>
            <div className="printable-receipt" style={{
              background: 'rgba(9, 13, 22, 0.8)',
              border: '1px border rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.2rem', borderBottom: '1px dashed rgba(255, 255, 255, 0.15)', paddingBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8' }}>BISTRO PULSE RESTAURANT</h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>123 Gourmet Street, Foodville | Tel: +1 800-555-FOOD</p>
                <div style={{ margin: '0.5rem 0', fontWeight: '700', fontSize: '0.9rem', color: '#10b981' }}>
                  INVOICE #{activeBillDetail.bill_number}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Date: {new Date(activeBillDetail.created_at || Date.now()).toLocaleString()}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <div><strong>Customer:</strong> {activeBillDetail.customer_name}</div>
                <div><strong>Table:</strong> {activeBillDetail.table_number}</div>
                <div><strong>Payment Method:</strong> {activeBillDetail.payment_method}</div>
                <div><strong>Status:</strong> <span style={{ color: '#10b981', fontWeight: '700' }}>PAID</span></div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem 0' }}>Item</th>
                    <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBillDetail.items && activeBillDetail.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{item.food_name}</td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>${parseFloat(item.price).toFixed(2)}</td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>${parseFloat(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Summary */}
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#94a3b8' }}>
                  <span>Subtotal:</span>
                  <span>${parseFloat(activeBillDetail.subtotal).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#94a3b8' }}>
                  <span>Tax:</span>
                  <span>${parseFloat(activeBillDetail.tax).toFixed(2)}</span>
                </div>
                {parseFloat(activeBillDetail.discount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#f43f5e' }}>
                    <span>Discount:</span>
                    <span>-${parseFloat(activeBillDetail.discount).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', fontWeight: '800', color: '#38bdf8' }}>
                  <span>Grand Total:</span>
                  <span>${parseFloat(activeBillDetail.grand_total).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                Thank you for dining with us! Please come again! 😃
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-ghost" onClick={handleClose}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handlePrint}>
                <Printer size={16} /> Print Receipt
              </button>
            </div>
          </div>
        ) : (
          /* Active Cart & Customer Info Checkout Form */
          <div style={{ padding: '1.5rem' }}>
            {cartItemsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your order cart is empty.</p>
                <p style={{ fontSize: '0.85rem' }}>Select food items from the POS menu to add them to the bill!</p>
              </div>
            ) : (
              <>
                {/* Customer Details Form */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.3rem' }}>
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer Name"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.3rem' }}>
                      Table / Takeaway
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="e.g. Table 4 / Takeaway"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.3rem' }}>
                      Payment Method
                    </label>
                    <select
                      className="input-field"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    >
                      <option value="Cash">💵 Cash</option>
                      <option value="Credit Card">💳 Credit / Debit Card</option>
                      <option value="UPI / QR">📱 UPI / QR Code</option>
                    </select>
                  </div>
                </div>

                {/* Cart Items List */}
                <div style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  marginBottom: '1.25rem'
                }}>
                  {cartItemsList.map((item) => (
                    <div
                      key={item.food_id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#f8fafc' }}>
                          {item.food.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          ${item.food.price.toFixed(2)} x {item.quantity}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem', borderRadius: '6px' }}>
                          <button
                            className="btn btn-ghost"
                            onClick={() => updateCartQuantity(item.food_id, -1)}
                            style={{ width: '24px', height: '24px', padding: 0 }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem', width: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-primary"
                            onClick={() => updateCartQuantity(item.food_id, 1)}
                            style={{ width: '24px', height: '24px', padding: 0 }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#38bdf8', minWidth: '60px', textAlign: 'right' }}>
                          ${item.subtotal.toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.food_id)}
                          style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '0.2rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Breakdown */}
                <div style={{
                  background: 'rgba(9, 13, 22, 0.5)',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <span>Subtotal:</span>
                    <span style={{ color: '#f8fafc', fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <span>Tax Rate (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      style={{ width: '70px', padding: '0.2rem 0.4rem', textAlign: 'right', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <span>Discount ($):</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      style={{ width: '70px', padding: '0.2rem 0.4rem', textAlign: 'right', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    justify: 'space-between',
                    marginTop: '0.6rem',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '1.2rem',
                    fontWeight: '800'
                  }}>
                    <span style={{ color: '#f8fafc' }}>Grand Total:</span>
                    <span style={{ color: '#38bdf8' }}>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
                  <button className="btn btn-ghost" onClick={clearCart} style={{ color: '#f43f5e' }}>
                    <Trash2 size={16} /> Clear Cart
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-ghost" onClick={handleClose}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleGenerateBill} disabled={isGenerating}>
                      <Receipt size={16} /> {isGenerating ? 'Generating...' : 'Generate Bill & Invoice'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CartBillModal;
