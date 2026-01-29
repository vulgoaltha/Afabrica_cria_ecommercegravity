import { getProduct, getProducts } from '@/api/EcommerceApi';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = await getProduct(params.id);

    if (!product) {
        return {
            title: 'Produto não encontrado | A Fabrica Cria',
        };
    }

    return {
        title: `${product.title} - A Fabrica Cria`,
        description: product.description?.substring(0, 160) || product.title,
        openGraph: {
            title: product.title,
            description: product.description?.substring(0, 160) || product.title,
            images: product.images,
        },
    };
}

export default async function Page({ params }: Props) {
    const product = await getProduct(params.id);

    return <ProductDetailClient product={product} />;
}

export async function generateStaticParams() {
    const { products } = await getProducts();
    return products.map((product) => ({
        id: product.id,
    }));
}
