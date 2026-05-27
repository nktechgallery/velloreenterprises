import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDrRxtq3Zw_55tqJb4HPJyBkGXMrjC7hNI",
  authDomain: "velloreenterprisesweb.firebaseapp.com",
  projectId: "velloreenterprisesweb",
  storageBucket: "velloreenterprisesweb.firebasestorage.app",
  messagingSenderId: "794384556434",
  appId: "1:794384556434:web:45f86b8eb22f062b01e14b",
  measurementId: "G-DYN7KRJ24Y"
};

// Initialize Firebase only once
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Admin email whitelist
export const ADMIN_EMAILS = ['velloreenterprises7@gmail.com'];

export const isAdmin = (email) => {
  return ADMIN_EMAILS.includes(email);
};

export default app;