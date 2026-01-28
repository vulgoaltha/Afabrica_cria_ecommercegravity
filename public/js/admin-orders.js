import { supabase } from '../js/supabase.js';
import { protegerAdmin } from '../js/auth.js';
import { formatCurrency, formatDate, showToast } from '../js/admin-utils.js';

// Verify Auth
protegerAdmin();

// DOM Elements
const ordersTableBody = document.getElementById('ordersTableBody');
const liveIndicator = document.getElementById('liveIndicator');
const loading = document.getElementById('loading');
const filterBtns = document.querySelectorAll('.filter-btn');

// Modal Elements
const orderModal = document.getElementById('orderModal');
const modalOrderId = document.getElementById('modalOrderId');
const modalStatus = document.getElementById('modalStatus');
const updateStatusSelect = document.getElementById('updateStatusSelect');
const modalItems = document.getElementById('modalItems');

const modalCustomerName = document.getElementById('modalCustomerName');
const modalCustomerEmail = document.getElementById('modalCustomerEmail');
const modalCustomerCPF = document.getElementById('modalCustomerCPF');
const modalAddressStreet = document.getElementById('modalAddressStreet');
const modalAddressCity = document.getElementById('modalAddressCity');
const modalAddressZip = document.getElementById('modalAddressZip');
const modalTotal = document.getElementById('modalTotal');

// State
let allOrders = [];
let currentFilter = 'all';
let currentOrderId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchOrders(); // Initial fetch
    initRealtimeListener();
    setupFilters();
    setupStatusUpdate();
});

// Initial Fetch
async function fetchOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao carregar pedidos:", error);
        return;
    }

    allOrders = data || [];
    renderOrders();
    loading.style.display = 'none';
    liveIndicator.style.display = 'flex';
}

// Real-time Listener
function initRealtimeListener() {
    supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'orders' },
            (payload) => {
                console.log('Change received!', payload);
                // Ideally we just modify the local state diff, but re-fetching is safer for getting full consistent sort order
                fetchOrders();
            }
        )
        .subscribe();
}

// Render Table
function renderOrders() {
    const filteredOrders = currentFilter === 'all'
        ? allOrders
        : allOrders.filter(order => order.status === currentFilter);

    ordersTableBody.innerHTML = '';

    if (filteredOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-10 text-center text-gray-400">
                    Nenhum pedido encontrado.
                </td>
            </tr>
        `;
        return;
    }

    filteredOrders.forEach(order => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors cursor-pointer';
        tr.onclick = () => openOrderModal(order.id);

        // Status Color Logic
        let statusColor = 'bg-gray-100 text-gray-600';
        if (order.status === 'Pago') statusColor = 'bg-green-100 text-green-700';
        if (order.status === 'Aguardando pagamento') statusColor = 'bg-yellow-100 text-yellow-700';
        if (order.status === 'Enviado') statusColor = 'bg-blue-100 text-blue-700';
        if (order.status === 'Cancelado') statusColor = 'bg-red-100 text-red-700';

        // Name Logic (Fallback for legacy data)
        const customerName = order.customer_name || 'Cliente';
        const total = order.total_in_cents || 0;

        tr.innerHTML = `
            <td class="px-6 py-4 font-mono text-xs text-gray-500">#${order.id.slice(0, 6)}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatDate(order.created_at)}</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">${customerName}</td>
            <td class="px-6 py-4 text-sm font-bold text-gray-900">${formatCurrency(total)}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-bold ${statusColor}">
                    ${order.status || 'Pendente'}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <button class="text-gray-400 hover:text-black">➝</button>
            </td>
        `;
        ordersTableBody.appendChild(tr);
    });
}

// Filters Logic
function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => {
                b.classList.remove('bg-black', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
            });
            // Add active class
            btn.classList.remove('bg-gray-200', 'text-gray-700');
            btn.classList.add('bg-black', 'text-white');

            currentFilter = btn.dataset.status;
            renderOrders();
        });
    });
}

// Modal Logic
function openOrderModal(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;

    currentOrderId = orderId;

    // Header
    modalOrderId.textContent = orderId;
    modalStatus.textContent = order.status || 'Pendente';
    updateStatusSelect.value = order.status || 'Aguardando pagamento';

    // Customer
    modalCustomerName.textContent = order.customer_name || 'N/A';
    modalCustomerEmail.textContent = order.customer_email || 'N/A';
    // modalCustomerCPF.textContent = order.customer_cpf || 'N/A'; 

    // Address (Supabase stores as JSONB, so it's an object)
    const address = order.address || {};
    modalAddressStreet.textContent = `${address.street || ''}, ${address.number || ''} ${address.complement ? '(' + address.complement + ')' : ''}`;
    modalAddressCity.textContent = `${address.city || ''} - ${address.state || ''}`;
    modalAddressZip.textContent = address.cep || '';

    // Items
    modalItems.innerHTML = (order.items || []).map(item => `
        <div class="flex gap-3 items-center border-b border-gray-100 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
            <img src="${item.image}" class="w-10 h-10 rounded object-cover bg-gray-200">
            <div class="flex-1">
                <p class="text-sm font-bold text-gray-800 line-clamp-1">${item.title}</p>
                <p class="text-xs text-gray-500">Tam: ${item.size} | Qtd: ${item.quantity}</p>
            </div>
            <p class="text-sm font-bold">${formatCurrency(item.price_in_cents * item.quantity)}</p>
        </div>
    `).join('');

    modalTotal.textContent = formatCurrency(order.total_in_cents);

    orderModal.classList.remove('hidden');
}

// Status Update Logic
function setupStatusUpdate() {
    updateStatusSelect.addEventListener('change', async (e) => {
        const newStatus = e.target.value;
        if (!currentOrderId) return;

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', currentOrderId);

            if (error) throw error;

            modalStatus.textContent = newStatus;
            showToast(`Status atualizado para: ${newStatus}`);
        } catch (error) {
            console.error(error);
            showToast('Erro ao atualizar status', 'error');
        }
    });
}
