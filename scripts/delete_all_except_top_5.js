
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeOldProducts() {
    console.log("Fetching all products...");

    // Get ALL products ordered by newest first
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, title, created_at')
        .order('created_at', { ascending: false });

    if (fetchError) {
        console.error("Error fetching:", fetchError);
        return;
    }

    if (products.length <= 5) {
        console.log(`Only found ${products.length} products. Nothing to delete.`);
        return;
    }

    // Keep the top 5
    const productsToKeep = products.slice(0, 5);
    const productsToDelete = products.slice(5);

    console.log("--- KEEPING THESE 5 ---");
    productsToKeep.forEach(p => console.log(`[${p.created_at}] ${p.title}`));

    console.log(`\n--- DELETING ${productsToDelete.length} OTHERS ---`);

    const idsToDelete = productsToDelete.map(p => p.id);

    // Delete in chunks if necessary (Supabase handles large IN queries generally well, but 100+ acts safe)
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', idsToDelete);

    if (deleteError) {
        console.error("Error deleting:", deleteError);
    } else {
        console.log("Successfully deleted old products!");
    }
}

purgeOldProducts();
