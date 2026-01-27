import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPage = () => {
    return (
        <>
            <Helmet>
                <title>Pedido Confirmado - A Fabrica Cria</title>
            </Helmet>

            <div className="min-h-screen bg-preto flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1649879134898-a21386a23ec7')] opacity-10 bg-cover bg-center" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-2xl w-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 md:p-12 rounded-2xl text-center shadow-2xl shadow-dourado/5"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-24 h-24 bg-dourado/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dourado"
                    >
                        <CheckCircle className="w-12 h-12 text-dourado" />
                    </motion.div>

                    <h1 className="font-poppins text-4xl md:text-5xl font-bold text-white mb-6">
                        Pagamento Realizado!
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Obrigado por sua compra. Seu pedido foi confirmado e estamos preparando tudo com a excelência de sempre.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-dourado hover:bg-yellow-500 text-preto font-bold text-lg py-6"
                        >
                            <Link to="/">
                                Voltar ao Início
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-gray-600 text-white hover:bg-white/10 text-lg py-6"
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
