import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Price } from '@/components/ui/Price'
import { Button } from '@/components/ui/Button'
import { useProducts, useGetCategories } from '@/services/api/productQueries'
import { PageTransition } from '@/components/layout/PageTransition'
import { Link } from 'react-router-dom'
import { transitions } from '@/utils/animations'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'

const Shop = () => {
    const { data: products, isLoading } = useProducts()
    const { data: categories } = useGetCategories()
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [searchQuery, setSearchQuery] = useState('')
    const { addItem } = useCartStore()

    const filteredProducts = products?.filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    }) || []

    const handleQuickAdd = (product: any) => {
        addItem(product)
        toast.success(`${product.name} added to your curated bag`, {
            style: {
                borderRadius: '16px',
                background: '#4A3728',
                color: '#F7F3EA',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
            }
        })
    }

    return (
        <PageTransition>
            <section className="pt-40 pb-32 bg-brand-cream min-h-screen">
                <Container>
                    {/* Header */}
                    <div className="mb-20 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-7xl font-outfit font-light mb-6"
                        >
                            The Catalog
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-brand-dark/40 tracking-widest uppercase text-[10px]"
                        >
                            Explore our curated series of luxury furniture
                        </motion.p>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 pb-8 border-b border-brand-dark/5">
                        <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth justify-start md:justify-start gap-8 pb-4 md:pb-0">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`text-[11px] tracking-[0.3em] uppercase font-bold transition-all whitespace-nowrap ${selectedCategory === 'All' ? 'text-brand-dark' : 'text-brand-dark/30 hover:text-brand-dark'
                                    }`}
                            >
                                All
                            </button>
                            {categories?.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`text-[11px] tracking-[0.3em] uppercase font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? 'text-brand-dark' : 'text-brand-dark/30 hover:text-brand-dark'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-dark/20" size={16} />
                            <input
                                type="text"
                                placeholder="SEARCH"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-2 pl-8 pr-4 text-xs tracking-widest text-brand-dark placeholder:text-brand-dark/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        <AnimatePresence mode="popLayout">
                            {isLoading
                                ? Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-[4/5] bg-brand-beige/50 rounded-[40px] mb-6" />
                                        <div className="h-4 w-1/2 bg-brand-beige/50 rounded mb-2" />
                                        <div className="h-4 w-1/4 bg-brand-beige/50 rounded" />
                                    </div>
                                ))
                                : filteredProducts.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ ...transitions, delay: (i % 4) * 0.1 }}
                                    >
                                        <Link to={`/product/${product.id}`} className="group block">
                                            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-6 shadow-soft group-hover:shadow-luxury transition-all duration-700">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                                {product.isNew && (
                                                    <div className="absolute top-6 left-6">
                                                        <span className="text-[9px] tracking-[0.3em] uppercase bg-white/40 backdrop-blur-md px-3 py-1 rounded-full font-bold">New</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-brand-dark/40 to-transparent">
                                                    <Button
                                                        className="w-full h-11 bg-white/40 backdrop-blur-md text-black border-none font-bold text-[10px]"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            handleQuickAdd(product)
                                                        }}
                                                    >
                                                        Quick Add
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-brand-dark/30 text-[9px] uppercase tracking-[0.4em] mb-1">
                                                    {product.category}
                                                </span>
                                                <h3 className="text-base font-outfit text-brand-dark mb-2 group-hover:text-brand-brown transition-colors">
                                                    {product.name}
                                                </h3>
                                                <Price amount={product.price} className="text-sm font-bold text-black" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {!isLoading && filteredProducts.length === 0 && (
                        <div className="py-24 text-center">
                            <h3 className="text-2xl font-outfit font-light mb-4">No pieces found</h3>
                            <p className="text-brand-dark/40 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                                We couldn't find any objects matching your criteria. Try alternative filters.
                            </p>
                            <Button variant="ghost" className="border border-brand-dark/10" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </Container>
            </section>
        </PageTransition>
    )
}

export default Shop
