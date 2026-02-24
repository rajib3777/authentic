import React from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-brand-dark/40 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-12 w-full rounded-xl border border-brand-dark/10 bg-white/50 px-4 py-2 text-sm text-brand-dark ring-offset-brand-cream file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-brand-dark/20 focus-visible:outline-none focus-visible:ring-brand-brown/20 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                        error && 'border-red-500/50 focus-visible:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-[9px] text-red-500 ml-1 uppercase tracking-wider">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
