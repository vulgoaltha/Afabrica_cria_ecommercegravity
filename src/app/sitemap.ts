import { MetadataRoute } from 'next'
import { getProducts } from '@/api/EcommerceApi'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { products } = await getProducts()

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}`,
        lastModified: new Date(product.created_at),
        changeFrequency: 'weekly',
        priority: 0.7,
    }))

    return [
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/catalogo`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/sobre`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/contato`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...productEntries,
    ]
}
