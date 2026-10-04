const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res, next) => {
  try {
    const [foodCount] = await db.query('SELECT COUNT(*) as count FROM foods');
    const [catCount] = await db.query('SELECT COUNT(*) as count FROM categories');
    const [billStats] = await db.query('SELECT COUNT(*) as total_bills, COALESCE(SUM(grand_total), 0) as total_revenue FROM bills');
    const [recentBills] = await db.query('SELECT * FROM bills ORDER BY id DESC LIMIT 5');

    res.json({
      success: true,
      data: {
        totalFoods: foodCount[0].count,
        totalCategories: catCount[0].count,
        totalBills: billStats[0].total_bills,
        totalRevenue: parseFloat(billStats[0].total_revenue).toFixed(2),
        recentBills
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
