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

    // Sign Up Logic (Email එකෙන් Account එක හදලා Phone එක DB එකට දානවා)
    const signUp = async (email, password, additionalData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            ...additionalData, // Phone number එක මෙතන තියෙනවා
            role: "student",
            createdAt: new Date()
        });
        return userCredential;
    };

    // --- NEW: Smart Login Logic (Email හෝ Phone එකෙන් Login වීම) ---
    const logInWithEmailOrPhone = async (identifier, password) => {
        // 1. බලනවා මේක Email එකක්ද කියලා (@ ලකුණ තියෙනවද කියලා)
        if (identifier.includes('@')) {
            // Email එකක් නම් කෙලින්ම Login කරනවා
            return signInWithEmailAndPassword(auth, identifier, password);
        } else {
            // 2. Email නෙවෙයි නම් (Phone Number එකක් නම්), Database එකේ හොයනවා
            // users collection එකේ phone field එක මේකට සමාන කෙනෙක් ඉන්නවද බලනවා
            const q = query(collection(db, "users"), where("phone", "==", identifier));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                throw new Error("No account found with this phone number.");
            }
            
            // User ව හම්බුනාම එයාගේ Email එක ගන්නවා
            const userDoc = querySnapshot.docs[0].data();
            const email = userDoc.email;
            
            // දැන් ඒ Email එක පාවිච්චි කරලා Login වෙනවා
            return signInWithEmailAndPassword(auth, email, password);
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
        // logInWithEmailOrPhone Function එක එළියට යවනවා
        <AuthContext.Provider value={{ user, signUp, logInWithEmailOrPhone, logOut, googleSignIn }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}