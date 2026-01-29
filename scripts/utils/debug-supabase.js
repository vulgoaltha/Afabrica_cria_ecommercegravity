import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    console.log("Checking products in Supabase...");
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log(`Found ${data.length} products.`);
    if (data.length > 0) {
        console.log("First product sample:", JSON.stringify(data[0], null, 2));
    } else {
        console.log("No products found in the database.");
    }
}

checkProducts();
