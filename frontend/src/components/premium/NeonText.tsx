// NeonText - Text with premium neon glow effects
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface NeonTextProps {
    children: ReactNode;
    color?: string;
    glow?: boolean;
    className?: string;
    animate?: boolean;
    animationDuration?: number;
}

export const NeonText = ({
    children,
    color = "#D4AF37",
    glow = true,
    className = "",
    animate = true,
    animationDuration = 2
}: NeonTextProps) => {
    return (
        <motion.span
            className={`relative inline-block ${className}`}
            animate={animate ? {
                textShadow: [
                    `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
                    `0 0 20px ${color}, 0 0 30px ${color}, 0 0 50px ${color}`,
                    `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`
                ]
            } : {}}
            transition={animate ? {
                duration: animationDuration,
                repeat: Infinity,
                ease: "easeInOut"
            } : {}}
            style={{
                color: color,
                textShadow: glow ? `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}` : 'none'
            }}
        >
            {children}
        </motion.span>
    );
};

// Neon Border component
interface NeonBorderProps {
    children: ReactNode;
    color?: string;
    thickness?: number;
    className?: string;
    animate?: boolean;
}

export const NeonBorder = ({
    children,
    color = "#D4AF37",
    thickness = 2,
    className = "",
    animate = true
}: NeonBorderProps) => {
    return (
        <motion.div
            className={`relative ${className}`}
            animate={animate ? {
                boxShadow: [
                    `0 0 10px ${color}, inset 0 0 10px ${color}`,
                    `0 0 20px ${color}, inset 0 0 20px ${color}`,
                    `0 0 10px ${color}, inset 0 0 10px ${color}`
                ]
            } : {}}
            transition={animate ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            } : {}}
            style={{
                border: `${thickness}px solid ${color}`,
                boxShadow: `0 0 10px ${color}, inset 0 0 10px ${color}`
            }}
        >
            {children}
        </motion.div>
    );
};
