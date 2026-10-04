import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [bills, setBills] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active view tab: 'home', 'menu', 'book-table', 'my-orders', 'about', 'admin-dashboard'
  const [activePage, setActivePage] = useState('home');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart (foodId -> quantity)
  const [cart, setCart] = useState({});

  // Modals state
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeBillDetail, setActiveBillDetail] = useState(null);

  // Notifications / Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch initial data
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await api.get('/foods');
      if (res.data.success) {
        setFoods(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch foods:', err);
      setError('Could not connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills');
      if (res.data.success) {
        setBills(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch bills:', err);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations');
      if (res.data.success) {
        setReservations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
    fetchStats();
    fetchBills();
    fetchReservations();
  }, []);

  // Food CRUD Operations
  const addFood = async (foodData) => {
    try {
      const res = await api.post('/foods', foodData);
      if (res.data.success) {
        showToast('Food item created successfully! ✨');
        fetchFoods();
        fetchStats();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add food item', 'error');
      return false;
    }
  };

  const updateFood = async (id, foodData) => {
    try {
      const res = await api.put(`/foods/${id}`, foodData);
      if (res.data.success) {
        showToast('Food item updated! 📝');
        fetchFoods();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update food item', 'error');
      return false;
    }
  };

  const deleteFood = async (id) => {
    try {
      const res = await api.delete(`/foods/${id}`);
      if (res.data.success) {
        showToast('Food item removed 🗑️', 'info');
        setCart((prev) => {
          const newCart = { ...prev };
          delete newCart[id];
          return newCart;
        });
        fetchFoods();
        fetchStats();
        return true;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete food item', 'error');
      return false;
    }
  };

  const toggleAvailability = async (id) => {
    try {
      const res = await api.patch(`/foods/${id}/availability`);
      if (res.data.success) {
        showToast(res.data.message);
        fetchFoods();
      }
    } catch (err) {
      showToast('Failed to toggle availability', 'error');
    }
  };

  // Table Reservations Logic
  const createReservation = async (reservationData) => {
    try {
      const res = await api.post('/reservations', reservationData);
      if (res.data.success) {
        showToast('Table reservation confirmed! 🥂');
        fetchReservations();
        return res.data.data;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create reservation', 'error');
      return null;
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      const res = await api.put(`/reservations/${id}/status`, { status });
      if (res.data.success) {
        showToast(`Reservation marked as ${status}`);
        fetchReservations();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const deleteReservation = async (id) => {
    try {
      const res = await api.delete(`/reservations/${id}`);
      if (res.data.success) {
        showToast('Reservation deleted', 'info');
        fetchReservations();
      }
    } catch (err) {
      showToast('Failed to delete reservation', 'error');
    }
  };

  // Cart Logic
  const addToCart = (foodId) => {
    setCart((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1
    }));
    showToast('Added to order cart 🛒');
  };

  const updateCartQuantity = (foodId, delta) => {
    setCart((prev) => {
      const currentQty = prev[foodId] || 0;
      const newQty = currentQty + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[foodId];
        return newCart;
      }
      return { ...prev, [foodId]: newQty };
    });
  };

  const removeFromCart = (foodId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[foodId];
      return newCart;
    });
  };

  const clearCart = () => setCart({});

  // Generate Bill Operation
  const createBill = async (billData) => {
    try {
      const res = await api.post('/bills', billData);
      if (res.data.success) {
        showToast('Order placed & bill generated! 🧾');
        clearCart();
        fetchStats();
        fetchBills();
        setActiveBillDetail(res.data.data);
        return res.data.data;
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order', 'error');
      return null;
    }
  };

  // Modal Handlers
  const openAddFoodModal = () => {
    setEditingFood(null);
    setIsFoodModalOpen(true);
  };

  const openEditFoodModal = (food) => {
    setEditingFood(food);
    setIsFoodModalOpen(true);
  };

  const closeFoodModal = () => {
    setIsFoodModalOpen(false);
    setEditingFood(null);
  };

  // Compute Cart Totals
  const cartItemsList = Object.entries(cart).map(([foodId, quantity]) => {
    const food = foods.find((f) => f.id === parseInt(foodId));
    return {
      food,
      food_id: parseInt(foodId),
      quantity,
      subtotal: food ? food.price * quantity : 0
    };
  }).filter((item) => item.food !== undefined);

  const cartSubtotal = cartItemsList.reduce((sum, item) => sum + item.subtotal, 0);
  const totalCartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  return (
    <RestaurantContext.Provider
      value={{
        foods,
        categories,
        stats,
        bills,
        reservations,
        loading,
        error,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartItemsList,
        cartSubtotal,
        totalCartCount,
        addFood,
        updateFood,
        deleteFood,
        toggleAvailability,
        createReservation,
        updateReservationStatus,
        deleteReservation,
        createBill,
        isFoodModalOpen,
        openAddFoodModal,
        openEditFoodModal,
        closeFoodModal,
        editingFood,
        isCartOpen,
        setIsCartOpen,
        activeBillDetail,
        setActiveBillDetail,
        toast,
        showToast,
        fetchFoods,
        fetchBills,
        fetchReservations
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);
