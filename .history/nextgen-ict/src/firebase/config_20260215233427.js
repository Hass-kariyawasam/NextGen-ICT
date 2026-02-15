// File: src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChYVapKMOTS2AcK_DxIH1VGuw-HxX1TmU",
  authDomain: "nextgen-ict-e6085.firebaseapp.com",
  projectId: "nextgen-ict-e6085",
  storageBucket: "nextgen-ict-e6085.firebasestorage.app",
  messagingSenderId: "788827611758",
  appId: "1:788827611758:web:47fe9b7004d84b1672bc7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);