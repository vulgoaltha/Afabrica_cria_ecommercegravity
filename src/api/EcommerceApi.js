import { products as mockProducts } from '@/data/products.js';

export const formatCurrency = (value, currencyInfo) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value / 100);
};

export const getProducts = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Transform our mock data into the structure expected by the templates
    const formattedProducts = mockProducts.map(p => ({
        id: p.id,
        title: p.name,
        subtitle: p.description,
        image: p.image,
        ribbon_text: undefined,
        variants: [
            {
                id: `var-${p.id}`,
                price_formatted: `R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                price_in_cents: Math.round(p.price * 100),
                sale_price_in_cents: null, // Simulated
                inventory_quantity: 10
            }
        ]
    }));

    return {
        products: formattedProducts
    };
};

export const getProductQuantities = async ({ product_ids }) => {
    await new Promise(resolve => setTimeout(resolve, 50));

    // Return mock quantities for the requested products
    const variants = product_ids.map(id => ({
        id: `var-${id}`,
        inventory_quantity: Math.floor(Math.random() * 20) + 1
    }));

    return { variants };
};

export const getProduct = async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const product = mockProducts.find(p => p.id.toString() === id.toString());

    if (!product) {
        throw new Error('Produto não encontrado');
    }

    // Format for consistency with getProducts
    return {
        id: product.id,
        title: product.name,
        subtitle: product.description,
        description: product.description, // Providing both for compatibility
        image: product.image,
        images: product.images ? product.images.map(img => ({ url: img })) : [{ url: product.image }],
        ribbon_text: undefined,
        purchasable: true,
        variants: [
            {
                id: `var-${product.id}`,
                title: 'Tamanho Único',
                price_formatted: `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                price_in_cents: Math.round(product.price * 100),
                sale_price_in_cents: null,
                inventory_quantity: 10,
                manage_inventory: false
            }
        ]
    };
};

export const initializeCheckout = async ({ items, successUrl, cancelUrl }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Simulate a successful checkout initialization
    // In a real app, this would return a Stripe/MercadoPago session URL
    return {
        url: successUrl // Just redirect to success page for simulation
    };
};
