import { supabase } from './supabase.js';
import { protegerAdmin } from './auth.js';
import { showToast } from './admin-utils.js';

// Verify Auth
protegerAdmin();

// DOM Elements
const categoryForm = document.getElementById('categoryForm');
const categoriesList = document.getElementById('categoriesList');
const catTitle = document.getElementById('catTitle');
const catSlug = document.getElementById('catSlug');
const btnSave = document.getElementById('btnSave');
const loading = document.getElementById('loading');

// Auto-generate slug
catTitle.addEventListener('input', (e) => {
    const title = e.target.value;
    const slug = title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/-+/g, '-'); // Remove duplicate dashes
    catSlug.value = slug;
});

// Load Categories
async function loadCategories() {
    loading.classList.remove('hidden');
    categoriesList.innerHTML = '';

    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;

        loading.classList.add('hidden');

        if (categories.length === 0) {
            categoriesList.innerHTML = `
                <li class="p-8 text-center text-gray-400">
                    Nenhuma categoria encontrada.
                </li>
            `;
            return;
        }

        categories.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group';
            li.innerHTML = `
                <div>
                    <p class="font-bold text-gray-800">${cat.title}</p>
                    <p class="text-xs text-gray-400 font-mono">/${cat.slug}</p>
                </div>
                <button onclick="deleteCategory('${cat.id}')" 
                    class="text-gray-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100" title="Excluir">
                    🗑️
                </button>
            `;
            categoriesList.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        showToast('Erro ao carregar categorias', 'error');
        loading.classList.add('hidden');
    }
}

// Add Category
categoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = catTitle.value.trim();
    const slug = catSlug.value.trim();

    if (!title || !slug) return;

    btnSave.innerText = 'Salvando...';
    btnSave.disabled = true;

    try {
        const { error } = await supabase
            .from('categories')
            .insert([{ title, slug }]);

        if (error) throw error;

        showToast('Categoria adicionada!');
        categoryForm.reset();
        loadCategories();

    } catch (error) {
        console.error(error);
        if (error.code === '23505') { // Unique violation
            showToast('Já existe uma categoria com este slug.', 'error');
        } else {
            showToast('Erro ao salvar categoria', 'error');
        }
    } finally {
        btnSave.innerText = 'Adicionar Categoria';
        btnSave.disabled = false;
    }
});

// Delete Category
window.deleteCategory = async (id) => {
    if (!confirm('Tem certeza? Isso pode afetar produtos que usam esta categoria.')) return;

    try {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showToast('Categoria removida.');
        loadCategories();

    } catch (error) {
        console.error(error);
        showToast('Erro ao remover categoria', 'error');
    }
};

// Init
document.addEventListener('DOMContentLoaded', loadCategories);
