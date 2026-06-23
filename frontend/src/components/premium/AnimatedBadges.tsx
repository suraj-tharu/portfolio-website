// AnimatedBadges - Premium achievement badges with animations
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface BadgeProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    unlocked?: boolean;
    progress?: number;
}

export const AnimatedBadge = ({
    icon = <Star size={24} />,
    title,
    description,
    unlocked = true,
    progress = 0
}: BadgeProps) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
            }}
            whileHover={{ scale: 1.1 }}
            className={`
        flex flex-col items-center p-6 rounded-2xl
        backdrop-blur-xl border border-white/20
        transition-all duration-300 cursor-pointer
        ${unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 shadow-lg shadow-yellow-500/20'
                    : 'bg-gray-400/10 opacity-50'
                }
      `}
        >
            <motion.div
                animate={unlocked ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`text-4xl mb-3 ${unlocked ? 'text-yellow-400' : 'text-gray-400'}`}
            >
                {icon}
            </motion.div>

            <h3 className="font-bold text-lg text-center">{title}</h3>
            {description && <p className="text-sm text-text-secondary dark:text-gray-300 mt-2 text-center">{description}</p>}

            {progress > 0 && (
                <div className="w-full mt-4 bg-gray-700/50 rounded-full h-2">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                    />
                </div>
            )}

            {unlocked && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0"
                    style={{ background: "conic-gradient(from 0deg, #fbbf24, #fb923c, transparent)" }}
                />
            )}
        </motion.div>
    );
};

export const BadgeGrid = ({ badges }: { badges: BadgeProps[] }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, i) => (
                <AnimatedBadge key={i} {...badge} />
            ))}
        </div>
    );
};
