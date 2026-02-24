import React from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBag, ArrowDown, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Price } from '@/components/ui/Price'
import { useProducts } from '@/services/api/productQueries'
import { PageTransition } from '@/components/layout/PageTransition'
import { fadeInUp, transitions, staggerContainer } from '@/utils/animations'

const Home = () => {
    const [openFaq, setOpenFaq] = React.useState<number | null>(0)
    const { data: products } = useProducts()
    const featured = products?.filter(p => p.isFeatured).slice(0, 3) || []
    const { scrollYProgress } = useScroll()
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

    return (
        <PageTransition>
            {/* Hero Section */}
            <section className="relative h-screen bg-brand-cream overflow-hidden">
                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative h-full flex items-center justify-center pt-24"
                >
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000"
                            alt="Hero Furniture"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-brand-cream/20" />
                    </div>

                    <Container className="relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-4xl mx-auto"
                        >
                            <h1 className="text-4xl sm:text-6xl md:text-8xl font-outfit font-light tracking-tight leading-[1.2] md:leading-[1.1] mb-8 md:mb-12 text-brand-dark px-4">
                                Furniture That Feels <br />
                                <span className="italic font-normal">Like Home</span>
                            </h1>
                            <Link to="/shop">
                                <Button variant="primary" size="lg" className="px-12 py-6 text-sm tracking-widest uppercase rounded-full">
                                    Explore
                                </Button>
                            </Link>
                        </motion.div>
                    </Container>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-brand-dark/30"
                    >
                        <span className="text-[10px] tracking-[0.5em] uppercase">Scroll</span>
                        <ArrowDown size={14} className="animate-bounce" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Featured Collections */}
            <section className="py-32 bg-brand-cream">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={transitions}
                        >
                            <div className="relative aspect-[4/5] rounded-arch overflow-hidden shadow-luxury">
                                <img
                                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1000"
                                    alt="Furniture Detail"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={transitions}
                            className="pl-0 lg:pl-12"
                        >
                            <span className="text-brand-dark/30 text-[10px] tracking-[0.4em] uppercase mb-4 block">Collection 01</span>
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-outfit font-light mb-6 md:mb-8 text-brand-dark leading-tight">
                                Defined by Precision. <br />
                                Designed to Impress.
                            </h2>
                            <p className="text-brand-dark/50 text-base leading-relaxed mb-10 max-w-md">
                                Each piece in our signature collection is a dialogue between craftsmanship and modern aesthetics.
                            </p>
                            <Link to="/shop">
                                <Button variant="ghost" className="p-0 border-b border-brand-dark tracking-widest uppercase text-xs">
                                    Discover More
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                        {featured.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ ...transitions, delay: i * 0.1 }}
                            >
                                <Link to={`/product/${product.id}`} className="group block">
                                    <div className="relative aspect-[10/12] rounded-[40px] overflow-hidden mb-6 shadow-soft">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                                        />
                                        <div className="absolute top-6 right-6">
                                            <div className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ShoppingBag size={18} className="text-brand-dark" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-1">{product.category}</p>
                                            <h3 className="text-lg font-outfit text-brand-dark">{product.name}</h3>
                                        </div>
                                        <Price amount={product.price} className="text-sm font-bold text-black" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Aesthetic Banner */}
            <section className="relative h-[80vh] bg-brand-dark flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2000"
                        alt="Bohemian Mood"
                        className="w-full h-full object-cover opacity-50 grayscale select-none"
                    />
                </div>
                <Container className="relative z-10 text-center text-black">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={transitions}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-outfit font-light italic mb-6 md:mb-8">Bohemian Lounge Sets</h2>
                        <p className="text-black/60 max-w-sm mx-auto mb-10">
                            Where soft textures meet geometric forms to create an atmosphere of effortless luxury.
                        </p>
                        <Button variant="ghost" className="text-black border-black px-10">
                            View Set
                        </Button>
                    </motion.div>
                </Container>
            </section>

            {/* Reviews Section */}
            <section className="py-32 bg-brand-cream overflow-hidden">
                <Container>
                    <div className="text-center mb-20">
                        <span className="text-brand-dark/30 text-[10px] tracking-[0.4em] uppercase mb-4 block">Testimonials</span>
                        <h2 className="text-4xl md:text-6xl font-outfit font-light text-brand-dark">Voices of Comfort</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                name: "Elena Rossi",
                                role: "Interior Designer",
                                text: "The craftsmanship is unparalleled. Each piece feels like a sculpture that happens to be a chair.",
                                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
                            },
                            {
                                name: "Marcus Thorne",
                                role: "Architect",
                                text: "Authentic has redefined what modern luxury means to me. Pure, honest, and incredibly comfortable.",
                                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                            },
                            {
                                name: "Sarah Jenkins",
                                role: "Homeowner",
                                text: "My living room finally feels complete. The customer service was as premium as the furniture itself.",
                                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
                            }
                        ].map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ ...transitions, delay: i * 0.2 }}
                                className="bg-white/50 backdrop-blur-sm p-10 rounded-[40px] shadow-soft border border-brand-dark/5"
                            >
                                <div className="flex items-center gap-1 mb-6 text-brand-dark/20">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-brand-dark text-lg font-outfit font-light mb-8 italic">"{review.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden grayscale">
                                        <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-brand-dark uppercase tracking-widest">{review.name}</h4>
                                        <p className="text-[10px] text-brand-dark/40 uppercase tracking-[0.2em]">{review.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* FAQ Section */}
            <section className="py-32 bg-brand-cream">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-20">
                            <span className="text-brand-dark/30 text-[10px] tracking-[0.4em] uppercase mb-4 block">Assistance</span>
                            <h2 className="text-4xl md:text-5xl font-outfit font-light text-brand-dark">Common Enquiries</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    q: "What is your delivery timeframe?",
                                    a: "Our white-glove delivery service typically takes 2-4 weeks. Each piece is meticulously inspected before dispatch to ensure it meets our exacting standards."
                                },
                                {
                                    q: "Do you offer international shipping?",
                                    a: "Yes, we facilitate international delivery to over 40 countries. Shipping costs and timelines vary by destination and item dimensions."
                                },
                                {
                                    q: "What is your return policy?",
                                    a: "We offer a 30-day curated return policy. If a piece does not resonate with your space, our team will coordinate a seamless collection."
                                },
                                {
                                    q: "Are the materials ethically sourced?",
                                    a: "Sustainability is core to our philosophy. We partner with FSC-certified suppliers and use non-toxic, eco-friendly finishes on all our timber products."
                                }
                            ].map((faq, i) => (
                                <div
                                    key={i}
                                    className={`rounded-[32px] overflow-hidden border transition-all duration-500 ${openFaq === i ? 'bg-white border-brand-dark/10 shadow-luxury' : 'bg-white/60 border-black/5 hover:bg-white hover:shadow-soft'}`}
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full px-8 py-8 flex items-center justify-between text-left group"
                                    >
                                        <span className={`text-lg font-outfit font-light transition-colors ${openFaq === i ? 'text-brand-dark' : 'text-brand-dark/60 group-hover:text-brand-dark'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`transition-transform duration-500 ${openFaq === i ? 'rotate-180 text-brand-dark' : 'text-brand-dark/20'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <div className="px-8 pb-8 text-brand-dark/50 text-base leading-relaxed max-w-2xl font-light">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Footer Branding */}
            <section className="py-40 bg-brand-cream flex items-center justify-center">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="text-6xl sm:text-8xl md:text-[180px] font-outfit font-bold tracking-tight text-black select-none whitespace-nowrap opacity-[0.08] lg:opacity-[0.05]"
                >
                    Authentic
                </motion.h2>
            </section>
        </PageTransition>
    )
}

export default Home
