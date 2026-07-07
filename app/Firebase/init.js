import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8e9QZG2DuuMk9QfSnqZW_aMnlMqTfL14",
  authDomain: "fir-practice-165ed.firebaseapp.com",
  projectId: "fir-practice-165ed",
  storageBucket: "fir-practice-165ed.firebasestorage.app",
  messagingSenderId: "314726403832",
  appId: "1:314726403832:web:0473784ea0d549f6f9f50d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
  } else {
    console.log("No user is signed in.");
  }
});