// AnimatedGradientText - Flowing gradient text animation
import { motion } from 'framer-motion';

interface AnimatedGradientTextProps {
    text: string;
    className?: string;
    colors?: string[];
    animationDuration?: number;
}

export const AnimatedGradientText = ({
    text,
    className = "",
    colors = ["#D4AF37", "#a78bfa", "#3b82f6", "#06b6d4", "#D4AF37"],
    animationDuration = 4
}: AnimatedGradientTextProps) => {
    const gradientStops = colors.map((color, i) => `${(i / (colors.length - 1)) * 100}% ${color}`).join(", ");

    return (
        <motion.h1
            className={`
        text-transparent bg-clip-text font-bold
        ${className}
      `}
            style={{
                backgroundImage: `linear-gradient(90deg, ${gradientStops})`,
                backgroundSize: "200% 200%"
            }}
            animate={{
                backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
            }}
            transition={{
                duration: animationDuration,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            {text}
        </motion.h1>
    );
};
