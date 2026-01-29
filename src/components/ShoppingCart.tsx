'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ShoppingCartProps {
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const ShoppingCartComponent: React.FC<ShoppingCartProps> = ({ isCartOpen, setIsCartOpen }) => {
    const { toast } = useToast();
    const router = useRouter();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast({
                title: 'Seu carrinho está vazio',
                description: 'Adicione alguns produtos ao carrinho antes de finalizar a compra.',
                variant: 'destructive',
            });
            return;
        }
        setIsCartOpen(false);
        router.push('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    onClick={() => setIsCartOpen(false)}
                >
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-black border-l border-gray-800 shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
                                <ShoppingCartIcon className="text-[var(--color-gold)]" />
                                Carrinho
                            </h2>
                            <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                                <X />
                            </Button>
                        </div>

                        <div className="flex-grow p-6 overflow-y-auto space-y-4">
                            {cartItems.length === 0 ? (
                                <div className="text-center text-gray-400 h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center">
                                        <ShoppingCartIcon size={32} className="text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-white uppercase tracking-widest text-xs">Seu carrinho está vazio</p>
                                        <p className="text-xs uppercase mt-2">Explore nosso catálogo para adicionar itens.</p>
                                    </div>
                                    <Button
                                        onClick={() => setIsCartOpen(false)}
                                        variant="outline"
                                        className="border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black font-bold text-xs"
                                    >
                                        Voltar à Loja
                                    </Button>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.variant.id} className="flex gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <Image
                                                src={item.product.images[0] || ''}
                                                alt={item.product.title}
                                                fill
                                                className="object-cover rounded-lg border border-gray-700"
                                            />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-white text-xs uppercase line-clamp-1">{item.product.title}</h3>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">{item.variant.title || 'Padrão'}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-[var(--color-gold)] font-black">
                                                    {(item.variant.sale_price_in_cents ?? item.variant.price_in_cents) / 100}
                                                </p>

                                                <div className="flex items-center bg-black/50 rounded-lg border border-gray-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}
                                                        className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="px-1 text-xs font-bold text-white min-w-[1.5rem] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                                                        className="px-2 py-1 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.variant.id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors self-start"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-gray-800 bg-gray-900/30">
                                <div className="flex justify-between items-center mb-6 text-white text-xs uppercase font-black tracking-widest">
                                    <span className="text-lg font-medium text-gray-400">Total</span>
                                    <span className="text-2xl font-black text-[var(--color-gold)]">{getCartTotal()}</span>
                                </div>
                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-[var(--color-gold)] hover:bg-yellow-500 text-black font-black py-8 text-lg rounded-xl shadow-lg shadow-[var(--color-gold)]/10 uppercase tracking-tighter"
                                >
                                    Finalizar Compra
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShoppingCartComponent;
