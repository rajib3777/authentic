import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus } from 'lucide-react'
import { useProducts } from '@/services/api/productQueries'
import { Card } from '@/components/ui/Card'

interface VisualizerSidebarProps {
    onAdd: (product: any) => void
}

export const VisualizerSidebar = ({ onAdd }: VisualizerSidebarProps) => {
    const { data: products } = useProducts()
    const [searchTerm, setSearchTerm] = useState('')

    const filtered = products?.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full bg-white rounded-[32px] border border-brand-dark/5 shadow-soft p-6">
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/20" size={16} />
                <input
                    type="text"
                    placeholder="SEARCH ASSETS"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-cream/50 border-none rounded-2xl py-3 pl-12 pr-4 text-[10px] tracking-widest font-bold focus:ring-0"
                />
            </div>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                    {filtered?.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => onAdd(product)}
                            className="group relative aspect-square rounded-2xl bg-brand-cream flex flex-col items-center justify-center transition-all hover:bg-brand-beige"
                        >
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                <Plus size={20} className="text-brand-dark" />
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                                <p className="truncate text-[8px] tracking-[0.1em] uppercase opacity-40 text-center">{product.name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
