
// Configurações
const SUPABASE_URL = 'https://hjyihhevftudmkazvzcx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeWloaGV2ZnR1ZG1rYXp2emN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjUyNDEsImV4cCI6MjA4NTE0MTI0MX0.j8cLKIFIOV55preioKYVdwv1kajlnm9wEtjudIgSvgA';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentEditId = null;
let selectedSizes = new Set();
let allProducts = [];

// ==========================================
// AUTH & INIT
// ==========================================
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && window.PAGE_ID !== 'login') {
        window.location.href = 'login.html';
        return null;
    }
    if (session && window.PAGE_ID === 'login') {
        window.location.href = 'index.html';
    }
    return session;
}

if (window.PAGE_ID === 'login') {
    checkAuth();
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage');

        errorMsg.classList.remove('hidden');
        errorMsg.textContent = 'Autenticando...';

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            errorMsg.textContent = error.message;
            errorMsg.classList.add('text-red-500');
        } else {
            window.location.href = 'index.html';
        }
    });
}

if (window.PAGE_ID === 'dashboard') {
    initDashboard();
}

async function initDashboard() {
    const session = await checkAuth();
    if (!session) return;

    document.getElementById('userEmail').textContent = session.user.email;
    setupTabAuth();
    setupProductListeners();
    loadOrders();
    loadProducts();
}

function setupTabAuth() {
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active', 'text-[#D4AF37]', 'border-b-2', 'border-[#D4AF37]');
                b.classList.add('text-gray-400');
            });
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            btn.classList.remove('text-gray-400');
            btn.classList.add('active', 'text-[#D4AF37]', 'border-b-2', 'border-[#D4AF37]');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
        });
    });
}

function setupProductListeners() {
    document.getElementById('newProductBtn').addEventListener('click', () => openProductForm());
    document.getElementById('cancelProductBtn').addEventListener('click', closeProductForm);
    document.getElementById('saveDraftBtn').addEventListener('click', () => saveProduct('draft'));
    document.getElementById('publishBtn').addEventListener('click', () => saveProduct('published'));
    document.getElementById('prodImage').addEventListener('change', handleImageSelect);
    document.getElementById('previewBtn').addEventListener('click', showPreview);
    document.getElementById('closePreviewBtn').addEventListener('click', () => {
        document.getElementById('previewModal').classList.add('hidden');
        document.getElementById('previewModal').classList.remove('flex');
    });

    document.querySelectorAll('.size-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            if (e.target.checked) selectedSizes.add(e.target.value);
            else selectedSizes.delete(e.target.value);
        });
    });

    ['prodPrice', 'prodOldPrice'].forEach(id => {
        document.getElementById(id).addEventListener('input', calculateDiscount);
    });
}

// --- Image Handling ---
async function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('imagePreviewContainer').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
    return publicUrl;
}

// --- Form Logic ---
function openProductForm(product = null) {
    const formContainer = document.getElementById('productFormContainer');
    const listContainer = document.getElementById('productsListContainer');
    formContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');

    document.getElementById('productForm').reset();
    document.getElementById('imagePreviewContainer').classList.add('hidden');
    selectedSizes.clear();
    document.querySelectorAll('.size-checkbox').forEach(cb => cb.checked = false);
    currentEditId = null;

    if (product) {
        currentEditId = product.id;
        document.getElementById('formTitle').textContent = 'Editar Produto';

        document.getElementById('prodTitle').value = product.title || '';
        document.getElementById('prodPrice').value = (product.preco_atual || 0).toFixed(2);
        document.getElementById('prodOldPrice').value = product.preco_antigo ? product.preco_antigo.toFixed(2) : '';
        document.getElementById('prodDiscount').value = product.discount_percent || 0;
        document.getElementById('prodDesc').value = product.description || '';
        document.getElementById('prodCategory').value = product.category || 'camisetas';
        document.getElementById('prodCustom').checked = product.is_custom || false;

        // New Fields
        document.getElementById('seoTitle').value = product.seo_title || '';
        document.getElementById('seoDesc').value = product.seo_description || '';
        document.getElementById('isFeatured').checked = product.is_featured || false;
        document.getElementById('featuredOrder').value = product.featured_order || 0;

        if (product.image) {
            document.getElementById('imagePreview').src = product.image;
            document.getElementById('imagePreviewContainer').classList.remove('hidden');
        }

        if (product.sizes && Array.isArray(product.sizes)) {
            product.sizes.forEach(size => {
                selectedSizes.add(size);
                const cb = document.querySelector(`.size-checkbox[value="${size}"]`);
                if (cb) cb.checked = true;
            });
        }

        document.getElementById('deleteProductBtn').classList.remove('hidden');
        document.getElementById('deleteProductBtn').onclick = () => deleteProduct(product.id);
    } else {
        document.getElementById('formTitle').textContent = 'Novo Produto';
        document.getElementById('deleteProductBtn').classList.add('hidden');
    }
}

