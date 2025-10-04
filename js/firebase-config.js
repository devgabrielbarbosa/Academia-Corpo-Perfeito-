// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4r4Cmc29PCO2_iE9QK08XrhEr0s0l5P0",
  authDomain: "academia-corpo-perfeito.firebaseapp.com",
  projectId: "academia-corpo-perfeito",
  storageBucket: "academia-corpo-perfeito.firebasestorage.app",
  messagingSenderId: "911045092513",
  appId: "1:911045092513:web:a90011c73f7a9c07287ce0",
  measurementId: "G-FB9DY6GNE1"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Firestore e Auth
export const db = getFirestore(app);
export const auth = getAuth(app);




