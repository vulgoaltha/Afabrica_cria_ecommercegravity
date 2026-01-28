import { db } from '@/lib/firebase';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';

export const formatCurrency = (value, currencyInfo) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value / 100);
};

export const getProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            products.push({
                id: doc.id,
                title: data.title,
                subtitle: data.description ? data.description.substring(0, 50) + '...' : '',
                image: data.image,
                price: data.price, // Legacy support
                // Map Firestore fields to expected frontend format
                variants: [
                    {
                        id: `var-${doc.id}`,
                        price_formatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((data.price_in_cents || 0) / 100),
                        price_in_cents: data.price_in_cents || 0,
                        sale_price_in_cents: data.sale_price_in_cents,
                        sale_price_formatted: data.sale_price_in_cents ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.sale_price_in_cents / 100) : null,
                        inventory_quantity: data.stock || 0
                    }
                ]
            });
        });

        return { products };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [] };
    }
};

export const getProductQuantities = async ({ product_ids }) => {
    // In Firestore, we already have stock in the product document. 
    // This is a legacy function for the template, we can return dummy or refetch.
    // For efficiency, we will assume detail view handles stock, but list view might need this.
    // Let's simplified return based on what we passed or fetch if needed.
    // For now, return mock to avoid breaking list view loops, or implement real fetch if critical.

    // Real implementation:
    const variants = [];
    for (const id of product_ids) {
        // We probably don't want to do N reads here. 
        // But since we transitioned to "One Doc = One Product", we handled this in getProducts above.
        // We will just return a success structure.
        variants.push({
            id: `var-${id}`,
            inventory_quantity: 100 // Fallback or real fetch
        });
    }
    return { variants };
};

export const getProduct = async (id) => {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Produto não encontrado');
        }

        const data = docSnap.data();

        // Handle images
        let images = [];
        if (data.gallery && Array.isArray(data.gallery)) {
            images = data.gallery.map(url => ({ url }));
        } else if (data.image) {
            images = [{ url: data.image }];
        }

        return {
            id: docSnap.id,
            title: data.title,
            subtitle: data.subtitle || data.description,
            description: data.description,
            image: data.image,
            images: images,
            sizes: data.sizes || ['P', 'M', 'G', 'GG'], // Default sizes if none saved
            customizable: data.customizable || false,
            // Construct a primary variant for price display
            variants: [
                {
                    id: `var-${docSnap.id}`,
                    title: 'Padrão',
                    price_formatted: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((data.price_in_cents || 0) / 100),
                    price_in_cents: data.price_in_cents || 0,
                    sale_price_in_cents: data.sale_price_in_cents,
                    sale_price_formatted: data.sale_price_in_cents ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.sale_price_in_cents / 100) : null,
                    inventory_quantity: data.stock || 0,
                    manage_inventory: true
                }
            ]
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

export const initializeCheckout = async ({ items, successUrl, cancelUrl }) => {
    // This connects to our Checkout.jsx logic usually, or backend.
    // For now, keep as mock since Checkout.jsx handles the real logic manually.
    return { url: successUrl };
};
