import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from './Container'

const FOOTER_LINKS = {
    Shop: [
        { name: 'All Collections', path: '/shop' },
        { name: 'New Arrivals', path: '/shop?filter=new' },
        { name: 'Best Sellers', path: '/shop?filter=best' },
    ],
    Brand: [
        { name: 'Our Story', path: '/about' },
        { name: 'Authentic Ethics', path: '/ethics' },
        { name: 'Careers', path: '/careers' },
    ],
    Service: [
        { name: 'Delivery', path: '/delivery' },
        { name: 'Returns', path: '/returns' },
        { name: 'Contact', path: '/contact' },
    ],
}

export const Footer = () => {
    return (
        <footer className="bg-brand-cream text-black border-t border-brand-dark/5 pt-24 pb-12">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                    <div className="md:col-span-4">
                        <Link to="/" className="text-3xl font-outfit font-light tracking-[0.4em] uppercase mb-8 block">
                            Authentic
                        </Link>
                        <p className="text-black/50 max-w-xs mb-10 leading-relaxed">
                            Crafting pieces that transcend trends, focusing on the dialogue between space and objects.
                        </p>
                        <div className="flex gap-4">
                            {/* Newsletter Small */}
                            <div className="flex-1 border-b border-brand-dark/20 py-2 flex items-center gap-4">
                                <input
                                    type="email"
                                    placeholder="Newsletter"
                                    className="bg-transparent text-sm tracking-widest focus:outline-none w-full"
                                />
                                <button className="text-[10px] uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity">Submit</button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                                <div key={title}>
                                    <h4 className="text-[10px] tracking-[0.4em] font-bold uppercase mb-8 opacity-40">{title}</h4>
                                    <ul className="space-y-4">
                                        {links.map((link) => (
                                            <li key={link.name}>
                                                <Link to={link.path} className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <div>
                                <h4 className="text-[10px] tracking-[0.4em] font-bold uppercase mb-8 opacity-40">Social</h4>
                                <ul className="space-y-4">
                                    {['Instagram', 'Pinterest', 'Twitter', 'Vimeo'].map((s) => (
                                        <li key={s}>
                                            <a href="#" className="text-sm opacity-60 hover:opacity-100 transition-opacity">{s}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-brand-dark/5 gap-8">
                    <p className="text-[10px] uppercase tracking-widest opacity-20">© 2026 Authentic Furniture. Crafted for Home.</p>
                    <div className="flex gap-8 text-[10px] uppercase tracking-widest opacity-40">
                        <a href="#" className="hover:opacity-100">Privacy Policy</a>
                        <a href="#" className="hover:opacity-100">Terms of Service</a>
                    </div>
                </div>
            </Container>
        </footer>
    )
}
