
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    console.log('--- Debugging Supabase ---');

    const { data: categories, error: catError } = await supabase.from('categories').select('*');
    if (catError) {
        console.error('Erro ao buscar categorias:', catError.message);
    } else {
        console.log('Categorias encontradas:', categories.map(c => c.slug));
    }

    const { data: products, error: prodError } = await supabase.from('products').select('id').limit(1);
    if (prodError) {
        console.error('Erro ao buscar produtos:', prodError.message);
    } else {
        console.log('Conexão com produtos OK.');
    }
}

debug();
