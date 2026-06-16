// SmoothProgressBar - Animated progress bar with smooth easing
import { motion } from 'framer-motion';

interface SmoothProgressBarProps {
    progress: number; // 0-100
    className?: string;
    color?: string;
    animated?: boolean;
    height?: number;
}

export const SmoothProgressBar = ({
    progress,
    className = "",
    color = "#D4AF37",
    animated = true,
    height = 4
}: SmoothProgressBarProps) => {
    return (
        <div
            className={`w-full bg-white/10 rounded-full overflow-hidden ${className}`}
            style={{ height: `${height}px` }}
        >
            <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={animated ? {
                    duration: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                } : { duration: 0 }}
            />
        </div>
    );
};

// Linear Progress with glow effect
export const GlowProgressBar = ({
    progress,
    className = "",
    color = "#D4AF37",
    height = 3
}: SmoothProgressBarProps) => {
    return (
        <div
            className={`w-full bg-white/5 rounded-full overflow-hidden relative ${className}`}
            style={{ height: `${height}px` }}
        >
            <motion.div
                className="h-full rounded-full"
                style={{
                    backgroundColor: color,
                    boxShadow: `0 0 20px ${color}`
                }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut"
                }}
            />
        </div>
    );
};
