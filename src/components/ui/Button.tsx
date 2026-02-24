import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'glass'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-brand-beige text-black hover:bg-brand-sand shadow-luxury',
            secondary: 'bg-brand-beige text-brand-dark hover:bg-brand-sand',
            ghost: 'bg-transparent text-brand-dark hover:opacity-70 transition-opacity',
            glass: 'glass glass-hover text-brand-dark',
        }

        const sizes = {
            sm: 'px-4 py-2 text-[11px] tracking-widest uppercase',
            md: 'px-6 py-3 text-xs tracking-widest uppercase',
            lg: 'px-10 py-4 text-sm tracking-[0.2em] uppercase',
        }

        const buttonProps = props as any

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase whitespace-nowrap',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...buttonProps}
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {children}
            </motion.button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
