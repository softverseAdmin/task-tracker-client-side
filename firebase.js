// firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app'; // Import from modular SDK
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Use environment variables for Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if it's not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig); // Initialize app if it doesn't already exist
} else {
  getApp(); // Use the already initialized app
}

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
