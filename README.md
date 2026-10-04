# 🍽️ BistroPulse - Simple Restaurant Management & POS System

A full-stack modern Restaurant Management Web Application designed for restaurant managers and cashiers. Built according to the **11-Week Development Plan**.

![BistroPulse Banner](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Key Features

- **🍔 Menu & Inventory Management (CRUD)**: Add, update, view, and delete food items with real-time stock availability toggles.
- **🥗 Category Grouping & Filtering**: Filter food items by categories (*Starters, Main Course, Fast Food, Desserts, Beverages*).
- **🛒 POS & Live Order Cart**: Interactive `+` and `-` quantity controls with real-time subtotal computation.
- **🧾 Bill & Invoice Generation**: Generate custom itemized receipts, calculate tax and discounts, and save bills to the database.
- **🖨️ Printable PDF Invoices**: One-click printable receipt output formatted for standard thermal receipt printers or PDF export.
- **📊 Sales Analytics & Bill Log**: View sales performance stats, revenue summary, and full historical bill log.
- **💾 Dual Database Engine**: Supports MySQL database out of the box with zero-config SQLite fallback for instant offline/local testing.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React.js (Vite) |
| **Frontend Styling** | Vanilla CSS3 (Glassmorphic Theme, Modern Typography) |
| **Icons** | Lucide React |
| **Backend Runtime** | Node.js & Express.js |
| **Database** | MySQL (`restaurant_db`) & SQLite Fallback |
| **API Architecture** | RESTful JSON APIs |

---

## 📅 11-Week Development Plan & Deliverables Map

| Week | Phase / Focus | Deliverables & Code Location |
| :---: | :--- | :--- |
| **Week 1** | Project Setup + HTML Form Design | [`week1_week2_demo/foodForm.html`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/week1_week2_demo/foodForm.html), [`week1_week2_demo/style.css`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/week1_week2_demo/style.css) |
| **Week 2** | JavaScript Form Validation & JS CRUD | [`week1_week2_demo/app.js`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/week1_week2_demo/app.js) |
| **Week 3** | Backend with Node.js + Express.js | [`backend/server.js`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/backend/server.js) |
| **Week 4** | MySQL Integration & Database Setup | [`schema.sql`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/schema.sql), [`backend/config/db.js`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/backend/config/db.js) |
| **Week 5** | Full CRUD API for Foods & Categories | [`backend/controllers/foodController.js`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/backend/controllers/foodController.js) |
| **Week 6** | Build React Frontend UI | [`frontend/src/pages/MenuManager.jsx`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/frontend/src/pages/MenuManager.jsx) |
| **Week 7** | Integrate Backend REST API with React | [`frontend/src/context/RestaurantContext.jsx`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/frontend/src/context/RestaurantContext.jsx) |
| **Week 8** | Category Filters & Quantity Buttons | [`frontend/src/components/CategoryFilter.jsx`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/frontend/src/components/CategoryFilter.jsx), [`FoodCard.jsx`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/frontend/src/components/FoodCard.jsx) |
| **Week 9** | Generate Bill & Save to DB | [`backend/controllers/billController.js`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/backend/controllers/billController.js), [`CartBillModal.jsx`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/frontend/src/components/CartBillModal.jsx) |
| **Week 10** | Glassmorphic Styling & Form Validations | [`frontend/src/index.css`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/frontend/src/index.css), [`FoodModal.jsx`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/frontend/src/components/FoodModal.jsx) |
| **Week 11** | Documentation, ERD & Deployment Readiness | [`README.md`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/README.md), [`ERD.md`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/ERD.md), [`API_DOCS.md`](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/API_DOCS.md) |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- NPM (v9 or higher)
- (Optional) MySQL Server (if using MySQL DB instead of default zero-config SQLite)

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
> The Express server will launch on `http://localhost:5000`. By default, it automatically initializes a local SQLite database populated with default categories and food items.

#### Connecting MySQL (Optional):
1. Import `schema.sql` into your MySQL server / phpMyAdmin.
2. Edit `backend/.env`:
   ```env
   PORT=5000
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=restaurant_db
   ```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
> The Vite React app will launch on `http://localhost:3000` with an automatic proxy to the Express API.

### 4. Running Week 1 & 2 Demo
Open `week1_week2_demo/foodForm.html` in any web browser to view the standalone Week 1 & Week 2 HTML/CSS/JS CRUD implementation.

---

## 📖 Project Documentation
- 🗄️ [Database ERD & Schema Guide (ERD.md)](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/ERD.md)
- 🔌 [RESTful API Documentation (API_DOCS.md)](file:///c:/Users/HENIL/OneDrive/Desktop/Vishuuuuuu%27s%20project/API_DOCS.md)
