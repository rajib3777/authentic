import React from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { PageTransition } from '@/components/layout/PageTransition'
import { Scissors, Hammer, Palette, Feather } from 'lucide-react'

const About = () => {
    return (
        <PageTransition>
            <div className="bg-brand-cream min-h-screen">
                {/* Hero Section */}
                <section className="pt-48 pb-32 overflow-hidden">
                    <Container>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
                            className="max-w-4xl"
                        >
                            <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-black/40 mb-8 block">Our Essence</span>
                            <h1 className="text-5xl md:text-8xl font-outfit font-light tracking-tight leading-[1.1] text-black mb-12">
                                Where Space Meets <br />
                                <span className="italic">Soul.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-black/60 font-outfit font-light leading-relaxed max-w-2xl">
                                Authentic was born from a simple observation: the objects we surround ourselves with define the quality of our quietest moments.
                            </p>
                        </motion.div>
                    </Container>
                </section>

                {/* Heritage Section */}
                <section className="py-32 border-t border-black/5">
                    <Container>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className="order-2 lg:order-1"
                            >
                                <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-luxury bg-brand-beige">
                                    <img
                                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                                        alt="Master craftsman at work"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
                                    />
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className="order-1 lg:order-2 space-y-10"
                            >
                                <h2 className="text-4xl md:text-5xl font-outfit font-light text-black">A Legacy of <br />Precision</h2>
                                <p className="text-black/50 leading-loose text-lg font-outfit font-light">
                                    Founded in 2024, our journey began in a small workshop where we obsessed over the curve of a chair leg and the grain of sustainably sourced oak. We believe that furniture shouldn't just fill a room; it should anchor it.
                                </p>
                                <div className="grid grid-cols-2 gap-12 pt-8">
                                    <div className="space-y-4">
                                        <div className="text-3xl font-outfit font-light text-black">100%</div>
                                        <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">Hand-finished</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-3xl font-outfit font-light text-black">Zero</div>
                                        <div className="text-[10px] uppercase tracking-widest font-bold text-black/40">Compromise</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </Container>
                </section>

                {/* Craftsmanship Section */}
                <section className="py-32 bg-white rounded-[100px] shadow-soft -mx-4 lg:-mx-20 px-4 lg:px-20 relative z-10">
                    <Container>
                        <div className="text-center max-w-2xl mx-auto mb-24">
                            <h2 className="text-4xl md:text-6xl font-outfit font-light text-black mb-8">The Craft of Quiet</h2>
                            <p className="text-black/40 italic">We study the dialogue between materials and human form.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { icon: Scissors, title: 'Textile Mastery', desc: 'Hand-picked fabrics from the finest European mills.' },
                                { icon: Hammer, title: 'Structural Integrity', desc: 'Japanese joinery techniques that stand the test of time.' },
                                { icon: Palette, title: 'Color Theory', desc: 'Curated palettes designed to soothe the subconscious.' },
                                { icon: Feather, title: 'Ergonomic Grace', desc: 'Designed to support the body, not just the space.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-10 bg-brand-cream/50 rounded-[40px] border border-black/5 hover:border-black/20 transition-all group"
                                >
                                    <item.icon className="text-black/20 group-hover:text-black transition-colors mb-8" size={32} />
                                    <h3 className="text-lg font-bold text-black mb-4 uppercase tracking-widest text-[12px]">{item.title}</h3>
                                    <p className="text-sm text-black/40 leading-relaxed font-outfit">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Vision Section */}
                <section className="py-48 bg-brand-cream">
                    <Container>
                        <div className="relative rounded-[80px] overflow-hidden bg-brand-dark min-h-[600px] flex items-center justify-center p-12 text-center shadow-luxury">
                            <img
                                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200"
                                className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
                                alt="Modern interior vision"
                            />
                            <div className="relative z-10 max-w-3xl">
                                <h2 className="text-4xl md:text-7xl font-outfit font-light text-brand-cream mb-12">Designing for <br />the Centuries.</h2>
                                <p className="text-brand-cream/60 text-lg md:text-xl font-outfit leading-loose mb-12 italic">
                                    "Our vision is not to follow trends, but to create silence in a noisy world. Every piece we craft is a promise of permanence."
                                </p>
                                <div className="text-[10px] tracking-[0.4em] uppercase font-bold text-brand-cream/40">— The Founders</div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Contact CTA */}
                <section className="py-32 text-center pb-64">
                    <Container>
                        <h2 className="text-3xl font-outfit font-light mb-12 text-black/40">Want to discuss a project?</h2>
                        <a href="mailto:concierge@authentic.com" className="text-4xl md:text-6xl font-outfit font-light text-black hover:italic transition-all duration-500 underline decoration-[1px] underline-offset-[20px] decoration-black/10 hover:decoration-black">
                            concierge@authentic.com
                        </a>
                    </Container>
                </section>
            </div>
        </PageTransition>
    )
}

export default About
