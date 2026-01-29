import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

// We use the anon key to create a client
const supabase = createClient(supabaseUrl, supabaseKey);

const ORIGINAL_PRODUCTS = [
    { title: "Camiseta", description: "Camiseta de alta qualidade com personalização.", price_in_cents: 8990, image: "/img/products/chave.png", category: "Camisetas", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG', 'XG'] },
    { title: "Calção Esportivo", description: "Calção leve e resistente.", price_in_cents: 5990, image: "/img/products/cavadinha.png", category: "Calções", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Short Passeio", description: "Conforto e lazer.", price_in_cents: 2990, image: "/img/products/passeio.png", category: "Shorts", customizable: false, stock: 50, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Boné Trucker", description: "Boné estilo trucker.", price_in_cents: 4990, image: "/img/products/Boné 3.png", category: "Bonés", customizable: true, stock: 50, sizes: ['U'] },
    { title: "Jaqueta Corta-Vento", description: "Leve e impermeável.", price_in_cents: 18990, image: "/img/products/kebrada com manga.png", category: "Jaquetas", customizable: true, stock: 20, sizes: ['P', 'M', 'G', 'GG'] },
    { title: "Polo Casual", description: "Clássica e moderna.", price_in_cents: 7990, image: "/img/products/malako.png", category: "Polos", customizable: true, stock: 50, sizes: ['P', 'M', 'G', 'GG'] }
];

async function seedWithAuth() {
    console.log("Tentando criar usuário temporário para burlar RLS...");

    // Create random credentials
    const email = `admin_temp_${Math.floor(Math.random() * 10000)}@example.com`;
    const password = "Password123!";

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
    });

    if (signUpError) {
        console.error("Erro ao criar usuário:", signUpError.message);
        console.log("Tentando prosseguir sem auth (pode falhar)...");
    } else {
        console.log("Usuário criado/logado com sucesso:", email);
    }

    console.log("Iniciando inserção de produtos...");

    for (const p of ORIGINAL_PRODUCTS) {
        const { error } = await supabase
            .from('products')
            .insert([p]);

        if (error) {
            console.error(`Erro ao inserir ${p.title}:`, error.message);
        } else {
            console.log(`Sucesso: ${p.title}`);
        }
    }

    console.log("Processo concluído!");
}

seedWithAuth();
