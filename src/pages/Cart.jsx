import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const handleRemove = (variantId) => {
        if (window.confirm('Deseja remover este item do carrinho?')) {
            removeFromCart(variantId);
        }
    };

    const total = getCartTotal();

    if (cartItems.length === 0) {
        return (
            <>
                <Helmet>
                    <title>Carrinho - A Fabricah Cria</title>
                </Helmet>

                <div className="min-h-screen bg-preto pt-24 pb-16 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center space-y-6"
                    >
                        <ShoppingBag className="w-24 h-24 mx-auto text-gray-700" />
                        <h2 className="font-poppins text-3xl font-bold">Seu carrinho está vazio</h2>
                        <p className="text-gray-400">Adicione produtos para começar suas compras</p>
                        <Button
                            asChild
                            size="lg"
                            className="bg-dourado hover:bg-yellow-500 text-preto font-semibold"
                        >
                            <Link to="/catalogo">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Voltar ao Catálogo
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Carrinho ({cartItems.length}) - A Fabricah Cria</title>
            </Helmet>

            <div className="min-h-screen bg-preto pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <Link
                            to="/catalogo"
                            className="inline-flex items-center text-gray-400 hover:text-dourado transition-colors mb-6"
                        >
                            <ArrowLeft className="w-5 h-5 mr-1" />
                            Continuar Comprando
                        </Link>
                        <h1 className="font-poppins text-4xl md:text-5xl font-bold">
                            Seu <span className="text-gradient">Carrinho</span>
                        </h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item, index) => (
                                <motion.div
                                    key={item.variant.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-dourado/50 transition-all duration-300"
                                >
                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <Link
                                            to={`/produto/${item.product.id}`}
                                            className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
                                        >
                                            <img
                                                src={item.product.image}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <Link
                                                    to={`/produto/${item.product.id}`}
                                                    className="font-poppins text-xl font-semibold hover:text-dourado transition-colors"
                                                >
                                                    {item.product.title}
                                                </Link>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge variant="secondary">
                                                        {item.variant.title}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.variant.id,
                                                                Math.max(1, item.quantity - 1)
                                                            )
                                                        }
                                                        className="w-8 h-8 rounded-lg border border-gray-700 hover:border-dourado flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-lg font-semibold w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.variant.id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="w-8 h-8 rounded-lg border border-gray-700 hover:border-dourado flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Price & Remove */}
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl font-bold text-dourado">
                                                        {item.variant.sale_price_formatted || item.variant.price_formatted}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemove(item.variant.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-24 space-y-6">
                                <h2 className="font-poppins text-2xl font-semibold">Resumo do Pedido</h2>

                                <div className="space-y-3 py-4 border-y border-gray-800">
                                    <div className="flex justify-between text-2xl font-bold">
                                        <span>Total</span>
                                        <span className="text-dourado">{total}</span>
                                    </div>
                                </div>

                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full bg-dourado hover:bg-yellow-500 text-preto font-semibold text-lg py-6"
                                >
                                    <Link to="/checkout">Finalizar Compra</Link>
                                </Button>

                                <p className="text-sm text-gray-500 text-center">
                                    Pagamento seguro e protegido
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
