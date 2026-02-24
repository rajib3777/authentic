import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronLeft, ChevronRight, Share2, Heart, Plus, Minus } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { Badge } from '@/components/ui/Badge'
import { useProduct } from '@/services/api/productQueries'
import { useCartStore } from '@/store/cartStore'
import { PageTransition } from '@/components/layout/PageTransition'
import { fadeInUp, transitions } from '@/utils/animations'
import { toast } from 'react-hot-toast'

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>()
    const { data: product, isLoading } = useProduct(id || '')
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const addItem = useCartStore((state) => state.addItem)
    const navigate = useNavigate()

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center bg-brand-cream">
            <div className="w-12 h-12 border-2 border-brand-dark/20 border-t-brand-dark rounded-full animate-spin" />
        </div>
    )

    if (!product) return (
        <div className="h-screen flex items-center justify-center bg-brand-cream font-outfit text-2xl">
            Object not found.
        </div>
    )

    const handleAddToCart = () => {
        addItem(product, quantity)
        toast.success(`${product.name} added to your bag`, {
            style: {
                borderRadius: '20px',
                background: '#4A3728',
                color: '#F7F3EA',
            }
        })
    }

    return (
        <PageTransition>
            <section className="pt-32 pb-24 bg-brand-cream min-h-screen">
                <Container>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity mb-12"
                    >
                        <ChevronLeft size={14} /> Back
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
                        {/* Gallery */}
                        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
                            {/* Thumbnails */}
                            <div className="order-2 md:order-1 flex md:flex-col gap-4">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-brand-brown' : 'border-transparent opacity-60'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="order-1 md:order-2 flex-grow">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-luxury"
                                >
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.isNew && (
                                        <div className="absolute top-8 left-8">
                                            <span className="text-[10px] tracking-[0.3em] uppercase bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full font-bold">Latest Edition</span>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="lg:col-span-5 flex flex-col py-6">
                            <div className="mb-0">
                                <span className="text-brand-dark/30 text-[10px] tracking-[0.5em] uppercase mb-4 block">
                                    {product.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-outfit font-light tracking-tight mb-6 text-brand-dark leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4 mb-10">
                                    <Price amount={product.price} className="text-3xl font-light scale-110 origin-left text-black" />
                                    {product.originalPrice && (
                                        <Price amount={product.originalPrice} className="text-lg text-brand-dark/20 line-through opacity-40" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div>
                                    <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold text-brand-dark/40 mb-4">Dimension</h4>
                                    <p className="text-brand-dark/60 text-sm font-medium">{product.dimensions}</p>
                                </div>

                                <div>
                                    <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold text-brand-dark/40 mb-4">Materials</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.materials?.map(m => (
                                            <span key={m} className="px-4 py-1.5 border border-brand-dark/5 rounded-full text-xs font-medium text-brand-dark/70">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-brand-dark/50 leading-relaxed text-base italic border-l-2 border-brand-brown/10 pl-6">
                                    {product.description}
                                </p>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center border border-brand-dark/10 rounded-full h-14 px-6 gap-8">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="opacity-40 hover:opacity-100"><Minus size={18} /></button>
                                        <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                                        <button onClick={() => setQuantity(q => q + 1)} className="opacity-40 hover:opacity-100"><Plus size={18} /></button>
                                    </div>
                                    <Button
                                        className="flex-grow h-14 text-sm tracking-widest gap-2"
                                        onClick={handleAddToCart}
                                    >
                                        Add to Bag <ChevronRight size={18} className="opacity-40" />
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center py-8 border-y border-brand-dark/5">
                                    <div className="flex gap-10">
                                        <button className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold opacity-40 hover:opacity-100 transition-opacity">
                                            <Share2 size={14} /> Share
                                        </button>
                                        <button className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold opacity-40 hover:opacity-100 transition-opacity">
                                            <Heart size={14} /> Save
                                        </button>
                                    </div>
                                    <Link to="/room-visualizer" className="text-[10px] tracking-[0.2em] font-bold text-brand-brown border-b border-brand-brown/30">
                                        Try in Visualizer
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Cross-sell Placeholder */}
            <section className="py-32 bg-brand-cream border-t border-brand-dark/5">
                <Container>
                    <h2 className="text-3xl font-outfit font-light mb-16 text-center">Complete the Room</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* 4 related products */}
                    </div>
                </Container>
            </section>
        </PageTransition>
    )
}

export default ProductDetail
