/**
 * @fileOverview Firebase configuration and initialization
 *
 * This module initializes Firebase services (Auth, Firestore, Storage) for the application.
 * Configuration can be provided via environment variables or falls back to defaults.
 *
 * @module lib/firebase
 */

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

/**
 * Firebase configuration object
 * Uses environment variables if available, otherwise falls back to hardcoded values
 *
 * @remarks
 * These values are safe to expose in client-side code as they identify your Firebase project
 * but don't grant access without proper Firestore security rules
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAkbLBTJo9-6OSH009jqw0dtx-xKxjE_VQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tradevision-journal-pss69.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://tradevision-journal-pss69-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tradevision-journal-pss69",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tradevision-journal-pss69.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "790628334512",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:790628334512:web:283fbaee6bb6aa1957b475",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CXZ90DLRPF"
};

/**
 * Validates that all required Firebase configuration values are present
 * @throws {Error} If any required configuration value is missing
 */
function validateFirebaseConfig(): void {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration: ${missingFields.join(', ')}`);
  }
}

// Validate configuration before initializing
validateFirebaseConfig();

/**
 * Initialize Firebase app instance
 * Reuses existing instance if already initialized to prevent multiple initializations
 */
let app: FirebaseApp;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw new Error('Firebase initialization failed. Please check your configuration.');
}

/**
 * Firebase Authentication instance
 * Used for user authentication operations
 */
const auth: Auth = getAuth(app);

/**
 * Firestore database instance
 * Used for all database operations
 */
const db: Firestore = getFirestore(app);

/**
 * Firebase Storage instance
 * Used for file uploads (e.g., trade screenshots)
 */
const storage: FirebaseStorage = getStorage(app);

export { app, db, auth, storage };
