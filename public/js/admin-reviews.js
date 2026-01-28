import { supabase } from '../js/supabase.js';
import { protegerAdmin } from '../js/auth.js';
import { formatDate, showToast } from '../js/admin-utils.js';

// Verify Auth
protegerAdmin();

// DOM Elements
const reviewsGrid = document.getElementById('reviewsGrid');
const loading = document.getElementById('loading');
const pendingCountBadge = document.getElementById('pendingCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const imageModal = document.getElementById('imageModal');
const fullImage = document.getElementById('fullImage');

// State
let allReviews = [];
let currentFilter = 'pending'; // 'pending' or 'approved'

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchReviews(); // Initial fetch
    initRealtimeListener();
    setupFilters();
});

// Fetch Reviews
async function fetchReviews() {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao ler avaliações:", error);
        showToast('Erro ao carregar avaliações', 'error');
        loading.style.display = 'none';
        return;
    }

    allReviews = data || [];
    updateUI();
    loading.style.display = 'none';
}

function updateUI() {
    let pendingCount = allReviews.filter(r => !r.approved).length;

    // Update Badge
    pendingCountBadge.textContent = `${pendingCount} Pendent${pendingCount !== 1 ? 'es' : 'e'}`;
    if (pendingCount > 0) {
        pendingCountBadge.classList.remove('bg-gray-100', 'text-gray-500');
        pendingCountBadge.classList.add('bg-yellow-100', 'text-yellow-800');
    } else {
        pendingCountBadge.classList.add('bg-gray-100', 'text-gray-500');
        pendingCountBadge.classList.remove('bg-yellow-100', 'text-yellow-800');
    }

    renderReviews();
}

// Real-time Listener
function initRealtimeListener() {
    supabase.channel('custom-reviews-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'reviews' },
            (payload) => {
                console.log('Change received!', payload);
                fetchReviews();
            }
        )
        .subscribe();
}

// Render Logic
function renderReviews() {
    const isPendingView = currentFilter === 'pending';
    const filteredReviews = allReviews.filter(r => isPendingView ? !r.approved : r.approved);

    reviewsGrid.innerHTML = '';

    if (filteredReviews.length === 0) {
        reviewsGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <span class="text-4xl mb-4">👍</span>
                <p class="text-lg font-medium">Nenhuma avaliação ${isPendingView ? 'pendente' : 'aprovada'}</p>
            </div>
        `;
        return;
    }

    filteredReviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 transition-all hover:shadow-md';

        // Stars
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white font-bold">
                        ${review.user_name ? review.user_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 leading-tight">${review.user_name || 'Anônimo'}</h3>
                        <p class="text-xs text-gray-500">${formatDate(review.created_at)}</p>
                    </div>
                </div>
                <div class="text-yellow-400 text-lg tracking-widest">${stars}</div>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic border-l-4 border-gray-200">
                "${review.comment}"
            </div>

            ${review.image_url ? `
                <div class="relative h-32 rounded-lg overflow-hidden cursor-zoom-in group" onclick="window.viewImage('${review.image_url}')">
                    <img src="${review.image_url}" class="w-full h-full object-cover transition-transform group-hover:scale-105">
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        🔍 Ampliar
                    </div>
                </div>
            ` : ''}
            
            <div class="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                ${isPendingView ? `
                    <button onclick="window.rejectReview('${review.id}')" class="flex-1 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors">
                        Rejeitar
                    </button>
                    <button onclick="window.approveReview('${review.id}')" class="flex-1 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 font-medium shadow-lg transition-colors">
                        Aprovar
                    </button>
                ` : `
                    <button onclick="window.rejectReview('${review.id}')" class="w-full px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors">
                        Excluir
                    </button>
                `}
            </div>
        `;

        reviewsGrid.appendChild(card);
    });
}

// Filter Logic
function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-white', 'shadow-sm', 'text-black', 'font-bold');
                b.classList.add('text-gray-500');
            });
            btn.classList.add('bg-white', 'shadow-sm', 'text-black', 'font-bold');
            btn.classList.remove('text-gray-500');

            currentFilter = btn.dataset.status;
            renderReviews();
        });
    });
}

// Actions
window.approveReview = async (id) => {
    try {
        const { error } = await supabase
            .from('reviews')
            .update({ approved: true })
            .eq('id', id);

        if (error) throw error;
        showToast('Avaliação aprovada!', 'success');
        // Realtime will update UI
    } catch (e) {
        console.error(e);
        showToast('Erro ao aprovar', 'error');
    }
};

window.rejectReview = async (id) => {
    if (!confirm('Tem certeza que deseja remover esta avaliação?')) return;

    try {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) throw error;
        showToast('Avaliação removida', 'success');
    } catch (e) {
        console.error(e);
        showToast('Erro ao remover', 'error');
    }
};

window.viewImage = (url) => {
    fullImage.src = url;
    imageModal.classList.remove('hidden');
};
