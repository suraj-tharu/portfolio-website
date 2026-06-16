import React from 'react';
import { motion } from 'framer-motion';
import { useMagneticButton } from '../hooks/useAdvancedInteractions';

/**
 * 3D Card Component (Suggestion #10)
 * Premium 3D perspective card transform effects
 */
interface Card3DProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
}

export const Card3D: React.FC<Card3DProps> = ({ children, className, intensity = 5 }) => {
    const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientY - rect.top) / rect.height - 0.5;
        const y = (e.clientX - rect.left) / rect.width - 0.5;

        setRotation({
            x: -x * intensity,
            y: y * intensity,
        });
    };

    return (
        <motion.div
            className={`${className} relative`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setRotation({ x: 0, y: 0 });
            }}
            style={{
                perspective: '1200px',
            }}
        >
            <motion.div
                animate={{
                    rotateX: isHovered ? rotation.x : 0,
                    rotateY: isHovered ? rotation.y : 0,
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 60 }}
                style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center',
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

/**
 * Premium Page Transition Component (Suggestion #3)
 * Smooth transitions with staggered animations
 */
interface PageTransitionProps {
    children: React.ReactNode;
    duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, duration = 0.6 }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        enter: {
            opacity: 1,
            transition: {
                duration,
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: { duration: duration / 2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        enter: {
            opacity: 1,
            y: 0,
            transition: { duration, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="enter"
            exit="exit"
            className="w-full"
        >
            <motion.div variants={itemVariants}>{children}</motion.div>
        </motion.div>
    );
};

/**
 * Animated Gradient Background Component (Suggestion #4)
 */
interface GradientBackgroundProps {
    colors?: string[];
    className?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    colors = ['#7B6EF6', '#EC4899', '#F59E0B'],
    className = '',
}) => {
    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`}>
            <motion.div
                animate={{
                    background: [
                        `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
                        `linear-gradient(225deg, ${colors[1]}, ${colors[2]}, ${colors[0]})`,
                        `linear-gradient(315deg, ${colors[2]}, ${colors[0]}, ${colors[1]})`,
                        `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
                    ],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="absolute inset-0 blur-3xl opacity-30"
            />
        </div>
    );
};

/**
 * Premium Magnetic Button (Suggestion #2)
 */
interface MagneticButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    onClick,
    className = '',
}) => {
    const { ref, position } = useMagneticButton();

    return (
        <motion.button
            ref={ref as any}
            onClick={onClick}
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                mass: 0.5,
            }}
            className={`relative px-6 py-3 rounded-full font-semibold transition-all ${className}`}
        >
            {children}
        </motion.button>
    );
};

/**
 * Advanced SVG Icon Animation Component (Suggestion #5)
 */
interface AnimatedIconProps {
    icon: React.ReactNode;
    animate?: boolean;
    className?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
    icon,
    animate = true,
    className = '',
}) => {
    return (
        <motion.div
            animate={animate ? { scale: [1, 1.1, 1] } : {}}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
            }}
            className={className}
        >
            {icon}
        </motion.div>
    );
};

/**
 * Micro-interactions Library (Suggestion #9)
 * Reusable subtle animations
 */
export const microInteractions = {
    // Hover scale effect
    hoverScale: {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { type: 'spring', stiffness: 400, damping: 17 },
    },

    // Hover lift effect
    hoverLift: {
        whileHover: { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
        transition: { type: 'spring', stiffness: 400, damping: 17 },
    },

    // Glow effect on hover
    hoverGlow: {
        whileHover: { boxShadow: '0 0 20px rgba(123, 110, 246, 0.5)' },
        transition: { duration: 0.3 },
    },

    // Pulse animation
    pulse: {
        animate: { scale: [1, 1.05, 1] },
        transition: { duration: 2, repeat: Infinity },
    },

    // Shimmer animation
    shimmer: {
        animate: { backgroundPosition: ['200% 0%', '-200% 0%'] },
        transition: { duration: 3, repeat: Infinity, ease: 'linear' },
    },

    // Bounce animation
    bounce: {
        animate: { y: [0, -10, 0] },
        transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
    },

    // Floating animation
    floating: {
        animate: { y: [0, -20, 0] },
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },

    // Gradient shift
    gradientShift: {
        animate: { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] },
        transition: { duration: 6, repeat: Infinity, ease: 'linear' },
    },
};
