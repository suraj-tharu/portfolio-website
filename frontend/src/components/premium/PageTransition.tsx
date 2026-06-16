// PageTransition - Smooth page transitions with reveal effect
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    duration?: number;
    className?: string;
}

export const PageTransition = ({ children, duration = 0.6, className = "" }: PageTransitionProps) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
                duration,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            {children}
        </motion.div>
    );
};

// Multi-layer page transition
export const AdvancedPageTransition = ({ children, duration = 0.8, className = "" }: PageTransitionProps) => {
    return (
        <motion.div className={className}>
            {/* Background layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: duration * 0.5 }}
            />

            {/* Content layer */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                    duration,
                    ease: [0.16, 1, 0.3, 1]
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
