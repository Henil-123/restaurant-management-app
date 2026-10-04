import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllFoods, resetQuantities } from '../services/api';

function BillPage() {
  const navigate = useNavigate();
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date().toLocaleString();

  useEffect(() => {
    fetchBillData();
  }, []);

  const fetchBillData = async () => {
    setLoading(true);
    try {
      const foods = await getAllFoods();
      const itemsWithQuantity = foods.filter(food => food.quantity > 0);
      setBillItems(itemsWithQuantity);
    } catch (error) {
      console.error('Error fetching bill data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear the bill? This will reset all quantities.')) {
      await resetQuantities();
      setBillItems([]);
    }
  };

  const grandTotal = billItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-accent"></div></div>;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 mb-4 print-area">
          <div className="card-body p-5">
            {/* Bill Header */}
            <div className="text-center mb-5 pb-3 border-bottom">
              <h2 className="font-display mb-1 text-accent">SpiceHaven</h2>
              <p className="text-muted mb-1">123 Culinary Boulevard, Food City, FC 90210</p>
              <p className="text-muted mb-0">Phone: (555) 123-4567</p>
            </div>
            
            <div className="d-flex justify-content-between mb-4">
              <div>
                <strong>Date:</strong> {currentDate}
              </div>
              <div>
                <strong>Invoice #:</strong> {Math.floor(Math.random() * 100000).toString().padStart(6, '0')}
              </div>
            </div>

            {/* Bill Items */}
            <table className="table mb-4">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billItems.length > 0 ? (
                  billItems.map(item => {
                    const id = item._id || item.id;
                    return (
                      <tr key={id}>
                        <td>
                          <div className="fw-bold">{item.name}</div>
                          <div className="text-muted small">{item.category}</div>
                        </td>
                        <td className="text-center align-middle">{item.quantity}</td>
                        <td className="text-end align-middle">${Number(item.price).toFixed(2)}</td>
                        <td className="text-end align-middle fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No items in bill. Add quantities from the menu.</td>
                  </tr>
                )}
              </tbody>
              {billItems.length > 0 && (
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end fw-bold pt-4 fs-5 border-0">Grand Total:</td>
                    <td className="text-end fw-bold pt-4 fs-5 border-0 text-accent">${grandTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
            
            <div className="text-center mt-5 pt-3 border-top text-muted small">
              <p className="mb-0">Thank you for dining with us!</p>
              <p>Please come again.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on print) */}
        <div className="d-flex justify-content-between no-print mb-5">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/manager')}>Back to Menu</button>
          <div>
            <button className="btn btn-outline-danger me-2" onClick={handleClear} disabled={billItems.length === 0}>Clear Bill</button>
            <button className="btn btn-primary" onClick={handlePrint} disabled={billItems.length === 0}>Print Bill</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillPage;
