import React, { useEffect, useState } from 'react';
import { orderService } from '../services';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, CheckCircle, Package, ExternalLink, Loader2 } from 'lucide-react';
import '../styles/theme.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders();
        // Filter orders for current user (if backend doesn't handle it)
        const userOrders = data.filter(o => o.userId === user.id).reverse();
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container fade-in" style={{ textAlign: 'center', marginTop: '6rem' }}>
        <div style={{ background: 'var(--accent)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--primary)' }}>
          <Package size={48} />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>No orders yet</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't placed any orders. Ready to try something delicious?</p>
        <Link to="/" className="btn btn-primary">Go to Menu</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <h1 style={{ marginBottom: '2.5rem' }}>Order History</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => (
          <div key={order._id} className="order-card" style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--accent)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                 <Package size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Order #{order._id?.substring(0, 8)}...</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                   {new Date(order.createdAt).toLocaleString()} • {order.foodName} (x{order.quantity})
                </p>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                   {order.status === 'PAID' ? (
                     <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold', background: '#f0fdf4', padding: '2px 8px', borderRadius: '12px' }}>
                       <CheckCircle size={14} /> Completed
                     </span>
                   ) : (
                     <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#854d0e', fontSize: '0.8rem', fontWeight: 'bold', background: '#fefce8', padding: '2px 8px', borderRadius: '12px' }}>
                       <Clock size={14} /> Pending
                     </span>
                   )}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
               <div style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                 {(order.totalPrice || 0).toLocaleString()}đ
               </div>
               <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                  Details <ExternalLink size={12} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
