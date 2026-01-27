import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

// LOGIN EMAIL
export function loginEmail(email, senha) {
    return signInWithEmailAndPassword(auth, email, senha);
}

// LOGIN GOOGLE
export function loginGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

// LOGOUT
export function logout() {
    return signOut(auth);
}

// PROTEGER ADMIN
export function protegerAdmin(callback) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = "/login.html";
        } else {
            callback(user);
        }
    });
}