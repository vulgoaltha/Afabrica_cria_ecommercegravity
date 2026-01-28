/**
 * Seed Script for 80 Products
 * Run this by importing it in the console or including it temporarily in index.html
 */
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const IMAGES = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
];

const TITLES = [
    "Camiseta Streetwear", "Moletom Oversized", "T-Shirt Estampada", "Regata Basic",
    "Calça Jogger", "Shorts Drift", "Boné Trucker", "Jaqueta Corta-Vento"
];

const ADJECTIVES = [
    "Premium", "Urban", "Classic", "Limited Edition", "Future", "Retro", "Black Edition"
];

export async function seedProducts() {
    console.log("Iniciando Seed de 80 produtos...");

    for (let i = 1; i <= 80; i++) {
        const title = `${TITLES[Math.floor(Math.random() * TITLES.length)]} ${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} #${i}`;
        const price = Math.floor(Math.random() * (200 - 50) + 50);

        const product = {
            title: title,
            description: "Produto de alta qualidade com design exclusivo A Fábrica Cria. Conforto e estilo para o seu dia a dia.",
            price_in_cents: price * 100,
            sale_price_in_cents: Math.random() > 0.7 ? (price - 10) * 100 : null,
            image: IMAGES[Math.floor(Math.random() * IMAGES.length)],
            category: ["camisetas", "moletons", "acessorios", "calcados"][Math.floor(Math.random() * 4)],
            stock: Math.floor(Math.random() * 50) + 10,
            sizes: ['P', 'M', 'G', 'GG', 'XG'],
            customizable: Math.random() > 0.8,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        try {
            await addDoc(collection(db, "products"), product);
            console.log(`Produto ${i}/80 criado: ${title}`);
        } catch (e) {
            console.error(e);
        }
    }

    console.log("SEED COMPLETO!");
    alert("80 Produtos criados com sucesso!");
}

// Auto-run if attached to window (for console usage)
window.runSeed = seedProducts;
