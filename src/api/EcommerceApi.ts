import { supabase } from '@/lib/supabase';
import { Product, ProductVariant } from '@/types';

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value / 100);
};

export const getProducts = async (): Promise<{ products: Product[] }> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const products: Product[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price_in_cents: item.price_in_cents || 0,
            sale_price_in_cents: item.sale_price_in_cents,
            images: item.gallery && Array.isArray(item.gallery) ? item.gallery : (item.image ? [item.image] : []),
            category: item.category,
            stock_quantity: item.stock || 0,
            manage_inventory: true,
            created_at: item.created_at,
            variants: [
                {
                    id: `var-${item.id}`,
                    product_id: item.id,
                    title: 'Padrão',
                    price_in_cents: item.price_in_cents || 0,
                    sale_price_in_cents: item.sale_price_in_cents,
                    stock_quantity: item.stock || 0,
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

export const getProduct = async (id: string): Promise<Product> => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            price_in_cents: data.price_in_cents || 0,
            sale_price_in_cents: data.sale_price_in_cents,
            images: data.gallery && Array.isArray(data.gallery) ? data.gallery : (data.image ? [data.image] : []),
            category: data.category,
            stock_quantity: data.stock || 0,
            manage_inventory: true,
            created_at: data.created_at,
            variants: [
                {
                    id: `var-${data.id}`,
                    product_id: data.id,
                    title: 'Padrão',
                    price_in_cents: data.price_in_cents || 0,
                    sale_price_in_cents: data.sale_price_in_cents,
                    stock_quantity: data.stock || 0,
                    manage_inventory: true
                }
            ]
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};
