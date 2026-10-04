const db = require('../config/db');

// GET all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, COUNT(f.id) as item_count 
       FROM categories c 
       LEFT JOIN foods f ON c.id = f.category_id 
       GROUP BY c.id 
       ORDER BY c.id ASC`
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// POST Create new category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const [result] = await db.execute(
      `INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)`,
      [name.trim(), description ? description.trim() : '', icon || '🍽️']
    );

    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// PUT Update category
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await db.execute(
      `UPDATE categories SET name = ?, description = ?, icon = ? WHERE id = ?`,
      [
        name !== undefined ? name.trim() : existing[0].name,
        description !== undefined ? description.trim() : existing[0].description,
        icon !== undefined ? icon : existing[0].icon,
        id
      ]
    );

    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Category updated successfully!', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE category
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Category deleted successfully!', deletedId: parseInt(id) });
  } catch (err) {
    next(err);
  }
};
