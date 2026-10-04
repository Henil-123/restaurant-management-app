const db = require('../config/db');

// POST Generate Bill
exports.generateBill = async (req, res, next) => {
  try {
    const { items, customer_name, table_number, payment_method, tax_rate = 5, discount_amount = 0 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot generate a bill with an empty list of items.'
      });
    }

    // Compute subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.food_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid food_id and quantity > 0.'
        });
      }

      // Fetch food item to verify price
      const [rows] = await db.query('SELECT * FROM foods WHERE id = ?', [item.food_id]);
      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Food item with ID ${item.food_id} not found.`
        });
      }

      const food = rows[0];
      const itemSubtotal = parseFloat((food.price * item.quantity).toFixed(2));
      subtotal += itemSubtotal;

      validatedItems.push({
        food_id: food.id,
        food_name: food.name,
        price: food.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    subtotal = parseFloat(subtotal.toFixed(2));
    const taxAmount = parseFloat(((subtotal * (tax_rate / 100))).toFixed(2));
    const discount = parseFloat(parseFloat(discount_amount || 0).toFixed(2));
    const grandTotal = parseFloat(Math.max(0, subtotal + taxAmount - discount).toFixed(2));

    // Generate unique bill number
    const billNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const [billResult] = await db.execute(
      `INSERT INTO bills (bill_number, customer_name, table_number, payment_method, subtotal, tax, discount, grand_total, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Paid')`,
      [
        billNumber,
        customer_name ? customer_name.trim() : 'Walk-in Customer',
        table_number ? table_number.trim() : 'T-1',
        payment_method || 'Cash',
        subtotal,
        taxAmount,
        discount,
        grandTotal
      ]
    );

    const billId = billResult.insertId;

    // Insert bill items
    for (const item of validatedItems) {
      await db.execute(
        `INSERT INTO bill_items (bill_id, food_id, food_name, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)`,
        [billId, item.food_id, item.food_name, item.price, item.quantity, item.subtotal]
      );
    }

    // Fetch full created bill
    const [createdBill] = await db.query('SELECT * FROM bills WHERE id = ?', [billId]);
    const [createdItems] = await db.query('SELECT * FROM bill_items WHERE bill_id = ?', [billId]);

    res.status(201).json({
      success: true,
      message: 'Bill generated successfully!',
      data: {
        ...createdBill[0],
        items: createdItems
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET all bills (History)
exports.getAllBills = async (req, res, next) => {
  try {
    const { search, limit = 50 } = req.query;
    let sql = `SELECT * FROM bills WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ` AND (bill_number LIKE ? OR customer_name LIKE ? OR table_number LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY id DESC LIMIT ?`;
    params.push(parseInt(limit));

    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET bill by ID with item breakdown
exports.getBillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [billRows] = await db.query('SELECT * FROM bills WHERE id = ? OR bill_number = ?', [id, id]);

    if (billRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    const bill = billRows[0];
    const [itemRows] = await db.query('SELECT * FROM bill_items WHERE bill_id = ?', [bill.id]);

    res.json({
      success: true,
      data: {
        ...bill,
        items: itemRows
      }
    });
  } catch (err) {
    next(err);
  }
};
