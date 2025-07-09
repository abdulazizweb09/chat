// src/app/lib/firebase.js yoki src/lib/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // faqat clientda ishlaydi

const firebaseConfig = {
  apiKey: "AIzaSyCK3QcEIgEcioltE35afwr7kXzd56jmRxw",
  authDomain: "chat-f497a.firebaseapp.com",
  projectId: "chat-f497a",
  storageBucket: "chat-f497a.firebasestorage.app",
  messagingSenderId: "1046262279778",
  appId: "1:1046262279778:web:0ef9c510bb28e23555eb3b",
  measurementId: "G-M1748CQL42",
};

// Firebase ilovasini faqat 1 marta initialize qilish
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// export qilish
export { app, auth };
