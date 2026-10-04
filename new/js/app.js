// Initial sample data
let foodItems = [
    { id: 1, name: "Paneer Tikka", price: 180, category: "Starters", description: "Grilled cottage cheese cubes marinated in spiced yogurt." },
    { id: 2, name: "Dal Makhani", price: 195, category: "Mains", description: "Creamy, slow-cooked black lentils and kidney beans." },
    { id: 3, name: "Masala Chai", price: 60, category: "Beverages", description: "Traditional spiced Indian tea." },
    { id: 4, name: "Gulab Jamun", price: 90, category: "Desserts", description: "Deep-fried milk dumplings soaked in sugar syrup." },
    { id: 5, name: "French Fries", price: 106, category: "All Time Favourites", description: "Crispy salted potato fries." }
];

let nextId = 6;
let isEditMode = false;
let currentEditId = null;

// DOM Elements
const foodForm = document.getElementById('foodForm');
const foodNameInput = document.getElementById('foodName');
const foodPriceInput = document.getElementById('foodPrice');
const foodCategoryInput = document.getElementById('foodCategory');
const foodDescInput = document.getElementById('foodDesc');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formTitle = document.getElementById('formTitle');
const foodTableBody = document.getElementById('foodTableBody');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const alertContainer = document.getElementById('alertContainer');

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    renderTable();

    // Form Submit Event
    foodForm.addEventListener('submit', handleFormSubmit);

    // Cancel Edit Event
    cancelEditBtn.addEventListener('click', resetForm);

    // Search Input Event
    searchInput.addEventListener('input', (e) => {
        renderTable(e.target.value);
    });
});

function showAlert(message, type = 'success') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHtml;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 4000);
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Reset previous validation
    foodForm.classList.remove('was-validated');

    // Validation checks
    const name = foodNameInput.value.trim();
    const price = parseFloat(foodPriceInput.value);
    const category = foodCategoryInput.value;
    const desc = foodDescInput.value.trim();

    let isValid = true;

    if (name.length < 2) {
        foodNameInput.classList.add('is-invalid');
        isValid = false;
    } else {
        foodNameInput.classList.remove('is-invalid');
        foodNameInput.classList.add('is-valid');
    }

    if (isNaN(price) || price <= 0) {
        foodPriceInput.classList.add('is-invalid');
        isValid = false;
    } else {
        foodPriceInput.classList.remove('is-invalid');
        foodPriceInput.classList.add('is-valid');
    }

    if (!category) {
        foodCategoryInput.classList.add('is-invalid');
        isValid = false;
    } else {
        foodCategoryInput.classList.remove('is-invalid');
        foodCategoryInput.classList.add('is-valid');
    }

    if (!isValid) {
        return; // Stop if invalid
    }

    if (isEditMode) {
        // Update existing
        const index = foodItems.findIndex(item => item.id === currentEditId);
        if (index !== -1) {
            foodItems[index] = {
                id: currentEditId,
                name: name,
                price: price,
                category: category,
                description: desc
            };
            showAlert('Food item updated successfully!', 'success');
        }
    } else {
        // Add new
        const newItem = {
            id: nextId++,
            name: name,
            price: price,
            category: category,
            description: desc
        };
        foodItems.push(newItem);
        showAlert('Food item added successfully!', 'success');
    }

    resetForm();
    renderTable(searchInput.value);
}

function renderTable(searchQuery = '') {
    foodTableBody.innerHTML = '';
    
    const query = searchQuery.toLowerCase().trim();
    const filteredItems = foodItems.filter(item => {
        return item.name.toLowerCase().includes(query) || 
               item.category.toLowerCase().includes(query);
    });

    if (filteredItems.length === 0) {
        emptyState.classList.remove('d-none');
    } else {
        emptyState.classList.add('d-none');
        
        filteredItems.forEach((item, index) => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td class="fw-bold">${item.name}</td>
                <td>₹${item.price}</td>
                <td><span class="badge bg-secondary">${item.category}</span></td>
                <td class="text-truncate" style="max-width: 200px;" title="${item.description}">${item.description || '-'}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editFood(${item.id})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteFood(${item.id})">Delete</button>
                </td>
            `;
            foodTableBody.appendChild(tr);
        });
    }
}

function deleteFood(id) {
    if (confirm("Are you sure you want to delete this food item?")) {
        foodItems = foodItems.filter(item => item.id !== id);
        renderTable(searchInput.value);
        showAlert('Food item deleted.', 'warning');
        
        // If deleting the item currently being edited, reset the form
        if (isEditMode && currentEditId === id) {
            resetForm();
        }
    }
}

window.editFood = function(id) {
    const item = foodItems.find(item => item.id === id);
    if (!item) return;

    // Populate form
    foodNameInput.value = item.name;
    foodPriceInput.value = item.price;
    foodCategoryInput.value = item.category;
    foodDescInput.value = item.description;

    // Remove validation styles
    foodNameInput.classList.remove('is-valid', 'is-invalid');
    foodPriceInput.classList.remove('is-valid', 'is-invalid');
    foodCategoryInput.classList.remove('is-valid', 'is-invalid');

    // Switch to edit mode
    isEditMode = true;
    currentEditId = id;
    
    formTitle.textContent = 'Edit Food Item';
    submitBtn.textContent = 'Update Food Item';
    cancelEditBtn.classList.remove('d-none');
    
    // Scroll to form (for mobile convenience)
    foodForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

function resetForm() {
    foodForm.reset();
    
    // Remove validation styles
    foodNameInput.classList.remove('is-valid', 'is-invalid');
    foodPriceInput.classList.remove('is-valid', 'is-invalid');
    foodCategoryInput.classList.remove('is-valid', 'is-invalid');
    
    isEditMode = false;
    currentEditId = null;
    
    formTitle.textContent = 'Add Food Item';
    submitBtn.textContent = 'Add Food Item';
    cancelEditBtn.classList.add('d-none');
}
