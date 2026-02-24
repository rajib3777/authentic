import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, Menu, X, Search, Scissors } from 'lucide-react'
import { Container } from './Container'
import { Button } from '../ui/Button'
import { cn } from '@/utils/cn'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'

const NAV_LINKS = [
    { name: 'Shop', path: '/shop' },
    { name: 'Visualizer', path: '/room-visualizer' },
    { name: 'About', path: '/about' },
]

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()
    const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer)
    const itemCount = useCartStore((state) => state.getItemCount())

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6',
                isScrolled ? 'bg-brand-cream/80 backdrop-blur-xl border-b border-brand-dark/5 py-4' : 'bg-transparent'
            )}
        >
            <Container className="flex items-center justify-between">
                <button
                    className="lg:hidden p-2 -ml-2 text-brand-dark"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Desktop Links Left */}
                <div className="hidden lg:flex items-center gap-10">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                'text-[13px] font-medium tracking-widest uppercase transition-all duration-300 hover:text-brand-brown relative group',
                                location.pathname === link.path ? 'text-black' : 'text-black/40'
                            )}
                        >
                            {link.name}
                            <span className={cn(
                                'absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-dark transition-all duration-300 group-hover:w-full',
                                location.pathname === link.path && 'w-full'
                            )} />
                        </Link>
                    ))}
                </div>

                <Link
                    to="/"
                    className="absolute left-1/2 -translate-x-1/2 text-xl lg:text-2xl font-outfit font-light tracking-[0.3em] lg:tracking-[0.4em] uppercase text-brand-dark"
                >
                    Authentic
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:gap-6">
                    <button className="hidden lg:block p-2 text-brand-dark/60 hover:text-brand-dark transition-colors">
                        <Search size={20} />
                    </button>
                    <Link to="/account" className="hidden lg:block p-2 text-brand-dark/60 hover:text-brand-dark transition-colors">
                        <User size={20} />
                    </Link>
                    <button
                        onClick={toggleCartDrawer}
                        className="flex items-center gap-2 p-2 group"
                    >
                        <div className="relative">
                            <ShoppingBag size={20} className="text-brand-dark group-hover:scale-110 transition-transform" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-brand-cream text-[9px] flex items-center justify-center rounded-full font-bold">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                        <span className="hidden lg:block text-[13px] font-medium tracking-wider uppercase">Bag</span>
                    </button>
                </div>
            </Container>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-brand-cream border-b border-brand-dark/5"
                    >
                        <Container className="py-12 flex flex-col items-center gap-8">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-2xl font-outfit tracking-[0.2em] uppercase text-black"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="w-full border-brand-dark/10" />
                            <Link to="/account" className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                                Account
                            </Link>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
