import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllFoods, deleteFood, updateQuantity, getCategories } from '../services/api';

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const foodsData = await getAllFoods();
      setFoods(foodsData);
      
      const catsData = await getCategories();
      setCategories(catsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteFood(id);
      fetchData();
    }
  };

  const handleQuantity = async (id, action) => {
    await updateQuantity(id, action);
    fetchData(); // Refresh list to get updated quantities
  };

  const filteredFoods = foods.filter(food => {
    const matchesCategory = selectedCategory ? food.category === selectedCategory : true;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-accent"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Menu Management</h2>
        <div>
          <Link to="/manager/bill" className="btn btn-outline-primary me-2">Generate Bill</Link>
          <Link to="/manager/add" className="btn btn-primary">Add New Food</Link>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-2 mb-md-0">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select 
            className="form-select" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th className="text-center">Quantity</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFoods.length > 0 ? (
              filteredFoods.map(food => {
                const id = food._id || food.id;
                return (
                  <tr key={id}>
                    <td className="fw-bold">{food.name}</td>
                    <td><span className="badge bg-secondary">{food.category}</span></td>
                    <td>${Number(food.price).toFixed(2)}</td>
                    <td className="text-muted small">{food.description}</td>
                    <td className="text-center">
                      <div className="d-inline-flex align-items-center bg-light p-1 rounded border">
                        <button className="btn btn-sm btn-outline-secondary border-0" onClick={() => handleQuantity(id, 'decrement')}>-</button>
                        <span className="mx-3 fw-bold fs-5">{food.quantity || 0}</span>
                        <button className="btn btn-sm btn-outline-secondary border-0" onClick={() => handleQuantity(id, 'increment')}>+</button>
                      </div>
                    </td>
                    <td className="text-end">
                      <Link to={`/manager/edit/${id}`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
                      <button onClick={() => handleDelete(id)} className="btn btn-sm btn-outline-danger">Delete</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No food items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FoodList;
