/**
 * Restore Original Products Script
 * Uploads the unique original products from data/products.js to Firestore
 */
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const ORIGINAL_PRODUCTS = [
    {
        id: 1, // Legacy ID
        title: "Camiseta",
        description: "Camiseta de alta qualidade com personalização total de cores e logos. Ideal para equipes esportivas e eventos.",
        price_in_cents: 8990,
        image: "/img/products/chave.png",
        category: "Camisetas",
        customizable: true,
        gallery: ["/img/products/chave.png", "/img/products/chavosa.png"],
        stock: 50,
        sizes: ['P', 'M', 'G', 'GG', 'XG']
    },
    {
        id: 2,
        title: "Calção Esportivo Performance",
        description: "Calção leve e resistente, desenvolvido para máxima performance em campo.",
        price_in_cents: 5990,
        image: "/img/products/cavadinha.png",
        category: "Calções",
        customizable: true,
        gallery: ["/img/products/cavadinha.png", "/img/products/cavadinha baby.png"],
        stock: 50,
        sizes: ['P', 'M', 'G', 'GG']
    },
    {
        id: 3,
        title: "Short Passeio",
        description: "Short projetado para conforto e lazer.",
        price_in_cents: 2990,
        image: "/img/products/passeio.png",
        category: "Shorts",
        customizable: false,
        gallery: ["/img/products/passeio.png"],
        stock: 50,
        sizes: ['P', 'M', 'G', 'GG']
    },
    {
        id: 4,
        title: "Boné Trucker Exclusive",
        description: "Boné estilo trucker com tela e ajuste snapback. Excelente para brindes e marketing.",
        price_in_cents: 4990,
        image: "/img/products/Boné 3.png",
        category: "Bonés",
        customizable: true,
        gallery: ["/img/products/Boné 3.png"],
        stock: 50,
        sizes: ['U']
    },
    {
        id: 5,
        title: "Jaqueta corta-vento Pro",
        description: "Jaqueta leve e impermeável, perfeita para treinos em condições adversas.",
        price_in_cents: 18990,
        image: "/img/products/kebrada com manga.png",
        category: "Jaquetas",
        customizable: true,
        gallery: ["/img/products/kebrada com manga.png"],
        stock: 20,
        sizes: ['P', 'M', 'G', 'GG', 'XG']
    },
    {
        id: 6,
        title: "Polo Masculina Casual",
        description: "Camisa polo clássica com toque moderno, ideal para uniformes corporativos.",
        price_in_cents: 7990,
        image: "/img/products/malako.png",
        category: "Polos",
        customizable: true,
        gallery: ["/img/products/malako.png", "/img/products/regata chave.png", "/img/products/street.png"],
        stock: 50,
        sizes: ['P', 'M', 'G', 'GG']
    }
];

export async function restoreProducts() {
    console.log("Restaurando produtos originais...");
    const productsRef = collection(db, "products");

    for (const product of ORIGINAL_PRODUCTS) {
        // Check if exists to avoid duplicates (optional, doing primitive check by title)
        const q = query(productsRef, where("title", "==", product.title));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            await addDoc(productsRef, {
                ...product,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log(`Restaurado: ${product.title}`);
        } else {
            console.log(`Já existe: ${product.title}`);
        }
    }

    alert("Produtos originais restaurados com sucesso!");
}

window.runRestore = restoreProducts;
