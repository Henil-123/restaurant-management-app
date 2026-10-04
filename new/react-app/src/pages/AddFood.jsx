import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFood, getCategories } from '../services/api';

function AddFood() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(['Appetizers', 'Main Course', 'Desserts', 'Beverages']);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: ''
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        if(cats.length > 0) {
            setCategories(cats);
            setFormData(prev => ({ ...prev, category: cats[0] }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price)
      };
      await addFood(dataToSubmit);
      navigate('/manager');
    } catch (error) {
      console.error('Error adding food:', error);
      alert('Failed to add food item.');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4 font-display">Add New Food Item</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Price ($)</label>
                  <input type="number" step="0.01" min="0" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Category</label>
                  <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Description</label>
                <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
              </div>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/manager')}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFood;
