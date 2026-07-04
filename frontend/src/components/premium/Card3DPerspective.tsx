// Card3DPerspective - 3D card with perspective effects and inner shine
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

interface Card3DPerspectiveProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: 'tilt' | 'lift' | 'glow';
    glareEffect?: boolean;
}

export const Card3DPerspective = ({
    children,
    className = "",
    hoverEffect = 'tilt',
    glareEffect = true
}: Card3DPerspectiveProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    // Spring physics for smooth return
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
    const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

    // Glare positioning
    const glareX = useTransform(mouseX, [-100, 100], [0, 100]);
    const glareY = useTransform(mouseY, [-100, 100], [0, 100]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const handleMouseEnter = () => setIsHovered(true);
    
    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    if (hoverEffect === 'tilt') {
        return (
            <motion.div
                ref={ref}
                className={`relative cursor-pointer overflow-hidden rounded-2xl ${className}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    perspective: 1200,
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {/* Content Layer */}
                <div style={{ transform: "translateZ(30px)" }}>
                    {children}
                </div>

                {/* Glare Layer */}
                {glareEffect && isHovered && (
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-50 rounded-2xl"
                        style={{
                            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(var(--text-base-rgb),0.15) 0%, transparent 60%)`,
                        }}
                    />
                )}
            </motion.div>
        );
    }

    if (hoverEffect === 'lift') {
        return (
            <motion.div
                ref={ref}
                className={`relative cursor-pointer ${className}`}
                whileHover={{ y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={`relative cursor-pointer ${className}`}
            whileHover={{ boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)" }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};
