import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore"; 

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState({});

    // Sign Up Logic
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

    // Login Logic
    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Google Login (මේකෙන් Auto merge වෙනවා console setting එක on නම්)
    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        // Google වලින් එන User අලුත් නම් විතරක් DB එකට දාන්න check එකක් දාමු
        const userRef = doc(db, "users", result.user.uid);
        const docSnap = await getDoc(userRef);
        
        if (!docSnap.exists()) {
            await setDoc(userRef, {
                email: result.user.email,
                role: "student",
                studentType: "online", // Default value
                createdAt: new Date()
            });
        }
        return result;
    };

    // Phone Login Setup (Recaptcha)
    const setUpRecaptcha = (number) => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
        recaptchaVerifier.render();
        return signInWithPhoneNumber(auth, number, recaptchaVerifier);
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
        <AuthContext.Provider value={{ user, signUp, logIn, logOut, googleSignIn, setUpRecaptcha }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}