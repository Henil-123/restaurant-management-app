const db = require('../config/db');

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const [users] = await db.query(
      'SELECT id, name, email, role, password, created_at FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Simple plain text / direct check for demo DB
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: `token_${user.id}_${Date.now()}`
    };

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const userRole = role === 'admin' ? 'admin' : 'user';

    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name.trim(), cleanEmail, password, userRole]
    );

    const newUserId = result.insertId;

    const userResponse = {
      id: newUserId,
      name: name.trim(),
      email: cleanEmail,
      role: userRole,
      token: `token_${newUserId}_${Date.now()}`
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/users (Admin only listing)
exports.getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};
