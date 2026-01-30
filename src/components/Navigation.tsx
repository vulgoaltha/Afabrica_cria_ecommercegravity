import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import ShoppingCartComponent from '@/components/ShoppingCart';
import logo from '@/assets/logo.webp';

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
    const [isCatalogoDropdownOpen, setIsCatalogoDropdownOpen] = useState(false);
    const { cartItems } = useCart();
    const location = useLocation();

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
        { name: 'Home', path: '/' },
        { name: 'Catálogo', path: '/catalogo', hasDropdown: true },
        { name: 'Sobre', path: '/sobre' },
        { name: 'Contato', path: '/contato' },
    ];

    const catalogoDropdownItems: DropdownItem[] = [
        { name: 'Todos Produtos', path: '/catalogo' },
        { name: 'Cria do Morro', path: '/catalogo/cria-do-morro' },
        { name: 'Aba Reta', path: '/catalogo/aba-reta' },
        { name: 'Trucker', path: '/catalogo/trucker' },
        { name: 'Produtos Personalizados', path: '/catalogo/personalizados' },
    ];

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
                                link.hasDropdown ? (
                                    <div
                                        key={link.path}
                                        className="relative"
                                        onMouseEnter={() => setIsCatalogoDropdownOpen(true)}
                                        onMouseLeave={() => setIsCatalogoDropdownOpen(false)}
                                    >
                                        <Link
                                            to={link.path}
                                            className={cn(
                                                'text-sm font-medium transition-colors duration-300 relative group',
                                                location.pathname === link.path || location.pathname.startsWith('/catalogo')
                                                    ? 'text-[var(--color-gold)]'
                                                    : 'text-white hover:text-[var(--color-gold)]'
                                            )}
                                        >
                                            {link.name}
                                            <span
                                                className={cn(
                                                    'absolute -bottom-1 left-0 h-0.5 bg-[var(--color-gold)] transition-all duration-300',
                                                    location.pathname.startsWith('/catalogo') ? 'w-full' : 'w-0 group-hover:w-full'
                                                )}
                                            />
                                        </Link>

                                        {/* Desktop Dropdown */}
                                        <AnimatePresence>
                                            {isCatalogoDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-md border border-[var(--color-gold)]/20 rounded-lg shadow-xl overflow-hidden"
                                                >
                                                    {catalogoDropdownItems.map((item, index) => (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            className={cn(
                                                                'block px-4 py-3 text-sm transition-colors duration-200',
                                                                'text-white hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)]',
                                                                index !== catalogoDropdownItems.length - 1 && 'border-b border-gray-800'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={cn(
                                            'text-sm font-medium transition-colors duration-300 relative group',
                                            location.pathname === link.path
                                                ? 'text-[var(--color-gold)]'
                                                : 'text-white hover:text-[var(--color-gold)]'
                                        )}
                                    >
                                        {link.name}
                                        <span
                                            className={cn(
                                                'absolute -bottom-1 left-0 h-0.5 bg-[var(--color-gold)] transition-all duration-300',
                                                location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                                            )}
                                        />
                                    </Link>
                                )
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
                                        link.hasDropdown ? (
                                            <div key={link.path}>
                                                <button
                                                    onClick={() => setIsCatalogoDropdownOpen(!isCatalogoDropdownOpen)}
                                                    className={cn(
                                                        'w-full text-left py-3 px-4 rounded-lg transition-colors duration-300 text-lg flex items-center justify-between',
                                                        location.pathname.startsWith('/catalogo')
                                                            ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]'
                                                            : 'text-white hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)]'
                                                    )}
                                                >
                                                    {link.name}
                                                    <motion.span
                                                        animate={{ rotate: isCatalogoDropdownOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        ▼
                                                    </motion.span>
                                                </button>

                                                {/* Mobile Dropdown Items */}
                                                <AnimatePresence>
                                                    {isCatalogoDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden mt-2 ml-4 space-y-2"
                                                        >
                                                            {catalogoDropdownItems.map((item) => (
                                                                <Link
                                                                    key={item.path}
                                                                    to={item.path}
                                                                    className="block py-2 px-4 rounded-lg text-sm text-white hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)] transition-colors duration-200"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className={cn(
                                                    'block py-3 px-4 rounded-lg transition-colors duration-300 text-lg',
                                                    location.pathname === link.path
                                                        ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]'
                                                        : 'text-white hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)]'
                                                )}
                                            >
                                                {link.name}
                                            </Link>
                                        )
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
