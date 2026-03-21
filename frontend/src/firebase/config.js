// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_O_4TvVpGP0679VAi814SOO-VKY-RvP0",
  authDomain: "flashattend-49e70.firebaseapp.com",
  projectId: "flashattend-49e70",
  storageBucket: "flashattend-49e70.firebasestorage.app",
  messagingSenderId: "610844240439",
  appId: "1:610844240439:web:186bbd248ebf16b6d96db2",
  measurementId: "G-C5ZTP0BTVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
