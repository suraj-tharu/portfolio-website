import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { TextReveal } from './premium/TextReveal';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';
import { Sparkles, ArrowRight, MapPin, Zap, ChevronDown, Award, BookOpen, Globe } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import profileImg from '../assets/profile.jpg';

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════ */
const HERO_PAD_TOP = 88;        // px — nav height clearance
const HERO_PAD_BOTTOM = 56;     // px — generous bottom breathing room
const CONTENT_MAX_W = 1280;     // px — max layout width
const BREAKPOINT_LG = 1024;     // px — 2-col threshold
const BREAKPOINT_MD = 768;      // px — mobile threshold
const BREAKPOINT_SM = 480;      // px — small phone threshold

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

/* ═══════════════════════════════════════════════════════════════════════
   MAGNETIC CURSOR PARALLAX HOOK
═══════════════════════════════════════════════════════════════════════ */
function useMagneticParallax(strength = 0.04) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y, strength]);

  return { springX, springY };
}

/* ═══════════════════════════════════════════════════════════════════════
   CINEMATIC BACKGROUND — Ultra Luxury Multi-Layer
═══════════════════════════════════════════════════════════════════════ */
function CinematicBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { springX, springY } = useMagneticParallax(0.02);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Base gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isDark
          ? 'linear-gradient(160deg, #020205 0%, #050812 25%, #080C1E 55%, #040308 100%)'
          : 'linear-gradient(160deg, #FEFEFE 0%, #F9F8FD 30%, #F4F2FC 65%, #FBFBFE 100%)',
      }} />

      {/* Premium grid */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: isDark ? 0.025 : 0.035,
        backgroundImage: `
          linear-gradient(${isDark ? 'rgba(139,92,246,0.5)' : 'rgba(109,40,217,0.3)'} 1px, transparent 1px),
          linear-gradient(90deg, ${isDark ? 'rgba(139,92,246,0.5)' : 'rgba(109,40,217,0.3)'} 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      {/* Noise texture */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: isDark ? 0.04 : 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay',
      }} />

      {/* Aurora orb 1 — Violet top-left */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ rotate: [0, 6, -4, 0], scale: [1, 1.1, 0.93, 1], x: [0, 50, -25, 0], y: [0, -25, 18, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="aurora-orb"
        data-el="aurora1"
      >
        <div style={{
          position: 'absolute', top: '-30%', left: '-20%',
          width: '70vw', height: '70vw', borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle at 38% 38%, rgba(139,92,246,0.22), rgba(124,58,237,0.07) 45%, transparent 70%)'
            : 'radial-gradient(circle at 38% 38%, rgba(139,92,246,0.12), rgba(124,58,237,0.03) 45%, transparent 70%)',
          filter: 'blur(110px)',
        }} />
      </motion.div>

      {/* Aurora orb 2 — Cyan-rose bottom-right */}
      <motion.div
        animate={{ rotate: [0, -5, 7, 0], scale: [1, 0.9, 1.08, 1], x: [0, -40, 30, 0], y: [0, 25, -15, 0] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{
          position: 'absolute', bottom: '-25%', right: '-18%',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle at 62% 62%, rgba(56,189,248,0.16), rgba(244,114,182,0.09) 48%, transparent 72%)'
            : 'radial-gradient(circle at 62% 62%, rgba(56,189,248,0.08), rgba(244,114,182,0.04) 48%, transparent 72%)',
          filter: 'blur(120px)',
        }} />
      </motion.div>

      {/* Accent center shimmer */}
      <motion.div
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '15%', left: '25%',
          width: '50vw', height: '35vw', borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(167,139,250,0.07), transparent 65%)'
            : 'radial-gradient(circle, rgba(167,139,250,0.045), transparent 65%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Gold accent glow (luxury signature) */}
      <motion.div
        animate={{ opacity: [0.1, 0.28, 0.1], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', top: '40%', right: '10%',
          width: '30vw', height: '30vw', borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(251,191,36,0.06), transparent 60%)'
            : 'radial-gradient(circle, rgba(251,191,36,0.04), transparent 60%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: isDark
          ? 'linear-gradient(to top, #040308, transparent)'
          : 'linear-gradient(to top, #FBFBFE, transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LUXURY PROFILE CARD — The hero image with cinematic frame
═══════════════════════════════════════════════════════════════════════ */
function LuxuryProfileCard({ isMobile, isSmall }: { isMobile: boolean; isSmall: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { springX, springY } = useMagneticParallax(0.015);
  const [hovered, setHovered] = useState(false);

  /* Three-tier sizing — never overflows the column */
  const cardSize = isSmall ? 200 : isMobile ? 260 : 400;

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Rotating luxury border ring 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: cardSize + 60,
          height: cardSize + 60,
          borderRadius: '50%',
          border: `1px solid ${isDark ? 'rgba(167,139,250,0.18)' : 'rgba(124,58,237,0.14)'}`,
          borderTopColor: isDark ? 'rgba(167,139,250,0.6)' : 'rgba(124,58,237,0.5)',
          borderRightColor: isDark ? 'rgba(167,139,250,0.3)' : 'rgba(124,58,237,0.25)',
        }}
      />

      {/* Rotating luxury border ring 2 — counter */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: cardSize + 100,
          height: cardSize + 100,
          borderRadius: '50%',
          border: `0.5px dashed ${isDark ? 'rgba(56,189,248,0.12)' : 'rgba(56,189,248,0.1)'}`,
        }}
      />

      {/* Orbit dots */}
      {[0, 90, 180, 270].map((deg, i) => (
        <motion.div
          key={deg}
          animate={{ rotate: [deg, deg + 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: cardSize + 60,
            height: cardSize + 60,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            width: i === 0 ? 7 : 4,
            height: i === 0 ? 7 : 4,
            borderRadius: '50%',
            background: i === 0
              ? (isDark ? '#A78BFA' : '#7C3AED')
              : (isDark ? 'rgba(56,189,248,0.6)' : 'rgba(56,189,248,0.5)'),
            boxShadow: i === 0
              ? `0 0 12px ${isDark ? 'rgba(167,139,250,0.8)' : 'rgba(124,58,237,0.7)'}`
              : 'none',
            marginTop: -2,
          }} />
        </motion.div>
      ))}

      {/* Ambient glow behind card */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: cardSize * 1.1,
          height: cardSize * 1.1,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(56,189,248,0.08) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(56,189,248,0.04) 50%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      {/* ── MAIN IMAGE CARD ── */}
      <motion.div
        animate={hovered ? { scale: 1.03 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          position: 'relative',
          width: cardSize,
          height: cardSize,
          borderRadius: isMobile ? '40% 60% 55% 45% / 45% 42% 58% 55%' : '38% 62% 57% 43% / 43% 40% 60% 57%',
          overflow: 'hidden',
          zIndex: 2,
          boxShadow: isDark
            ? `0 0 0 1px rgba(167,139,250,0.2), 0 0 0 2px rgba(167,139,250,0.05), 0 30px 80px -15px rgba(0,0,0,0.8), 0 0 60px -10px rgba(139,92,246,0.25)`
            : `0 0 0 1px rgba(124,58,237,0.15), 0 0 0 2px rgba(124,58,237,0.04), 0 30px 80px -15px rgba(0,0,0,0.2), 0 0 60px -10px rgba(139,92,246,0.15)`,
          flexShrink: 0,
        }}
      >
        {/* Profile Image */}
        <img
          src={profileImg}
          alt="Suraj Tharu Chaudhary"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            filter: isDark
              ? 'contrast(1.06) saturate(1.05) brightness(0.97)'
              : 'contrast(1.03) saturate(1.02)',
            transition: 'filter 0.4s ease',
          }}
        />

        {/* Luxury overlay — gradient wash */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'linear-gradient(to top, rgba(4,3,8,0.45) 0%, transparent 40%)'
            : 'linear-gradient(to top, rgba(255,255,255,0.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* Color tint accent top-right */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'radial-gradient(ellipse at 80% 10%, rgba(139,92,246,0.12), transparent 60%)'
            : 'radial-gradient(ellipse at 80% 10%, rgba(139,92,246,0.08), transparent 60%)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }} />

        {/* Shimmer on hover */}
        <motion.div
          animate={hovered ? { x: ['−120%', '120%'] } : { x: '−120%' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* ── Floating Badge: Available ── */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.06, y: -2 }}
        style={{
          position: 'absolute',
          top: isSmall ? -8 : isMobile ? -10 : 12,
          right: isSmall ? -8 : isMobile ? -10 : -18,
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '9px 16px',
          borderRadius: 999,
          background: isDark
            ? 'rgba(10, 10, 20, 0.85)'
            : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(52,211,153,0.3)' : 'rgba(5,150,105,0.25)'}`,
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(52,211,153,0.12)'
            : '0 8px 32px rgba(0,0,0,0.1), 0 0 20px rgba(5,150,105,0.08)',
          zIndex: 10,
          cursor: 'default',
        }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#34D399',
          boxShadow: '0 0 10px rgba(52,211,153,0.7)',
          animation: 'hero-dot-pulse 1.8s ease-in-out infinite',
          display: 'inline-block', flexShrink: 0,
        }} />
        <span style={{
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
          color: isDark ? '#34D399' : '#059669',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>Available</span>
      </motion.div>

      {/* ── Floating Badge: MSc ── */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.06, y: 2 }}
        style={{
          position: 'absolute',
          bottom: isSmall ? -8 : isMobile ? -10 : 22,
          left: isSmall ? -8 : isMobile ? -10 : -22,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px',
          borderRadius: 16,
          background: isDark
            ? 'rgba(10, 10, 20, 0.88)'
            : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(167,139,250,0.25)' : 'rgba(124,58,237,0.18)'}`,
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.12)'
            : '0 8px 32px rgba(0,0,0,0.1)',
          zIndex: 10,
          cursor: 'default',
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: isDark
            ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(56,189,248,0.2))'
            : 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(56,189,248,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BookOpen size={14} style={{ color: isDark ? '#A78BFA' : '#7C3AED' }} />
        </div>
        <div>
          <div style={{
            fontFamily: '"Syne", system-ui, sans-serif',
            fontSize: '0.75rem', fontWeight: 800,
            color: isDark ? '#FFFFFF' : '#0F172A',
            lineHeight: 1.1,
          }}>MSc Candidate</div>
          <div style={{
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            fontSize: '0.6rem', fontWeight: 500,
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.45)',
          }}>Information Systems</div>
        </div>
      </motion.div>

      {/* ── Floating Badge: ML ── desktop only */}
      {!isMobile && !isSmall && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.06 }}
          style={{
            position: 'absolute',
            top: '55%',
            right: -36,
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '12px 14px',
            borderRadius: 16,
            background: isDark
              ? 'rgba(10, 10, 20, 0.88)'
              : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${isDark ? 'rgba(244,114,182,0.2)' : 'rgba(244,114,182,0.15)'}`,
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.5)'
              : '0 8px 32px rgba(0,0,0,0.08)',
            zIndex: 10,
            cursor: 'default',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: isDark
              ? 'linear-gradient(135deg, rgba(244,114,182,0.25), rgba(167,139,250,0.15))'
              : 'linear-gradient(135deg, rgba(244,114,182,0.15), rgba(167,139,250,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={16} style={{ color: isDark ? '#F472B6' : '#DB2777' }} />
          </div>
          <span style={{
            fontFamily: '"Syne", system-ui, sans-serif',
            fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.06em',
            color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
            textTransform: 'uppercase',
          }}>ML/AI</span>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ROLE BADGE
═══════════════════════════════════════════════════════════════════════ */
const roles = [
  "Machine Learning Engineer",
  "Geospatial Analyst",
  "Computer Engineering Educator",
  "Tech Researcher",
];

function RoleBadge({ role }: { role: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role}
        initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '9px 22px', borderRadius: 999,
          background: isDark
            ? 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(56,189,248,0.06))'
            : 'linear-gradient(135deg, rgba(139,92,246,0.07), rgba(56,189,248,0.04))',
          border: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.18)'}`,
          backdropFilter: 'blur(14px)',
          boxShadow: isDark
            ? 'inset 0 1px 0 rgba(255,255,255,0.05)'
            : 'inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: isDark ? '#A78BFA' : '#7C3AED',
          boxShadow: `0 0 10px ${isDark ? 'rgba(167,139,250,0.7)' : 'rgba(124,58,237,0.5)'}`,
          animation: 'hero-dot-pulse 2s ease-in-out infinite',
          display: 'inline-block',
        }} />
        <span style={{
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          color: isDark ? '#C4B5FD' : '#5B21B6',
          fontSize: '0.84rem', fontWeight: 600, letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}>
          {role}
        </span>
        <span style={{
          width: 2, height: 16, borderRadius: 1,
          background: isDark ? '#A78BFA' : '#7C3AED',
          animation: 'hero-cursor-blink 1s steps(2) infinite',
          display: 'inline-block', opacity: 0.7,
        }} />
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PREMIUM STAT CARD
═══════════════════════════════════════════════════════════════════════ */
interface StatCardProps {
  value: string | number;
  suffix: string;
  label: string;
  accentColor: string;
  icon: React.ReactNode;
  delay: number;
}

function StatCard({ value, suffix, label, accentColor, icon, delay }: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 6,
        padding: '22px 14px',
        borderRadius: 20,
        background: isDark
          ? hov ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.025)'
          : hov ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
        border: `1px solid ${isDark
          ? hov ? `${accentColor}30` : 'rgba(255,255,255,0.07)'
          : hov ? `${accentColor}20` : 'rgba(0,0,0,0.07)'}`,
        backdropFilter: 'blur(20px)',
        boxShadow: hov
          ? isDark
            ? `0 12px 40px -8px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px ${accentColor}15`
            : `0 12px 40px -8px ${accentColor}20, inset 0 1px 0 rgba(255,255,255,0.8)`
          : isDark
            ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 8px rgba(0,0,0,0.04)',
        transform: hov ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
      }}
    >
      {/* Icon */}
      <motion.div
        animate={hov ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          width: 36, height: 36, borderRadius: 11,
          background: `${accentColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${accentColor}25`,
          marginBottom: 2,
        }}
      >
        <span style={{ color: accentColor, display: 'flex' }}>{icon}</span>
      </motion.div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <span style={{
          fontFamily: '"Syne", system-ui, sans-serif',
          fontSize: '1.55rem', fontWeight: 800, lineHeight: 1,
          color: isDark ? '#FFFFFF' : '#0F0F1A',
        }}>
          {value || ''}
        </span>
        <span style={{
          fontFamily: '"Syne", system-ui, sans-serif',
          fontSize: '1rem', fontWeight: 700,
          color: accentColor,
        }}>
          {suffix}
        </span>
      </div>
      <span style={{
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.33)' : 'rgba(0,0,0,0.38)',
        textAlign: 'center',
      }}>
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SHIMMER BUTTON
═══════════════════════════════════════════════════════════════════════ */
function ShimmerButton({
  href, children, variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isPrimary = variant === 'primary';

  return (
    <motion.a
      href={href}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '15px 34px', borderRadius: 999,
        fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.01em',
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        textDecoration: 'none',
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
        ...(isPrimary ? {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 45%, #7C3AED 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: isDark
            ? '0 4px 28px -4px rgba(139,92,246,0.5), inset 0 1px 0 rgba(255,255,255,0.18)'
            : '0 4px 28px -4px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
        } : {
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
          color: isDark ? '#E2E8F0' : '#1E293B',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.12)'}`,
          backdropFilter: 'blur(16px)',
          boxShadow: isDark
            ? 'inset 0 1px 0 rgba(255,255,255,0.07)'
            : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.05)',
        }),
      }}
      whileHover={{
        y: -4,
        boxShadow: isPrimary
          ? (isDark
            ? '0 16px 48px -8px rgba(139,92,246,0.55), inset 0 1px 0 rgba(255,255,255,0.22)'
            : '0 16px 48px -8px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.3)')
          : (isDark
            ? '0 10px 32px -8px rgba(139,92,246,0.22), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 10px 32px -8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)'),
      }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {isPrimary && (
        <span style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
          animation: 'hero-shimmer 3.5s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        {children}
      </span>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SCROLL INDICATOR
═══════════════════════════════════════════════════════════════════════ */
function ScrollIndicator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1.2 }}
      style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        zIndex: 5,
      }}
    >
      <span style={{
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.28)',
      }}>
        Scroll
      </span>
      {/* Luxury scroll line */}
      <div style={{
        width: 1, height: 40, borderRadius: 1,
        background: isDark
          ? 'linear-gradient(to bottom, rgba(167,139,250,0.5), transparent)'
          : 'linear-gradient(to bottom, rgba(124,58,237,0.4), transparent)',
        position: 'relative', overflow: 'hidden',
      }}>
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
            background: isDark ? '#A78BFA' : '#7C3AED',
            borderRadius: 1,
          }}
        />
      </div>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={14} style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.22)' }} />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN HERO
