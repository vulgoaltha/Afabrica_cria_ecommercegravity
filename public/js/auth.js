import { supabase } from './supabase.js';

// LOGIN EMAIL
export async function loginEmail(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha
    });
    if (error) throw error;
    return data;
}

// LOGIN GOOGLE
export async function loginGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/admin/dashboard.html'
        }
    });
    if (error) throw error;
    return data;
}

// LOGOUT
export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = "/login.html";
}

// PROTEGER ADMIN
export async function protegerAdmin(callback) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = "/login.html";
    } else {
        if (callback) callback(session.user);
    }

    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
            window.location.href = "/login.html";
        }
    });
}