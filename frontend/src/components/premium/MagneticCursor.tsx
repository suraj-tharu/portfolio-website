import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export const MagneticCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth springs for trailing effect
  const springX = useSpring(-100, { stiffness: 300, damping: 28, mass: 0.5 });
  const springY = useSpring(-100, { stiffness: 300, damping: 28, mass: 0.5 });
  const scale = useSpring(1, { stiffness: 200, damping: 15 });
  
  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX - 24);
      springY.set(e.clientY - 24);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('magnetic-target') ||
        target.closest('.magnetic-target')
      ) {
        setIsHovering(true);
        scale.set(1.5);
      } else {
        setIsHovering(false);
        scale.set(1);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [springX, springY, scale, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          @media (hover: hover) and (pointer: fine) {
            body { cursor: none !important; }
            a, button, [role="button"], input, select, textarea { cursor: none !important; }
          }
        `}
      </style>
      
      {/* Outer subtle glow */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9999] mix-blend-multiply dark:mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          scale: scale,
          border: '1px solid rgba(var(--text-base-rgb), 0.4)',
          backgroundColor: isHovering ? 'rgba(var(--text-base-rgb), 1)' : 'transparent',
          opacity: isHovering ? 0.8 : 0.4,
          boxShadow: '0 8px 32px rgba(var(--text-base-rgb), 0.1)',
        }}
      />
      
      {/* Inner precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--text)] pointer-events-none z-[10000]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />
    </>
  );
};

export default MagneticCursor;
