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
const modalTitle = document.getElementById('modalTitle');
const btnSaveText = document.getElementById('btnSaveText');
const viewNavigation = document.getElementById('viewNavigation');
const btnBackToFolders = document.getElementById('btnBackToFolders');
const currentFolderLabel = document.getElementById('currentFolderLabel');

let isEditing = false;
let currentProductId = null;
let currentCategory = null; // null = Folders view, slug = Category products view
let allCategories = [];

// Image Inputs setup
const imageInputs = [];
for (let i = 1; i <= 5; i++) {
    imageInputs.push({
        input: document.getElementById(`imageInput${i}`),
        preview: document.getElementById(`previewImage${i}`)
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Setup Image Previews
    imageInputs.forEach(({ input }, index) => {
        // Use custom change logic or update helper
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const i = index + 1;
                    const preview = document.getElementById(`previewImage${i}`);
                    preview.src = e.target.result;

                    // Show everything via our helper
                    toggleImageState(i, true);
                };
                reader.readAsDataURL(file);
            }
        });
    });

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

    loadCategories();

    btnBackToFolders.addEventListener('click', () => {
        const currentLower = currentCategory?.toLowerCase();
        let parentKey = Object.keys(PARENTS).find(key =>
            PARENTS[key].children.map(c => c.toLowerCase()).includes(currentLower)
        );

        if (parentKey) {
            currentCategory = parentKey;
        } else {
            currentCategory = null;
        }
        loadProducts();
    });
});

// Load Categories for Select
async function loadCategories() {
    const categorySelect = document.getElementById('category');
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('title', { ascending: true });

        if (error) throw error;

        allCategories = categories; // Store globally for folder view
        categorySelect.innerHTML = '<option value="" disabled selected>Selecione...</option>';

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.slug; // Using slug as the value to store in products table
            option.textContent = cat.title;
            categorySelect.appendChild(option);
        });

    } catch (e) {
        console.error("Erro ao carregar categorias:", e);
        categorySelect.innerHTML = '<option value="" disabled>Erro ao carregar</option>';
    }
}

// Nesting constants
const PARENTS = {
    'cria-do-morro': { title: 'Cria do Morro', children: ['aba-reta', 'trucker'] },
    'mangueira': { title: 'Mangueira', children: ['mangueira-1', 'mangueira-2'] }
};