function closeProductForm() {
    document.getElementById('productFormContainer').classList.add('hidden');
    document.getElementById('productsListContainer').classList.remove('hidden');
}

function calculateDiscount() {
    const current = parseFloat(document.getElementById('prodPrice').value) || 0;
    const old = parseFloat(document.getElementById('prodOldPrice').value) || 0;
    if (old > current && current > 0) {
        const discount = Math.round(((old - current) / old) * 100);
        document.getElementById('prodDiscount').value = discount;
    } else {
        document.getElementById('prodDiscount').value = 0;
    }
}

// --- PREVIEW LOGIC ---
function showPreview() {
    const title = document.getElementById('prodTitle').value || 'Título do Produto';
    const price = parseFloat(document.getElementById('prodPrice').value) || 0;
    const oldPrice = parseFloat(document.getElementById('prodOldPrice').value) || null;
    const desc = document.getElementById('prodDesc').value || 'Descrição do produto...';
    const imgSrc = document.getElementById('imagePreviewContainer').classList.contains('hidden')
        ? 'https://placehold.co/400x500?text=Preview'
        : document.getElementById('imagePreview').src;

    const discount = document.getElementById('prodDiscount').value;

    // Inject into Modal
    const modalContent = document.getElementById('previewContent');
    modalContent.innerHTML = `
        <div class="bg-black text-white p-4 max-w-sm mx-auto rounded-xl border border-gray-800">
            <div class="relative aspect-[4/5] overflow-hidden rounded-lg mb-4">
                <img src="${imgSrc}" class="w-full h-full object-cover">
                ${discount > 0 ? `<div class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">${discount}% OFF</div>` : ''}
            </div>
            <h3 class="font-bold text-lg uppercase mb-1">${title}</h3>
            <p class="text-xs text-gray-400 mb-3 line-clamp-2">${desc}</p>
            <div class="flex items-end gap-2">
                <span class="text-[#D4AF37] font-bold text-xl">R$ ${price.toFixed(2)}</span>
                ${oldPrice ? `<span class="text-gray-500 line-through text-sm mb-1">R$ ${oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="w-full mt-4 bg-[#D4AF37] text-black font-bold py-2 rounded">ADICIONAR</button>
        </div>
    `;

    document.getElementById('previewModal').classList.remove('hidden');
    document.getElementById('previewModal').classList.add('flex');
}

// --- SAVE ---
async function saveProduct(status) {
    const saveBtn = status === 'published' ? document.getElementById('publishBtn') : document.getElementById('saveDraftBtn');
    saveBtn.textContent = '...';
    saveBtn.disabled = true;

    try {
        const imageFile = document.getElementById('prodImage').files[0];
        let imageUrl = null;

        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        } else if (currentEditId) {
            const existing = window.allProducts.find(p => p.id === currentEditId);
            imageUrl = existing.image;
        }

        const priceCurrent = parseFloat(document.getElementById('prodPrice').value);
        const priceOld = parseFloat(document.getElementById('prodOldPrice').value) || null;

        // Auto-Promotion Logic
        const isPromotion = priceOld > priceCurrent;

        const productData = {
            title: document.getElementById('prodTitle').value,
            preco_atual: priceCurrent,
            preco_antigo: priceOld,
            sale_price_in_cents: Math.round(priceCurrent * 100),
            price_in_cents: priceOld ? Math.round(priceOld * 100) : Math.round(priceCurrent * 100),
            discount_percent: parseInt(document.getElementById('prodDiscount').value) || 0,
            description: document.getElementById('prodDesc').value,
            category: document.getElementById('prodCategory').value,
            is_custom: document.getElementById('prodCustom').checked,
            sizes: Array.from(selectedSizes),
            status: status,
            // New Fields
            seo_title: document.getElementById('seoTitle').value,
            seo_description: document.getElementById('seoDesc').value,
            is_featured: document.getElementById('isFeatured').checked,
            featured_order: parseInt(document.getElementById('featuredOrder').value) || 0,
            is_promotion: isPromotion,

            image: imageUrl || (currentEditId ? window.allProducts.find(p => p.id === currentEditId).image : null)
        };

        let savedProduct;
        if (currentEditId) {
            const { data, error } = await supabase.from('products').update(productData).eq('id', currentEditId).select().single();
            if (error) throw error;
            savedProduct = data;
        } else {
            const { data, error } = await supabase.from('products').insert([productData]).select().single();
            if (error) throw error;
            savedProduct = data;
        }

        if (savedProduct) await syncVariants(savedProduct);

        alert(`Produto ${status === 'published' ? 'Publicado' : 'Salvo'} com sucesso!`);
        closeProductForm();
        loadProducts();

    } catch (error) {
        alert('Erro: ' + error.message);
    } finally {
        saveBtn.textContent = status === 'published' ? 'Publicar Produto' : 'Salvar Rascunho';
        saveBtn.disabled = false;
    }
}

