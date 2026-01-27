import { protegerAdmin } from "./auth.js";

// Protege a rota - se não estiver logado, redireciona
protegerAdmin((user) => {
    console.log("Admin logado:", user.email);
    // Aqui você pode adicionar lógica específica do admin,
    // como carregar dados do dashboard, pedidos, etc.

    // Exemplo: mostrar email no header
    const adminEmailEl = document.getElementById('admin-email');
    if (adminEmailEl) {
        adminEmailEl.textContent = user.email;
    }
});
