// Tooltip - Premium tooltip with smooth animations
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface TooltipProps {
    content: string | ReactNode;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

const positionClass = {
    top: '-top-12 left-1/2 -translate-x-1/2',
    bottom: 'top-12 left-1/2 -translate-x-1/2',
    left: 'right-full mr-3 top-1/2 -translate-y-1/2',
    right: 'left-full ml-3 top-1/2 -translate-y-1/2'
};

const arrowClass = {
    top: 'bottom-0 translate-y-full left-1/2 -translate-x-1/2',
    bottom: 'top-0 -translate-y-full left-1/2 -translate-x-1/2',
    left: 'right-0 translate-x-full top-1/2 -translate-y-1/2',
    right: 'left-0 -translate-x-full top-1/2 -translate-y-1/2'
};

export const Tooltip = ({
    content,
    children,
    position = 'top',
    delay = 0.2
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block group">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className={`absolute ${positionClass[position]} whitespace-nowrap z-50`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay }}
                    >
                        <div className="px-3 py-2 bg-[#D4AF37] text-black rounded-lg text-sm font-medium shadow-lg">
                            {content}
                            {/* Arrow */}
                            <div
                                className={`absolute ${arrowClass[position]} w-2 h-2 bg-[#D4AF37] transform rotate-45`}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
