import { cn } from '@/utils/cn'

interface SkeletonProps {
    className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-white/5',
                className
            )}
        />
    )
}
