'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types';

interface Props {
    product: Product;
}

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

export default function ProductDetailClient({ product }: Props) {
    const [selectedVariant] = useState<ProductVariant | null>(product.variants?.[0] || null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { addToCart } = useCart();
    const { toast } = useToast();

    const handleAddToCart = useCallback(async () => {
        if (!selectedSize) {
            toast({
                variant: "destructive",
                title: "Selecione um tamanho",
                description: "Por favor, escolha um tamanho para continuar.",
            });
            return;
        }

        if (product && selectedVariant) {
            const availableQuantity = selectedVariant.stock_quantity;
            try {
                await addToCart(product, selectedVariant, quantity, availableQuantity);
                toast({
                    title: "Adicionado ao Carrinho! 🛒",
                    description: `${quantity} x ${product.title} (Tam: ${selectedSize}) adicionado.`,
                });
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Ops! Algo deu errado.",
                    description: error.message,
                });
            }
        }
    }, [product, selectedVariant, selectedSize, quantity, addToCart, toast]);

    const handleQuantityChange = useCallback((amount: number) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + amount;
            if (newQuantity < 1) return 1;
            return newQuantity;
        });
    }, []);

    const handlePrevImage = useCallback(() => {
        if (product.images.length > 1) {
            setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1);
        }
    }, [product.images.length]);

    const handleNextImage = useCallback(() => {
        if (product.images.length > 1) {
            setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1);
        }
    }, [product.images.length]);

    const price = (selectedVariant?.sale_price_in_cents ?? selectedVariant?.price_in_cents ?? 0) / 100;
    const hasMultipleImages = product.images.length > 1;

    return (
        <div className="min-h-screen bg-black pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--color-gold)] transition-colors mb-8">
                    <ArrowLeft size={18} />
                    Voltar ao Início
                </Link>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="space-y-4">
                        <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 aspect-square">
                            <Image
                                src={product.images[currentImageIndex] || placeholderImage}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />

                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[var(--color-gold)]/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[var(--color-gold)]/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {hasMultipleImages && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === currentImageIndex ? 'border-[var(--color-gold)] scale-105' : 'border-gray-800 hover:border-gray-600'
                                            }`}
                                    >
                                        <Image
                                            src={image || placeholderImage}
                                            alt={`${product.title} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{product.title}</h1>

                        <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-gray-800">
                            <span className="text-4xl font-bold text-[var(--color-gold)]">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
                            </span>
                        </div>

                        <div className="prose prose-invert max-w-none text-gray-300 mb-8">
                            {product.description}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Tamanho</h3>
                            <div className="flex flex-wrap gap-3">
                                {['P', 'M', 'G', 'GG'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all ${selectedSize === size
                                            ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-black'
                                            : 'border-gray-700 text-gray-400 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mb-8">
                            <div className="flex items-center border-2 border-gray-700 rounded-xl bg-gray-900/50 w-max">
                                <button onClick={() => handleQuantityChange(-1)} className="p-4 text-gray-400 hover:text-white transition-colors">
                                    <Minus size={20} />
                                </button>
                                <span className="w-12 text-center text-xl font-bold text-white">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="p-4 text-gray-400 hover:text-white transition-colors">
                                    <Plus size={20} />
                                </button>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                size="lg"
                                className="flex-1 bg-[var(--color-gold)] hover:bg-yellow-500 text-black font-bold text-lg h-auto py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                            >
                                <ShoppingCart className="mr-2 h-6 w-6" />
                                Adicionar ao Carrinho
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
