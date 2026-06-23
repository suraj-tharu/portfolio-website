import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface GlowCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string; // Hex color for the glow
}

export const GlowCard = ({ children, className = "", glowColor = "rgba(139, 92, 246, 0.15)" }: GlowCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 300 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        
        // Calculate mouse position relative to the card
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
        // Reset or leave it where it exited (leaving it creates a nice lingering effect)
        // If you want it to snap to center on leave, uncomment below:
        /*
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            mouseX.set(rect.width / 2);
            mouseY.set(rect.height / 2);
        }
        */
    };

    // Construct the background using motion template
    const background = useMotionTemplate`radial-gradient(
        600px circle at ${springX}px ${springY}px,
        ${glowColor},
        transparent 40%
    )`;

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden premium-card group ${className}`}
        >
            {/* The actual glow that follows the cursor */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{ background }}
            />
            {/* Darker inner card to make border glow stand out (optional based on styling) */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