═══════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const greeting = useGreeting();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINT_LG}px)`);
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINT_MD - 1}px)`);
  const isSmall = useMediaQuery(`(max-width: ${BREAKPOINT_SM - 1}px)`);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const stagger = {
    greeting: 0.1,
    name: 0.28,
    role: 0.52,
    meta: 0.72,
    desc: 0.92,
    cta: 1.18,
    stats: 1.45,
    photo: 0.55,
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{ position: 'relative', width: '100%' }}
    >
      <CinematicBackground />

      <div style={{ position: 'relative', zIndex: 5 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          paddingTop: HERO_PAD_TOP,
          paddingBottom: HERO_PAD_BOTTOM,
          boxSizing: 'border-box',
        }}>
          <div style={{
            margin: 'auto 0',          /* vertical: shrink to content; horizontal: none */
            width: '100%',
            maxWidth: CONTENT_MAX_W,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: isSmall ? 16 : isMobile ? 24 : 48,
            paddingRight: isSmall ? 16 : isMobile ? 24 : 48,
            boxSizing: 'border-box',
          }}>

            {/* ══════════════ MAIN GRID ══════════════ */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? '1fr 0.88fr' : '1fr',
              gap: isDesktop ? 56 : isMobile ? 32 : 40,
              alignItems: 'center',
            }}>

              {/* ════════ LEFT: TEXT ════════ */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                textAlign: isDesktop ? 'left' : 'center',
                alignItems: isDesktop ? 'flex-start' : 'center',
                order: isDesktop ? 1 : 2,
                minWidth: 0,   /* prevent grid blowout */
              }}>

                {/* Greeting pill */}
                <AnimatePresence>
                  {greeting && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: stagger.greeting, ease: [0.16, 1, 0.3, 1] }}
                      style={{ marginBottom: isSmall ? 14 : isMobile ? 18 : 26 }}
                    >
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '8px 20px', borderRadius: 999,
                        background: isDark ? 'rgba(139,92,246,0.07)' : 'rgba(139,92,246,0.05)',
                        border: `1px solid ${isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.14)'}`,
                        backdropFilter: 'blur(16px)',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: isDark
                          ? 'inset 0 1px 0 rgba(255,255,255,0.05)'
                          : 'inset 0 1px 0 rgba(255,255,255,0.6)',
                      }}>
                        <span style={{
                          position: 'absolute', inset: -1,
                          borderRadius: 999,
                          background: `conic-gradient(from 0deg, transparent 0%, ${isDark ? 'rgba(167,139,250,0.35)' : 'rgba(124,58,237,0.22)'} 25%, transparent 50%)`,
                          animation: 'hero-border-rotate 4s linear infinite',
                          zIndex: 0, filter: 'blur(2px)',
                        }} />
                        <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: '#34D399',
                            boxShadow: '0 0 12px rgba(52,211,153,0.6)',
                            animation: 'hero-dot-pulse 2s ease-in-out infinite',
                            display: 'inline-block',
                          }} />
                          <span style={{
                            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: isDark ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.58)',
                          }}>
                            {greeting} — Welcome
                          </span>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.1, delay: stagger.name, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: '"Syne", system-ui, sans-serif',
                    fontWeight: 800,
                    fontSize: isSmall
                      ? 'clamp(2rem, 9vw, 2.6rem)'
                      : isMobile
                        ? 'clamp(2.4rem, 10vw, 3rem)'
                        : 'clamp(2.8rem, 4.8vw, 5.2rem)',
                    lineHeight: 1.04,
                    letterSpacing: '-0.035em',
                    marginBottom: isSmall ? 12 : isMobile ? 16 : 22,
                    background: isDark
                      ? 'linear-gradient(140deg, #FFFFFF 0%, #E2E8F0 35%, #C4B5FD 70%, #A78BFA 100%)'
                      : 'linear-gradient(140deg, #0F172A 0%, #1E293B 35%, #5B21B6 70%, #7C3AED 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {language === 'ne' ? 'सुरज थारु\nचौधरी' : 'Suraj Tharu\nChaudhary'}
                </motion.h1>

                {/* Role Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: stagger.role }}
                  style={{ marginBottom: isSmall ? 12 : isMobile ? 16 : 20 }}
                >
                  <RoleBadge role={roles[roleIndex]} />
                </motion.div>

                {/* Location & Availability */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: stagger.meta }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    marginBottom: isSmall ? 14 : isMobile ? 18 : 26,
                    fontSize: isSmall ? '0.72rem' : '0.8rem', fontWeight: 500,
                    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                    color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)',
                    letterSpacing: '0.01em',
                    flexWrap: 'wrap',
                    justifyContent: isDesktop ? 'flex-start' : 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={13} style={{ color: isDark ? '#A78BFA' : '#7C3AED', flexShrink: 0 }} />
                    <span>{t('hero.location')}</span>
                  </div>
                  <span style={{
                    width: 3, height: 3, borderRadius: '50%',
                    background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
                    display: 'inline-block',
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Zap size={12} style={{ color: '#34D399', flexShrink: 0 }} />
                    <span style={{ color: isDark ? '#34D399' : '#059669', fontWeight: 600 }}>
                      Available for work
                    </span>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, delay: stagger.desc }}
                  style={{
                    maxWidth: 520, marginBottom: isSmall ? 20 : isMobile ? 26 : 36,
                    fontSize: isSmall ? '0.84rem' : isMobile ? '0.9rem' : 'clamp(0.93rem, 1.2vw, 1.03rem)',
                    lineHeight: 1.72,
                    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                    color: isDark ? 'rgba(255,255,255,0.52)' : 'rgba(0,0,0,0.58)',
                    fontWeight: 400,
                  }}
                >
                  <TextReveal text={t('hero.description')} delay={stagger.desc} staggerDuration={0.012} />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: stagger.cta }}
                  style={{
                    display: 'flex', gap: 14, flexWrap: 'wrap',
                    justifyContent: isDesktop ? 'flex-start' : 'center',
                  }}
                >
                  <ShimmerButton href="#work" variant="primary">
                    <Sparkles size={15} />
                    View My Work
                  </ShimmerButton>
                  <ShimmerButton href="#contact" variant="secondary">
                    Get In Touch
                    <ArrowRight size={15} />
                  </ShimmerButton>
                </motion.div>
              </div>

              {/* ════════ RIGHT: PROFILE IMAGE ════════ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.2, delay: stagger.photo, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  order: isDesktop ? 2 : 1,
                  paddingTop: !isDesktop ? (isSmall ? 8 : 16) : 0,
                  paddingBottom: !isDesktop ? (isSmall ? 8 : 16) : 0,
                  position: 'relative',
                  /* Prevent the image from making the grid wider than viewport */
                  minWidth: 0,
                  overflow: 'visible',
                }}
              >
                <LuxuryProfileCard isMobile={isMobile} isSmall={isSmall} />
              </motion.div>
            </div>

            {/* ════════ STATS BAR ════════ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: stagger.stats, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: isSmall ? 8 : isMobile ? 10 : 14,
                width: '100%',
                marginTop: isDesktop ? 56 : isSmall ? 24 : 36,
              }}
            >
              {([
                { value: 5, suffix: '+', label: 'Years Teaching', accentColor: '#A78BFA', icon: <BookOpen size={16} /> },
                { value: '', suffix: 'MSc', label: 'Info Systems', accentColor: '#38BDF8', icon: <Award size={16} /> },
                { value: '', suffix: 'GIS', label: 'Spatial Analysis', accentColor: '#34D399', icon: <Globe size={16} /> },
                { value: '', suffix: 'ML', label: 'Deep Learning', accentColor: '#F472B6', icon: <Sparkles size={16} /> },
              ] as const).map((s, i) => (
                <StatCard
                  key={s.label}
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  accentColor={s.accentColor}
                  icon={s.icon}
                  delay={stagger.stats + i * 0.09}
                />
              ))}
            </motion.div>

          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {!isMobile && <ScrollIndicator />}

      {/* Keyframes */}
      <style>{`
        @keyframes hero-shimmer {
          0% { transform: translateX(-120%); }
          60%, 100% { transform: translateX(120%); }
        }
        @keyframes hero-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.82); }
        }
        @keyframes hero-cursor-blink {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0; }
        }
        @keyframes hero-border-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
