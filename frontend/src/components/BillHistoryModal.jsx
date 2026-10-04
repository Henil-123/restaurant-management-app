import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Receipt, Search, Eye, Calendar, User, CreditCard } from 'lucide-react';
import api from '../api/axios';

const BillHistoryModal = () => {
  const { bills, viewReceipt } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBills = bills.filter((b) =>
    (b.bill_number && b.bill_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.customer_name && b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.table_number && b.table_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewInvoice = (billId) => {
    viewReceipt(billId);
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={22} color="#f59e0b" />
            Generated Bills & Sales History
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            View and reprint all past customer receipts and billing records
          </p>
        </div>

        <div style={{ position: 'relative', width: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search by invoice # or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.3rem', height: '38px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(9, 13, 22, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Invoice #</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Customer & Table</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Date & Time</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Payment</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Grand Total</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No generated bills found.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '700', color: '#38bdf8' }}>
                      {bill.bill_number}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: '600', color: '#f8fafc' }}>{bill.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{bill.table_number}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      {new Date(bill.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span className="badge badge-primary">{bill.payment_method}</span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '800', color: '#10b981', fontSize: '1rem' }}>
                      ${parseFloat(bill.grand_total).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => handleViewInvoice(bill.id)}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={14} /> View Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BillHistoryModal;
