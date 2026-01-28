
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Configuration from src/lib/firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyCd9i7k3EywIK56nQy9alVmf_DbY6OV1WI",
    authDomain: "afabricacriaecommercegravity.firebaseapp.com",
    projectId: "afabricacriaecommercegravity",
    storageBucket: "afabricacriaecommercegravity.firebasestorage.app",
    messagingSenderId: "1023848528077",
    appId: "1:1023848528077:web:3ae42b0a49fc5892509184"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ORIGINAL_PRODUCTS = [
    { title: "Camiseta", description: "Camiseta de alta qualidade com personalização.", price_in_cents: 8990, image: "/img/products/chave.png", category: "Camisetas", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG', 'XG'] },
    { title: "Calção Esportivo", description: "Calção leve e resistente.", price_in_cents: 5990, image: "/img/products/cavadinha.png", category: "Calções", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Short Passeio", description: "Conforto e lazer.", price_in_cents: 2990, image: "/img/products/passeio.png", category: "Shorts", customizable: false, stock: 50, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Boné Trucker", description: "Boné estilo trucker.", price_in_cents: 4990, image: "/img/products/Boné 3.png", category: "Bonés", customizable: true, stock: 50, sizes: ['U'] },
    { title: "Jaqueta Corta-Vento", description: "Leve e impermeável.", price_in_cents: 18990, image: "/img/products/kebrada com manga.png", category: "Jaquetas", customizable: true, stock: 20, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Polo Casual", description: "Clássica e moderna.", price_in_cents: 7990, image: "/img/products/malako.png", category: "Polos", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG'] }
];

async function restore() {
    console.log("Iniciando restauração...");

    try {
        // 1. Restore Original
        console.log("Restaurando 6 produtos originais...");
        for (const p of ORIGINAL_PRODUCTS) {
            await addDoc(collection(db, "products"), { ...p, createdAt: serverTimestamp() });
            console.log(`+ ${p.title}`);
        }

        // 2. Create 80 Random
        console.log("Criando mais 80 produtos...");
        for (let i = 1; i <= 80; i++) {
            const p = {
                title: `Produto Exemplo #${i}`,
                description: "Descrição automática.",
                price_in_cents: Math.floor(Math.random() * 20000) + 5000,
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
                category: "Geral",
                sizes: ['P', 'M', 'G'],
                stock: 100,
                createdAt: serverTimestamp()
            };
            await addDoc(collection(db, "products"), p);
            if (i % 10 === 0) console.log(`Criado ${i}/80...`);
        }

        console.log("SUCESSO! Todos os produtos foram restaurados.");
        process.exit(0);

    } catch (e) {
        console.error("ERRO:", e);
        process.exit(1);
    }
}

restore();
