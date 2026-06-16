// GlassmorphismCard - Premium frosted glass effect component
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassmorphismCardProps {
  children: ReactNode;
  gradient?: boolean;
  shimmer?: boolean;
  delay?: number;
  className?: string;
}

export const GlassmorphismCard = ({
  children,
  gradient = true,
  shimmer = true,
  delay = 0,
  className = ""
}: GlassmorphismCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`
        relative overflow-hidden
        bg-white/10 dark:bg-black/10 
        backdrop-blur-xl 
        border border-white/20 dark:border-white/10
        rounded-2xl p-6
        hover:bg-white/15 dark:hover:bg-black/15
        transition-all duration-300
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        ${gradient ? 'bg-gradient-to-br from-white/20 to-white/10 dark:from-white/5 dark:to-transparent' : ''}
        ${className}
      `}
    >
      {shimmer && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent 
          opacity-0 hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
      )}
      {children}
    </motion.div>
  );
};
