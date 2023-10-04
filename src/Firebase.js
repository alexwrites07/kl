
// Firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
;


const firebaseConfig = {
    apiKey: "AIzaSyA1h6QXsmX4PcYCZILMTtry8UaaMbcBNKg",
    authDomain: "agent-807a7.firebaseapp.com",
    projectId: "agent-807a7",
    storageBucket: "agent-807a7.appspot.com",
    messagingSenderId: "918626263804",
    appId: "1:918626263804:web:627f47367e84af8e5c2d79"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Optional: Connect to Firebase Emulators for local development
// Uncomment the following lines if you're using Firebase Emulators
// connectAuthEmulator(auth, 'http://localhost:9099');
// connectFirestoreEmulator(firestore, 'localhost', 8080);


