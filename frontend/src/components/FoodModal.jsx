import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { X, Save, Image as ImageIcon } from 'lucide-react';

const FoodModal = () => {
  const { isFoodModalOpen, closeFoodModal, editingFood, categories, addFood, updateFood } = useRestaurant();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    image_url: '',
    is_available: true
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingFood) {
      setFormData({
        name: editingFood.name || '',
        price: editingFood.price || '',
        category_id: editingFood.category_id || '',
        description: editingFood.description || '',
        image_url: editingFood.image_url || '',
        is_available: editingFood.is_available === 1 || editingFood.is_available === true
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        description: '',
        image_url: '',
        is_available: true
      });
    }
    setErrors({});
  }, [editingFood, isFoodModalOpen, categories]);

  if (!isFoodModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Food name is required';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errs.price = 'Please enter a valid positive price';
    }
    if (!formData.category_id) errs.category_id = 'Category selection is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    let success = false;

    if (editingFood) {
      success = await updateFood(editingFood.id, formData);
    } else {
      success = await addFood(formData);
    }

    setSubmitting(false);
    if (success) {
      closeFoodModal();
    }
  };

  return (
    <div className="modal-overlay" onClick={closeFoodModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f8fafc' }}>
            {editingFood ? '✏️ Edit Food Item' : '➕ Add New Food Item'}
          </h2>
          <button
            onClick={closeFoodModal}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem' }}>
              Food Item Name <span style={{ color: '#f43f5e' }}>*</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Paneer Butter Masala"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <small style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.name}</small>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Price ($) <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input-field"
                placeholder="e.g. 12.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {errors.price && <small style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.price}</small>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Category <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <select
                className="input-field"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon || '🍽️'} {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <small style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{errors.category_id}</small>}
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem' }}>
              Image URL (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <ImageIcon size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="url"
                className="input-field"
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem' }}>
              Description
            </label>
            <textarea
              className="input-field"
              rows="3"
              placeholder="Short description of ingredients or preparation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <label htmlFor="is_available" style={{ fontSize: '0.9rem', color: '#f8fafc', cursor: 'pointer', userSelect: 'none' }}>
              Item is currently available in stock
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={closeFoodModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={16} /> {submitting ? 'Saving...' : editingFood ? 'Update Item' : 'Save Food Item'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FoodModal;
