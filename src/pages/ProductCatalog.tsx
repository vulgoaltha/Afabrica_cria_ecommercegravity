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
import { getProducts, calculateProductPrices } from '@/api/EcommerceApi';
import { Product } from '@/types';

const ProductCatalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { category } = useParams();
    const { addToCart } = useCart();
    const { toast } = useToast();

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
        fetchProducts();
    }, [toast]);

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by category from URL
        if (category) {
            filtered = filtered.filter(p => p.category === category);
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
        const titles: Record<string, string> = {
            'cria-do-morro': 'Cria do Morro',
            'bones': 'Bonés',
            'bucket': 'Bucket',
            'personalizados': 'Produtos Personalizados'
        };
        return titles[category] || 'Catálogo';
    }, [category]);

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

    return (
        <>
            <Helmet>
                <title>Catálogo de Produtos - A Fabricah Cria</title>
                <meta
                    name="description"
                    content="Explore nosso catálogo completo de uniformes de alta qualidade. Camisetas, calções, meias, bonés e muito mais."
                />
            </Helmet>

            <div className="min-h-screen bg-preto pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center"
                    >
                        <h1 className="font-poppins text-4xl md:text-5xl font-bold mb-4">
                            {category ? <>Nossos <span className="text-gradient">{categoryTitle}</span></> : <>Nosso <span className="text-gradient">Catálogo</span></>}
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {category ? `Explorando itens da categoria ${categoryTitle}` : 'Encontre o uniforme perfeito para sua equipe ou empresa'}
                        </p>
                    </motion.div>

                    {/* Search */}
                    {!loading && (
                        <div className="mb-8 space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar produtos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12"
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
                            <Loader2 className="w-12 h-12 text-dourado animate-spin" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 text-lg mb-4">
                                Nenhum produto encontrado.
                            </p>
                            <Button
                                onClick={() => setSearchTerm('')}
                                className="bg-dourado hover:bg-yellow-500 text-preto"
                            >
                                Limpar Busca
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product: Product, index: number) => {
                                const priceInfo = calculateProductPrices(product);

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group"
                                    >
                                        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-dourado/50 hover:shadow-premium-lg transition-all duration-300 h-full flex flex-col">
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
                                                        <h3 className="font-poppins text-xl font-semibold hover:text-dourado transition-colors">
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
                                                        <span className="text-2xl font-bold text-dourado">
                                                            {priceInfo.displayPrice}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="bg-dourado hover:bg-yellow-500 text-preto"
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
        </>
    );
};

export default ProductCatalog;
