import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import './styles/theme.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          {/* Redirect all unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <div className="container">
          &copy; 2026 MiniFood Ordering System. All rights reserved.
        </div>
      </footer>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
