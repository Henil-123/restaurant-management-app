const db = require('../config/db');

// GET all foods (with optional category & search filter)
exports.getAllFoods = async (req, res, next) => {
  try {
    const { category_id, search, available_only } = req.query;
    let sql = `
      SELECT f.*, c.name as category_name, c.icon as category_icon 
      FROM foods f 
      LEFT JOIN categories c ON f.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category_id && category_id !== 'all') {
      sql += ` AND f.category_id = ?`;
      params.push(category_id);
    }

    if (search) {
      sql += ` AND (f.name LIKE ? OR f.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (available_only === 'true') {
      sql += ` AND f.is_available = 1`;
    }

    sql += ` ORDER BY f.id DESC`;

    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET food by ID
exports.getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT f.*, c.name as category_name, c.icon as category_icon 
       FROM foods f 
       LEFT JOIN categories c ON f.category_id = c.id 
       WHERE f.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST Create new food item
exports.createFood = async (req, res, next) => {
  try {
    const { name, price, category_id, description, image_url } = req.body;

    if (!name || price === undefined || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category_id are required fields.'
      });
    }

    const defaultImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';

    const [result] = await db.execute(
      `INSERT INTO foods (name, price, category_id, description, image_url, is_available) VALUES (?, ?, ?, ?, ?, 1)`,
      [name.trim(), parseFloat(price), parseInt(category_id), description ? description.trim() : '', image_url || defaultImg]
    );

    const newId = result.insertId;
    const [rows] = await db.query(
      `SELECT f.*, c.name as category_name, c.icon as category_icon 
       FROM foods f 
       LEFT JOIN categories c ON f.category_id = c.id 
       WHERE f.id = ?`,
      [newId]
    );

    res.status(201).json({
      success: true,
      message: 'Food item created successfully!',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// PUT Update food item
exports.updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, category_id, description, image_url, is_available } = req.body;

    const [existing] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const updatedName = name !== undefined ? name.trim() : existing[0].name;
    const updatedPrice = price !== undefined ? parseFloat(price) : existing[0].price;
    const updatedCategory = category_id !== undefined ? parseInt(category_id) : existing[0].category_id;
    const updatedDesc = description !== undefined ? description.trim() : existing[0].description;
    const updatedImg = image_url !== undefined ? image_url : existing[0].image_url;
    const updatedAvailable = is_available !== undefined ? (is_available ? 1 : 0) : existing[0].is_available;

    await db.execute(
      `UPDATE foods SET name = ?, price = ?, category_id = ?, description = ?, image_url = ?, is_available = ? WHERE id = ?`,
      [updatedName, updatedPrice, updatedCategory, updatedDesc, updatedImg, updatedAvailable, id]
    );

    const [rows] = await db.query(
      `SELECT f.*, c.name as category_name, c.icon as category_icon 
       FROM foods f 
       LEFT JOIN categories c ON f.category_id = c.id 
       WHERE f.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Food item updated successfully!',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// DELETE Food item
exports.deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    await db.execute('DELETE FROM foods WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Food item '${existing[0].name}' deleted successfully!`,
      deletedId: parseInt(id)
    });
  } catch (err) {
    next(err);
  }
};

// PATCH toggle food availability
exports.toggleAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const newStatus = existing[0].is_available === 1 ? 0 : 1;
    await db.execute('UPDATE foods SET is_available = ? WHERE id = ?', [newStatus, id]);

    res.json({
      success: true,
      message: `Availability updated to ${newStatus === 1 ? 'Available' : 'Out of stock'}`,
      is_available: newStatus
    });
  } catch (err) {
    next(err);
  }
};
