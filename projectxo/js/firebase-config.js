// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase configuration - USE YOUR VALUES
const firebaseConfig = {
  apiKey: "AIzaSyAxv3yZ5Ex_JavuAxOEe0DoaDwH1YIx62w",
  authDomain: "projectxo-17061130.firebaseapp.com",
  projectId: "projectxo-17061130",
  storageBucket: "projectxo-17061130.firebasestorage.app",
  messagingSenderId: "834793800310",
  appId: "1:834793800310:web:4f29a5df2cdfc148861557"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { auth, db };