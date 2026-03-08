import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, signInWithPopup,
  GoogleAuthProvider, sendPasswordResetEmail, updatePassword
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  doc, setDoc, getDoc, collection,
  query, where, getDocs, updateDoc
} from "firebase/firestore";

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user,        setUser]        = useState(null);
  const [userData,    setUserData]    = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // ✅ true from start

  const fetchUserData = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setUserData(snap.data());
    } catch (e) {
      console.error("fetchUserData error:", e);
    }
  };

  const signUp = async (email, password, additionalData) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      email, ...additionalData, role: "student", createdAt: new Date()
    });
    return cred;
  };

  const logInWithEmailOrPhone = async (identifier, password) => {
    if (identifier.includes("@")) {
      return signInWithEmailAndPassword(auth, identifier, password);
    }
    const q    = query(collection(db, "users"), where("phone", "==", identifier));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("No account found with this phone number.");
    return signInWithEmailAndPassword(auth, snap.docs[0].data().email, password);
  };

  const googleSignIn = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const ref    = doc(db, "users", result.user.uid);
    const snap   = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        name: result.user.displayName, email: result.user.email,
        role: "student", studentType: "online", createdAt: new Date()
      });
    }
    return result;
  };

  const updateUserData = async (uid, data) => {
    await updateDoc(doc(db, "users", uid), data);
    setUserData(prev => ({ ...prev, ...data }));
  };

  const changePassword = (newPassword) => updatePassword(auth.currentUser, newPassword);
  const resetPassword  = (email)       => sendPasswordResetEmail(auth, email);
  const logOut         = ()            => signOut(auth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      setLoadingUser(false); // ✅ Firebase confirm කළාට පස්සේ විතරක් false
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, userData, loadingUser,
      signUp, logInWithEmailOrPhone, logOut,
      googleSignIn, resetPassword,
      updateUserData, changePassword, fetchUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## ✅ Problem එක මෙහෙම වෙනවා
```
Page load
    ↓
loadingUser = true   →  Spinner පෙන්වනවා (logout වෙන්නේ නෑ)
    ↓
Firebase onAuthStateChanged fire වෙනවා
    ↓
loadingUser = false
    ↓
user තියෙනවා  →  Dashboard show වෙනවා ✅
user නෑ       →  /login redirect ✅
```

**කලින් වෙච්ච දේ:**
```
Page load → user = null → ProtectedRoute → /login  ❌
(Firebase check වෙන්නත් කලින් logout)