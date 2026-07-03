import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* Trail dot config */
const TRAIL_COUNT = 6;

interface TrailDot {
  x: number;
  y: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  /* Main ring — spring for smooth lag */
  const ringX = useSpring(cursorX, { stiffness: 200, damping: 24, mass: 0.5 });
  const ringY = useSpring(cursorY, { stiffness: 200, damping: 24, mass: 0.5 });

  /* Dot — tighter spring for near-instant */
  const dotX = useSpring(cursorX, { stiffness: 600, damping: 36, mass: 0.3 });
  const dotY = useSpring(cursorY, { stiffness: 600, damping: 36, mass: 0.3 });

  const [trail, setTrail] = useState<TrailDot[]>(Array(TRAIL_COUNT).fill({ x: -100, y: -100 }));
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [hoverText, setHoverText] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef<TrailDot[]>(Array(TRAIL_COUNT).fill({ x: -100, y: -100 }));
  const rafRef = useRef<number | undefined>(undefined);
  const rippleId = useRef(0);

  /* Mobile detection */
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Trail animation loop */
  const animateTrail = useCallback(function loop() {
    const newTrail = [...trailRef.current];
    for (let i = TRAIL_COUNT - 1; i > 0; i--) {
      const prev = newTrail[i - 1];
      const curr = newTrail[i];
      newTrail[i] = {
        x: curr.x + (prev.x - curr.x) * 0.35,
        y: curr.y + (prev.y - curr.y) * 0.35,
      };
    }
    newTrail[0] = { ...posRef.current };
    trailRef.current = newTrail;
    setTrail([...newTrail]);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  /* Mouse tracking + magnetic snap */
  useEffect(() => {
    if (isMobile) return;

    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      /* Magnetic snap to nearest interactive element */
      const target = document.elementFromPoint(x, y);
      const magnetic = target?.closest('button, a, [data-magnetic]') as HTMLElement | null;

      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (x - cx) * 0.3;
        const dy = (y - cy) * 0.3;
        cursorX.set(cx + dx - 20);
        cursorY.set(cy + dy - 20);
        posRef.current = { x: cx + dx - 3, y: cy + dy - 3 };
        setIsHovering(true);
        setIsPointer(true);
        /* Check for text mode */
        const text = magnetic.getAttribute('data-cursor-text') || '';
        setHoverText(text);
      } else {
        cursorX.set(x - 20);
        cursorY.set(y - 20);
        posRef.current = { x: x - 3, y: y - 3 };
        setIsHovering(false);
        setIsPointer(false);
        setHoverText('');
      }
    };

    const click = (e: MouseEvent) => {
      const id = ++rippleId.current;
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 520);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('click', click);
    rafRef.current = requestAnimationFrame(animateTrail);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('click', click);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, cursorX, cursorY, animateTrail]);

  /* Hide system cursor */
  useEffect(() => {
    if (isMobile) return;
    document.documentElement.style.cursor = 'none';
    const hideDefault = () => { document.documentElement.style.cursor = 'none'; };
    document.querySelectorAll('button, a, input, textarea, select').forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
    });
    return () => {
      document.documentElement.style.cursor = '';
      hideDefault();
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* ── Trail dots ─────────────────────────────────── */}
      {trail.map((dot, i) => {
        const size = Math.max(2, 5 - i * 0.6);
        const opacity = Math.max(0, 0.55 - i * 0.08);
        const hue = 260 + i * 12; // violet → pink drift
        return (
          <div
            key={i}
            style={{
              position: 'fixed',
              left: dot.x,
              top: dot.y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `hsla(${hue},80%,70%,${opacity})`,
              pointerEvents: 'none',
              zIndex: 99996,
              transform: 'translate(-50%, -50%)',
              willChange: 'transform',
              transition: 'width 0.2s, height 0.2s',
              boxShadow: i < 2 ? `0 0 ${6 - i * 2}px hsla(${hue},80%,70%,0.6)` : 'none',
            }}
          />
        );
      })}

      {/* ── Main ring ──────────────────────────────────── */}
      <motion.div
        style={{
          position: 'fixed',
          left: ringX,
          top: ringY,
          zIndex: 99997,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? (hoverText ? 80 : 54) : 40,
            height: isHovering ? (hoverText ? 80 : 54) : 40,
            borderColor: isPointer
              ? 'rgba(244,114,182,0.85)'
              : 'rgba(167,139,250,0.7)',
            backgroundColor: isPointer
              ? 'rgba(167,139,250,0.06)'
              : 'transparent',
          }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          style={{
            borderRadius: '50%',
            border: '1.5px solid rgba(167,139,250,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
          }}
        >
          {hoverText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              style={{
                fontSize: '0.5rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(167,139,250,0.9)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {hoverText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* ── Cursor dot ─────────────────────────────────── */}
      <motion.div
        style={{
          position: 'fixed',
          left: dotX,
          top: dotY,
          width: isPointer ? 4 : 6,
          height: isPointer ? 4 : 6,
          borderRadius: '50%',
          background: isPointer
            ? 'rgba(244,114,182,1)'
            : 'rgba(167,139,250,1)',
          pointerEvents: 'none',
          zIndex: 99999,
          boxShadow: `0 0 8px ${isPointer ? 'rgba(244,114,182,0.8)' : 'rgba(167,139,250,0.8)'}`,
          willChange: 'transform',
        }}
      />

      {/* ── Click ripples ──────────────────────────────── */}
      {ripples.map(({ id, x, y }) => (
        <div
          key={id}
          style={{
            position: 'fixed',
            left: x,
            top: y,
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '1.5px solid rgba(167,139,250,0.9)',
            pointerEvents: 'none',
            zIndex: 99995,
            animation: 'click-ripple 0.5s ease-out forwards',
          }}
        />
      ))}

      {/* ── Pulse ring (periodic) ──────────────────────── */}
      <motion.div
        style={{
          position: 'fixed',
          left: ringX,
          top: ringY,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(167,139,250,0.3)',
          pointerEvents: 'none',
          zIndex: 99994,
        }}
        animate={{
          scale: [1, 2.2],
          opacity: [0.4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
          repeatDelay: 1,
        }}
      />
    </>
  );
}
