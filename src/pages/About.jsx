import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Target, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
    const values = [
        {
            icon: Award,
            title: 'Qualidade Excepcional',
            description: 'Utilizamos apenas materiais de primeira linha para garantir durabilidade e conforto.',
        },
        {
            icon: Target,
            title: 'Personalização Total',
            description: 'Cada projeto é único. Trabalhamos para criar exatamente o que você imagina.',
        },
        {
            icon: Users,
            title: 'Atendimento Dedicado',
            description: 'Nossa equipe está pronta para orientar você em cada etapa do processo.',
        },
        {
            icon: Zap,
            title: 'Entrega Rápida',
            description: 'Processos otimizados para garantir que seu pedido chegue no prazo.',
        },
    ];

    const differentiators = [
        'Mais de 10 anos de experiência no mercado',
        'Personalização sem limite de quantidade',
        'Tecnologia de impressão de última geração',
        'Consultoria especializada sem custo adicional',
        'Garantia de qualidade em todos os produtos',
        'Parcerias com as melhores marcas de tecidos',
    ];

    return (
        <>
            <Helmet>
                <title>Sobre Nós - A Fabrica Cria</title>
                <meta
                    name="description"
                    content="Conheça a história da A Fabrica Cria. Especialistas em uniformes personalizados com mais de 10 anos de experiência."
                />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1637666679781-7e535cd26dfa"
                        alt="About Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-preto/80 via-preto/60 to-preto" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center pt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto space-y-6"
                    >
                        <h1 className="font-poppins text-5xl md:text-7xl font-bold leading-tight">
                            Sobre <span className="text-gradient">A Fabrica Cria</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300">
                            Transformando ideias em uniformes excepcionais há mais de uma década.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Company Story */}
            <section className="py-16 md:py-24 bg-preto">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6 text-lg text-gray-300 leading-relaxed"
                        >
                            <p>
                                Fundada com a missão de elevar o padrão de uniformes personalizados no Brasil,
                                <span className="text-dourado font-semibold"> A Fabrica Cria </span>
                                nasceu da paixão por qualidade, design e atendimento excepcional.
                            </p>
                            <p>
                                Ao longo de mais de 10 anos no mercado, nos tornamos referência em uniformes personalizados.
                                para equipes esportivas, empresas e eventos especiais. Nossa dedicação vai além da
                                simples produção - criamos identidades visuais que inspiram confiança e orgulho.
                            </p>
                            <p>
                                Trabalhamos com os melhores materiais, tecnologia de ponta em personalização e uma
                                equipe apaixonada por criar peças únicas que superem as expectativas de nossos clientes.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-preto to-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-poppins text-4xl md:text-5xl font-bold mb-4">
                            Nossos <span className="text-gradient">Valores</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Princípios que guiam cada projeto que realizamos
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-dourado/50 transition-all duration-300 hover:shadow-premium"
                            >
                                <div className="w-16 h-16 bg-dourado/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <value.icon className="w-8 h-8 text-dourado" />
                                </div>
                                <h3 className="font-poppins text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-gray-400 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 md:py-24 bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="font-poppins text-4xl md:text-5xl font-bold mb-6">
                                Por que escolher <span className="text-gradient">a gente</span>?
                            </h2>
                            <ul className="space-y-4">
                                {differentiators.map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-dourado/20 flex items-center justify-center flex-shrink-0 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-dourado" />
                                        </div>
                                        <span className="text-gray-300 text-lg">{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1637666639858-e914177a9146"
                                alt="Why Choose Us"
                                className="rounded-xl shadow-premium-lg"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-preto">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-br from-dourado/20 to-transparent border border-dourado/30 rounded-2xl p-12"
                    >
                        <h2 className="font-poppins text-4xl md:text-5xl font-bold mb-6">
                            Pronto para começar <span className="text-gradient">seu projeto</span>?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Solicite um orçamento sem compromisso e descubra como podemos ajudar
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="bg-dourado hover:bg-yellow-500 text-preto font-semibold px-8 py-6 text-lg"
                        >
                            <Link to="/contato">Solicitar Orçamento</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default About;