// Load Products
async function loadProducts() {
    productsGrid.innerHTML = '<div class="col-span-full text-center py-10">Carregando...</div>';

    // Check if current view is a parent folder
    if (PARENTS[currentCategory]) {
        viewNavigation.classList.remove('hidden');
        currentFolderLabel.textContent = PARENTS[currentCategory].title;
        // Clear loading message before rendering folders to avoid race condition
        productsGrid.innerHTML = '';
        renderCategoryFolders(currentCategory);
        // Removed early return to allow products to load below folders
    } else if (!currentCategory) {
        viewNavigation.classList.add('hidden');
        renderCategoryFolders();
        return;
    }

    // Entering a leaf folder (products)
    viewNavigation.classList.remove('hidden');
    const catObj = allCategories.find(c => c.slug === currentCategory);

    // Find if this is a child of any parent for consistent navigation
    const currentLower = currentCategory.toLowerCase();
    let parentKey = Object.keys(PARENTS).find(key =>
        PARENTS[key].children.map(c => c.toLowerCase()).includes(currentLower)
    );

    if (parentKey) {
        currentFolderLabel.innerHTML = `
            <span class="cursor-pointer hover:text-black" onclick="currentCategory='${parentKey}'; loadProducts();">${PARENTS[parentKey].title}</span>
            <span class="mx-2 text-gray-300">/</span>
            <span>${catObj ? catObj.title : currentCategory}</span>
        `;
    } else {
        currentFolderLabel.textContent = catObj ? catObj.title : currentCategory;
    }

    try {
        let query = supabase.from('products').select('*').eq('category', currentCategory);
        const { data: productsData, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        // Clear loading state only if folders haven't been rendered yet or if it's the only content
        if (productsGrid.innerHTML.includes('Carregando...')) {
            // If it's a parent category, we should only remove the Carregando text if present, 
            // but the current structure has it as a div. 
            // Since we cleared it before renderCategoryFolders, this check is mostly for leaf folders.
            if (!PARENTS[currentCategory]) productsGrid.innerHTML = '';
            else {
                // If it's a parent, just remove the loading div if it somehow persisted
                const loadingDiv = productsGrid.querySelector('.text-center.py-10');
                if (loadingDiv && loadingDiv.textContent.includes('Carregando')) {
                    loadingDiv.remove();
                }
            }
        }

        if (productsData.length === 0 && !PARENTS[currentCategory]) {
            if (currentCategory) {
                productsGrid.innerHTML += '<div class="col-span-full text-center py-10 text-gray-400">Nenhum produto nesta categoria.</div>';
            }
        }

        productsData.forEach(product => {
            renderProductCard(product.id, product);
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        showToast('Erro ao carregar produtos', 'error');
    }
}

function renderCategoryFolders(parent = null) {
    if (!parent) productsGrid.innerHTML = '';

    if (allCategories.length === 0) {
        setTimeout(() => renderCategoryFolders(parent), 500);
        return;
    }

    let foldersToShow = [];
    // Normalize children and parent slugs for robust matching
    const allChildren = Object.values(PARENTS).flatMap(p => p.children.map(c => c.toLowerCase()));
    const allParents = Object.keys(PARENTS).map(k => k.toLowerCase());

    if (PARENTS[parent]) {
        // Show only sub-categories of this parent
        const childrenSlugs = PARENTS[parent].children.map(c => c.toLowerCase());
        foldersToShow = allCategories.filter(cat => childrenSlugs.includes(cat.slug.toLowerCase()));
    } else {
        // Root view: Filter out ALL children AND parent category slugs (they are virtualized)
        foldersToShow = allCategories.filter(cat =>
            !allChildren.includes(cat.slug.toLowerCase()) &&
            !allParents.includes(cat.slug.toLowerCase())
        );

        // Add virtual parent folders at the beginning
        Object.keys(PARENTS).reverse().forEach(slug => {
            // Check if we should actually show this parent (if any of its children exist)
            const childrenSlugs = PARENTS[slug].children.map(c => c.toLowerCase());
            const hasChildren = allCategories.some(cat => childrenSlugs.includes(cat.slug.toLowerCase()));

            if (hasChildren || slug === 'cria-do-morro' || slug === 'mangueira') {
                foldersToShow.unshift({ title: PARENTS[slug].title, slug: slug, isParent: true });
            }
        });
    }

    foldersToShow.forEach(cat => {
        const folder = document.createElement('div');
        folder.className = 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 flex flex-col items-center justify-center cursor-pointer group hover:bg-yellow-50 hover:border-yellow-200';
        folder.onclick = () => {
            currentCategory = cat.slug;
            loadProducts();
        };

        folder.innerHTML = `
            <div class="text-5xl mb-4 group-hover:scale-110 transition-transform">${cat.isParent ? '📁' : '📂'}</div>
            <h3 class="font-bold text-gray-800 text-center">${cat.title}</h3>
            <p class="text-xs text-gray-400 mt-2 uppercase tracking-wider">Clique para abrir</p>
        `;

        productsGrid.appendChild(folder);
    });
}

// Render Card
function renderProductCard(id, product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group';

    // Determina se tem desconto usando a nova lógica (preco_antigo > preco_atual)
    // Se preco_antigo existe E é maior que preco_atual, é promoção.
    let isPromo = false;
    let currentPrice = product.preco_atual || (product.price_in_cents ? product.price_in_cents / 100 : 0);
    let oldPrice = product.preco_antigo;

    // Fallback logic for legacy data if needed, but sticking to new fields primarily:
    if (oldPrice && oldPrice > currentPrice) {
        isPromo = true;
    }

    card.innerHTML = `
        <div class="relative aspect-square bg-gray-100 overflow-hidden">
            <img src="${product.image || 'https://via.placeholder.com/300'}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            
            <!-- Checkbox Overlay -->
            <div class="absolute top-3 left-3 z-20">
                <input type="checkbox" value="${product.id}" class="product-checkbox w-5 h-5 rounded border-gray-300 text-black focus:ring-black shadow-lg cursor-pointer" onclick="event.stopPropagation(); toggleSelection('${product.id}')">
            </div>

            <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button onclick="editProduct('${id}')" class="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-blue-600 transition-colors" title="Editar">
                    ✏️
                </button>
                <button onclick="deleteProduct('${id}')" class="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-red-600 transition-colors" title="Excluir">
                    🗑️
                </button>
            </div>
            ${isPromo ? '<span class="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">PROMOÇÃO</span>' : ''}
        </div>
        <div class="p-4">
            <p class="text-xs text-gray-500 uppercase font-semibold mb-1">${product.category || 'Geral'}</p>
            <h3 class="font-bold text-gray-900 line-clamp-1 text-lg">${product.title}</h3>
            <div class="flex items-center justify-between mt-3">
                <div class="flex flex-col">
                    ${isPromo ? `<span class="text-xs text-gray-400 line-through">${formatCurrency(oldPrice)}</span>` : ''}
                    <p class="font-black text-xl text-gray-900">
                        ${formatCurrency(currentPrice)}
                    </p>
                    <p class="text-xs text-teal-600 font-medium mt-0.5">
                        6x de ${formatCurrency(currentPrice / 6)} sem juros
                    </p>
                </div>
                <span class="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                    Estoque: ${product.stock || '∞'}
                </span>
            </div>
        </div>
    `;

    productsGrid.appendChild(card);
}

// Bulk Selection Logic
let selectedProducts = new Set();
const selectAllCheckbox = document.getElementById('selectAll');
const bulkActions = document.getElementById('bulkActions');
const selectedCountLabel = document.getElementById('selectedCount');
const btnBulkDelete = document.getElementById('btnBulkDelete');

// Toggle Single Selection
window.toggleSelection = (id) => {
    if (selectedProducts.has(id)) {
        selectedProducts.delete(id);
    } else {
        selectedProducts.add(id);
    }
    updateBulkUI();
};

// Select All Logic
selectAllCheckbox.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const isChecked = e.target.checked;

    checkboxes.forEach(cb => {
        cb.checked = isChecked;
        if (isChecked) {
            selectedProducts.add(cb.value);
        } else {
            selectedProducts.delete(cb.value);
        }
    });
    updateBulkUI();
});

// Update UI
function updateBulkUI() {
    const count = selectedProducts.size;
    selectedCountLabel.textContent = `${count} selecionado${count !== 1 ? 's' : ''} `;

    if (count > 0) {
        bulkActions.classList.remove('hidden');
    } else {
        bulkActions.classList.add('hidden');
        selectAllCheckbox.checked = false; // Reset select all if manual deselect clears list
    }
}

// Bulk Delete Action
btnBulkDelete.addEventListener('click', async () => {
    if (!confirm(`Tem certeza que deseja excluir ${selectedProducts.size} produtos ? `)) return;

    try {
        btnBulkDelete.textContent = 'Excluindo...';
        btnBulkDelete.disabled = true;

        const idsToDelete = Array.from(selectedProducts);

        // Chunk deletion just in case
        const { error } = await supabase.from('products').delete().in('id', idsToDelete);

        if (error) throw error;

        showToast(`${idsToDelete.length} produtos excluídos!`);

        // Reset
        selectedProducts.clear();
        updateBulkUI();
        loadProducts(); // Reload grid

    } catch (e) {
        console.error(e);
        showToast('Erro ao excluir em massa', 'error');
    } finally {
        btnBulkDelete.textContent = '🗑️ Excluir Selecionados';
        btnBulkDelete.disabled = false;
    }
});

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

// Helper to toggle image state
function toggleImageState(index, hasImage) {
    const preview = document.getElementById(`previewImage${index}`);
    const btnRemove = document.getElementById(`btnRemoveImage${index}`);

    if (hasImage) {
        preview.classList.remove('hidden');
        btnRemove.classList.remove('hidden');
    } else {
        preview.src = '';
        preview.classList.add('hidden');
        btnRemove.classList.add('hidden');
        document.getElementById(`imageInput${index}`).value = ''; // Reset file input
    }
}

// Remove Image Function
window.removeImage = (index) => {
    toggleImageState(index, false);

    // Slight shift: If removing a middle image, we keep it empty. 
    // Trying to shift images up is complex without a full re-render, so empty slot is fine.
    // The save logic already filters out empty/hidden inputs.
};

window.editProduct = async (id) => {
    try {
        const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error) throw error;

        // Set values
        document.getElementById('name').value = product.title;

        // Handle Price Loading
        const currentPrice = product.preco_atual !== null ? product.preco_atual : (product.price_in_cents ? product.price_in_cents / 100 : 0);
        const oldPrice = product.preco_antigo !== null ? product.preco_antigo : (product.sale_price_in_cents ? product.price_in_cents / 100 : '');

        document.getElementById('precoAtual').value = currentPrice;
        document.getElementById('precoAntigo').value = oldPrice || '';

        document.getElementById('category').value = product.category || 'camisetas';
        document.getElementById('subCategory').value = product.sub_category || '';
        document.getElementById('stock').value = product.stock || 0;
        document.getElementById('description').value = product.description || '';


        // Sizes
        document.querySelectorAll('.size-check').forEach(cb => {
            cb.checked = product.sizes ? product.sizes.includes(cb.value) : false;
        });

        // Images
        const gallery = product.gallery || (product.image ? [product.image] : []);

        // Reset all previews first
        for (let i = 1; i <= 5; i++) {
            toggleImageState(i, false);
        }

        // Fill available slots
        gallery.forEach((url, index) => {
            if (index < 5) {
                const i = index + 1; // 1-based index
                const preview = document.getElementById(`previewImage${i}`);
                preview.src = url;
                toggleImageState(i, true);
            }
        });

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

    // Clear all images
    for (let i = 1; i <= 5; i++) {
        toggleImageState(i, false);
    }

    modalTitle.textContent = 'Novo Produto';
    btnSaveText.textContent = 'Salvar Produto';

    // Reset sizes to default check (M, G, GG)
    document.querySelectorAll('.size-check').forEach(cb => {
        cb.checked = ['M', 'G', 'GG'].includes(cb.value);
    });

    // Enhancement: Pre-select category if in a folder
    if (currentCategory) {
        document.getElementById('category').value = currentCategory;
    }

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
    const precoAtual = parseFloat(document.getElementById('precoAtual').value);
    // PrecoAntigo can be null/empty
    const precoAntigoVal = document.getElementById('precoAntigo').value;
    const precoAntigo = precoAntigoVal ? parseFloat(precoAntigoVal) : null;

    const category = document.getElementById('category').value;
    const subCategory = document.getElementById('subCategory').value;
    const stock = parseInt(document.getElementById('stock').value) || 0;
    const description = document.getElementById('description').value;


    const selectedSizes = Array.from(document.querySelectorAll('.size-check:checked')).map(cb => cb.value);

    // Validation: Require at least one image (the first one)
    const hasMainImage = imageInputs[0].preview.src && !imageInputs[0].preview.classList.contains('hidden');
    // If not editing (new product), we MUST have a file selected if preview is empty
    const hasInputFile = imageInputs[0].input.files.length > 0;

    if (!hasMainImage && !hasInputFile) {
        showToast('Selecione pelo menos a imagem principal', 'error');
        return;
    }

    btnSaveText.textContent = 'Salvando...';

    try {
        // Process all images
        const galleryUrls = [];

        for (let i = 0; i < 5; i++) {
            const { input, preview } = imageInputs[i];
            const file = input.files[0];
            let url = preview.src; // Keep existing if not changed

            // If empty (and hidden), skip
            if (preview.classList.contains('hidden') && !file) continue;

            if (file) {
                // Upload new file
                url = await uploadToSupabase(file);
            }

            // Only add valid URLs
            if (url && url.startsWith('http')) {
                galleryUrls.push(url);
            }
        }

        const mainImage = galleryUrls.length > 0 ? galleryUrls[0] : null;

        const productData = {
            title: name,
            // Keeping legacy fields in sync for safety
            price_in_cents: Math.round(precoAtual * 100),
            sale_price_in_cents: null,
            preco_atual: precoAtual,
            preco_antigo: precoAntigo,
            image: mainImage,
            gallery: galleryUrls,
            category: category,
            sub_category: subCategory,
            description: description,
            stock: stock,
            sizes: selectedSizes,
            customizable: false,
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
