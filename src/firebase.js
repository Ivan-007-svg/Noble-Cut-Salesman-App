// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATvsgeJE6i7Q6vcXEd4Lo5fxZwASQNqsY",
  authDomain: "noble-cut.firebaseapp.com",
  projectId: "noble-cut",
  storageBucket: "noble-cut.firebasestorage.app",
  messagingSenderId: "823877688810",
  appId: "1:823877688810:web:edcb9dd10fcb08984b6693"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
