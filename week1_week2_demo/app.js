// Week 2: JavaScript Form Functionality & JS-only CRUD
let foodItems = [
  { id: 1, name: 'Paneer Butter Masala', price: 12.99, category: 'Main Course', description: 'Rich creamy paneer gravy with butter' },
  { id: 2, name: 'Crispy Spring Rolls', price: 6.50, category: 'Starters', description: 'Vegetable filled crispy appetizers' },
  { id: 3, name: 'Mango Lassi', price: 4.00, category: 'Beverages', description: 'Chilled yogurt mango smoothie' }
];

let editingId = null;

// DOM Elements
const foodForm = document.getElementById('foodForm');
const foodNameInput = document.getElementById('foodName');
const foodPriceInput = document.getElementById('foodPrice');
const foodCategoryInput = document.getElementById('foodCategory');
const foodDescInput = document.getElementById('foodDescription');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const foodTableBody = document.getElementById('foodTableBody');
const emptyState = document.getElementById('emptyState');
const itemCount = document.getElementById('itemCount');
const searchInput = document.getElementById('searchInput');

// Validation error elements
const nameError = document.getElementById('nameError');
const priceError = document.getElementById('priceError');
const categoryError = document.getElementById('categoryError');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  
  foodForm.addEventListener('submit', handleFormSubmit);
  resetBtn.addEventListener('click', resetForm);
  searchInput.addEventListener('input', () => renderTable(searchInput.value));
});

// Render table
function renderTable(filterText = '') {
  foodTableBody.innerHTML = '';
  
  const filtered = foodItems.filter(item => 
    item.name.toLowerCase().includes(filterText.toLowerCase()) ||
    item.category.toLowerCase().includes(filterText.toLowerCase())
  );

  itemCount.textContent = filtered.length;

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    filtered.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td><span class="badge">${escapeHtml(item.category)}</span></td>
        <td>$${parseFloat(item.price).toFixed(2)}</td>
        <td>${escapeHtml(item.description || '-')}</td>
        <td class="action-btns">
          <button class="btn btn-edit" onclick="editItem(${item.id})">✏️ Edit</button>
          <button class="btn btn-danger" onclick="deleteItem(${item.id})">🗑️ Delete</button>
        </td>
      `;
      foodTableBody.appendChild(tr);
    });
  }
}

// Form Submission with Validation
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Clear previous errors
  nameError.textContent = '';
  priceError.textContent = '';
  categoryError.textContent = '';

  const name = foodNameInput.value.trim();
  const price = parseFloat(foodPriceInput.value);
  const category = foodCategoryInput.value;
  const description = foodDescInput.value.trim();

  let isValid = true;

  if (!name) {
    nameError.textContent = 'Food name is required';
    isValid = false;
  }

  if (isNaN(price) || price <= 0) {
    priceError.textContent = 'Please enter a valid positive price';
    isValid = false;
  }

  if (!category) {
    categoryError.textContent = 'Please select a category';
    isValid = false;
  }

  if (!isValid) return;

  if (editingId !== null) {
    // Update existing
    const index = foodItems.findIndex(i => i.id === editingId);
    if (index !== -1) {
      foodItems[index] = { id: editingId, name, price, category, description };
    }
  } else {
    // Add new
    const newId = foodItems.length > 0 ? Math.max(...foodItems.map(i => i.id)) + 1 : 1;
    foodItems.push({ id: newId, name, price, category, description });
  }

  resetForm();
  renderTable();
}

// Edit item
window.editItem = function(id) {
  const item = foodItems.find(i => i.id === id);
  if (!item) return;

  editingId = item.id;
  foodNameInput.value = item.name;
  foodPriceInput.value = item.price;
  foodCategoryInput.value = item.category;
  foodDescInput.value = item.description || '';
  
  saveBtn.innerHTML = '💾 Update Food Item';
  saveBtn.classList.add('btn-primary');
};

// Delete item
window.deleteItem = function(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    foodItems = foodItems.filter(i => i.id !== id);
    if (editingId === id) resetForm();
    renderTable();
  }
};

// Reset form
function resetForm() {
  editingId = null;
  foodForm.reset();
  nameError.textContent = '';
  priceError.textContent = '';
  categoryError.textContent = '';
  saveBtn.innerHTML = '➕ Add Food Item';
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
