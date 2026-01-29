import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.webp';

const Footer = () => {
    const [email, setEmail] = useState('');
    const { toast } = useToast();

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            toast({
                title: 'Inscrição realizada!',
                description: 'Você receberá nossas novidades em breve.',
            });
            setEmail('');
        }
    };

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Catálogo', path: '/catalogo' },
        { name: 'Sobre', path: '/sobre' },
        { name: 'Contato', path: '/contato' },
    ];

    const legalLinks = [
        { name: 'FAQ', path: '#' },
        { name: 'Política de Privacidade', path: '#' },
        { name: 'Termos de Serviço', path: '#' },
    ];

    const socialLinks = [
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
    ];

    return (
        <footer className="bg-black border-t border-gray-900 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <Link to="/" className="inline-block">
                            <motion.img
                                src={logo}
                                alt="A Fábrica Cria Logo"
                                className="h-10 w-auto object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Especialistas em uniformes personalizados para equipes, empresas e eventos.
                            Qualidade excepcional, personalização completa e atendimento dedicado.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    whileHover={{ scale: 1.1 }}
                                    className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center hover:bg-[var(--color-gold)]/20 transition-colors duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5 text-[var(--color-gold)]" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-[var(--color-gold)] uppercase tracking-widest text-sm">
                            Links Rápidos
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-[var(--color-gold)] transition-colors duration-300 text-sm font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-[var(--color-gold)] uppercase tracking-widest text-sm">
                            Informações
                        </h3>
                        <ul className="space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.path}
                                        className="text-gray-400 hover:text-[var(--color-gold)] transition-colors duration-300 text-sm font-medium"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-[var(--color-gold)] uppercase tracking-widest text-sm">
                                Contato
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3 text-gray-400 text-sm">
                                    <Mail className="w-5 h-5 text-[var(--color-gold)] mt-0.5 flex-shrink-0" />
                                    <span>sac@afabricahcria.com.br</span>
                                </li>
                                <li className="flex items-start space-x-3 text-gray-400 text-sm">
                                    <Phone className="w-5 h-5 text-[var(--color-gold)] mt-0.5 flex-shrink-0" />
                                    <span>(11) 2506-7087</span>
                                </li>
                                <li className="flex items-start space-x-3 text-gray-400 text-sm">
                                    <MapPin className="w-5 h-5 text-[var(--color-gold)] mt-0.5 flex-shrink-0" />
                                    <span>São Paulo, SP - Brasil</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-[var(--color-gold)] uppercase tracking-widest text-xs">
                                Newsletter
                            </h3>
                            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 bg-gray-900/50 border-gray-800 focus:border-[var(--color-gold)]"
                                />
                                <Button type="submit" size="icon" className="bg-[var(--color-gold)] hover:bg-yellow-500 text-black shrink-0">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-gray-900">
                    <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} A Fabrica Cria. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
