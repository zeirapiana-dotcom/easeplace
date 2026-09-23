import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFW8F4TkmAczRmVtyOHK06a4Qm32e3rb0",
  authDomain: "easeplace-boarding-house.firebaseapp.com",
  projectId: "easeplace-boarding-house",
  storageBucket: "easeplace-boarding-house.firebasestorage.app",
  messagingSenderId: "398101151065",
  appId: "1:398101151065:web:2a859f852fcf1c1430a048",
  measurementId: "G-3D6Q9Z2F2Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

googleProvider.setCustomParameters({
  prompt: 'select_account'
});