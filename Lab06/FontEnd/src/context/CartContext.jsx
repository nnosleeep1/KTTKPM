import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) return [];
    
    try {
      const parsed = JSON.parse(savedCart);
      // Data Migration: If any item has an 'id' that is a number, the cart is stale
      if (parsed.some(item => typeof item.id === 'number')) {
        localStorage.removeItem('cart');
        return [];
      }
      return parsed;
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Use _id for MongoDB compatibility
      const id = product._id || product.id;
      const existing = prev.find(item => (item._id || item.id) === id);
      
      if (existing) {
        return prev.map(item => (item._id || item.id) === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item => (item._id || item.id) === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCartItems([]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

