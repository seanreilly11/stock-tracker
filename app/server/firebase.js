// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};
// const firebaseConfig = {
//     apiKey: "AIzaSyBmfWAhZfC_OrBAd71eNpb1DF7J6BuXckA",
//     authDomain: "stock-tracker-62c54.firebaseapp.com",
//     projectId: "stock-tracker-62c54",
//     storageBucket: "stock-tracker-62c54.appspot.com",
//     messagingSenderId: "838702626135",
//     appId: "1:838702626135:web:7cf15df505714a26657a12",
//     measurementId: "G-FX2YJMCPD6",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
