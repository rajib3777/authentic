import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { useCartStore } from '@/store/cartStore'
import { PageTransition } from '@/components/layout/PageTransition'

const Cart = () => {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore()

    if (items.length === 0) {
        return (
            <PageTransition>
                <section className="pt-40 pb-32 bg-brand-cream min-h-[70vh] flex items-center justify-center">
                    <Container className="text-center">
                        <div className="w-24 h-24 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingBag size={40} className="text-brand-dark/20" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-outfit font-light mb-6">Your bag is empty</h2>
                        <p className="text-brand-dark/40 mb-10 tracking-widest uppercase text-[10px]">Find your next masterpiece in our catalog</p>
                        <Link to="/shop">
                            <Button size="lg" className="px-12">Return to Shop</Button>
                        </Link>
                    </Container>
                </section>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <section className="pt-40 pb-32 bg-brand-cream min-h-screen">
                <Container>
                    <h1 className="text-3xl sm:text-5xl font-outfit font-light mb-12 md:mb-16 px-2">Your Curated Bag</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8">
                            <div className="space-y-12">
                                {items.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-brand-dark/5">
                                        <div className="w-full sm:w-48 aspect-[4/5] rounded-[32px] overflow-hidden bg-brand-beige shadow-soft">
                                            <img
                                                src={item.images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-grow flex flex-col justify-between py-2">
                                            <div>
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                    <div>
                                                        <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-1">{item.category}</p>
                                                        <h3 className="text-xl sm:text-2xl font-outfit font-light text-brand-dark">{item.name}</h3>
                                                    </div>
                                                    <Price amount={item.price * item.quantity} className="text-lg sm:text-xl font-light" />
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    <span className="text-[10px] uppercase font-bold px-3 py-1 bg-brand-dark/5 rounded-full opacity-60">In Stock</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-brand-dark/10 rounded-full h-11 px-6 gap-6">
                                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="opacity-40 hover:opacity-100"><Minus size={14} /></button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="opacity-40 hover:opacity-100"><Plus size={14} /></button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-brand-dark/30 hover:text-red-500 transition-colors flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold"
                                                >
                                                    <Trash2 size={16} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[40px] p-8 sm:p-10 shadow-soft lg:sticky lg:top-32">
                                <h3 className="text-xl font-outfit font-light mb-8">Summary</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm opacity-60">
                                        <span>Subtotal</span>
                                        <Price amount={getTotal()} size="sm" />
                                    </div>
                                    <div className="flex justify-between text-sm opacity-60">
                                        <span>Delivery</span>
                                        <span className="text-green-600 uppercase tracking-widest text-[10px] font-bold">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between text-sm opacity-60">
                                        <span>Estimated Tax</span>
                                        <span className="">Calculated at checkout</span>
                                    </div>
                                </div>
                                <div className="border-t border-brand-dark/5 pt-6 mb-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm tracking-widest uppercase font-bold opacity-40">Total</span>
                                        <Price amount={getTotal()} className="text-3xl font-bold text-black" />
                                    </div>
                                </div>
                                <Link to="/checkout">
                                    <Button className="w-full h-14 tracking-[0.2em] rounded-2xl group">
                                        Checkout <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <p className="text-[10px] text-center mt-6 text-brand-dark/20 uppercase tracking-widest">
                                    Secure worldwide shipping included
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </PageTransition>
    )
}

export default Cart
