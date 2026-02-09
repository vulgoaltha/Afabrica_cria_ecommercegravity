
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

const exampleProducts = Array.from({ length: 10 }, (_, i) => ({
    title: `MANGUEIRA - Camisa Premium ${i + 1}`,
    description: `Produto oficial Mangueira. Conforto e estilo para o seu dia a dia. Coleção exclusiva Estação Primeira.`,
    preco_atual: 119.90,
    preco_antigo: 149.90,
    price_in_cents: 11990,
    image: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop`,
    gallery: [
        `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop`
    ],
    category: 'mangueira',
    stock: 50,
    sizes: ['P', 'M', 'G', 'GG'],
    customizable: false,
    // removed 'purchasable' as it doesn't exist in schema
    created_at: new Date().toISOString()
}));

async function seed() {
    console.log('Iniciando seeding...');

    // Explicitly check for mangueira category
    const { data: cats } = await supabase.from('categories').select('slug');
    const hasMangueira = cats.some(c => c.slug === 'mangueira');

    if (!hasMangueira) {
        console.log('Criando categoria Mangueira...');
        const { error: catErr } = await supabase.from('categories').insert([{ title: 'Mangueira', slug: 'mangueira' }]);
        if (catErr) console.error('Erro ao criar categoria:', catErr.message);
    }

    console.log('Limpando produtos anteriores de exemplo (mangueira)...');
    await supabase.from('products').delete().eq('category', 'mangueira');

    console.log('Inserindo 10 produtos...');
    const { data, error } = await supabase.from('products').insert(exampleProducts);

    if (error) {
        console.error('ERRO AO INSERIR:', error.message);
    } else {
        console.log('SUCESSO! 10 produtos criados.');
    }
}

seed();
