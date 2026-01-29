'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProducts } from '@/api/EcommerceApi';
import Image from 'next/image';
import { Product } from '@/types';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

const ProductCard = ({ product, index }: { product: Product, index: number }) => {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();

    const displayVariant = useMemo(() => product.variants?.[0], [product]);
    const price = (displayVariant?.sale_price_in_cents ?? displayVariant?.price_in_cents ?? 0) / 100;
    const originalPrice = displayVariant?.price_in_cents ? displayVariant.price_in_cents / 100 : null;
    const hasSale = displayVariant?.sale_price_in_cents !== null && displayVariant?.sale_price_in_cents !== displayVariant?.price_in_cents;

    const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product.variants || product.variants.length > 1) {
            router.push(`/product/${product.id}`);
            return;
        }

        const defaultVariant = product.variants[0];
        try {
            await addToCart(product, defaultVariant, 1, defaultVariant.stock_quantity);
            toast({
                title: "Adicionado ao Carrinho! 🛒",
                description: `${product.title} foi adicionado ao seu carrinho.`,
            });
        } catch (error: any) {
            toast({
                title: "Erro ao adicionar",
                description: error.message,
                variant: "destructive"
            });
        }
    }, [product, addToCart, toast, router]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
        >
            <Link href={`/product/${product.id}`}>
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-premium-lg hover:border-[var(--color-gold)]/50 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                            src={product.images[0] || placeholderImage}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-baseline gap-1.5 border border-white/10">
                            {hasSale && (
                                <span className="line-through opacity-70 text-gray-400">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalPrice!)}
                                </span>
                            )}
                            <span className="text-[var(--color-gold)]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
                            </span>
                        </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold truncate text-white group-hover:text-[var(--color-gold)] transition-colors uppercase">
                            {product.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2 flex-grow font-medium uppercase text-[10px] tracking-widest leading-relaxed">
                            {product.description || 'Qualidade excepcional A Fábrica Cria.'}
                        </p>
                        <Button
                            onClick={handleAddToCart}
                            className="w-full mt-4 bg-[var(--color-gold)] hover:bg-yellow-500 text-black font-black uppercase text-[10px] tracking-widest transition-colors h-12"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar
                        </Button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const ProductsList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts();
                setProducts(response.products);
            } catch (err: any) {
                setError(err.message || 'Falha ao carregar produtos');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-16 w-16 text-[var(--color-gold)] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 p-8 bg-gray-900/50 rounded-xl border border-red-900/50">
                <p>Erro ao carregar produtos: {error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center text-gray-400 p-16 bg-gray-900/30 rounded-xl border border-gray-800">
                <p className="text-lg">Nenhum produto disponível no momento.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
            ))}
        </div>
    );
};

export default ProductsList;
