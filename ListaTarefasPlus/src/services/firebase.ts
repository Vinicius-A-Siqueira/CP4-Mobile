import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AlzaSYCHuO2ku3MZK8Mj4Pf0q3DkYfmOnGxNk3s", 
  authDomain: "cp4-mobile-c7b83.firebaseapp.com", 
  projectId: "cp4-mobile-c7b83", 
  storageBucket: "cp4-mobile-c7b83.appspot.com", 
  messagingSenderId: "200694114878", 
  appId: "1:200694114878:android:915ad01fed5f5afe9d3f6f", 
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);