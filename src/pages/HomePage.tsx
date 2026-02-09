import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductsList from '@/components/ProductsList';
import logoCria from '@/assets/logo-cria-do-morro.webp';
import bannerCria from '@/assets/banner-hero-cria-do-morro.png';

const HomePage = () => {
    const features = [
        {
            icon: Star,
            title: 'Qualidade Excepcional',
            description: 'Materiais de alta qualidade para máxima durabilidade',
        },
        {
            icon: Users,
            title: 'Atendimento Especializado',
            description: 'Suporte personalizado para criar o uniforme dos seus sonhos',
        },
        {
            icon: Zap,
            title: 'Entrega Rápida',
            description: 'Produção ágil sem comprometer a qualidade',
        },
    ];

    return (
        <>
            <Helmet>
                <title>A Fabricah Cria - Uniformes Personalizados</title>
                <meta
                    name="description"
                    content="Uniformes exclusivos de alta qualidade para equipes, empresas e eventos."
                />
                <meta property="og:title" content="A Fabricah Cria - Uniformes Personalizados" />
                <meta
                    property="og:description"
                    content="Uniformes personalizados de alta qualidade para equipes, empresas e eventos."
                />
                <meta property="og:image" content={bannerCria} />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={bannerCria}
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-preto/80 via-preto/60 to-preto" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center mt-8 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto space-y-6 md:space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="flex justify-center mb-6"
                        >
                            <div
                                className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border-2 border-dourado/30 shadow-2xl shadow-dourado/20"
                            >
                                <img
                                    src={logoCria}
                                    alt="Cria do Morro Logo"
                                    className="w-20 md:w-28 h-auto object-contain brightness-110 drop-shadow-lg"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-bold tracking-widest uppercase mb-4">
                                Coleção Oficial
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="font-poppins text-4xl sm:text-5xl md:text-7xl font-bold leading-tight md:leading-tight"
                        >
                            <span className="text-gradient block mb-2 md:mb-4 drop-shadow-[0_0_20px_rgba(255,210,0,0.3)]">PRODUTOS OFICIAIS</span>
                            <span className="text-white uppercase tracking-tighter">Cria do Morro</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto px-4"
                        >
                            Uniformes exclusivos para equipes esportivas, empresas e eventos especiais.
                            Qualidade excepcional para você.
                        </motion.p>

                    </motion.div>
                </div>


            </section>


            {/* Featured Products */}
            <section className="py-16 md:py-24 bg-preto">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-poppins text-3xl md:text-5xl font-bold mb-4">
                            Os <span className="text-gradient">Mais Vendidos</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Descubra nossos uniformes mais populares e exclusivos
                        </p>
                    </motion.div>

                    <ProductsList limit={20} excludeBranded={true} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mt-12"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="bg-dourado hover:bg-yellow-500 text-preto font-semibold"
                        >
                            <Link to="/catalogo">Ver Catálogo Completo</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

        </>
    );
};

export default HomePage;
