import { supabase } from '@/lib/supabase';

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value / 100);
};

export const getProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const products = data.map((item) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle || (item.description ? item.description.substring(0, 50) + '...' : ''),
            description: item.description,
            image: item.image,
            category: item.category,
            // Map Supabase fields to expected frontend format
            variants: [
                {
                    id: `var-${item.id}`,
                    price_formatted: formatCurrency(item.price_in_cents || 0),
                    price_in_cents: item.price_in_cents || 0,
                    sale_price_in_cents: item.sale_price_in_cents,
                    sale_price_formatted: item.sale_price_in_cents ? formatCurrency(item.sale_price_in_cents) : null,
                    inventory_quantity: item.stock || 0,
                    manage_inventory: true
                }
            ]
        }));

        return { products };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [] };
    }
};

export const getProductQuantities = async ({ product_ids }) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, stock')
            .in('id', product_ids);

        if (error) throw error;

        const variants = data.map(item => ({
            id: `var-${item.id}`,
            inventory_quantity: item.stock || 0
        }));

        return { variants };
    } catch (error) {
        console.error("Error fetching quantities:", error);
        return { variants: [] };
    }
};

export const getProduct = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Handle images
        let images = [];
        if (data.gallery && Array.isArray(data.gallery)) {
            images = data.gallery.map(url => ({ url }));
        } else if (data.image) {
            images = [{ url: data.image }];
        }

        return {
            id: data.id,
            title: data.title,
            subtitle: data.subtitle || data.description,
            description: data.description,
            image: data.image,
            images: images,
            sizes: data.sizes || ['P', 'M', 'G', 'GG'],
            customizable: data.customizable || false,
            purchasable: true, // Assuming all fetched products are purchasable
            variants: [
                {
                    id: `var-${data.id}`,
                    title: 'Padrão',
                    price_formatted: formatCurrency(data.price_in_cents || 0),
                    price_in_cents: data.price_in_cents || 0,
                    sale_price_in_cents: data.sale_price_in_cents,
                    sale_price_formatted: data.sale_price_in_cents ? formatCurrency(data.sale_price_in_cents) : null,
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
    // Legacy support for checkout initialization
    return { url: successUrl };
};
