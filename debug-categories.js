import { createClient } from '@supabase/supabase-base';
import fs from 'fs';
import path from 'path';

// Parse the supabase config from a potential env file or try to find it in the js files
// Actually, I'll just use a small node script to query the DB if I had the keys.
// I can read public/js/supabase.js to get the keys.

const supabaseJsPath = 'c:/Users/altam/OneDrive/Área de Trabalho/Afabrica_cria_ecommercegravity/public/js/supabase.js';
const content = fs.readFileSync(supabaseJsPath, 'utf8');
const urlMatch = content.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = content.match(/supabaseKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
    console.log(`URL: ${urlMatch[1]}`);
    console.log(`Key: ${keyMatch[1].substring(0, 10)}...`);

    // I don't have supabase package in the runner environment usually, but I can try to use fetch
    async function debug() {
        try {
            const resp = await fetch(`${urlMatch[1]}/rest/v1/categories?select=id,title,slug`, {
                headers: {
                    'apikey': keyMatch[1],
                    'Authorization': `Bearer ${keyMatch[1]}`
                }
            });
            const categories = await resp.json();
            console.log('Categories in DB:');
            console.table(categories);
        } catch (e) {
            console.error('Error:', e);
        }
    }
    debug();
} else {
    console.log('Could not find Supabase credentials');
}
