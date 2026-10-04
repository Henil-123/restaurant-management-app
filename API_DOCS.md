# 🔌 RESTful API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Food Items API (`/api/foods`)

### `GET /api/foods`
Fetch all food items with category metadata.
- **Query Parameters**:
  - `category_id` (optional): Filter by category ID.
  - `search` (optional): Search by name or description.
  - `available_only` (optional): `true` to filter in-stock items only.
- **Response**:
  ```json
  {
    "success": true,
    "count": 9,
    "data": [
      {
        "id": 1,
        "name": "Paneer Tikka",
        "price": 9.99,
        "category_id": 1,
        "category_name": "Starters",
        "category_icon": "🥗",
        "description": "Marinated cottage cheese grilled to perfection",
        "image_url": "https://...",
        "is_available": 1
      }
    ]
  }
  ```

### `GET /api/foods/:id`
Fetch single food item by ID.

### `POST /api/foods`
Create new food item.
- **Request Body**:
  ```json
  {
    "name": "Crispy Paneer Roll",
    "price": 8.50,
    "category_id": 1,
    "description": "Delicious rolled starter",
    "image_url": "https://..."
  }
  ```

### `PUT /api/foods/:id`
Update an existing food item.

### `DELETE /api/foods/:id`
Delete a food item by ID.

### `PATCH /api/foods/:id/availability`
Toggle stock availability status (`is_available`: 1 <-> 0).

---

## 2. Categories API (`/api/categories`)

### `GET /api/categories`
Fetch all food categories with item counts.

### `POST /api/categories`
Create new food category.

---

## 3. Bills & Invoices API (`/api/bills`)

### `POST /api/bills`
Generate a new bill, calculate totals, and save to database.
- **Request Body**:
  ```json
  {
    "customer_name": "John Doe",
    "table_number": "Table 4",
    "payment_method": "Cash",
    "tax_rate": 5,
    "discount_amount": 2.00,
    "items": [
      { "food_id": 1, "quantity": 2 },
      { "food_id": 8, "quantity": 1 }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Bill generated successfully!",
    "data": {
      "id": 1,
      "bill_number": "INV-482019-9182",
      "customer_name": "John Doe",
      "subtotal": 23.98,
      "tax": 1.20,
      "discount": 2.00,
      "grand_total": 23.18,
      "items": [...]
    }
  }
  ```

### `GET /api/bills`
Fetch past bill history list.

### `GET /api/bills/:id`
Fetch complete bill invoice breakdown with line items.

---

## 4. Statistics API (`/api/stats`)

### `GET /api/stats`
Fetch overview statistics for dashboard metrics (total food items, active categories, total bills, total revenue).
