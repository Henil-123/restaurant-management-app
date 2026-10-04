const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all food items (JOIN with categories)
router.get('/foods', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, c.name as category_name 
      FROM foods f
      LEFT JOIN categories c ON f.category_id = c.id
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single food item
router.get('/foods/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM foods WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Food item not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET foods by category
router.get('/foods/category/:categoryId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM foods WHERE category_id = ?', [req.params.categoryId]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Add new food item
router.post('/foods', async (req, res) => {
  const { name, price, category_id, description, quantity } = req.body;
  
  if (!name) return res.status(400).json({ success: false, error: 'Name is required' });
  if (price === undefined || price <= 0) return res.status(400).json({ success: false, error: 'Price must be positive' });
  if (!category_id) return res.status(400).json({ success: false, error: 'Category ID is required' });

  try {
    const [result] = await pool.query(
      'INSERT INTO foods (name, price, category_id, description, quantity) VALUES (?, ?, ?, ?, ?)',
      [name, price, category_id, description || '', quantity || 0]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, name, price, category_id, description, quantity } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT Update food item
router.put('/foods/:id', async (req, res) => {
  const { name, price, category_id, description, quantity } = req.body;
  const id = req.params.id;

  try {
    const [result] = await pool.query(
      'UPDATE foods SET name = ?, price = ?, category_id = ?, description = ?, quantity = ? WHERE id = ?',
      [name, price, category_id, description, quantity, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Food item not found' });
    res.json({ success: true, message: 'Food item updated' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE Delete food item
router.delete('/foods/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM foods WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Food item not found' });
    res.json({ success: true, message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH Increment/Decrement quantity
router.patch('/foods/:id/quantity', async (req, res) => {
  const { action } = req.body;
  const id = req.params.id;

  if (action !== 'increment' && action !== 'decrement') {
    return res.status(400).json({ success: false, error: 'Invalid action. Must be increment or decrement' });
  }

  try {
    const operator = action === 'increment' ? '+' : '-';
    const [result] = await pool.query(
      `UPDATE foods SET quantity = GREATEST(0, quantity ${operator} 1) WHERE id = ?`,
      [id]
    );
    
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Food item not found' });
    res.json({ success: true, message: `Quantity ${action}ed` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
