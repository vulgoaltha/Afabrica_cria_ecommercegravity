
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteDummyProducts() {
    console.log("Searching for 'Produto Exemplo'...");

    // First setup - get IDs
    const { data: products, error: searchError } = await supabase
        .from('products')
        .select('id, title')
        .ilike('title', 'Produto Exemplo%');

    if (searchError) {
        console.error("Error searching:", searchError);
        return;
    }

    if (!products || products.length === 0) {
        console.log("No products found causing 'Produto Exemplo'.");
        return;
    }

    console.log(`Found ${products.length} products to delete.`);

    const ids = products.map(p => p.id);

    // Delete
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', ids);

    if (deleteError) {
        console.error("Error deleting:", deleteError);
    } else {
        console.log("Successfully deleted products!");
    }
}

deleteDummyProducts();
