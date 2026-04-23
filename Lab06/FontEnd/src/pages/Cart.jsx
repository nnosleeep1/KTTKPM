import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { orderService, paymentService } from '../services';
import { Trash2, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import '../styles/theme.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Banking');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      for (const item of cartItems) {
        const order = await orderService.createOrder({
          userId: user.id || user._id,
          foodId: item._id,
          quantity: item.quantity
        });

        // 2. Process payment immediately for the order
        await paymentService.processPayment({
          orderId: order._id,
          paymentMethod: paymentMethod
        });
      }

      alert('Order successfully placed and paid!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container fade-in" style={{ textAlign: 'center', marginTop: '6rem' }}>
        <div style={{ background: 'var(--accent)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--primary)' }}>
          <ShoppingBag size={48} />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '3rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem' }}>
        {/* Cart items */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                🍱
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.price.toLocaleString()}đ</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="btn btn-outline" style={{ width: '32px', height: '32px', padding: 0 }}>-</button>
                <span style={{ fontWeight: '600' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="btn btn-outline" style={{ width: '32px', height: '32px', padding: 0 }}>+</button>
              </div>
              <div style={{ width: '100px', textAlign: 'right', fontWeight: '700', fontSize: '1.1rem' }}>
                {(item.price * item.quantity).toLocaleString()}đ
              </div>
              <button onClick={() => removeFromCart(item._id)} style={{ color: 'var(--text-muted)', padding: '0.5rem', background: 'transparent' }}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>


        {/* Checkout section */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', alignSelf: 'start' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
            <span style={{ fontWeight: '500' }}>{total.toLocaleString()}đ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
            <span style={{ fontWeight: '500', color: 'var(--success)' }}>FREE</span>
          </div>
          <div style={{ borderTop: '2px solid #f1f5f9', margin: '1.5rem 0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>Total</span>
            <span style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--primary)' }}>{total.toLocaleString()}đ</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Payment Method</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setPaymentMethod('Banking')}
                className={`btn ${paymentMethod === 'Banking' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
              >
                Banking
              </button>
              <button 
                onClick={() => setPaymentMethod('COD')}
                className={`btn ${paymentMethod === 'COD' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
              >
                COD
              </button>
            </div>
          </div>

          <button 
            onClick={handleCheckout} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', height: '56px' }}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <><CreditCard size={20} /> Checkout</>
            )}
          </button>
          
          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Prices include all taxes and delivery fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
