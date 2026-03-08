import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(['c006']); // Free zone auto-enrolled

  const addToCart = (course) => {
    if (!cart.find(c => c.id === course.id) && !enrolledCourses.includes(course.id)) {
      setCart(prev => [...prev, { ...course, status: 'pending' }]);
    }
  };

  const removeFromCart = (courseId) => {
    setCart(prev => prev.filter(c => c.id !== courseId));
  };

  const isInCart = (courseId) => cart.some(c => c.id === courseId);
  const isEnrolled = (courseId) => enrolledCourses.includes(courseId);

  const cartTotal = cart.reduce((sum, c) => sum + c.price, 0);

  // Simulate buy → pending approval
  const buyNow = (courseId) => {
    setCart(prev => prev.map(c =>
      c.id === courseId ? { ...c, status: 'pending_approval' } : c
    ));
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, isInCart, isEnrolled,
      enrolledCourses, cartTotal, buyNow
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);