
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

const ORIGINAL_PRODUCTS = [
    { title: "Camiseta", description: "Camiseta de alta qualidade com personalização.", price_in_cents: 8990, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", category: "Camisetas", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG', 'XG'] },
    { title: "Calção Esportivo", description: "Calção leve e resistente.", price_in_cents: 5990, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80", category: "Calções", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Short Passeio", description: "Conforto e lazer.", price_in_cents: 2990, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", category: "Shorts", customizable: false, stock: 50, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Boné Trucker", description: "Boné estilo trucker.", price_in_cents: 4990, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80", category: "Bonés", customizable: true, stock: 50, sizes: ['U'] },
    { title: "Jaqueta Corta-Vento", description: "Leve e impermeável.", price_in_cents: 18990, image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80", category: "Jaquetas", customizable: true, stock: 20, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Polo Casual", description: "Clássica e moderna.", price_in_cents: 7990, image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800&q=80", category: "Polos", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG'] }
];

async function seed() {
    console.log("Iniciando Seed no Supabase...");

    // 1. Restore Original
    console.log("Restaurando originais...");
    const { error: err1 } = await supabase.from('products').insert(ORIGINAL_PRODUCTS);
    if (err1) console.error("Erro ao inserir originais:", err1);
    else console.log("Originais inseridos!");

    // 2. Create 80 Additional
    console.log("Criando 80 produtos adicionais...");
    const newProducts = [];
    for (let i = 1; i <= 80; i++) {
        newProducts.push({
            title: `Item Coleção #${i}`,
            description: "Produto exclusivo A Fábrica Cria.",
            price_in_cents: Math.floor(Math.random() * 20000) + 5000,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
            category: "Geral",
            sizes: ['P', 'M', 'G'],
            stock: 100,
            customizable: Math.random() > 0.8
        });
    }

    // Insert in chunks of 20 to avoid payload limits
    for (let i = 0; i < newProducts.length; i += 20) {
        const chunk = newProducts.slice(i, i + 20);
        const { error } = await supabase.from('products').insert(chunk);
        if (error) console.error(`Erro no chunk ${i}:`, error);
        else console.log(`Inseridos ${i + 20}/80...`);
    }

    console.log("SEED COMPLETO!");
}

seed();
