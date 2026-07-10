import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { ADMIN_EMAILS } from './constants';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDrRxtq3Zw_55tqJb4HPJyBkGXMrjC7hNI',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'velloreenterprisesweb.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'velloreenterprisesweb',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'velloreenterprisesweb.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '794384556434',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:794384556434:web:45f86b8eb22f062b01e14b',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DYN7KRJ24Y',
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

export const isAdmin = (email) => {
  return ADMIN_EMAILS.includes(email);
};

export default app;
