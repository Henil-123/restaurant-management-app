import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const BillReceiptModal = () => {
  const { activeBillDetail, setActiveBillDetail } = useRestaurant();

  if (!activeBillDetail) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setActiveBillDetail(null);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleClose}
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
        className="modal-content printable-receipt" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '520px', 
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
        {/* Close Icon (Hidden on Print) */}
        <button 
          className="no-print"
          onClick={handleClose}
          style={{ 
            position: 'absolute', 
            right: '16px', 
            top: '16px', 
            background: 'none', 
            border: 'none', 
            fontSize: '22px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            color: '#666'
          }}
        >
          ✕
        </button>

        {/* Receipt Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="no-print" style={{ fontSize: '40px', marginBottom: '6px' }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '26px', fontWeight: '900', margin: '0' }}>
            SPICE HAVEN
          </h2>
          <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', marginTop: '2px' }}>
            INDIAN RESTAURANT &amp; CAFFE
          </p>
          <div style={{ fontSize: '13px', fontWeight: '800', marginTop: '10px', color: 'var(--accent-dark)' }}>
            INVOICE RECEIPT #: <strong>{activeBillDetail.bill_number}</strong>
          </div>
        </div>

        {/* Customer & Order Metadata */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', border: '1px solid #e2e8f0', lineHeight: '1.7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Customer:</strong> {activeBillDetail.customer_name}</span>
            <span><strong>Table/Ref:</strong> {activeBillDetail.table_number}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>Payment:</strong> {activeBillDetail.payment_method}</span>
            <span><strong>Status:</strong> <span style={{ color: '#166534', fontWeight: '800' }}>Paid</span></span>
          </div>
          <div>
            <strong>Date:</strong> {new Date(activeBillDetail.created_at || Date.now()).toLocaleString()}
          </div>
        </div>

        {/* Items Breakdown Table */}
        <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', marginBottom: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ padding: '8px 4px' }}>Dish Name</th>
              <th style={{ padding: '8px 4px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '8px 4px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '8px 4px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {activeBillDetail.items && activeBillDetail.items.length > 0 ? (
              activeBillDetail.items.map((item, idx) => {
                const name = item.food_name || item.name || item.food?.name || 'Item';
                const qty = item.quantity || 1;
                const price = parseFloat(item.price || 0).toFixed(2);
                const subtotal = parseFloat(item.subtotal || (price * qty) || 0).toFixed(2);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 4px', fontWeight: '600' }}>{name}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'center' }}>x{qty}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'right' }}>₹{price}</td>
                    <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: '700' }}>₹{subtotal}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '12px', textAlign: 'center', color: '#888' }}>
                  No items listed for this bill receipt.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div style={{ borderTop: '2px solid #333', paddingTop: '12px', textAlign: 'right', fontSize: '14px', lineHeight: '1.7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <span>₹{activeBillDetail.subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>GST / Tax (5%):</span>
            <span>₹{activeBillDetail.tax}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', color: 'var(--accent-dark)', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #eee' }}>
            <span>Grand Total:</span>
            <span>₹{activeBillDetail.grand_total}</span>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666', borderTop: '1px dashed #ccc', paddingTop: '12px' }}>
          Thank you for dining with Spice Haven! 🌶️<br />
          500 Terry Francine St, San Francisco CA
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="no-print" style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button 
            onClick={handlePrint} 
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: 'var(--black)', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '800', 
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            🖨️ PRINT RECEIPT
          </button>
          <button 
            onClick={handleClose} 
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: 'var(--accent-dark)', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '800', 
              fontSize: '13px',
              cursor: 'pointer' 
            }}
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillReceiptModal;
