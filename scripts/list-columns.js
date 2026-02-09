
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hjyihhevftudmkazvzcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listColumns() {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
        console.error('Erro:', error.message);
        return;
    }
    if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log('COLUMNS_START');
        columns.forEach(col => console.log(col));
        console.log('COLUMNS_END');
    } else {
        console.log('Nenhum produto para checar.');
    }
}

listColumns();
