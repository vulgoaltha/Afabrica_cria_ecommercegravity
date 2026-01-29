'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProducts } from '@/api/EcommerceApi';
import Image from 'next/image';
import { Product } from '@/types';

const CatalogPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();
    const { toast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts();
                setProducts(response.products);
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar os produtos.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [toast]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            return product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        });
    }, [searchTerm, products]);

    const handleAddToCart = async (product: Product) => {
        if (!product.variants || product.variants.length === 0) return;
        const variant = product.variants[0];

        try {
            await addToCart(product, variant, 1, variant.stock_quantity);
            toast({
                title: 'Produto adicionado!',
                description: `${product.title} foi adicionado ao carrinho.`,
            });
        } catch (error: any) {
            toast({
                title: 'Erro ao adicionar',
                description: error.message,
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Nosso <span className="text-[var(--color-gold)]">Catálogo</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Encontre o uniforme perfeito para sua equipe ou empresa
                    </p>
                </motion.div>

                {!loading && (
                    <div className="mb-8 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12"
                                />
                            </div>
                        </div>

                        <p className="text-gray-400">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                        </p>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-[var(--color-gold)] animate-spin" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg mb-4">
                            Nenhum produto encontrado.
                        </p>
                        <Button
                            onClick={() => setSearchTerm('')}
                            className="bg-[var(--color-gold)] hover:bg-yellow-500 text-black"
                        >
                            Limpar Busca
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product, index) => {
                            const variant = product.variants?.[0];
                            const price = (variant?.sale_price_in_cents ?? variant?.price_in_cents ?? 0) / 100;

                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="group"
                                >
                                    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-[var(--color-gold)]/50 transition-all duration-300 h-full flex flex-col">
                                        <Link href={`/product/${product.id}`} className="relative block overflow-hidden aspect-square">
                                            <Image
                                                src={product.images[0] || ''}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </Link>

                                        <div className="p-6 space-y-4 flex flex-col flex-grow">
                                            <div className="flex-grow">
                                                <Link href={`/product/${product.id}`}>
                                                    <h3 className="text-xl font-semibold hover:text-[var(--color-gold)] transition-colors">
                                                        {product.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                                <div>
                                                    <span className="text-2xl font-bold text-[var(--color-gold)]">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
                                                    </span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="bg-[var(--color-gold)] hover:bg-yellow-500 text-black"
                                                    onClick={() => handleAddToCart(product)}
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    Adicionar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogPage;
