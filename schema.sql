-- Restaurant Management Database Schema (MySQL)
-- Database Name: restaurant_db

CREATE DATABASE IF NOT EXISTS `restaurant_db`;
USE `restaurant_db`;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `icon` VARCHAR(50) DEFAULT '🍽️',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Foods Table
CREATE TABLE IF NOT EXISTS `foods` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `category_id` INT NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500),
  `is_available` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Bills Table
CREATE TABLE IF NOT EXISTS `bills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `bill_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(100) DEFAULT 'Walk-in Customer',
  `table_number` VARCHAR(20) DEFAULT 'T-1',
  `payment_method` VARCHAR(50) DEFAULT 'Cash',
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `tax` DECIMAL(10, 2) DEFAULT 0.00,
  `discount` DECIMAL(10, 2) DEFAULT 0.00,
  `grand_total` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Paid',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Bill Items Table
CREATE TABLE IF NOT EXISTS `bill_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `bill_id` INT NOT NULL,
  `food_id` INT NOT NULL,
  `food_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data: Categories
INSERT INTO `categories` (`id`, `name`, `description`, `icon`) VALUES
(1, 'Starters', 'Crispy, tasty appetizers to kick off your meal', '🥗'),
(2, 'Main Course', 'Hearty and delicious traditional & modern main dishes', '🍛'),
(3, 'Fast Food', 'Burgers, pizzas, fries & quick bites', '🍔'),
(4, 'Desserts', 'Sweet treats and delightful desserts', '🍰'),
(5, 'Beverages', 'Refreshing cold and hot drinks', '🥤')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Data: Foods
INSERT INTO `foods` (`id`, `name`, `price`, `category_id`, `description`, `image_url`, `is_available`) VALUES
(1, 'Paneer Tikka', 9.99, 1, 'Marinated cottage cheese grilled to perfection in tandoor', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500', 1),
(2, 'Crispy Spring Rolls', 6.50, 1, 'Golden fried rolls packed with fresh spicy vegetables', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', 1),
(3, 'Paneer Butter Masala', 12.99, 2, 'Rich, velvety tomato butter gravy with soft paneer cubes', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500', 1),
(4, 'Veg Biryani Special', 11.50, 2, 'Fragrant long-grain basmati rice cooked with exotic spices', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', 1),
(5, 'Classic Cheese Burger', 8.99, 3, 'Juicy veg patty layered with cheddar cheese, lettuce & sauce', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 1),
(6, 'Farmhouse Pizza 10"', 14.25, 3, 'Loaded with capsicum, onion, tomato, mushrooms & mozzarella', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', 1),
(7, 'Chocolate Lava Cake', 5.99, 4, 'Warm molten chocolate cake served with vanilla bean ice cream', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', 1),
(8, 'Mango Lassi', 4.00, 5, 'Traditional Indian sweet mango yogurt smoothie', 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500', 1),
(9, 'Iced Mint Lemonade', 3.50, 5, 'Chilled sparkling mint and lemon cooler', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
