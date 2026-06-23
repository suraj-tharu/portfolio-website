// MicroInteractionButton - Premium button with micro-interactions
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MicroInteractionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    glowColor?: string;
}

export const MicroInteractionButton = ({
    children,
    onClick,
    variant = 'primary',
    className = "",
    glowColor = "#D4AF37"
}: MicroInteractionButtonProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        
        x.set(xPct * 20); // Magnetic pull radius X
        y.set(yPct * 20); // Magnetic pull radius Y
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const baseClasses = "px-8 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden";

    const variantClasses = {
        primary: "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/40",
        secondary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/40",
        outline: "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50"
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{
                x: mouseXSpring,
                y: mouseYSpring,
                boxShadow: `0 0 30px ${glowColor}00`
            }}
            onHoverStart={() => {
                if (ref.current) {
                    ref.current.style.boxShadow = `0 0 30px ${glowColor}80, inset 0 0 20px ${glowColor}40`;
                }
            }}
            onHoverEnd={() => {
                if (ref.current) {
                    ref.current.style.boxShadow = `0 0 30px ${glowColor}00`;
                }
            }}
        >
            <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-2"
            >
                {children}
            </motion.span>

            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
        </motion.button>
    );
};
