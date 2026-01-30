import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessPageState {
    orderId?: string;
    email?: string;
}

const SuccessPage = () => {
    const location = useLocation();
    const { orderId, email } = (location.state as SuccessPageState) || {};

    return (
        <>
            <Helmet>
                <title>Pedido Confirmado - A Fabricah Cria</title>
            </Helmet>

            <div className="min-h-screen bg-black pt-24 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1649879134898-a21386a23ec7')] opacity-10 bg-cover bg-center pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-2xl w-full bg-gray-900 border border-gray-800 p-8 md:p-12 rounded-2xl text-center shadow-2xl shadow-[var(--color-gold)]/5"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-24 h-24 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-[var(--color-gold)]"
                    >
                        <CheckCircle className="w-12 h-12 text-[var(--color-gold)]" />
                    </motion.div>

                    <h1 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tighter">
                        Pedido Confirmado!
                    </h1>

                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Obrigado por sua compra. Seu pedido foi recebido com sucesso e já estamos separando seus itens.
                    </p>

                    {orderId && (
                        <div className="bg-black/50 border border-gray-800 rounded-lg p-6 mb-8 max-w-md mx-auto">
                            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-1">Número do Pedido</p>
                            <p className="text-2xl font-mono text-white tracking-widest selection:bg-[var(--color-gold)] selection:text-black">
                                #{orderId}
                            </p>
                            {email && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Enviamos uma confirmação para {email}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-[var(--color-gold)] hover:bg-yellow-500 text-black font-bold text-lg py-6 uppercase tracking-wider"
                        >
                            <Link to="/">
                                Voltar ao Início
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-white/10 text-lg py-6 uppercase tracking-wider"
                        >
                            <Link to="/catalogo">
                                Continuar Comprando <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default SuccessPage;
