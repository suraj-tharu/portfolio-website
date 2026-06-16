// Card3DPerspective - 3D card with perspective effects
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';

interface Card3DPerspectiveProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: 'tilt' | 'lift' | 'glow';
}

export const Card3DPerspective = ({
    children,
    className = "",
    hoverEffect = 'tilt'
}: Card3DPerspectiveProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    if (hoverEffect === 'tilt') {
        return (
            <motion.div
                ref={ref}
                className={`relative cursor-pointer ${className}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    perspective: 1000,
                    rotateX,
                    rotateY
                }}
            >
                {children}
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
            whileHover={{ boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)" }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};
