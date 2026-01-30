import { supabase } from '@/lib/supabase';
import { Product, ProductVariant } from '@/types';

export const formatCurrency = (value: number, isCents: boolean = true) => {
    const amount = isCents ? value / 100 : value;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(amount);
};

export interface ProductPriceInfo {
    currentPrice: number; // in Reais
    oldPrice: number | null; // in Reais
    hasDiscount: boolean;
    discountPercentage: number | null;
    displayPrice: string;
    displayOldPrice: string | null;
}

/**
 * Calculates standardized price information for a product or variant.
 * Priority: preco_atual > sale_price_in_cents > price_in_cents
 */
export const calculateProductPrices = (product: any, variant?: any): ProductPriceInfo => {
    const v = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : {});

    let currentPrice = 0;
    let oldPrice: number | null = null;

    // 1. Determine Current Price (in Reais)
    if (product.preco_atual !== undefined && product.preco_atual !== null) {
        currentPrice = product.preco_atual;
    } else if (v.sale_price_in_cents) {
        currentPrice = v.sale_price_in_cents / 100;
    } else if (v.price_in_cents) {
        currentPrice = v.price_in_cents / 100;
    } else if (product.price_in_cents) {
        currentPrice = product.price_in_cents / 100;
    }

    // 2. Determine Old Price (in Reais)
    if (product.preco_antigo !== undefined && product.preco_antigo !== null) {
        oldPrice = product.preco_antigo;
    } else if (v.sale_price_in_cents && v.price_in_cents && v.price_in_cents > v.sale_price_in_cents) {
        oldPrice = v.price_in_cents / 100;
    } else if (product.sale_price_in_cents && product.price_in_cents && product.price_in_cents > product.sale_price_in_cents) {
        oldPrice = product.price_in_cents / 100;
    }

    const hasDiscount = !!oldPrice && oldPrice > currentPrice;
    const discountPercentage = hasDiscount
        ? Math.round(((oldPrice! - currentPrice) / oldPrice!) * 100)
        : null;

    return {
        currentPrice,
        oldPrice,
        hasDiscount,
        discountPercentage,
        displayPrice: formatCurrency(currentPrice, false),
        displayOldPrice: oldPrice ? formatCurrency(oldPrice, false) : null
    };
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
            preco_antigo: item.preco_antigo,
            preco_atual: item.preco_atual,
            image: item.image,
            images: item.gallery && Array.isArray(item.gallery) ? item.gallery : (item.image ? [item.image] : []),
            category: item.category,
            stock_quantity: item.stock || 0,
            manage_inventory: true,
            created_at: item.created_at,
            subtitle: item.subtitle,
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

export const getProductQuantities = async ({ product_ids }: { product_ids: string[] }) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, stock')
            .in('id', product_ids);

        if (error) throw error;

        const variants = data.map((item: any) => ({
            id: `var-${item.id}`,
            stock_quantity: item.stock || 0
        }));

        return { variants };
    } catch (error) {
        console.error("Error fetching quantities:", error);
        return { variants: [] };
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
            preco_antigo: data.preco_antigo,
            preco_atual: data.preco_atual,
            image: data.image,
            images: data.gallery && Array.isArray(data.gallery) ? data.gallery : (data.image ? [data.image] : []),
            category: data.category,
            stock_quantity: data.stock || 0,
            manage_inventory: true,
            created_at: data.created_at,
            subtitle: data.subtitle,
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
