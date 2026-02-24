import React from 'react'
import { cn } from '@/utils/cn'

interface PriceProps {
    amount: number
    originalAmount?: number
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Price = ({ amount, originalAmount, className, size = 'md' }: PriceProps) => {
    const formattedAmount = new Intl.NumberFormat('bn-BD', {
        style: 'currency',
        currency: 'BDT',
        currencyDisplay: 'narrowSymbol',
    }).format(amount)

    const formattedOriginalAmount = originalAmount
        ? new Intl.NumberFormat('bn-BD', {
            style: 'currency',
            currency: 'BDT',
            currencyDisplay: 'narrowSymbol',
        }).format(originalAmount)
        : null

    const sizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-xl',
        xl: 'text-2xl',
    }

    return (
        <div className={cn('flex items-baseline gap-2', className)}>
            <span className={cn('font-bold text-black', sizes[size])}>
                {formattedAmount}
            </span>
            {formattedOriginalAmount && (
                <span className="text-black/40 line-through text-sm">
                    {formattedOriginalAmount}
                </span>
            )}
        </div>
    )
}
