import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail 
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; 

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState({});

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
            return signInWithEmailAndPassword(auth, userDoc.email, password);
        }
    };

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

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

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
        <AuthContext.Provider value={{ user, signUp, logInWithEmailOrPhone, logOut, googleSignIn, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

// ESLint warning eka ain karanna me peliya ekathu kala
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}