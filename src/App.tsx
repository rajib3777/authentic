import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import { queryClient } from './services/api/queryClient'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { CartDrawer } from './features/cart/CartDrawer'
import { Toaster } from 'react-hot-toast'

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'))
const Shop = React.lazy(() => import('./pages/Shop'))
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'))
const Cart = React.lazy(() => import('./pages/Cart'))
const Checkout = React.lazy(() => import('./pages/Checkout'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Account = React.lazy(() => import('./pages/Account'))
const RoomVisualizer = React.lazy(() => import('./pages/RoomVisualizer'))
const About = React.lazy(() => import('./pages/About'))

const AppContent = () => {
    const location = useLocation()

    return (
        <div className="flex flex-col min-h-screen bg-brand-cream">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">
                <AnimatePresence mode="wait">
                    <React.Suspense
                        fallback={
                            <div className="h-screen w-full flex items-center justify-center bg-brand-cream text-brand-dark">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin" />
                                    <p className="font-outfit text-sm tracking-widest uppercase opacity-40">Authentic</p>
                                </div>
                            </div>
                        }
                    >
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/room-visualizer" element={<RoomVisualizer />} />
                            <Route path="/about" element={<About />} />
                            <Route path="*" element={<div className="h-[60vh] flex items-center justify-center">Page Not Found</div>} />
                        </Routes>
                    </React.Suspense>
                </AnimatePresence>
            </main>
            <Footer />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#1A1110',
                        color: '#F7F3EA',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontFamily: 'Outfit, sans-serif'
                    }
                }}
            />
        </div>
    )
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <ScrollToTop />
                <AppContent />
            </Router>
        </QueryClientProvider>
    )
}

export default App
