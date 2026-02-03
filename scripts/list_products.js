
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error listing products:", error);
        return;
    }

    console.log(`Found ${products.length} products:`);
    products.forEach((p, index) => {
        console.log(`${index + 1}. [${p.created_at}] ${p.title} (ID: ${p.id})`);
    });
}

listProducts();
