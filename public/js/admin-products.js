import { supabase } from '../js/supabase.js';
import { protegerAdmin } from '../js/auth.js';
import { formatCurrency, showToast, handleImagePreview } from '../js/admin-utils.js';

// Verify Auth
protegerAdmin();

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const btnNewProduct = document.getElementById('btnNewProduct');
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const modalTitle = document.getElementById('modalTitle');
const btnSaveText = document.getElementById('btnSaveText');

let isEditing = false;
let currentProductId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    handleImagePreview(imageInput, previewImage);

    // Setup Sizes Checkboxes
    const sizes = ['P', 'M', 'G', 'GG', 'XG', 'XXG', 'ESP', 'ESP1', 'ESP2'];
    const container = document.getElementById('sizesContainer');
    if (container) {
        container.innerHTML = sizes.map(size => `
            <label class="flex items-center gap-2 cursor-pointer bg-white px-3 py-1 rounded border border-gray-200 hover:border-gray-400 transition-colors">
                <input type="checkbox" value="${size}" class="size-check rounded text-black focus:ring-black"> 
                <span class="text-sm font-medium">${size}</span>
            </label>
        `).join('');
    }
});

// Load Products
async function loadProducts() {
    productsGrid.innerHTML = '<div class="col-span-full text-center py-10">Carregando...</div>';

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        productsGrid.innerHTML = '';

        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                    <p class="text-xl font-bold mb-2">Nenhum produto encontrado</p>
                    <p class="text-sm">Clique em "+ Novo Produto" para começar</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            renderProductCard(product.id, product);
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        showToast('Erro ao carregar produtos', 'error');
    }
}

// Render Card
function renderProductCard(id, product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group';

    card.innerHTML = `
        <div class="relative aspect-square bg-gray-100 overflow-hidden">
            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="editProduct('${id}')" class="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-blue-600 transition-colors" title="Editar">
                    ✏️
                </button>
                <button onclick="deleteProduct('${id}')" class="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-red-600 transition-colors" title="Excluir">
                    🗑️
                </button>
            </div>
            ${product.sale_price_in_cents ? '<span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">PROMOÇÃO</span>' : ''}
        </div>
        <div class="p-4">
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">${product.category || 'Geral'}</p>
            <h3 class="font-bold text-gray-900 line-clamp-1 text-lg">${product.title}</h3>
            <div class="flex items-center justify-between mt-3">
                <p class="font-black text-xl text-gray-900">
                    ${formatCurrency(product.price_in_cents)}
                </p>
                <span class="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                    Estoque: ${product.stock || '∞'}
                </span>
            </div>
        </div>
    `;

    productsGrid.appendChild(card);
}

// Global Functions
window.deleteProduct = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;

            showToast('Produto excluído com sucesso');
            loadProducts();
        } catch (e) {
            console.error(e);
            showToast('Erro ao excluir', 'error');
        }
    }
}

window.editProduct = async (id) => {
    try {
        const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;

        // Set values
        document.getElementById('name').value = product.title;
        document.getElementById('price').value = product.price_in_cents / 100;
        document.getElementById('salePrice').value = product.sale_price_in_cents ? product.sale_price_in_cents / 100 : '';
        document.getElementById('category').value = product.category || 'camisetas';
        document.getElementById('stock').value = product.stock || 0;
        document.getElementById('description').value = product.description || '';
        document.getElementById('isCustomizable').checked = product.customizable || false;

        // Sizes
        document.querySelectorAll('.size-check').forEach(cb => {
            cb.checked = product.sizes ? product.sizes.includes(cb.value) : false;
        });

        // Image
        previewImage.src = product.image;
        previewImage.classList.remove('hidden');

        isEditing = true;
        currentProductId = id;
        modalTitle.textContent = 'Editar Produto';
        btnSaveText.textContent = 'Atualizar';

        productModal.classList.remove('hidden');
    } catch (e) {
        console.error(e);
        showToast('Erro ao carregar detalhes', 'error');
    }
}

// Open Modal logic
btnNewProduct.addEventListener('click', () => {
    isEditing = false;
    currentProductId = null;
    productForm.reset();
    previewImage.src = '';
    previewImage.classList.add('hidden');
    modalTitle.textContent = 'Novo Produto';
    btnSaveText.textContent = 'Salvar Produto';

    // Reset sizes to default check (M, G, GG)
    document.querySelectorAll('.size-check').forEach(cb => {
        cb.checked = ['M', 'G', 'GG'].includes(cb.value);
    });

    productModal.classList.remove('hidden');
});

// Helper for Image Upload
async function uploadToSupabase(file) {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;

    // Upload
    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

    if (error) throw error;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

    return publicUrl;
}

// Handle Form Submit
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const salePrice = parseFloat(document.getElementById('salePrice').value);
    const category = document.getElementById('category').value;
    const stock = parseInt(document.getElementById('stock').value) || 0;
    const description = document.getElementById('description').value;
    const isCustomizable = document.getElementById('isCustomizable').checked;

    const selectedSizes = Array.from(document.querySelectorAll('.size-check:checked')).map(cb => cb.value);
    const file = imageInput.files[0];

    if (!isEditing && !file) {
        showToast('Selecione uma imagem principal', 'error');
        return;
    }

    btnSaveText.textContent = 'Salvando...';

    try {
        let imageUrl = previewImage.src;

        if (file) {
            imageUrl = await uploadToSupabase(file);
        }

        const productData = {
            title: name,
            price_in_cents: Math.round(price * 100),
            sale_price_in_cents: salePrice ? Math.round(salePrice * 100) : null,
            image: imageUrl,
            category: category,
            description: description,
            stock: stock,
            sizes: selectedSizes,
            customizable: isCustomizable,
            updated_at: new Date().toISOString()
        };

        if (isEditing) {
            const { error } = await supabase.from('products').update(productData).eq('id', currentProductId);
            if (error) throw error;
            showToast('Produto atualizado!');
        } else {
            productData.created_at = new Date().toISOString();
            const { error } = await supabase.from('products').insert([productData]);
            if (error) throw error;
            showToast('Produto criado!');
        }

        productModal.classList.add('hidden');
        loadProducts();

    } catch (error) {
        console.error(error);
        showToast('Erro ao salvar produto: ' + error.message, 'error');
    } finally {
        btnSaveText.textContent = 'Salvar Produto';
    }
});
