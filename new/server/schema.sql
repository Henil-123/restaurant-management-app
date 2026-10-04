CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

INSERT IGNORE INTO categories (name) VALUES 
('All Time Favourites'), 
('Starters'), 
('Mains'), 
('Beverages'), 
('Desserts'), 
('Chef''s Specials');

CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id INT,
  description TEXT,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO foods (name, price, category_id, description) VALUES
('Paneer Tikka', 250.00, 2, 'Spicy marinated cottage cheese cubes grilled to perfection'),
('Dal Makhani', 200.00, 3, 'Creamy and buttery black lentils slow-cooked'),
('Masala Chai', 50.00, 4, 'Indian tea brewed with aromatic spices'),
('Gulab Jamun', 100.00, 5, 'Fried dough balls soaked in sweet, sticky sugar syrup'),
('French Fries', 120.00, 2, 'Crispy deep-fried potato batons');
