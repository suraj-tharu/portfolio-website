import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticWrapperProps {
    children: React.ReactNode;
    className?: string;
    magneticIntensity?: number; // How far it moves
    springStiffness?: number;
    springDamping?: number;
    springMass?: number;
}

export const MagneticWrapper = ({
    children,
    className = "",
    magneticIntensity = 15, // pixels
    springStiffness = 150,
    springDamping = 15,
    springMass = 0.1
}: MagneticWrapperProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: springStiffness, damping: springDamping, mass: springMass });
    const mouseYSpring = useSpring(y, { stiffness: springStiffness, damping: springDamping, mass: springMass });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        
        // Calculate distance from center of element
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Normalize the movement based on intensity
        x.set(mouseX * (magneticIntensity / 50)); 
        y.set(mouseY * (magneticIntensity / 50));
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className={`inline-block ${className}`}
            style={{
                x: mouseXSpring,
                y: mouseYSpring,
            }}
        >
            {children}
        </motion.div>
    );
};
