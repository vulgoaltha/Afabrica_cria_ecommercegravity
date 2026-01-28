import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCd9i7k3EywIK56nQy9alVmf_DbY6OV1WI",
    authDomain: "afabricacriaecommercegravity.firebaseapp.com",
    projectId: "afabricacriaecommercegravity",
    storageBucket: "afabricacriaecommercegravity.firebasestorage.app",
    messagingSenderId: "1023848528077",
    appId: "1:1023848528077:web:3ae42b0a49fc5892509184",
    measurementId: "G-9DVJQW8FRD"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exporta as instâncias dos serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log("🔥 Firebase (React) inicializado");
