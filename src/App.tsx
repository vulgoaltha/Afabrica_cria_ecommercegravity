import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/hooks/useCart';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
import HomePage from '@/pages/HomePage';
import ProductCatalog from '@/pages/ProductCatalog';
import ProductDetailPage from '@/pages/ProductDetailPage';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';
import QuoteForm from '@/pages/QuoteForm';
import SuccessPage from '@/pages/SuccessPage';

function App() {
    return (
        <CartProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ScrollToTop />
                <div className="min-h-screen bg-black text-white">
                    <Navigation />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/catalogo" element={<ProductCatalog />} />
                            <Route path="/catalogo/:category" element={<ProductCatalog />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            <Route path="/produto/:id" element={<ProductDetailPage />} />
                            <Route path="/carrinho" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/sobre" element={<About />} />
                            <Route path="/contato" element={<QuoteForm />} />
                            <Route path="/success" element={<SuccessPage />} />
                        </Routes>
                    </main>
                    <Footer />
                    <Toaster />
                    <WhatsAppButton />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;
