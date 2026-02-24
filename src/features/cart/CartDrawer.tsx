import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'

export const CartDrawer = () => {
    const { isCartDrawerOpen, setCartDrawerOpen } = useUIStore()
    const { items, removeItem, getTotal } = useCartStore()

    return (
        <AnimatePresence>
            {isCartDrawerOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartDrawerOpen(false)}
                        className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-cream border-l border-brand-dark/10 z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-brand-dark/5 flex items-center justify-between">
                            <h2 className="text-xl font-bold font-outfit text-black flex items-center gap-2">
                                <ShoppingBag size={20} />
                                Your Bag
                                <span className="bg-brand-dark text-brand-cream text-[10px] px-2 py-0.5 rounded-full ml-2">
                                    {items.length}
                                </span>
                            </h2>
                            <button
                                onClick={() => setCartDrawerOpen(false)}
                                className="p-2 text-black/40 hover:text-black transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <ShoppingBag size={48} className="mb-4" />
                                    <p>Your bag is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/5 border border-black/10 shrink-0">
                                            <img
                                                src={item.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=200'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between gap-2">
                                                <h4 className="text-sm font-medium text-black line-clamp-1">{item.name}</h4>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-black/20 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="text-xs text-black/40 mt-1">Qty: {item.quantity}</div>
                                            <div className="mt-2">
                                                <Price amount={item.price * item.quantity} size="sm" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-brand-dark/5 bg-brand-cream/50 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-black/40 text-sm">Subtotal</span>
                                    <Price amount={getTotal()} size="lg" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/cart" onClick={() => setCartDrawerOpen(false)} className="w-full">
                                        <Button variant="glass" className="w-full border border-black/10">View Cart</Button>
                                    </Link>
                                    <Link to="/checkout" onClick={() => setCartDrawerOpen(false)} className="w-full">
                                        <Button variant="primary" className="w-full">Checkout</Button>
                                    </Link>
                                </div>
                                <p className="text-[10px] text-black/20 text-center uppercase tracking-widest">
                                    Shipping & taxes calculated at checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
