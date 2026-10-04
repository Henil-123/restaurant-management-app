import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFoodById, updateFood, getCategories } from '../services/api';

function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState(['Appetizers', 'Main Course', 'Desserts', 'Beverages']);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [foodData, catsData] = await Promise.all([
          getFoodById(id),
          getCategories()
        ]);
        if(catsData.length > 0) setCategories(catsData);
        
        setFormData({
          name: foodData.name,
          price: foodData.price,
          category: foodData.category,
          description: foodData.description
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Could not load food item data.');
        navigate('/manager');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, navigate]);

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
      await updateFood(id, dataToSubmit);
      navigate('/manager');
    } catch (error) {
      console.error('Error updating food:', error);
      alert('Failed to update food item.');
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-accent"></div></div>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4 font-display">Edit Food Item</h3>
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
                <button type="submit" className="btn btn-primary">Update Item</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditFood;
