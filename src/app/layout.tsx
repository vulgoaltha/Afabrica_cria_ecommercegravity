import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import '../index.css'
import { CartProvider } from '@/hooks/useCart'
import { Toaster } from '@/components/ui/toaster'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-poppins'
})

export const metadata: Metadata = {
    title: 'A Fabricah Cria | Ecommerce Premium',
    description: 'A maior fabrica de criatividade para o seu e-commerce. Produtos premium e exclusivos.',
    openGraph: {
        title: 'A Fabricah Cria',
        description: 'A maior fabrica de criatividade para o seu e-commerce.',
        images: ['/og-image.jpg'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
            <body className="min-h-screen bg-black text-white font-poppins antialiased">
                <CartProvider>
                    <Navigation />
                    <main>{children}</main>
                    <Footer />
                    <Toaster />
                    <WhatsAppButton />
                </CartProvider>
            </body>
        </html>
    )
}