async function syncVariants(product) {
    await supabase.from('variants').delete().eq('product_id', product.id);
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['Único'];
    const variants = sizes.map(size => ({
        product_id: product.id, title: size, price_in_cents: product.price_in_cents,
        sale_price_in_cents: product.sale_price_in_cents, stock_quantity: 100, manage_inventory: true
    }));
    await supabase.from('variants').insert(variants);
}

// --- List & Delete ---
async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '<div class="col-span-3 text-center py-8">Carregando...</div>';

    // Ordered by Featured then Date
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('featured_order', { ascending: true }) // Lower number = higher priority if implemented logic matches, usually desc is better for featured score, but let's stick to simple
        .order('created_at', { ascending: false });

    if (error) { grid.innerHTML = `Erro: ${error.message}`; return; }

    window.allProducts = products;

    grid.innerHTML = products.map(p => {
        const isDraft = p.status === 'draft';
        const price = p.preco_atual || (p.sale_price_in_cents / 100);

        return `
        <div class="card relative group border ${isDraft ? 'border-gray-700 opacity-75' : 'border-gray-800'} hover:border-[#D4AF37]">
            <div class="absolute top-2 right-2 flex gap-1 z-10">
                ${isDraft ? '<span class="bg-gray-600 text-white text-xs px-2 py-1 rounded">Rascunho</span>' : '<span class="bg-green-900 text-green-100 text-xs px-2 py-1 rounded">Publicado</span>'}
                ${p.is_featured ? '<span class="bg-yellow-600 text-black text-xs px-2 py-1 rounded font-bold">★</span>' : ''}
            </div>
            
            <div class="aspect-video bg-gray-900 rounded mb-4 overflow-hidden">
                 <img src="${p.image || 'https://placehold.co/400x300?text=No+Image'}" class="w-full h-full object-cover">
            </div>
            
            <h3 class="font-bold text-lg mb-1 truncate">${p.title}</h3>
            <p class="text-[#D4AF37] font-bold mb-4">R$ ${price.toFixed(2)}</p>
            
            <button class="btn btn-primary w-full text-sm" onclick="openProductFormWrapper('${p.id}')">Editar</button>
        </div>
    `}).join('');
}

window.openProductFormWrapper = (id) => openProductForm(window.allProducts.find(x => x.id == id));
window.deleteProduct = async (id) => {
    if (!confirm('Confirmar exclusão?')) return;
    await supabase.from('products').delete().eq('id', id);
    closeProductForm();
    loadProducts();
};

async function loadOrders() {
    const tbody = document.getElementById('ordersList');
    if (!tbody) return;
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    // ... (simplified for brevity, assume populated)
    if (data) tbody.innerHTML = data.map(o => `<tr><td class="p-4">#${o.id.slice(0, 8)}</td><td class="p-4">${o.customer_name}</td><td class="p-4">R$ ${(o.total_in_cents / 100).toFixed(2)}</td><td class="p-4">${o.status}</td><td class="p-4">...</td><td class="p-4">...</td></tr>`).join('');
}
