import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDg07kED4aItCSoExKx2Lgaiq5HqqLBGiU",
  authDomain: "tico-stay.firebaseapp.com",
  projectId: "tico-stay",
  storageBucket: "tico-stay.firebasestorage.app",
  messagingSenderId: "520688021349",
  appId: "1:520688021349:web:aa8537828997296fd0bb8c",
  measurementId: "G-HMLGEQEWX5"
};

export const app = initializeApp(firebaseConfig);
