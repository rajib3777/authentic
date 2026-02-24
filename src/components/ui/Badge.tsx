import React from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
    className?: string
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'destructive'
}

export const Badge = ({ className, children, variant = 'primary' }: BadgeProps) => {
    const variants = {
        primary: 'bg-brand-blue/20 text-brand-blue border-brand-blue/20',
        secondary: 'bg-black/10 text-black/80 border-black/10',
        outline: 'bg-transparent text-black/80 border-black/20',
        success: 'bg-green-500/20 text-green-400 border-green-500/20',
        destructive: 'bg-red-500/20 text-red-400 border-red-500/20',
    }

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    )
}
