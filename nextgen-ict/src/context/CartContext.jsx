import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
  collection, addDoc, getDocs, query,
  where, serverTimestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart]                             = useState([]);
  const [enrollments, setEnrollments]               = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  const fetchEnrollments = async () => {
    if (!user) { setEnrollments([]); setLoadingEnrollments(false); return; }
    setLoadingEnrollments(true);
    const q    = query(collection(db, "enrollments"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    setEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoadingEnrollments(false);
  };

  useEffect(() => { fetchEnrollments(); }, [user]);

  const addToCart      = (course) => {
    if (!cart.find(c => c.id === course.id) && !isEnrolled(course.id))
      setCart(prev => [...prev, course]);
  };
  const removeFromCart = (courseId) => setCart(prev => prev.filter(c => c.id !== courseId));
  const isInCart       = (courseId) => cart.some(c => c.id === courseId);
  const isEnrolled     = (courseId) => enrollments.some(e => e.courseId === courseId && e.status === 'approved');
  const isPending      = (courseId) => enrollments.some(e => e.courseId === courseId && e.status === 'pending');
  const cartTotal      = cart.reduce((s, c) => s + (c.price || 0), 0);

  // slipLink = Google Drive share link (or null)
  const buyNow = async (course, slipLink = null) => {
    if (!user) return;
    await addDoc(collection(db, "enrollments"), {
      userId:      user.uid,
      courseId:    course.id,
      courseTitle: course.title,
      price:       course.price,
      status:      'pending',
      slipLink:    slipLink || null,
      enrolledAt:  serverTimestamp(),
    });
    setCart(prev => prev.filter(c => c.id !== course.id));
    await fetchEnrollments();
  };

  const submitPayment = async (slipLink, description) => {
    if (!user || cart.length === 0) throw new Error('Invalid submission');

    const orderDoc = await addDoc(collection(db, "orders"), {
      userId:      user.uid,
      courseCount: cart.length,
      courses:     cart.map(c => ({
        id: c.id,
        courseTitle: c.title,
        thumbnail: c.thumbnail,
        price: c.price
      })),
      totalAmount: cartTotal,
      slipLink:    slipLink,
      description: description,
      status:      'pending',
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp()
    });

    // Create individual enrollment records for tracking
    for (const course of cart) {
      await addDoc(collection(db, "enrollments"), {
        userId:      user.uid,
        courseId:    course.id,
        courseTitle: course.title,
        price:       course.price,
        orderId:     orderDoc.id,
        status:      'pending',
        slipLink:    slipLink,
        enrolledAt:  serverTimestamp(),
      });
    }

    setCart([]);
    await fetchEnrollments();
  };

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, isInCart,
      isEnrolled, isPending, enrollments,
      loadingEnrollments, cartTotal, buyNow, fetchEnrollments,
      submitPayment
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);