import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config (kept as-is for local/dev). Do NOT initialize client SDKs on the server.
const firebaseConfig = {
  apiKey: "AIzaSyA8e9QZG2DuuMk9QfSnqZW_aMnlMqTfL14",
  authDomain: "fir-practice-165ed.firebaseapp.com",
  projectId: "fir-practice-165ed",
  storageBucket: "fir-practice-165ed.firebasestorage.app",
  messagingSenderId: "314726403832",
  appId: "1:314726403832:web:0473784ea0d549f6f9f50d",
};

// Export placeholders; real instances are only created in the browser
let app = null;
let auth = null;
let db = null;

if (typeof window !== "undefined") {
  // Only initialize Firebase in the browser to avoid server-side IndexedDB / persistence issues
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Safe to attach client-only auth state listener here
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
    } else {
      console.log("No user is signed in.");
    }
  });
}

export { auth, db };