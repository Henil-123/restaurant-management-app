import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { UtensilsCrossed, Layers, Receipt, DollarSign } from 'lucide-react';

const StatsOverview = () => {
  const { stats, foods } = useRestaurant();

  const totalFoods = stats?.totalFoods || foods.length;
  const totalCategories = stats?.totalCategories || 5;
  const totalBills = stats?.totalBills || 0;
  const totalRevenue = stats?.totalRevenue || '0.00';

  const cards = [
    { title: 'Total Food Items', value: totalFoods, icon: UtensilsCrossed, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
    { title: 'Active Categories', value: totalCategories, icon: Layers, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
    { title: 'Total Bills Generated', value: totalBills, icon: Receipt, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    { title: 'Total Revenue', value: `$${totalRevenue}`, icon: DollarSign, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-panel" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: card.bg,
              color: card.color,
              padding: '0.8rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>{card.title}</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#f8fafc', marginTop: '0.1rem' }}>{card.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;
