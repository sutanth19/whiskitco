import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBg0rK6Rvye36O7j07kvGhdsn3DtHDbz60",
  authDomain: "appwhiskit.firebaseapp.com",
  projectId: "appwhiskit",
  storageBucket: "appwhiskit.appspot.com",
  messagingSenderId: "992112272809",
  appId: "1:992112272809:web:d12c15a2fadb6125add0b8",
  measurementId: "G-KYJ6NFCZH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { auth, db };
