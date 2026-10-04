const db = require('../config/db');

// GET /api/reservations (All or filtered by user_id)
exports.getAllReservations = async (req, res, next) => {
  try {
    const { user_id, status } = req.query;
    let sql = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];

    if (user_id) {
      sql += ' AND user_id = ?';
      params.push(user_id);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/reservations (Create new reservation)
exports.createReservation = async (req, res, next) => {
  try {
    const { user_id, guest_name, email, phone, party_size, date, time_slot, special_requests } = req.body;

    if (!guest_name || !email || !phone || !date || !time_slot) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, date, and time slot are required'
      });
    }

    const [result] = await db.execute(
      `INSERT INTO reservations (user_id, guest_name, email, phone, party_size, date, time_slot, special_requests, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')`,
      [
        user_id || null,
        guest_name.trim(),
        email.trim(),
        phone.trim(),
        parseInt(party_size) || 2,
        date,
        time_slot,
        special_requests ? special_requests.trim() : ''
      ]
    );

    const [newRes] = await db.query('SELECT * FROM reservations WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Table reservation created successfully!',
      data: newRes[0]
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/reservations/:id/status (Update reservation status)
exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    await db.execute('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
    const [updated] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Reservation status updated to ${status}`,
      data: updated[0]
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reservations/:id
exports.deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM reservations WHERE id = ?', [id]);
    res.json({ success: true, message: 'Reservation deleted successfully', deletedId: parseInt(id) });
  } catch (err) {
    next(err);
  }
};
