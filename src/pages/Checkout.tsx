import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, CreditCard, Truck, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Price } from '@/components/ui/Price'
import { useCartStore } from '@/store/cartStore'
import { useOrderStore } from '@/store/orderStore'
import { useAuthStore } from '@/store/authStore'
import { PageTransition } from '@/components/layout/PageTransition'
import { Order } from '@/types'

const Checkout = () => {
    const { items, getTotal, clearCart } = useCartStore()
    const addOrder = useOrderStore((state) => state.addOrder)
    const user = useAuthStore((state) => state.user)
    const [step, setStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash' | 'nagad' | 'rocket'>('card')
    const navigate = useNavigate()

    const handleComplete = () => {
        // Save order to store
        if (user) {
            const newOrder: Order = {
                id: Math.random().toString(36).substr(2, 9).toUpperCase(),
                userId: user.id,
                items: [...items],
                total: getTotal(),
                status: 'processing',
                createdAt: new Date().toISOString(),
                address: {
                    street: 'Signature Way 123',
                    city: 'Dhaka',
                    state: 'Dhaka',
                    zip: '1212',
                    country: 'Bangladesh'
                }
            }
            addOrder(newOrder)
        }

        setStep(3)
        clearCart()
        window.scrollTo(0, 0)
    }

    if (items.length === 0 && step < 3) {
        return (
            <Container className="py-40 text-center">
                <h2 className="text-3xl font-outfit font-light mb-8">Your bag is empty</h2>
                <Link to="/shop">
                    <Button>Start Shopping</Button>
                </Link>
            </Container>
        )
    }

    return (
        <PageTransition>
            <section className="pt-40 pb-32 bg-brand-cream min-h-screen">
                <Container>
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-4 text-black/20 text-[10px] tracking-[0.3em] font-bold uppercase mb-16 justify-center">
                        <span className={step >= 1 ? 'text-black' : ''}>Shipping</span>
                        <ChevronRight size={12} />
                        <span className={step >= 2 ? 'text-black' : ''}>Payment</span>
                        <ChevronRight size={12} />
                        <span className={step >= 3 ? 'text-black' : ''}>Confirmation</span>
                    </div>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-12"
                                    >
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-outfit font-light mb-4 text-brand-dark">Shipping Information</h2>
                                            <p className="text-brand-dark/60 text-[11px] tracking-[0.1em] font-medium leading-loose max-w-md">
                                                Please provide your delivery details below. Our white-glove service ensures your pieces arrive in pristine condition.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="First Name" placeholder="e.g. John" />
                                            <Input label="Last Name" placeholder="e.g. Doe" />
                                            <Input label="Email Address" type="email" placeholder="john@authentic.com" className="md:col-span-2" />
                                            <Input label="Delivery Address" placeholder="123 Signature Way" className="md:col-span-2" />
                                            <Input label="City" placeholder="San Francisco" />
                                            <Input label="State" placeholder="California" />
                                            <Input label="ZIP Code" placeholder="94103" />
                                            <Input label="Country" placeholder="United States" />
                                        </div>
                                        <div className="pt-8">
                                            <Button size="lg" className="px-12 h-14 rounded-2xl gap-3" onClick={() => setStep(2)}>
                                                Proceed to Payment <ArrowRight size={18} className="opacity-40" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-12"
                                    >
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-outfit font-light mb-4 text-brand-dark">Payment</h2>
                                            <p className="text-brand-dark/40 text-[10px] tracking-[0.2em] uppercase">Encrypted secure checkout</p>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Payment Method Selector */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                                {[
                                                    { id: 'card', label: 'Card', icon: <CreditCard size={18} /> },
                                                    { id: 'bkash', label: 'bKash', color: 'bg-[#D12053]' },
                                                    { id: 'nagad', label: 'Nagad', color: 'bg-[#F7941D]' },
                                                    { id: 'rocket', label: 'Rocket', color: 'bg-[#8C3494]' }
                                                ].map((method) => (
                                                    <button
                                                        key={method.id}
                                                        onClick={() => setPaymentMethod(method.id as any)}
                                                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${paymentMethod === method.id
                                                            ? 'border-brand-brown bg-brand-brown/5'
                                                            : 'border-brand-dark/5 bg-white/50 hover:border-brand-dark/20'
                                                            }`}
                                                    >
                                                        {method.icon ? (
                                                            <div className="text-brand-dark">{method.icon}</div>
                                                        ) : (
                                                            <div className={`w-8 h-8 rounded-full ${method.color} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                                                                {method.label[0]}
                                                            </div>
                                                        )}
                                                        <span className="text-[10px] uppercase tracking-widest font-bold text-black">{method.label}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="p-8 rounded-[32px] bg-brand-beige/30 border border-brand-dark/5">
                                                <AnimatePresence mode="wait">
                                                    {paymentMethod === 'card' ? (
                                                        <motion.div
                                                            key="card-form"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                                        >
                                                            <Input label="Cardholder Name" placeholder="John Doe" className="md:col-span-2" />
                                                            <Input label="Card Number" placeholder="•••• •••• •••• ••••" className="md:col-span-2" />
                                                            <Input label="Expiry Date" placeholder="MM / YY" />
                                                            <Input label="CVC" placeholder="•••" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="mfs-form"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="space-y-6"
                                                        >
                                                            <div className="flex items-center gap-4 mb-4">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg ${paymentMethod === 'bkash' ? 'bg-[#D12053]' :
                                                                    paymentMethod === 'nagad' ? 'bg-[#F7941D]' : 'bg-[#8C3494]'
                                                                    }`}>
                                                                    {paymentMethod === 'bkash' ? 'b' : paymentMethod === 'nagad' ? 'N' : 'R'}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-outfit text-brand-dark capitalize">{paymentMethod} Payment</h4>
                                                                    <p className="text-[10px] uppercase tracking-widest opacity-40">Fast, secure local payment</p>
                                                                </div>
                                                            </div>
                                                            <Input label="Personal Wallet Number" placeholder="01XXX-XXXXXX" />
                                                            <p className="text-[10px] text-brand-dark/40 italic pl-1">
                                                                You will receive a notification to enter your PIN after clicking 'Complete Order'.
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                                            <Button variant="ghost" className="px-10 h-14 font-bold border border-brand-dark/5 rounded-2xl uppercase tracking-widest" onClick={() => setStep(1)}>
                                                Back
                                            </Button>
                                            <Button size="lg" className="px-12 h-14 rounded-2xl gap-3 flex-grow sm:flex-grow-0" onClick={handleComplete}>
                                                Complete Order <ShieldCheck size={18} className="opacity-40" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-24 h-24 bg-black text-brand-cream rounded-full flex items-center justify-center mx-auto mb-10 shadow-luxury">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h2 className="text-3xl sm:text-5xl font-outfit font-light mb-6">Order Reserved</h2>
                                        <p className="text-brand-dark/40 mb-12 max-w-sm mx-auto leading-relaxed italic">
                                            Thank you for choosing Authentic. Your order #94215 has been successfully placed. You will receive a confirmation email within minutes.
                                        </p>

                                        {/* Cross-sell on confirmation */}
                                        <div className="mt-16 pt-16 border-t border-brand-dark/5">
                                            <h3 className="text-sm tracking-[0.3em] uppercase opacity-40 mb-10 font-bold">Complete your space</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                                {/* Recommended Items */}
                                                <div className="group cursor-pointer" onClick={() => navigate('/shop')}>
                                                    <div className="aspect-[4/5] rounded-3xl bg-brand-beige overflow-hidden mb-4 shadow-soft">
                                                        <img src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                                    </div>
                                                    <p className="text-[10px] tracking-widest uppercase font-bold opacity-40">Lighting</p>
                                                </div>
                                                <div className="group cursor-pointer" onClick={() => navigate('/shop')}>
                                                    <div className="aspect-[4/5] rounded-3xl bg-brand-beige overflow-hidden mb-4 shadow-soft">
                                                        <img src="https://images.unsplash.com/photo-1583847268964-b28cd8e5abd1?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                                    </div>
                                                    <p className="text-[10px] tracking-widest uppercase font-bold opacity-40">Decor</p>
                                                </div>
                                                <div className="group cursor-pointer" onClick={() => navigate('/shop')}>
                                                    <div className="aspect-[4/5] rounded-3xl bg-brand-beige overflow-hidden mb-4 shadow-soft">
                                                        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                                    </div>
                                                    <p className="text-[10px] tracking-widest uppercase font-bold opacity-40">Storage</p>
                                                </div>
                                                <div className="group cursor-pointer" onClick={() => navigate('/shop')}>
                                                    <div className="aspect-[4/5] rounded-3xl bg-brand-beige overflow-hidden mb-4 shadow-soft">
                                                        <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                                    </div>
                                                    <p className="text-[10px] tracking-widest uppercase font-bold opacity-40">Bedding</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to="/shop">
                                            <Button size="lg" className="px-12 rounded-2xl h-14 tracking-[0.2em]">Continue Exploring</Button>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Side Summary */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[40px] p-8 shadow-soft lg:sticky lg:top-32">
                                <h3 className="text-lg font-outfit font-light mb-8">Order Overview</h3>
                                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-20 rounded-2xl bg-brand-cream overflow-hidden shrink-0 shadow-soft">
                                                <img
                                                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1583847268964-b28cd8e5abd1?auto=format&fit=crop&q=80&w=200'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-xs font-bold uppercase tracking-widest text-black truncate">{item.name}</div>
                                                <div className="text-[10px] opacity-40 mt-1 uppercase tracking-widest font-bold">Qty {item.quantity}</div>
                                            </div>
                                            <div className="text-sm font-light">
                                                <Price amount={item.price * item.quantity} size="sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 pt-6 border-t border-brand-dark/5">
                                    <div className="flex justify-between text-xs opacity-40 font-bold uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <Price amount={getTotal()} size="sm" />
                                    </div>
                                    <div className="flex justify-between text-xs opacity-40 font-bold uppercase tracking-widest">
                                        <span>Delivery</span>
                                        <span className="text-green-600 font-bold">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between text-brand-dark font-outfit text-xl pt-6">
                                        <span>Total</span>
                                        <Price amount={getTotal()} className="font-bold text-black" />
                                    </div>
                                </div>
                                <div className="mt-8 p-4 bg-brand-cream/50 rounded-2xl flex items-center gap-4 border border-brand-dark/5">
                                    <ShieldCheck className="text-brand-dark/20" size={24} />
                                    <p className="text-[9px] uppercase tracking-widest opacity-40 leading-relaxed font-bold">
                                        Authenticated & Insured <br /> Luxury Shipping
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </PageTransition>
    )
}

export default Checkout
