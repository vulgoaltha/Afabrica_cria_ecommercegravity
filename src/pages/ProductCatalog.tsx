import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getProducts, calculateProductPrices, getCategories, formatCurrency } from '@/api/EcommerceApi';
import { Product } from '@/types';
import bannerMangueira from '@/assets/banner-hero-mangueira.png';
import bannerCria from '@/assets/banner-hero-cria-do-morro.png';
import logoCriaDoMorro from '@/assets/logo-cria-do-morro.webp';

const ProductCatalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryTitleMap, setCategoryTitleMap] = useState<Record<string, string>>({});
    const { toast } = useToast();
    const { category } = useParams();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await getProducts();
                setProducts(response.products);
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar os produtos.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            const cats = await getCategories();
            const map: Record<string, string> = {};
            cats.forEach(c => map[c.slug] = c.title);
            setCategoryTitleMap(map);
        };

        fetchProducts();
        fetchCategories();
    }, [toast]);

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by category from URL
        if (category) {
            filtered = filtered.filter(p => p.category === category || p.sub_category === category);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return filtered;
    }, [searchTerm, products, category]);

    const categoryTitle = useMemo(() => {
        if (!category) return 'Catálogo';
        return categoryTitleMap[category] || category.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    }, [category, categoryTitleMap]);

    const handleAddToCart = async (product: Product) => {
        if (!product.variants || product.variants.length === 0) return;
        const variant = product.variants[0];

        try {
            await addToCart(product, variant, 1, variant.stock_quantity);
            toast({
                title: 'Produto adicionado!',
                description: `${product.title} foi adicionado ao carrinho.`,
            });
        } catch (error: any) {
            toast({
                title: 'Erro ao adicionar',
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const CATEGORY_BRANDING: Record<string, any> = {
        'mangueira': {
            banner: bannerMangueira,
            logo: logoCriaDoMorro,
            title: "MANGUEIRA",
            subtitle: "Sinta a batida do RJ e vista as cores da Conexão Primeiro.",
            tag: "Coleção Oficial",
            highlight: "Verde e Rosa com Orgulho.",
            colors: {
                primary: "#EC008C",
                secondary: "#009543",
                accent: "#EC008C",
                gradient: "from-[#EC008C]/90 via-black/80 to-[#009543]/90"
            }
        },
        'mangueira-1': {
            banner: bannerMangueira,
            logo: logoCriaDoMorro,
            title: "MANGUEIRA 1",
            subtitle: "Sinta a batida do RJ e vista as cores da Conexão Primeiro.",
            tag: "Coleção Oficial",
            highlight: "Verde e Rosa com Orgulho.",
            colors: {
                primary: "#EC008C",
                secondary: "#009543",
                accent: "#EC008C",
                gradient: "from-[#EC008C]/90 via-black/80 to-[#009543]/90"
            }
        },
        'mangueira-2': {
            banner: bannerMangueira,
            logo: logoCriaDoMorro,
            title: "MANGUEIRA 2",
            subtitle: "Sinta a batida do RJ e vista as cores da Conexão Primeiro.",
            tag: "Coleção Oficial",
            highlight: "Verde e Rosa com Orgulho.",
            colors: {
                primary: "#EC008C",
                secondary: "#009543",
                accent: "#EC008C",
                gradient: "from-[#EC008C]/90 via-black/80 to-[#009543]/90"
            }
        },
        'outros': {
            banner: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
            title: "OUTROS",
            subtitle: "Minimalismo e inovação em cada fibra. O futuro do streetwear.",
            tag: "Premium Aqua",
            highlight: "Tecnologia e Movimento",
            colors: {
                primary: "#00F2FE",
                secondary: "#4FACFE",
                accent: "#00F2FE",
                gradient: "from-[#00F2FE]/90 via-black/80 to-[#4FACFE]/90"
            }
        },
        'outros-2': {
            banner: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop",
            title: "OUTROS 2",
            subtitle: "A energia vibrante do asfalto refletida em cores intensas.",
            tag: "Sunset Energy",
            highlight: "Intensidade Urbana",
            colors: {
                primary: "#F7971E",
                secondary: "#FFD200",
                accent: "#F7971E",
                gradient: "from-[#F7971E]/90 via-black/80 to-[#FFD200]/90"
            }
        },
        'outros-3': {
            banner: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
            title: "OUTROS 3",
            subtitle: "A sofisticação do gelo encontra a resistência do metal.",
            tag: "Arctic Premium",
            highlight: "Pureza e Resistência",
            colors: {
                primary: "#E0E0E0",
                secondary: "#BDC3C7",
                accent: "#E0E0E0",
                gradient: "from-[#E0E0E0]/80 via-black/90 to-[#BDC3C7]/80"
            }
        },
        'cria-do-morro': {
            banner: bannerCria,
            logo: logoCriaDoMorro,
            title: "CRIA DO MORRO",
            subtitle: "A essência de quem faz a própria história. Nascido e Criado.",
            tag: "Coleção Oficial",
            highlight: "Original e Autêntico",
            colors: {
                primary: "#FFD200",
                secondary: "#FFFFFF",
                accent: "#FFD200",
                gradient: "from-[#FFD200]/40 via-black/80 to-black/90"
            }
        },
        'aba-reta': {
            banner: bannerCria,
            logo: logoCriaDoMorro,
            title: "ABA RETA",
            subtitle: "A essência de quem faz a própria história. Nascido e Criado.",
            tag: "Coleção Oficial",
            highlight: "Original e Autêntico",
            colors: {
                primary: "#FFD200",
                secondary: "#FFFFFF",
                accent: "#FFD200",
                gradient: "from-[#FFD200]/40 via-black/80 to-black/90"
            }
        },
        'trucker': {
            banner: bannerCria,
            logo: logoCriaDoMorro,
            title: "TRUCKER",
            subtitle: "A essência de quem faz a própria história. Nascido e Criado.",
            tag: "Coleção Oficial",
            highlight: "Original e Autêntico",
            colors: {
                primary: "#FFD200",
                secondary: "#FFFFFF",
                accent: "#FFD200",
                gradient: "from-[#FFD200]/40 via-black/80 to-black/90"
            }
        }
    };

    const BRANDS_WITH_BANNER = ['mangueira', 'mangueira-1', 'mangueira-2', 'cria-do-morro', 'aba-reta', 'trucker', 'outros', 'outros-2', 'outros-3'];
    const branding = category ? CATEGORY_BRANDING[category.toLowerCase()] : null;
    const showHero = branding && BRANDS_WITH_BANNER.includes(category?.toLowerCase() || '');

    const formatBrandText = (text: string) => {
        if (!text) return text;
        const parts = text.split(/(Verde|Rosa)/gi);
        return parts.map((part, i) => {
            const lowerPart = part.toLowerCase();
            if (lowerPart === 'verde') {
                return <span key={i} style={{ color: "#009543" }}>{part}</span>;
            }
            if (lowerPart === 'rosa') {
                return <span key={i} style={{ color: "#EC008C" }}>{part}</span>;
            }
            return part;
        });
    };

    return (
        <div className="min-h-screen bg-preto">
            <Helmet>
                <title>{category ? `${categoryTitle} | CRIA DO MORRO` : 'Catálogo | CRIA DO MORRO'}</title>
                <meta
                    name="description"
                    content={category ? `Explore nossa coleção exclusiva de ${categoryTitle}. Qualidade premium e design autêntico.` : 'Confira nosso catálogo completo de uniformes e streetwear.'}
                />
            </Helmet>

            <div className={cn("min-h-screen", showHero ? "bg-black" : "bg-preto pt-24 pb-16")}>
                {/* Dynamic Category Hero */}
                {showHero && branding && (
                    <section className="relative py-20 md:py-32 overflow-hidden flex items-center justify-center mb-12">
                        {/* Background Banner with Overlay */}
                        <div className="absolute inset-0">
                            <img
                                src={branding.banner}
                                alt={`${branding.title} Hero`}
                                className="w-full h-full object-cover"
                            />
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", branding.colors.gradient)} />
                        </div>

                        <div className="container mx-auto px-4 relative z-10 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                {/* Logo/Icon Container */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="flex justify-center mb-6"
                                >
                                    <div
                                        className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border-2 shadow-2xl"
                                        style={{
                                            borderColor: `${branding.colors.primary}50`,
                                            boxShadow: `0 0 30px ${branding.colors.primary}30`
                                        }}
                                    >
                                        {branding.logo ? (
                                            <img
                                                src={branding.logo}
                                                alt={`${branding.title} Logo`}
                                                className="w-20 md:w-28 h-auto object-contain brightness-110 drop-shadow-lg"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement?.classList.add('flex-col');
                                                    const fallbackText = document.createElement('span');
                                                    fallbackText.innerText = branding.title;
                                                    fallbackText.className = 'text-white font-black text-xs tracking-tighter';
                                                    e.currentTarget.parentElement?.appendChild(fallbackText);
                                                }}
                                            />
                                        ) : (
                                            <span className="text-white font-black text-xl tracking-tighter uppercase drop-shadow-lg">
                                                {branding.title}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.span
                                    className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/10 text-white text-xs font-bold tracking-widest uppercase mb-4"
                                >
                                    {branding.tag}
                                </motion.span>

                                <h1 className="font-poppins text-4xl md:text-7xl font-black mb-6 tracking-tighter text-white uppercase">
                                    {branding.title.includes('OUTROS') ? 'COLEÇÃO' : 'PRODUTOS OFICIAIS'} <span style={{ color: branding.colors.primary }} className="drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{branding.title}</span>
                                </h1>

                                <p className="text-white text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed mb-6 px-4">
                                    {formatBrandText(branding.subtitle)}
                                    <span
                                        className="block mt-4 font-black uppercase tracking-[0.2em] text-sm md:text-base inline-block mx-auto py-1 px-4 rounded-lg bg-black/20"
                                    >
                                        {formatBrandText(branding.highlight)}
                                    </span>
                                </p>
                            </motion.div>
                        </div>

                        {/* Bottom Transition Gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
                    </section>
                )}

                <div className="container mx-auto px-4">
                    {/* Header - Only if no special branding banner is shown */}
                    {!showHero && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12 text-center"
                        >
                            <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4">
                                {category ? (
                                    <>Nossos <span
                                        className={cn(!branding && "text-gradient")}
                                        style={branding ? { color: branding.colors.primary } : {}}
                                    >
                                        {categoryTitle}
                                    </span></>
                                ) : (
                                    <>Nosso <span className="text-gradient">Catálogo</span></>
                                )}
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                {category ? `Explorando itens da categoria ${categoryTitle}` : 'Encontre o uniforme perfeito para sua equipe ou empresa'}
                            </p>
                        </motion.div>
                    )}

                    {/* Search */}
                    {!loading && (
                        <div className={cn("mb-8 space-y-4", branding && "max-w-4xl mx-auto")}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={cn(
                                            "pl-12 bg-white/5 border-white/10 text-white",
                                            branding && "focus:ring-2"
                                        )}
                                        style={branding ? { borderColor: `${branding.colors.primary}50`, '--tw-ring-color': `${branding.colors.primary}30` } as any : {}}
                                    />
                                </div>
                            </div>

                            <p className="text-gray-400">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                            </p>
                        </div>
                    )}

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className={cn("w-12 h-12 animate-spin", category?.startsWith('mangueira') ? "text-[#EC008C]" : "text-dourado")} />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg mb-4">
                                Nenhum produto encontrado.
                            </p>
                            <Button
                                onClick={() => setSearchTerm('')}
                                className={cn(
                                    "transition-colors",
                                    category?.startsWith('mangueira')
                                        ? "bg-[#009543] hover:bg-[#007a37] text-white"
                                        : "bg-dourado hover:bg-yellow-500 text-preto"
                                )}
                            >
                                Limpar Busca
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product: Product, index: number) => {
                                const priceInfo = calculateProductPrices(product);
                                const itemCategory = product.category?.toLowerCase() || product.sub_category?.toLowerCase() || '';
                                const itemBranding = CATEGORY_BRANDING[itemCategory] || (category ? CATEGORY_BRANDING[category.toLowerCase()] : null);
                                const isThemed = !!itemBranding;

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group"
                                    >
                                        <div className={cn(
                                            "bg-gray-900/50 rounded-xl border overflow-hidden transition-all duration-300 h-full flex flex-col",
                                            isThemed
                                                ? "hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                                : "border-gray-800 hover:border-dourado/50 hover:shadow-premium-lg"
                                        )}
                                            style={isThemed ? { borderColor: `${itemBranding.colors.primary}30` } : {}}
                                            onMouseEnter={(e) => {
                                                if (isThemed) e.currentTarget.style.borderColor = `${itemBranding.colors.primary}80`;
                                            }}
                                            onMouseLeave={(e) => {
                                                if (isThemed) e.currentTarget.style.borderColor = `${itemBranding.colors.primary}30`;
                                            }}
                                        >
                                            {/* Image */}
                                            <Link to={`/produto/${product.id}`} className="relative block overflow-hidden aspect-square">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />

                                                {/* Discount Badge */}
                                                {priceInfo.discountPercentage && (
                                                    <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-tighter animate-pulse">
                                                        {priceInfo.discountPercentage}% OFF
                                                    </div>
                                                )}
                                            </Link>

                                            {/* Content */}
                                            <div className="p-6 space-y-4 flex flex-col flex-grow">
                                                <div className="flex-grow">
                                                    <Link to={`/produto/${product.id}`}>
                                                        <h3
                                                            className="font-poppins text-xl font-semibold transition-colors"
                                                            style={isThemed ? { color: '#fff' } : {}}
                                                        >
                                                            {product.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                                        {product.subtitle || product.description}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                                    <div className="flex flex-col">
                                                        {priceInfo.hasDiscount && (
                                                            <span className="text-xs line-through text-gray-500 font-medium">
                                                                {priceInfo.displayOldPrice}
                                                            </span>
                                                        )}
                                                        <span
                                                            className="text-2xl font-bold"
                                                            style={isThemed ? { color: itemBranding.colors.primary } : { color: 'var(--color-gold)' }}
                                                        >
                                                            {priceInfo.displayPrice}
                                                        </span>
                                                        <span
                                                            className="text-[10px] font-bold tracking-wide uppercase mt-1"
                                                            style={isThemed ? { color: itemBranding.colors.secondary } : { color: '#2dd4bf' }}
                                                        >
                                                            6x de {formatCurrency(priceInfo.currentPrice / 6, false)} sem juros
                                                        </span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="transition-all duration-300"
                                                        style={isThemed ? {
                                                            backgroundColor: itemBranding.colors.secondary,
                                                            color: '#fff'
                                                        } : {
                                                            backgroundColor: 'var(--color-gold)',
                                                            color: '#000'
                                                        }}
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        Adicionar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCatalog;
