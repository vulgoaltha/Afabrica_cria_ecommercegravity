import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="h-full"
        >
            <Link to={`/produto/${product.id}`} className="block h-full group">
                <div className="relative rounded-2xl border border-gray-800 bg-[#0B0C10] shadow-2xl overflow-hidden group transition-all duration-300 hover:border-[var(--color-gold)]/50 hover:shadow-premium-lg hover:-translate-y-1 h-full flex flex-col">

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
                        <div className="absolute bottom-2 right-2 bg-[#2a2a2a] text-[#FFD700] text-[11px] font-black px-3 py-1 rounded-full shadow-xl border border-white/5 flex items-center gap-1.5">
                            {hasDiscount && (
                                <span className="line-through text-gray-500 text-[9px] font-medium hidden sm:inline-block mr-1">{displayPriceAntigo}</span>
                            )}
                            {displayPriceAtual}
                        </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-sm font-black text-white group-hover:text-[var(--color-gold)] transition-colors uppercase leading-tight line-clamp-2 mb-1">
                            {product.title}
                        </h3>

                        <p className="text-[10px] text-gray-400 line-clamp-2 mb-3 leading-relaxed font-medium uppercase tracking-wide">
                            {product.subtitle || 'Qualidade excepcional. Estilo urbano autêntico.'}
                        </p>

                        {/* Installment Info */}
                        <div className="hidden sm:block text-[9px] text-[#2dd4bf] font-bold tracking-wide mb-3 uppercase">
                            6x de {formatPrice((product.preco_atual || (product.price_in_cents ? product.price_in_cents / 100 : 0)) / 6)} sem juros
                        </div>

                        <div className="mt-auto">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full bg-[var(--color-gold)] hover:bg-[#d4af37] text-black font-black uppercase text-[11px] tracking-widest h-10 rounded-md shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
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

const ProductsList = ({ limit }: { limit?: number }) => {
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

    const displayedProducts = limit ? products.slice(0, limit) : products;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
            ))}
        </div>
    );
};

export default ProductsList;
