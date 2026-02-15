// File: src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithPopup
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore"; 

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState({});

    // Sign Up Logic (Student Data එක්ක)
    const signUp = async (email, password, additionalData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // User හදපු ගමන් එයාගේ විස්තර Firestore එකට දානවා
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            ...additionalData, // Online ද Physical ද කියන විස්තර
            role: "student",
            createdAt: new Date()
        });
        return userCredential;
    };

    // Login Logic
    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Google Login
    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider);
    };

    // Logout Logic
    const logOut = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, signUp, logIn, logOut, googleSignIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}