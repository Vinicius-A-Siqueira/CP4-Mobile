import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCHuO2ku3MZK8Mj4Pf0q3DkYfmOnGxNk3s",
  authDomain: "cp4-mobile-c7b83.firebaseapp.com",
  projectId: "cp4-mobile-c7b83",
  storageBucket: "cp4-mobile-c7b83.firebasestorage.app",
  messagingSenderId: "200694114878",
  appId: "1:200694114878:web:6c7241920a4b981a9d3f6f",
  measurementId: "G-ZW24EQG2PS"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);