import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

type MotionTag = 'div' | 'span' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'aside' | 'nav' | 'ul' | 'li' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
  as?: MotionTag;
};

export function FadeIn({
  children, delay = 0, duration = 0.7, x = 0, y = 30,
  className, style, as = 'div'
}: FadeInProps) {
  // Access motion components via bracket notation for dynamic tag names
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Tag>
  );
}
