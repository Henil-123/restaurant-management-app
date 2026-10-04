import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { 
    foods, 
    categories, 
    addFood, 
    updateFood, 
    deleteFood, 
    toggleAvailability,
    reservations,
    updateReservationStatus,
    deleteReservation,
    bills,
    stats,
    viewReceipt
  } = useRestaurant();

  const { user, isAdmin, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState('foods'); // 'foods' | 'reservations' | 'bills'

  // Food Form State
  const [editingId, setEditingId] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '',
    price: '',
    category_id: '1',
    description: '',
    image_url: ''
  });

  const [foodSearch, setFoodSearch] = useState('');

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '500px', margin: '80px auto', background: 'var(--white)', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '24px' }}>
          Admin Authentication Required
        </h2>
        <p style={{ color: 'var(--gray)', fontSize: '14px', margin: '12px 0 24px' }}>
          You must be logged in as an Admin to access the Food Manager, Reservations, and Revenue dashboard.
        </p>
        <button 
          className="auth-btn"
          onClick={() => openAuthModal('login')}
        >
          SIGN IN AS ADMIN
        </button>
      </div>
    );
  }

  const handleFoodFormChange = (e) => {
    setFoodForm({ ...foodForm, [e.target.name]: e.target.value });
  };

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const success = await updateFood(editingId, foodForm);
      if (success) {
        setEditingId(null);
        setFoodForm({ name: '', price: '', category_id: '1', description: '', image_url: '' });
      }
    } else {
      const success = await addFood(foodForm);
      if (success) {
        setFoodForm({ name: '', price: '', category_id: '1', description: '', image_url: '' });
      }
    }
  };

  const startEditFood = (food) => {
    setEditingId(food.id);
    setFoodForm({
      name: food.name,
      price: food.price.toString(),
      category_id: food.category_id ? food.category_id.toString() : '1',
      description: food.description || '',
      image_url: food.image_url || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFoodForm({ name: '', price: '', category_id: '1', description: '', image_url: '' });
  };

  const filteredFoods = foods.filter(f => 
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) || 
    (f.category_name && f.category_name.toLowerCase().includes(foodSearch.toLowerCase()))
  );

  const rawRevenue = stats?.total_revenue || stats?.totalRevenue || bills.reduce((sum, b) => sum + parseFloat(b.grand_total || 0), 0);
  const totalRevenueFormatted = parseFloat(rawRevenue || 0).toFixed(2);

  return (
    <div className="manager-container">
      {/* Header Banner */}
      <div style={{ background: 'var(--accent-dark)', color: 'var(--white)', padding: '28px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: 'var(--accent)' }}>ADMIN CONTROL CENTER</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: '900', marginTop: '4px' }}>
            Spice Haven Restaurant Manager
          </h1>
        </div>

        {/* Quick Stats Badges */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent)' }}>{foods.length}</div>
            <div style={{ fontSize: '11px', letterSpacing: '1px' }}>MENU ITEMS</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#6ee7b7' }}>{reservations.length}</div>
            <div style={{ fontSize: '11px', letterSpacing: '1px' }}>BOOKINGS</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#fde047' }}>₹{totalRevenueFormatted}</div>
            <div style={{ fontSize: '11px', letterSpacing: '1px' }}>TOTAL REVENUE</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>
        <button 
          className={`category-tab-btn ${activeTab === 'foods' ? 'active' : ''}`}
          onClick={() => setActiveTab('foods')}
        >
          🍲 FOOD MENU MANAGER ({foods.length})
        </button>
        <button 
          className={`category-tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          🥂 TABLE BOOKINGS ({reservations.length})
        </button>
        <button 
          className={`category-tab-btn ${activeTab === 'bills' ? 'active' : ''}`}
          onClick={() => setActiveTab('bills')}
        >
          🧾 ORDERS &amp; BILLS ({bills.length})
        </button>
      </div>

      {/* TAB 1: FOOD MANAGER */}
      {activeTab === 'foods' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          
          {/* Form */}
          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '20px', marginBottom: '16px' }}>
              {editingId ? '✏️ Edit Food Item' : '➕ Add New Food Item'}
            </h3>

            <form onSubmit={handleFoodSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Food Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={foodForm.name} 
                  onChange={handleFoodFormChange}
                  placeholder="e.g. Paneer Butter Masala" 
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Price (₹) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={foodForm.price} 
                    onChange={handleFoodFormChange}
                    placeholder="e.g. 220" 
                    required 
                    min="1"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Category *</label>
                  <select 
                    name="category_id" 
                    value={foodForm.category_id} 
                    onChange={handleFoodFormChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
                  >
                    {categories.length > 0 ? (
                      categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    ) : (
                      <>
                        <option value="1">Starters</option>
                        <option value="2">Main Course</option>
                        <option value="3">Fast Food</option>
                        <option value="4">Desserts</option>
                        <option value="5">Beverages</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Image URL</label>
                <input 
                  type="url" 
                  name="image_url" 
                  value={foodForm.image_url} 
                  onChange={handleFoodFormChange}
                  placeholder="https://images.unsplash.com/..." 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Description</label>
                <textarea 
                  name="description" 
                  value={foodForm.description} 
                  onChange={handleFoodFormChange}
                  placeholder="Brief description of the ingredients or preparation..." 
                  rows="3"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '12px', background: 'var(--accent-dark)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '800', cursor: 'pointer' }}
                >
                  {editingId ? 'UPDATE ITEM' : 'ADD ITEM'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={cancelEdit} 
                    style={{ padding: '12px 16px', background: '#e4e4e7', color: 'black', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table list */}
          <div className="admin-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '20px' }}>
                Menu Items List
              </h3>
              <input 
                type="text" 
                placeholder="🔍 Search items or category..." 
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', width: '220px', fontSize: '13px' }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFoods.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td style={{ fontWeight: '700' }}>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>{item.category_name || 'General'}</td>
                      <td>
                        <button 
                          onClick={() => toggleAvailability(item.id)}
                          style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            background: item.is_available ? '#dcfce7' : '#fee2e2',
                            color: item.is_available ? '#166534' : '#991b1b'
                          }}
                        >
                          {item.is_available ? 'Available' : 'Out of stock'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn-sm btn-edit" onClick={() => startEditFood(item)}>Edit</button>
                        <button className="btn-sm btn-delete" onClick={() => deleteFood(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESERVATIONS MANAGER */}
      {activeTab === 'reservations' && (
        <div className="admin-card">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '20px', marginBottom: '16px' }}>
            Customer Table Reservations
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest Name</th>
                  <th>Contact Info</th>
                  <th>Party Size</th>
                  <th>Date &amp; Time</th>
                  <th>Special Request</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id}>
                    <td>#{res.id}</td>
                    <td style={{ fontWeight: '700' }}>{res.guest_name}</td>
                    <td>
                      <div>📧 {res.email}</div>
                      <div>📞 {res.phone}</div>
                    </td>
                    <td>👥 {res.party_size} Guests</td>
                    <td>
                      <div>📅 {res.date}</div>
                      <div>⏰ {res.time_slot}</div>
                    </td>
                    <td>{res.special_requests || '—'}</td>
                    <td>
                      <select 
                        value={res.status} 
                        onChange={(e) => updateReservationStatus(res.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn-sm btn-delete" onClick={() => deleteReservation(res.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BILLS & REVENUE MANAGER */}
      {activeTab === 'bills' && (
        <div className="admin-card">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '20px', marginBottom: '16px' }}>
            Customer Bills &amp; Revenue Logs
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bill #</th>
                  <th>Customer Name</th>
                  <th>Table / Order</th>
                  <th>Payment</th>
                  <th>Subtotal</th>
                  <th>Grand Total</th>
                  <th>Date</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id}>
                    <td style={{ fontWeight: '700' }}>{bill.bill_number}</td>
                    <td>{bill.customer_name}</td>
                    <td>{bill.table_number}</td>
                    <td>{bill.payment_method}</td>
                    <td>₹{bill.subtotal}</td>
                    <td style={{ fontWeight: '800', color: 'var(--accent-dark)' }}>₹{bill.grand_total}</td>
                    <td>{new Date(bill.created_at || Date.now()).toLocaleDateString()}</td>
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
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
