import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductsList from '@/components/ProductsList';

const HomePage = () => {
    const features = [
        {
            icon: Star,
            title: 'Qualidade Excepcional',
            description: 'Materiais de alta qualidade para máxima durabilidade',
        },
        {
            icon: Users,
            title: 'Personalização Total',
            description: 'Customize cores, logos e designs conforme sua necessidade',
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
                <title>A Fabrica Cria - Uniformes Personalizados</title>
                <meta
                    name="description"
                    content="Uniformes exclusivos de alta qualidade para equipes, empresas e eventos."
                />
                <meta property="og:title" content="A Fabrica Cria - Uniformes Personalizados" />
                <meta
                    property="og:description"
                    content="Uniformes personalizados de alta qualidade para equipes, empresas e eventos."
                />
                <meta property="og:image" content="https://images.unsplash.com/photo-1649879134898-a21386a23ec7" />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1649879134898-a21386a23ec7"
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
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="font-poppins text-4xl sm:text-5xl md:text-7xl font-bold leading-tight md:leading-tight"
                        >
                            <span className="text-gradient block mb-2 md:mb-4">A Fabrica Cria</span>
                            <span className="text-white">Uniformes Exclusivos</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto px-4"
                        >
                            Uniformes exclusivos para equipes esportivas, empresas e eventos especiais.
                            Qualidade excepcional com personalização completa.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-dourado hover:bg-yellow-500 text-preto font-semibold px-8 py-6 text-lg group w-full sm:w-auto"
                            >
                                <Link to="/catalogo">
                                    Explorar Catálogo
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-2 border-dourado text-dourado hover:bg-dourado hover:text-preto px-8 py-6 text-lg w-full sm:w-auto"
                            >
                                <Link to="/contato">Solicitar Orçamento</Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>


            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-preto to-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-poppins text-3xl md:text-5xl font-bold mb-4">
                            Por que escolher <span className="text-gradient">A Fabrica Cria</span>?
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Excelência em cada detalhe, do design à entrega
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center p-8 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-dourado/50 transition-all duration-300 hover:shadow-premium"
                            >
                                <div className="w-16 h-16 bg-dourado/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <feature.icon className="w-8 h-8 text-dourado" />
                                </div>
                                <h3 className="font-poppins text-2xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
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
                            Produtos em <span className="text-gradient">Destaque</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Descubra nossos uniformes mais populares e exclusivos
                        </p>
                    </motion.div>

                    <ProductsList />

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

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-preto">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-br from-dourado/20 to-transparent border border-dourado/30 rounded-2xl p-8 md:p-12"
                    >
                        <h2 className="font-poppins text-3xl md:text-5xl font-bold mb-6">
                            Pronto para criar seu <span className="text-gradient">uniforme ideal</span>?
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">
                            Entre em contato conosco e receba um orçamento personalizado sem compromisso
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="bg-dourado hover:bg-yellow-500 text-preto font-semibold px-8 py-6 text-lg w-full sm:w-auto"
                        >
                            <Link to="/contato">Solicitar Orçamento Gratuito</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
