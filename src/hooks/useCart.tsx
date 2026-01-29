'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { formatCurrency } from '@/api/EcommerceApi';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, variant: ProductVariant, quantity: number, availableQuantity: number) => Promise<void>;
    removeFromCart: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => string;
    getRawTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'e-commerce-cart';

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error('Failed to load cart from storage', error);
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addToCart = useCallback((product: Product, variant: ProductVariant, quantity: number, availableQuantity: number) => {
        return new Promise<void>((resolve, reject) => {
            if (variant.manage_inventory) {
                const existingItem = cartItems.find(item => item.variant.id === variant.id);
                const currentCartQuantity = existingItem ? existingItem.quantity : 0;
                if ((currentCartQuantity + quantity) > availableQuantity) {
                    const error = new Error(`Estoque insuficiente para ${product.title} (${variant.title}). Apenas ${availableQuantity} restantes.`);
                    reject(error);
                    return;
                }
            }

            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.variant.id === variant.id);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.variant.id === variant.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prevItems, { product, variant, quantity }];
            });
            resolve();
        });
    }, [cartItems]);

    const removeFromCart = useCallback((variantId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.variant.id !== variantId));
    }, []);

    const updateQuantity = useCallback((variantId: string, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.variant.id === variantId ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const getRawTotal = useCallback(() => {
        return cartItems.reduce((total, item) => {
            const price = item.variant.sale_price_in_cents ?? item.variant.price_in_cents;
            return total + price * item.quantity;
        }, 0);
    }, [cartItems]);

    const getCartTotal = useCallback(() => {
        if (cartItems.length === 0) return formatCurrency(0);
        return formatCurrency(getRawTotal());
    }, [cartItems, getRawTotal]);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getRawTotal,
    }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getRawTotal]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
