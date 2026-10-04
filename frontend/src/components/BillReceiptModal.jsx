import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';

const BillReceiptModal = () => {
  const { activeBillDetail, setActiveBillDetail } = useRestaurant();

  if (!activeBillDetail) return null;

  const handlePrint = () => {
    const bill = activeBillDetail;
    const items = bill.items && bill.items.length > 0
      ? bill.items.map((item) => {
          const name = item.food_name || item.name || 'Item';
          const qty = item.quantity || 1;
          const price = parseFloat(item.price || 0).toFixed(2);
          const sub = parseFloat(item.subtotal || 0).toFixed(2);
          return `
            <tr>
              <td style="padding:6px 4px;border-bottom:1px solid #eee;font-weight:600;">${name}</td>
              <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:center;">x${qty}</td>
              <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:right;">&#8377;${price}</td>
              <td style="padding:6px 4px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">&#8377;${sub}</td>
            </tr>`;
        }).join('')
      : `<tr><td colspan="4" style="padding:12px;text-align:center;color:#888;">No items found.</td></tr>`;

    const receiptHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${bill.bill_number}</title>
  <style>
    @page { size: A5 portrait; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #000; background: #fff; }
    .header { text-align: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #1a3c34; }
    .header h1 { font-size: 22px; font-weight: 900; letter-spacing: 3px; color: #1a3c34; }
    .header p { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-top: 2px; }
    .header .inv { font-size: 12px; font-weight: 800; margin-top: 8px; color: #1a3c34; }
    .meta { background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 16px; font-size: 12px; line-height: 1.8; }
    .meta-row { display: flex; justify-content: space-between; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    thead tr { border-bottom: 2px solid #333; }
    th { padding: 8px 4px; text-align: left; font-weight: 800; }
    th:nth-child(2) { text-align: center; }
    th:nth-child(3), th:nth-child(4) { text-align: right; }
    .totals { border-top: 2px solid #333; padding-top: 10px; font-size: 13px; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .grand { font-size: 17px; font-weight: 900; color: #1a3c34; border-top: 1px solid #eee; padding-top: 6px; margin-top: 4px; }
    .footer { text-align: center; margin-top: 16px; padding-top: 12px; border-top: 1px dashed #ccc; font-size: 11px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>SPICE HAVEN</h1>
    <p>Indian Restaurant &amp; Caffe</p>
    <div class="inv">INVOICE RECEIPT #: <strong>${bill.bill_number}</strong></div>
  </div>
  <div class="meta">
    <div class="meta-row">
      <span><strong>Customer:</strong> ${bill.customer_name || 'Walk-in Customer'}</span>
      <span><strong>Table:</strong> ${bill.table_number || '—'}</span>
    </div>
    <div class="meta-row">
      <span><strong>Payment:</strong> ${bill.payment_method || 'Cash'}</span>
      <span><strong>Status:</strong> <span style="color:#166534;font-weight:800;">Paid</span></span>
    </div>
    <div><strong>Date:</strong> ${new Date(bill.created_at || Date.now()).toLocaleString()}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Dish Name</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Price</th>
        <th style="text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>${items}</tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Subtotal:</span><span>&#8377;${parseFloat(bill.subtotal || 0).toFixed(2)}</span></div>
    <div class="total-row"><span>GST / Tax (5%):</span><span>&#8377;${parseFloat(bill.tax || 0).toFixed(2)}</span></div>
    <div class="total-row grand"><span>Grand Total:</span><span>&#8377;${parseFloat(bill.grand_total || 0).toFixed(2)}</span></div>
  </div>
  <div class="footer">Thank you for dining with Spice Haven! &#127798;<br>500 Terry Francine St, San Francisco CA</div>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=600,height=800');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
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
