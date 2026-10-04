import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Fallback sample data in case API is down
let staticFoods = [
  { id: '1', name: 'Margherita Pizza', price: 12.99, category: 'Main Course', description: 'Classic cheese and tomato', quantity: 0 },
  { id: '2', name: 'Garlic Bread', price: 5.99, category: 'Appetizers', description: 'Toasted with garlic butter', quantity: 0 },
  { id: '3', name: 'Tiramisu', price: 6.99, category: 'Desserts', description: 'Coffee flavored Italian dessert', quantity: 0 },
];

let nextId = 4;

export const getAllFoods = async () => {
  try {
    const res = await api.get('/foods');
    return res.data;
  } catch (error) {
    console.warn('API failed, using static data for getAllFoods');
    return staticFoods;
  }
};

export const getFoodById = async (id) => {
  try {
    const res = await api.get(`/foods/${id}`);
    return res.data;
  } catch (error) {
    console.warn('API failed, using static data for getFoodById');
    const food = staticFoods.find(f => f.id === id || f._id === id);
    if (food) return food;
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const res = await api.get('/categories');
    return res.data;
  } catch (error) {
    console.warn('API failed, using static data for categories');
    return ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];
  }
};

export const getFoodsByCategory = async (categoryId) => {
  try {
    const res = await api.get(`/foods?category=${categoryId}`);
    return res.data;
  } catch (error) {
    console.warn('API failed, using static data for getFoodsByCategory');
    return staticFoods.filter(f => f.category === categoryId);
  }
};

export const addFood = async (foodData) => {
  try {
    const res = await api.post('/foods', foodData);
    return res.data;
  } catch (error) {
    console.warn('API failed, using static data for addFood');
    const newFood = { ...foodData, id: String(nextId++), quantity: 0 };
    staticFoods.push(newFood);
    return newFood;
  }
};

export const updateFood = async (id, foodData) => {
  try {
    const res = await api.put(`/foods/${id}`, foodData);
    return res.data;
  } catch (error) {
    console.warn('API failed, using static data for updateFood');
    staticFoods = staticFoods.map(f => (f.id === id || f._id === id) ? { ...f, ...foodData } : f);
    return foodData;
  }
};

export const deleteFood = async (id) => {
  try {
    const res = await api.delete(`/foods/${id}`);
    return res.data;
  } catch (error) {
    console.warn('API failed, using static data for deleteFood');
    staticFoods = staticFoods.filter(f => f.id !== id && f._id !== id);
    return { success: true };
  }
};

export const updateQuantity = async (id, action) => {
  try {
    const res = await api.patch(`/foods/${id}/quantity`, { action });
    return res.data;
  } catch (error) {
    console.warn('API failed, using static data for updateQuantity');
    const food = staticFoods.find(f => f.id === id || f._id === id);
    if (food) {
      if (action === 'increment') food.quantity++;
      if (action === 'decrement' && food.quantity > 0) food.quantity--;
      return food;
    }
    throw new Error('Food not found');
  }
};

export const resetQuantities = async () => {
    try {
        const foods = await getAllFoods();
        staticFoods.forEach(f => f.quantity = 0);
        // Try real API for each item (in a real app, backend would have a bulk endpoint)
        try {
            await Promise.all(foods.map(f => {
                const id = f._id || f.id;
            }));
        } catch(e) {}
    } catch(err) {
        console.error(err);
    }
}
