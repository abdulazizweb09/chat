// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCK3QcEIgEcioltE35afwr7kXzd56jmRxw",
  authDomain: "chat-f497a.firebaseapp.com",
  projectId: "chat-f497a",
  storageBucket: "chat-f497a.firebasestorage.app",
  messagingSenderId: "1046262279778",
  appId: "1:1046262279778:web:0ef9c510bb28e23555eb3b",
  measurementId: "G-M1748CQL42",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
