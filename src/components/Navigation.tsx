import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import ShoppingCartComponent from '@/components/ShoppingCart';
import logo from '@/assets/logo-cria.webp';
import { getCategories } from '@/api/EcommerceApi';

interface NavLink {
    name: string;
    path: string;
    hasDropdown?: boolean;
}

interface DropdownItem {
    name: string;
    path: string;
}

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartItems } = useCart();
    const location = useLocation();
    const [categories, setCategories] = useState<{ name: string, path: string }[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            const cats = await getCategories();
            const items: { name: string, path: string }[] = [];
            cats.forEach(c => {
                items.push({ name: c.title, path: `/catalogo/${c.slug}` });
            });
            setCategories(items);
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks: NavLink[] = [
        { name: 'Cria do morro', path: '/', hasDropdown: true },
        { name: 'MANGUEIRA', path: '/catalogo/mangueira', hasDropdown: true },
        { name: 'OUTROS', path: '/catalogo/outros' },
        { name: 'OUTROS', path: '/catalogo/outros-2' },
        { name: 'OUTROS', path: '/catalogo/outros-3' },
    ];

    const criaDropdownItems = [
        { name: 'Ver Tudo', path: '/' },
        { name: 'Aba Reta', path: '/catalogo/aba-reta' },
        { name: 'Trucker', path: '/catalogo/trucker' },
    ];

    const mangueiraDropdownItems = [
        { name: 'Ver Tudo', path: '/catalogo/mangueira' },
        { name: 'Mangueira 1', path: '/catalogo/mangueira-1' },
        { name: 'Mangueira 2', path: '/catalogo/mangueira-2' },
    ];

    const getDropdownItems = (name: string) => {
        if (name === 'Cria do morro') return criaDropdownItems;
        if (name === 'MANGUEIRA') return mangueiraDropdownItems;
        return [];
    };

    const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled
                        ? 'bg-black/95 backdrop-blur-md shadow-lg py-2'
                        : 'bg-transparent py-4'
                )}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 group z-50 relative">
                            <motion.img
                                src={logo}
                                alt="A Fabricah Cria Logo"
                                className="h-10 md:h-12 w-auto object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <div key={link.path} className="relative group/nav">
                                    <Link
                                        to={link.path}
                                        className={cn(
                                            'text-sm font-medium transition-colors duration-300 relative flex items-center gap-1 py-4',
                                            location.pathname === link.path
                                                ? 'text-[var(--color-gold)]'
                                                : 'text-white hover:text-[var(--color-gold)]',
                                            link.name === 'MANGUEIRA' && 'text-white hover:text-[#FF69B4]'
                                        )}
                                    >
                                        {link.name}
                                        {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                                        <span
                                            className={cn(
                                                'absolute -bottom-1 left-0 h-0.5 transition-all duration-300',
                                                link.name === 'MANGUEIRA' ? 'bg-[#FF69B4]' : 'bg-[var(--color-gold)]',
                                                location.pathname === link.path ? 'w-full' : 'w-0 group-hover/nav:w-full'
                                            )}
                                        />
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {link.hasDropdown && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 invisible group-hover/nav:visible opacity-0 group-hover/nav:opacity-100 transition-all duration-300 transform scale-95 group-hover/nav:scale-100 z-50">
                                            <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[200px]">
                                                {getDropdownItems(link.name).map((item) => (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        className="block px-6 py-4 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between group/item"
                                                    >
                                                        {item.name}
                                                        <div
                                                            className={cn(
                                                                "w-1 h-1 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity",
                                                                link.name === 'MANGUEIRA' ? "bg-[#EC008C]" : "bg-[var(--color-gold)]"
                                                            )}
                                                        />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/catalogo"
                                className="p-2 hover:bg-[var(--color-gold)]/10 rounded-lg transition-colors duration-300"
                            >
                                <Search className="w-5 h-5 text-white hover:text-[var(--color-gold)] transition-colors" />
                            </Link>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 hover:bg-[var(--color-gold)]/10 rounded-lg transition-colors duration-300"
                            >
                                <ShoppingCart className="w-5 h-5 text-white hover:text-[var(--color-gold)] transition-colors" />
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-[var(--color-gold)] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="md:hidden p-2 hover:bg-[var(--color-gold)]/10 rounded-lg transition-colors duration-300 z-50 relative"
                            >
                                {isOpen ? (
                                    <X className="w-6 h-6 text-white" />
                                ) : (
                                    <Menu className="w-6 h-6 text-white" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden overflow-hidden bg-black/95 backdrop-blur-md absolute top-full left-0 right-0 border-t border-gray-800 shadow-xl"
                            >
                                <div className="py-6 px-4 space-y-4">
                                    {navLinks.map((link) => (
                                        <React.Fragment key={link.path}>
                                            <Link
                                                to={link.path}
                                                className={cn(
                                                    'block py-3 px-4 rounded-lg transition-colors duration-300 text-lg',
                                                    location.pathname === link.path
                                                        ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]'
                                                        : 'text-white hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)]',
                                                    link.name === 'MANGUEIRA' && 'text-white hover:text-[#FF69B4] hover:bg-[#FF69B4]/10 border border-white/20'
                                                )}
                                            >
                                                {link.name}
                                            </Link>

                                            {/* Mobile Subcategories */}
                                            {link.hasDropdown && (
                                                <div className="pl-6 space-y-2 mt-2">
                                                    {getDropdownItems(link.name).map((item) => (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            className={cn(
                                                                "block py-2 px-4 rounded-md text-sm transition-colors",
                                                                location.pathname === item.path
                                                                    ? (link.name === 'MANGUEIRA' ? "text-[#EC008C] bg-[#EC008C]/5" : "text-[var(--color-gold)] bg-[var(--color-gold)]/5")
                                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                                            )}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            <ShoppingCartComponent isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
        </>
    );
};

export default Navigation;
