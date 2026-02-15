import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrW1soesbqGz62jRy-HibkgJJycq_5kXo",
  authDomain: "myfinancetracker-8a726.firebaseapp.com",
  projectId: "myfinancetracker-8a726",
  storageBucket: "myfinancetracker-8a726.firebasestorage.app",
  messagingSenderId: "962054230976",
  appId: "1:962054230976:web:c0c3c04bece36198d72e25",
  measurementId: "G-T9QTWDCS0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and EXPORT services
export const auth = getAuth(app);
export const db = getFirestore(app);