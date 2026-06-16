// MicroInteractionButton - Premium button with micro-interactions
import { motion } from 'framer-motion';
import { useMagneticButton } from '../../hooks/usePremiumFeatures';

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
  const baseClasses = "px-8 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden";

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50",
    secondary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50",
    outline: "border-2 border-white/30 text-white hover:bg-white/10"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        boxShadow: `0 0 30px ${glowColor}00`
      }}
      onHoverStart={(e: any) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${glowColor}80, inset 0 0 20px ${glowColor}40`;
      }}
      onHoverEnd={(e: any) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${glowColor}00`;
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
