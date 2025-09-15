// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2aLBK_1teqnPX1K1n1P7YODAyIgGEiOc",
  authDomain: "trendtracker-48f9a.firebaseapp.com",
  databaseURL: "https://trendtracker-48f9a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trendtracker-48f9a",
  storageBucket: "trendtracker-48f9a.appspot.com",
  messagingSenderId: "367843776066",
  appId: "1:367843776066:web:cb91d77811e3f3b7b63fdb",
  measurementId: "G-NQ5XME2J2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
