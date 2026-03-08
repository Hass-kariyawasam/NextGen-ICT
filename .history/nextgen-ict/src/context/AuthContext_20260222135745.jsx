import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [userData, setUserData]   = useState(null);
  const [loadingUser, setLoading] = useState(true);

  // ── Sign in with Google ──────────────────────────────────────────────────
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const u      = result.user;

    // Create or update user doc in Firestore
    const ref  = doc(db, 'users', u.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // New user → create profile
      const studentId = 'NG' + Date.now().toString().slice(-6);
      await setDoc(ref, {
        name:       u.displayName || '',
        email:      u.email,
        photoURL:   u.photoURL || '',
        role:       'student',
        studentId,
        createdAt:  serverTimestamp(),
        provider:   'google',
      });
    }
    return result;
  };

  // ── Email / Password sign in ─────────────────────────────────────────────
  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ── Email / Password sign up ─────────────────────────────────────────────
  const signUp = async (email, password, name) => {
    const result    = await createUserWithEmailAndPassword(auth, email, password);
    const u         = result.user;
    const studentId = 'NG' + Date.now().toString().slice(-6);
    await setDoc(doc(db, 'users', u.uid), {
      name,
      email,
      role:       'student',
      studentId,
      createdAt:  serverTimestamp(),
      provider:   'email',
    });
    return result;
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logOut = () => signOut(auth);

  // ── Password reset ───────────────────────────────────────────────────────
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ── Auth state listener ──────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, 'users', u.uid));
        setUserData(snap.exists() ? snap.data() : null);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, userData, loadingUser,
      signInWithGoogle, signIn, signUp, logOut, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
