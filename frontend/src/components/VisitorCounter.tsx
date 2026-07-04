import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

export default function VisitorCounter() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Eye size={12} className="text-violet-500 shrink-0" />
      <span className="text-xs text-text-secondary dark:text-slate-400 dark:text-white/35">Visitors:</span>
      <img
        src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fsuraj-tharu-portfolio.com&countColor=%237C3AED&style=flat-square&labelColor=%23ffffff00&label=%20"
        alt="Global Visitor Count"
        className="h-4 opacity-90 hover:opacity-100 transition-opacity"
      />
    </motion.div>
  );
}
