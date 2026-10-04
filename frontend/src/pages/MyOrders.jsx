import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { 
    cartItemsList, 
    cartSubtotal, 
    setIsCartOpen, 
    bills, 
    reservations, 
    viewReceipt, 
    setActivePage 
  } = useRestaurant();

  const { user } = useAuth();

  const userBills = user 
    ? bills.filter(b => b.customer_name?.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]))
    : bills;

  const userReservations = user 
    ? reservations.filter(r => r.email === user.email || r.user_id === user.id)
    : reservations;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', minHeight: '75vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '32px', marginBottom: '24px' }}>
        🛒 My Orders &amp; Reservations
      </h1>

      {/* Current Active Cart Summary */}
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black)', marginBottom: '12px' }}>
          Active Shopping Cart ({cartItemsList.length} Items)
        </h3>

        {cartItemsList.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>
            Your order cart is currently empty.{' '}
            <button 
              onClick={() => setActivePage('menu')} 
              style={{ color: 'var(--accent-dark)', fontWeight: '800', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              Browse menu to add dishes &rarr;
            </button>
          </p>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '800' }}>Cart Subtotal: ₹{cartSubtotal}</span>
              <button 
                onClick={() => setIsCartOpen(true)}
                style={{ background: 'var(--accent-dark)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer' }}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Table Bookings */}
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black)', marginBottom: '16px' }}>
          🥂 My Table Reservations ({userReservations.length})
        </h3>

        {userReservations.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>No active table reservations. <button onClick={() => setActivePage('book-table')} style={{ color: 'var(--accent-dark)', fontWeight: '800', border: 'none', background: 'none', cursor: 'pointer' }}>Book a table now &rarr;</button></p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {userReservations.map(res => (
              <div key={res.id} style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '800', fontSize: '15px' }}>#{res.id} - {res.guest_name}</span>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
                    {res.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--gray)' }}>📅 Date: {res.date}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray)' }}>⏰ Time: {res.time_slot}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray)' }}>👥 Guests: {res.party_size} People</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Order Receipts / Bills */}
      <div style={{ background: 'var(--white)', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--black)', marginBottom: '16px' }}>
          🧾 Past Order Bills &amp; Receipts ({userBills.length})
        </h3>

        {userBills.length === 0 ? (
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>No past orders found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bill #</th>
                  <th>Customer Name</th>
                  <th>Table / Order</th>
                  <th>Payment</th>
                  <th>Grand Total</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {userBills.map(bill => (
                  <tr key={bill.id}>
                    <td style={{ fontWeight: '700' }}>{bill.bill_number}</td>
                    <td>{bill.customer_name}</td>
                    <td>{bill.table_number}</td>
                    <td>{bill.payment_method}</td>
                    <td style={{ fontWeight: '800', color: 'var(--accent-dark)' }}>₹{bill.grand_total}</td>
                    <td>
                      <button 
                        className="btn-sm btn-edit"
                        onClick={() => viewReceipt(bill)}
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
