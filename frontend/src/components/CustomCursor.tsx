import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

type CursorState = 'default' | 'link' | 'view' | 'read' | 'drag';

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const trailConfig = { stiffness: 150, damping: 15, mass: 0.8 };
  const trailX = useSpring(cursorX, trailConfig);
  const trailY = useSpring(cursorY, trailConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setIsVisible(prev => {
        if (!prev) return true;
        return prev;
      });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      const button = target.closest('button');
      const img = target.closest('img, [data-cursor="view"]');
      const draggable = target.closest('[data-cursor="drag"]');
      const readable = target.closest('article, p, [data-cursor="read"]');

      if (draggable) {
        setCursorState('drag');
        setCursorLabel('Drag');
      } else if (img) {
        setCursorState('view');
        setCursorLabel('View');
      } else if (anchor) {
        setCursorState('link');
        // Use aria-label or inner text if short
        const text = anchor.getAttribute('aria-label') || anchor.innerText.trim().slice(0, 12);
        setCursorLabel(text || 'Open');
      } else if (button) {
        setCursorState('link');
        const text = button.getAttribute('aria-label') || button.innerText.trim().slice(0, 12);
        setCursorLabel(text || 'Click');
      } else if (readable) {
        setCursorState('read');
        setCursorLabel('Read');
      } else {
        setCursorState('default');
        setCursorLabel('');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const isHovering = cursorState !== 'default';

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-brand-500 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Outer ring / label container */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-screen flex items-center justify-center"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          width: isHovering ? 72 : 40,
          height: isHovering ? 72 : 40,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="w-full h-full rounded-full border border-brand-light flex items-center justify-center overflow-hidden"
          animate={{
            backgroundColor: isHovering ? "rgba(139,92,246,0.15)" : "transparent",
            borderColor: isHovering ? "rgba(139,92,246,0.7)" : "rgba(167,139,250,0.6)",
            boxShadow: isHovering ? "0 0 20px rgba(139,92,246,0.4)" : "0 0 10px rgba(139,92,246,0.3)"
          }}
          transition={{ duration: 0.3 }}
        >
          {cursorLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-bold text-text-primary dark:text-white tracking-wider uppercase select-none"
            >
              {cursorLabel}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
