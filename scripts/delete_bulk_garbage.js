
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteGarbage() {
    console.log("Searching for garbage products...");

    // Fetch all products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, created_at');

    if (error) {
        console.error("Error fetching:", error);
        return;
    }

    // Filter for the garbage patterns seen in screenshots
    // "Cria Do Morro XX", "Bones XX", "Personalizados"
    // CAREFUL: "Boné Cria Diversidade" contains "Cria", but not "Cria Do Morro"

    const garbage = products.filter(p =>
        p.title.includes('Cria Do Morro') || // e.g. Cria Do Morro 27
        p.title.includes('Bones') ||         // e.g. Bones 29
        p.title.match(/Produto Exemplo #\d+/) ||
        p.title.includes('Personalizados')
    );

    console.log(`Found ${garbage.length} items to delete.`);

    if (garbage.length === 0) {
        return;
    }

    const ids = garbage.map(p => p.id);

    // Delete chunks
    const chunkSize = 50;
    for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        console.log(`Deleting chunk ${i / chunkSize + 1}...`);

        const { error: delError } = await supabase
            .from('products')
            .delete()
            .in('id', chunk);

        if (delError) console.error("Error deleting chunk:", delError);
    }

    console.log("Cleanup complete.");
}

deleteGarbage();
