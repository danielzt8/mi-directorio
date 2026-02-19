// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPZp-S7f0sC__4-8VgdlJ9Xrpk75X-7aw",
    authDomain: "directorio-obispado.firebaseapp.com",
    projectId: "directorio-obispado",
    storageBucket: "directorio-obispado.firebasestorage.app",
    messagingSenderId: "1031416820681",
    appId: "1:1031416820681:web:8882902f8c9aa8fa736e18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);