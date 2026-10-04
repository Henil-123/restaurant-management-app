const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dbDriver = null;
let useSQLite = false;

const initDb = async () => {
  const dbType = process.env.DB_TYPE || 'sqlite';

  if (dbType === 'mysql') {
    try {
      const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'restaurant_db',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      // Test connection
      await pool.getConnection();
      console.log('✅ Connected to MySQL database successfully!');
      dbDriver = pool;
      return;
    } catch (err) {
      console.warn('⚠️ MySQL connection failed. Falling back to local SQLite database.', err.message);
      useSQLite = true;
    }
  } else {
    useSQLite = true;
  }

  if (useSQLite) {
    const dbPath = path.join(__dirname, '../restaurant.sqlite');
    console.log(`ℹ️ Using SQLite database at: ${dbPath}`);
    
    const db = new sqlite3.Database(dbPath);
    
    // Promisify SQLite methods
    dbDriver = {
      isSQLite: true,
      query: (sql, params = []) => {
        return new Promise((resolve, reject) => {
          // Normalize MySQL placeholder '?' vs SQLite
          db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve([rows]);
          });
        });
      },
      execute: (sql, params = []) => {
        return new Promise((resolve, reject) => {
          db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
          });
        });
      }
    };

    // Seed SQLite tables if not exist
    await seedSQLite(db);
  }
};

const seedSQLite = (db) => {
  return new Promise((resolve) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          icon TEXT DEFAULT '🍽️',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS foods (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          category_id INTEGER NOT NULL,
          description TEXT,
          image_url TEXT,
          is_available INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        );
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS bills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bill_number TEXT NOT NULL UNIQUE,
          customer_name TEXT DEFAULT 'Walk-in Customer',
          table_number TEXT DEFAULT 'T-1',
          payment_method TEXT DEFAULT 'Cash',
          subtotal REAL NOT NULL,
          tax REAL DEFAULT 0.00,
          discount REAL DEFAULT 0.00,
          grand_total REAL NOT NULL,
          status TEXT DEFAULT 'Paid',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS bill_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bill_id INTEGER NOT NULL,
          food_id INTEGER NOT NULL,
          food_name TEXT NOT NULL,
          price REAL NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          subtotal REAL NOT NULL,
          FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
        );
      `);

      // Seed categories
      db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
        if (!err && row.count === 0) {
          console.log('🌱 Seeding initial categories into SQLite...');
          const stmt = db.prepare('INSERT INTO categories (id, name, description, icon) VALUES (?, ?, ?, ?)');
          stmt.run(1, 'Starters', 'Crispy, tasty appetizers to kick off your meal', '🥗');
          stmt.run(2, 'Main Course', 'Hearty and delicious traditional & modern main dishes', '🍛');
          stmt.run(3, 'Fast Food', 'Burgers, pizzas, fries & quick bites', '🍔');
          stmt.run(4, 'Desserts', 'Sweet treats and delightful desserts', '🍰');
          stmt.run(5, 'Beverages', 'Refreshing cold and hot drinks', '🥤');
          stmt.finalize();
        }
      });

      // Seed foods
      db.get('SELECT COUNT(*) as count FROM foods', (err, row) => {
        if (!err && row.count === 0) {
          console.log('🌱 Seeding initial foods into SQLite...');
          const stmt = db.prepare('INSERT INTO foods (id, name, price, category_id, description, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)');
          stmt.run(1, 'Paneer Tikka', 9.99, 1, 'Marinated cottage cheese grilled to perfection in tandoor', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500', 1);
          stmt.run(2, 'Crispy Spring Rolls', 6.50, 1, 'Golden fried rolls packed with fresh spicy vegetables', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', 1);
          stmt.run(3, 'Paneer Butter Masala', 12.99, 2, 'Rich, velvety tomato butter gravy with soft paneer cubes', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500', 1);
          stmt.run(4, 'Veg Biryani Special', 11.50, 2, 'Fragrant long-grain basmati rice cooked with exotic spices', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', 1);
          stmt.run(5, 'Classic Cheese Burger', 8.99, 3, 'Juicy veg patty layered with cheddar cheese, lettuce & sauce', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 1);
          stmt.run(6, 'Farmhouse Pizza 10"', 14.25, 3, 'Loaded with capsicum, onion, tomato, mushrooms & mozzarella', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', 1);
          stmt.run(7, 'Chocolate Lava Cake', 5.99, 4, 'Warm molten chocolate cake served with vanilla bean ice cream', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', 1);
          stmt.run(8, 'Mango Lassi', 4.00, 5, 'Traditional Indian sweet mango yogurt smoothie', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500', 1);
          stmt.run(9, 'Iced Mint Lemonade', 3.50, 5, 'Chilled sparkling mint and lemon cooler', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', 1);
          stmt.finalize(resolve);
        } else {
          resolve();
        }
      });
    });
  });
};

const query = async (sql, params = []) => {
  if (!dbDriver) await initDb();
  if (dbDriver.isSQLite) {
    return dbDriver.query(sql, params);
  } else {
    return dbDriver.query(sql, params);
  }
};

const execute = async (sql, params = []) => {
  if (!dbDriver) await initDb();
  if (dbDriver.isSQLite) {
    return dbDriver.execute(sql, params);
  } else {
    const [result] = await dbDriver.execute(sql, params);
    return [result];
  }
};

module.exports = {
  initDb,
  query,
  execute
};
