import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98, filter: 'blur(10px)' },
  in: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  out: { opacity: 0, y: -15, scale: 0.98, filter: 'blur(10px)' },
};

const pageTransition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1],
  duration: 0.8,
};

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen w-full origin-top"
    >
      {children}
    </motion.div>
  );
}
