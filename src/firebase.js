// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAy3fy_BJyzgDARKxyH3khql8wWQOLwgc4",
    authDomain: "barcode-app-4a65b.firebaseapp.com",
    projectId: "barcode-app-4a65b",
    storageBucket: "barcode-app-4a65b.appspot.com",
    messagingSenderId: "670881354935",
    appId: "1:670881354935:web:d3489d2486ed8aa9d3e932",
    measurementId: "G-F4QE40BQ8Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
