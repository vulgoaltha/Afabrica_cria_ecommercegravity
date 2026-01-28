import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart as ShoppingCartIcon, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    const handleCheckout = async () => {
        console.log("Checkout inciado. Itens:", cartItems);

        if (cartItems.length === 0) {
            toast({
                title: 'Seu carrinho está vazio',
                description: 'Adicione alguns produtos ao carrinho antes de finalizar a compra.',
                variant: 'destructive',
            });
            return;
        }

        try {
            // Preparar dados com verificação de segurança reforçada
            const cleanItems = cartItems.map(item => {
                // Tenta pegar preço de várias fontes
                let finalPrice = 0;
                if (typeof item.variant.price === 'number') finalPrice = item.variant.price;
                else if (typeof item.variant.price_in_cents === 'number') finalPrice = item.variant.price_in_cents / 100;
                else if (typeof item.variant.sale_price_in_cents === 'number') finalPrice = item.variant.sale_price_in_cents / 100;

                // Garante que não é NaN
                if (isNaN(finalPrice)) finalPrice = 0;

                return {
                    productId: String(item.product.id || item.product._id || 'N/A'),
                    title: String(item.product.title || 'Produto Sem Nome'),
                    price: finalPrice,
                    quantity: Number(item.quantity) || 1,
                    size: String(item.variant.title || 'U'),
                    image: String(item.product.image || '')
                };
            });

            // Parse total com segurança
            const totalStr = getCartTotal().replace('R$', '').trim();
            // Remove pontos de milhar e troca virgula decimal por ponto
            const totalValue = parseFloat(totalStr.replace(/\./g, '').replace(',', '.')) || 0;

            const orderData = {
                items: cleanItems,
                total: totalValue,
                status: 'Recebido',
                customerName: 'Cliente Site',
                whatsapp: '',
                createdAt: serverTimestamp()
            };

            console.log("Enviando pedido para Firestore:", orderData);

            const docRef = await addDoc(collection(db, "orders"), orderData);

            console.log("SUCESSO! Pedido salvo com ID: ", docRef.id);

            // 2. Limpar carrinho
            clearCart();
            setIsCartOpen(false);

            // 3. Feedback
            toast({
                title: 'Pedido realizado!',
                description: `Pedido #${docRef.id.slice(0, 6)} salvo com sucesso!`,
                className: "bg-green-600 text-white border-none"
            });

            // alert(`Sucesso! Pedido #${docRef.id} criado.`);

        } catch (error) {
            console.error("ERRO FATAL NO CHECKOUT:", error);

            let errorMessage = 'Verifique sua conexão e tente novamente.';
            if (error.code === 'permission-denied') errorMessage = 'Erro de permissão: Falha ao salvar no Firestore.';
            if (error.message) errorMessage = error.message;

            toast({
                title: 'Erro ao processar',
                description: errorMessage,
                variant: 'destructive',
            });

            alert("Erro: " + errorMessage);
        }
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
                                        <img
                                            src={item.product.image}
                                            alt={item.product.title}
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                                        />
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-white text-xs uppercase line-clamp-1">{item.product.title}</h3>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">{item.variant.title || 'Padrão'}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-[var(--color-gold)] font-black">
                                                    {item.variant.sale_price_formatted || item.variant.price_formatted}
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

export default ShoppingCart;
