// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from "firebase/database";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvajtzixakcKJKFpiTzXA0l6Q18RbEgmw",
  authDomain: "appchat-717d1.firebaseapp.com",
  projectId: "appchat-717d1",
  storageBucket: "appchat-717d1.appspot.com",
  messagingSenderId: "64241256184",
  appId: "1:64241256184:web:3fc6c3ae25416068a51d0d",
  measurementId: "G-VRB5LGF75M"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_DATABASE =  getDatabase(FIREBASE_APP);
export const storage = getStorage(FIREBASE_APP);
// const analytics = getAnalytics(app);