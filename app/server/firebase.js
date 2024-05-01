// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBmfWAhZfC_OrBAd71eNpb1DF7J6BuXckA",
    authDomain: "stock-tracker-62c54.firebaseapp.com",
    projectId: "stock-tracker-62c54",
    storageBucket: "stock-tracker-62c54.appspot.com",
    messagingSenderId: "838702626135",
    appId: "1:838702626135:web:7cf15df505714a26657a12",
    measurementId: "G-FX2YJMCPD6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
