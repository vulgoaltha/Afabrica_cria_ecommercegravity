import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getProducts, getProductQuantities, calculateProductPrices } from '@/api/EcommerceApi';
import { supabase } from '@/lib/supabase'; // Import Supabase Client
import { Product } from '@/types';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const navigate = useNavigate();

    const formatPrice = (value: number | string | null | undefined) => {
        if (!value) return null;
        if (typeof value === 'string') return value;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const displayVariant = useMemo(() => (product.variants && product.variants.length > 0) ? product.variants[0] : {}, [product]);

    const priceInfo = useMemo(() => calculateProductPrices(product, displayVariant), [product, displayVariant]);

    const {
        displayPrice: displayPriceAtual,
        displayOldPrice: displayPriceAntigo,
        hasDiscount,
        discountPercentage
    } = priceInfo;

    // Debug logging (temporary) - Cleaned
    if (product.title === 'Jaqueta Corta-Vento' || product.preco_antigo || product.preco_atual) {
        console.log('🔍 PRODUTO COM DESCONTO:', product.title, {
            ...priceInfo,
            'produto completo': product
        });
    }

    const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.variants && product.variants.length > 1) {
            navigate(`/produto/${product.id}`);
            return;
        }

        const defaultVariant = product.variants ? product.variants[0] : null;
        if (!defaultVariant) return;

        const availableQuantity = defaultVariant.stock_quantity;

        try {
            await addToCart(product, defaultVariant, 1, availableQuantity);
            toast({
                title: "Adicionado ao Carrinho! 🛒",
                description: `${product.title} foi adicionado ao seu carrinho.`,
            });
        } catch (error: any) {
            toast({
                title: "Erro ao adicionar",
                description: error.message,
                variant: "destructive"
            });
        }
    }, [product, addToCart, toast, navigate]);

    const THEMES: Record<string, { primary: string, secondary: string }> = {
        'mangueira': { primary: "#EC008C", secondary: "#009543" },
        'mangueira-1': { primary: "#EC008C", secondary: "#009543" },
        'mangueira-2': { primary: "#EC008C", secondary: "#009543" },
        'outros': { primary: "#00F2FE", secondary: "#4FACFE" },
        'outros-2': { primary: "#F7971E", secondary: "#FFD200" },
        'outros-3': { primary: "#E0E0E0", secondary: "#BDC3C7" }
    };

    const itemCategory = product.category?.toLowerCase() || product.sub_category?.toLowerCase() || '';
    const theme = THEMES[itemCategory];
    const isThemed = !!theme;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="h-full"
        >
            <Link to={`/produto/${product.id}`} className="block h-full group">
                <div className={cn(
                    "relative rounded-2xl border bg-[#0B0C10] shadow-2xl overflow-hidden group transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1 h-full flex flex-col",
                    isThemed
                        ? "shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                        : "border-gray-800 hover:border-[var(--color-gold)]/50"
                )}
                    style={isThemed ? { borderColor: `${theme.primary}30` } : {}}
                    onMouseEnter={(e) => {
                        if (isThemed) e.currentTarget.style.borderColor = `${theme.primary}60`;
                    }}
                    onMouseLeave={(e) => {
                        if (isThemed) e.currentTarget.style.borderColor = `${theme.primary}30`;
                    }}
                >

                    {/* Image Container - Contained style per Reference 2 */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-900 mx-3 mt-3 rounded-xl">
                        <img
                            src={product.image || placeholderImage}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                        {/* Discount Badge */}
                        {discountPercentage && (
                            <div className="absolute top-2 left-2 z-10 bg-[#FF4D4D] text-white text-[10px] font-black px-2 py-0.5 rounded-sm shadow-lg uppercase tracking-wider">
                                {discountPercentage}% OFF
                            </div>
                        )}

                        {/* Price Tag as Pill - Bottom Right */}
                        <div
                            className="absolute bottom-2 right-2 text-[11px] font-black px-3 py-1 rounded-full shadow-xl border border-white/5 flex items-center gap-1.5"
                            style={isThemed ? { backgroundColor: theme.primary, color: '#fff' } : { backgroundColor: '#2a2a2a', color: '#FFD700' }}
                        >
                            {hasDiscount && (
                                <span className="line-through text-gray-400 text-[9px] font-medium hidden sm:inline-block mr-1">{displayPriceAntigo}</span>
                            )}
                            {displayPriceAtual}
                        </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                        <h3
                            className="text-sm font-black transition-colors uppercase leading-tight line-clamp-2 mb-1 text-white"
                            style={isThemed ? { transition: 'color 0.3s' } : {}}
                            onMouseEnter={(e) => {
                                if (isThemed) e.currentTarget.style.color = theme.primary;
                            }}
                            onMouseLeave={(e) => {
                                if (isThemed) e.currentTarget.style.color = '#fff';
                            }}
                        >
                            {product.title}
                        </h3>

                        <p className="text-[10px] text-gray-400 line-clamp-2 mb-3 leading-relaxed font-medium uppercase tracking-wide">
                            {product.subtitle || 'Qualidade excepcional. Estilo urbano autêntico.'}
                        </p>

                        {/* Installment Info */}
                        <div
                            className="text-[10px] font-bold tracking-wide mb-3 uppercase"
                            style={isThemed ? { color: theme.secondary } : { color: '#2dd4bf' }}
                        >
                            6x de {formatPrice(priceInfo.currentPrice / 6)} sem juros
                        </div>

                        <div className="mt-auto">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full font-black uppercase text-[11px] tracking-widest h-10 rounded-md shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                style={isThemed ? { backgroundColor: theme.secondary, color: '#fff' } : { backgroundColor: 'var(--color-gold)', color: '#000' }}
                            >
                                <ShoppingCart className="h-3.5 w-3.5" /> Adicionar
                            </Button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const ProductsList = ({
    limit,
    categoryFilter,
    excludeBranded = false
}: {
    limit?: number;
    categoryFilter?: string;
    excludeBranded?: boolean;
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductsWithQuantities = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch products first
                const productsResponse = await getProducts();

                if (!productsResponse.products || productsResponse.products.length === 0) {
                    setProducts([]);
                    return;
                }

                const initialProducts = productsResponse.products;
                setProducts(initialProducts); // Render immediately
                setLoading(false); // Stop loading indicator early

                // 2. Fetch quantities in background
                const productIds = initialProducts.map(p => p.id);
                const quantitiesResponse = await getProductQuantities({
                    product_ids: productIds
                });

                if (quantitiesResponse?.variants) {
                    const variantQuantityMap = new Map<string, number>();
                    quantitiesResponse.variants.forEach((v: any) => {
                        variantQuantityMap.set(v.id, v.stock_quantity);
                    });

                    setProducts(prevProducts => prevProducts.map(product => ({
                        ...product,
                        variants: product.variants?.map(variant => ({
                            ...variant,
                            stock_quantity: variantQuantityMap.get(variant.id) ?? variant.stock_quantity
                        }))
                    })));
                }
            } catch (err: any) {
                setError(err.message || 'Falha ao carregar produtos');
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchProductsWithQuantities();

        // Realtime Subscription
        const subscription = supabase
            .channel('public:products')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                (payload) => {
                    console.log('🔄 Realtime update received!', payload);
                    fetchProductsWithQuantities();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const displayedProducts = useMemo(() => {
        let filtered = products;

        if (excludeBranded) {
            const brandedCategories = ['mangueira', 'outros', 'outros-2', 'outros-3'];
            filtered = filtered.filter(p => {
                const cat = p.category?.toLowerCase() || '';
                const subCat = p.sub_category?.toLowerCase() || '';
                return !brandedCategories.includes(cat) && !brandedCategories.includes(subCat);
            });
        }

        if (categoryFilter) {
            filtered = filtered.filter(p =>
                p.category?.toLowerCase() === categoryFilter.toLowerCase() ||
                p.sub_category?.toLowerCase() === categoryFilter.toLowerCase() ||
                p.title?.toLowerCase().includes(categoryFilter.toLowerCase())
            );
        }
        return limit ? filtered.slice(0, limit) : filtered;
    }, [products, limit, categoryFilter, excludeBranded]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-16 w-16 text-[var(--color-gold)] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 p-8 bg-gray-900/50 rounded-xl border border-red-900/50">
                <p>Erro ao carregar produtos: {error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center text-gray-400 p-16 bg-gray-900/30 rounded-xl border border-gray-800">
                <p className="text-lg">Nenhum produto disponível no momento.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
            ))}
        </div>
    );
};

export default ProductsList;
