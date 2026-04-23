import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/theme.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-link" style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Utensils size={28} />
          <span>MiniFood</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Menu</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/cart" className="nav-link" style={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Hi, {user.username}</span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
