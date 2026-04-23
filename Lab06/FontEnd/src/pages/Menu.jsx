import React, { useEffect, useState } from 'react';
import { foodService } from '../services';
import { useCart } from '../context/CartContext';
import { ShoppingPlus, Loader2, Star, Clock } from 'lucide-react';
import '../styles/theme.css';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await foodService.getFoods();
        setFoods(data);
      } catch (error) {
        console.error('Failed to fetch foods', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <header style={{ margin: '3rem 0 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Delicious Food Delivery</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Order from our best selection of Vietnamese cuisine.</p>
      </header>

      <div className="food-grid">
        {foods.map((food) => (
          <div key={food._id} className="food-card" style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',

            boxShadow: 'var(--shadow-md)',
            transition: 'var(--transition)',
            position: 'relative'
          }}>
            <div style={{ height: '200px', background: '#f1f5f9', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                <Star size={14} fill="var(--primary)" color="var(--primary)" /> 4.8
              </div>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '3rem',
                color: 'var(--text-muted)'
              }}>
                🍱
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>{food.name}</h3>
                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>{food.price.toLocaleString()}đ</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', height: '2.7rem', overflow: 'hidden' }}>
                {food.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} /> 20-30 mins
                </span>
                <button onClick={() => addToCart(food)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                   Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
