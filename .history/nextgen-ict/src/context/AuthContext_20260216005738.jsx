import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail // Reset email function eka
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; 

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState({});

    // --- Sign Up Logic ---
    const signUp = async (email, password, additionalData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            ...additionalData,
            role: "student",
            createdAt: new Date()
        });
        return userCredential;
    };

    // --- Smart Login Logic (Email or Phone) ---
    const logInWithEmailOrPhone = async (identifier, password) => {
        if (identifier.includes('@')) {
            return signInWithEmailAndPassword(auth, identifier, password);
        } else {
            const q = query(collection(db, "users"), where("phone", "==", identifier));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                throw new Error("No account found with this phone number.");
            }
            
            const userDoc = querySnapshot.docs[0].data();
            const email = userDoc.email;
            return signInWithEmailAndPassword(auth, email, password);
        }
    };

    // --- Google Sign In ---
    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const userRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(userRef);
        
        if (!docSnap.exists()) {
            await setDoc(userRef, {
                email: result.user.email,
                role: "student",
                studentType: "online",
                createdAt: new Date()
            });
        }
        return result;
    };

    // --- Password Reset Logic (Meeka Provider eka athulata damma) ---
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // --- Log Out ---
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
        // Value ekata 'resetPassword' ekath ekathu kala
        <AuthContext.Provider value={{ user, signUp, logInWithEmailOrPhone, logOut, googleSignIn, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}