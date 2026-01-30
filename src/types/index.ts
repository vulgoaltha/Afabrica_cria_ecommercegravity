export interface Product {
    id: string;
    title: string;
    description: string;
    price_in_cents: number;
    sale_price_in_cents?: number;
    preco_antigo?: number;
    preco_atual?: number;
    images: string[];
    image?: string;
    nome?: string;
    category: string;
    stock_quantity: number;
    manage_inventory: boolean;
    variants?: ProductVariant[];
    created_at: string;
    subtitle?: string;
    sizes?: string[];
    customizable?: boolean;
    purchasable?: boolean;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    title: string;
    price_in_cents: number;
    sale_price_in_cents?: number;
    stock_quantity: number;
    manage_inventory: boolean;
}

export interface CartItem {
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

export interface Order {
    id: string;
    user_id: string;
    items: CartItem[];
    total_amount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    payment_method: string;
    shipping_address: Address;
    created_at: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    role: 'admin' | 'customer';
}
