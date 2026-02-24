import React from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
    children: React.ReactNode
}

const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
}

export const PageTransition = ({ children }: PageTransitionProps) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    )
}
