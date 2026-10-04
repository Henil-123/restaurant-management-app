import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

const BookTable = () => {
  const { createReservation, showToast } = useRestaurant();
  const { user } = useAuth();

  const timeSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', 
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', 
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', 
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const [partySize, setPartySize] = useState('2');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('7:30 PM');

  const [guestName, setGuestName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName || !email || !phone || !date || !selectedTime) {
      showToast('Please fill in all required booking fields', 'error');
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      user_id: user?.id || null,
      guest_name: guestName,
      email,
      phone,
      party_size: parseInt(partySize),
      date,
      time_slot: selectedTime,
      special_requests: specialRequests
    };

    const res = await createReservation(bookingData);
    setIsSubmitting(false);

    if (res) {
      setConfirmedBooking(res);
    }
  };

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      <div className="booking-header">
        <h1>BOOK A TABLE</h1>
        <p style={{ color: 'var(--gray)', fontSize: '15px', marginTop: '8px' }}>
          Reserve your authentic Indian dining experience at Spice Haven.
        </p>
      </div>

      {confirmedBooking ? (
        <div style={{ maxWidth: '520px', margin: '20px auto', background: 'var(--white)', padding: '36px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '28px', marginBottom: '8px' }}>
            Reservation Confirmed!
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '24px' }}>
            We look forward to welcoming you to Spice Haven.
          </p>

          <div style={{ background: 'rgba(153, 156, 104, 0.12)', padding: '20px', borderRadius: '12px', textAlign: 'left', lineHeight: '1.8', fontSize: '14px', marginBottom: '24px' }}>
            <p><strong>Reservation ID:</strong> #{confirmedBooking.id}</p>
            <p><strong>Guest Name:</strong> {confirmedBooking.guest_name}</p>
            <p><strong>Guests:</strong> {confirmedBooking.party_size} People</p>
            <p><strong>Date:</strong> {confirmedBooking.date}</p>
            <p><strong>Time Slot:</strong> {confirmedBooking.time_slot}</p>
            <p><strong>Contact Phone:</strong> {confirmedBooking.phone}</p>
            <p><strong>Status:</strong> <span style={{ color: '#166534', fontWeight: '800' }}>Confirmed</span></p>
          </div>

          <button 
            className="book-btn"
            onClick={() => setConfirmedBooking(null)}
            style={{ width: '100%', margin: '0' }}
          >
            MAKE ANOTHER RESERVATION
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: '850px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Controls row */}
          <div className="booking-controls">
            <div className="booking-field">
              <label htmlFor="party-size">Party Size</label>
              <select 
                id="party-size" 
                value={partySize} 
                onChange={(e) => setPartySize(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            <div className="booking-field">
              <label htmlFor="date">Date</label>
              <input 
                type="date" 
                id="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Time slot selector */}
          <div className="time-slot-label">CHOOSE AN AVAILABLE TIME SLOT:</div>
          <div className="time-grid">
            {timeSlots.map((slot) => (
              <div 
                key={slot}
                className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                onClick={() => setSelectedTime(slot)}
              >
                {slot}
              </div>
            ))}
          </div>

          {/* Guest Contact Details */}
          <div style={{ background: 'var(--white)', padding: '28px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-dark)', fontSize: '20px', marginBottom: '16px' }}>
              Guest Contact Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Guest Name *</label>
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Rahul Sharma" 
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Email Address *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com" 
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Phone Number *</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210" 
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Special Request / Seating Preference</label>
              <textarea 
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Window table, dietary preference, birthday celebration, etc..." 
                rows="3"
                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginTop: '4px', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <button type="submit" className="book-btn" disabled={isSubmitting}>
            {isSubmitting ? 'CONFIRMING...' : 'CONFIRM & BOOK TABLE'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookTable;
