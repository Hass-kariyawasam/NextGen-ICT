import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user }             = useAuth();
  const [cart, setCart]      = useState([]);
  const [enrollments, setEnrollments] = useState([]); // approved
  const [pending, setPending] = useState([]);           // pending requests

  // Listen to this user's enrollment requests
  useEffect(() => {
    if (!user) { setEnrollments([]); setPending([]); return; }
    const q = query(
      collection(db, 'enrollmentRequests'),
      where('userId', '==', user.uid),
    );
    const unsub = onSnapshot(q, (snap) => {
      const approved = [];
      const pend     = [];
      snap.forEach(d => {
        const data = { id: d.id, ...d.data() };
        if (data.status === 'approved')  approved.push(data.courseId);
        if (data.status === 'pending')   pend.push(data.courseId);
      });
      setEnrollments(approved);
      setPending(pend);
    });
    return unsub;
  }, [user]);

  const addToCart     = (course) => {
    if (!cart.find(c => c.id === course.id)) setCart(prev => [...prev, course]);
  };
  const removeFromCart = (courseId) => setCart(prev => prev.filter(c => c.id !== courseId));
  const clearCart      = ()         => setCart([]);
  const isInCart       = (id)       => cart.some(c => c.id === id);
  const isEnrolled     = (id)       => enrollments.includes(id);
  const isPending      = (id)       => pending.includes(id);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart,
      isInCart, isEnrolled, isPending, enrollments, pending,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
