import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface CardProps {
    className?: string
    children?: React.ReactNode
    delay?: number
    hover?: boolean
}

export const Card = ({ className, children, delay = 0, hover = true }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                'bg-white rounded-[40px] overflow-hidden transition-all duration-500',
                hover && 'hover:shadow-luxury hover:-translate-y-1',
                className
            )}
        >
            {children}
        </motion.div>
    )
}
