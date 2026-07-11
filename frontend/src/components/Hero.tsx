import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { TextReveal } from './premium/TextReveal';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';
import { Sparkles, ArrowRight, MapPin, Zap, ChevronDown, Award, BookOpen, Globe, Star } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import profileImg from '../assets/profile.jpg';

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-PREMIUM DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════ */
const HERO_PAD_TOP    = 88;
const HERO_PAD_BOTTOM = 64;
const CONTENT_MAX_W   = 1300;
const BREAKPOINT_XL   = 1280;
const BREAKPOINT_LG   = 1024;
const BREAKPOINT_MD   = 768;
const BREAKPOINT_SM   = 480;
const BREAKPOINT_XS   = 360;

/* ── Ultra-Premium Palette — vivid & readable in BOTH modes ── */
const PALETTE = {
  violet900: '#2E1065',
  violet800: '#4C1D95',
  violet700: '#6D28D9',
  violet600: '#7C3AED',
  violet500: '#8B5CF6',
  violet400: '#A78BFA',
  violet300: '#C4B5FD',
  violet200: '#DDD6FE',
  gold500:   '#F59E0B',
  gold400:   '#FBBF24',
  gold300:   '#FCD34D',
  goldLight: '#FDE68A',
  cyan500:   '#06B6D4',
  cyan400:   '#22D3EE',
  cyan300:   '#67E8F9',
  rose500:   '#F43F5E',
  rose400:   '#FB7185',
  rose300:   '#FDA4AF',
  emerald500: '#10B981',
  emerald400: '#34D399',
  emerald300: '#6EE7B7',
  sapphire500: '#3B82F6',
  sapphire400: '#60A5FA',
} as const;

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
   ULTRA-LUXURY CINEMATIC BACKGROUND — 4 Aurora Orbs + Gold Signature
═══════════════════════════════════════════════════════════════════════ */
function CinematicBackground() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { springX, springY } = useMagneticParallax(0.018);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>

      {/* Base Canvas */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isDark
          ? 'linear-gradient(168deg, #020208 0%, #04041A 20%, #060A1E 42%, #08041A 65%, #020208 100%)'
          : 'linear-gradient(168deg, #FAFBFF 0%, #F5F3FF 22%, #EEF2FF 45%, #F0FDF4 70%, #FAFBFF 100%)',
      }} />

      {/* Luxury mesh grid */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: isDark ? 0.028 : 0.04,
        backgroundImage: `
          linear-gradient(${isDark ? 'rgba(139,92,246,0.7)' : 'rgba(109,40,217,0.35)'} 1px, transparent 1px),
          linear-gradient(90deg, ${isDark ? 'rgba(139,92,246,0.7)' : 'rgba(109,40,217,0.35)'} 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
      }} />

      {/* Film grain */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: isDark ? 0.045 : 0.022,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        mixBlendMode: 'overlay',
      }} />

      {/* AURORA ORB 1 — Royal Violet (top-left) */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{ rotate: [0, 8, -5, 0], scale: [1, 1.12, 0.92, 1], x: [0, 60, -30, 0], y: [0, -30, 22, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{
          position: 'absolute', top: '-35%', left: '-22%',
          width: '80vw', height: '80vw', borderRadius: '50%',
          background: isDark
            ? `radial-gradient(circle at 38% 38%, ${PALETTE.violet700}58 0%, ${PALETTE.violet500}2E 35%, ${PALETTE.violet400}0F 60%, transparent 75%)`
            : `radial-gradient(circle at 38% 38%, ${PALETTE.violet700}2E 0%, ${PALETTE.violet500}14 35%, ${PALETTE.violet400}05 60%, transparent 75%)`,
          filter: 'blur(120px)',
        }} />
      </motion.div>

      {/* AURORA ORB 2 — Champagne Gold (bottom-right) */}
      <motion.div
        animate={{ rotate: [0, -6, 9, 0], scale: [1, 0.88, 1.1, 1], x: [0, -50, 35, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      >
        <div style={{
          position: 'absolute', bottom: '-28%', right: '-20%',
          width: '65vw', height: '65vw', borderRadius: '50%',
          background: isDark
            ? `radial-gradient(circle at 62% 62%, ${PALETTE.gold500}33 0%, ${PALETTE.gold400}1A 40%, ${PALETTE.gold300}08 65%, transparent 80%)`
            : `radial-gradient(circle at 62% 62%, ${PALETTE.gold500}1F 0%, ${PALETTE.gold400}0D 40%, transparent 70%)`,
          filter: 'blur(130px)',
        }} />
      </motion.div>

      {/* AURORA ORB 3 — Orchid Rose (top-right) */}
      <motion.div
        animate={{ rotate: [0, 5, -8, 0], scale: [1, 1.08, 0.95, 1], x: [0, -25, 40, 0], y: [0, 15, -35, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
      >
        <div style={{
          position: 'absolute', top: '-10%', right: '-15%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: isDark
            ? `radial-gradient(circle at 55% 30%, ${PALETTE.rose500}2E 0%, ${PALETTE.rose400}14 45%, transparent 70%)`
            : `radial-gradient(circle at 55% 30%, ${PALETTE.rose500}1A 0%, ${PALETTE.rose400}0A 45%, transparent 70%)`,
          filter: 'blur(110px)',
        }} />
      </motion.div>

      {/* AURORA ORB 4 — Celestial Cyan (center-left) */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.15, 1], x: [0, 20, -10, 0], y: [0, -15, 8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <div style={{
          position: 'absolute', top: '30%', left: '-5%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: isDark
            ? `radial-gradient(circle at 40% 50%, ${PALETTE.cyan500}24 0%, ${PALETTE.cyan400}0F 50%, transparent 70%)`
            : `radial-gradient(circle at 40% 50%, ${PALETTE.cyan500}14 0%, ${PALETTE.cyan400}07 50%, transparent 70%)`,
          filter: 'blur(100px)',
        }} />
      </motion.div>

      {/* CENTER SHIMMER PULSE */}
      <motion.div
        animate={{ opacity: [0.3, 0.65, 0.3], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', top: '10%', left: '15%',
          width: '70vw', height: '45vw', borderRadius: '50%',
          background: isDark
            ? `radial-gradient(ellipse, ${PALETTE.violet500}17 0%, ${PALETTE.gold500}0D 40%, transparent 68%)`
            : `radial-gradient(ellipse, ${PALETTE.violet500}0F 0%, ${PALETTE.gold500}08 40%, transparent 68%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Diagonal luxury glint */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: isDark
          ? 'linear-gradient(135deg, transparent 30%, rgba(167,139,250,0.025) 50%, transparent 70%)'
          : 'linear-gradient(135deg, transparent 30%, rgba(124,58,237,0.018) 50%, transparent 70%)',
      }} />

      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        background: isDark
          ? 'linear-gradient(to top, rgba(2,2,8,0.95), rgba(4,4,26,0.4), transparent)'
          : 'linear-gradient(to top, rgba(250,251,255,0.95), rgba(245,243,255,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Top vignette */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '25%',
        background: isDark
          ? 'linear-gradient(to bottom, rgba(2,2,8,0.6), transparent)'
          : 'linear-gradient(to bottom, rgba(250,251,255,0.5), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LUXURY FLOATING PARTICLES
═══════════════════════════════════════════════════════════════════════ */
function LuxuryParticles({ isDark }: { isDark: boolean }) {
  const particles = [
    { size: 3, x: '12%', y: '18%', color: PALETTE.violet400, delay: 0,   dur: 7 },
    { size: 2, x: '85%', y: '25%', color: PALETTE.gold400,   delay: 1.5, dur: 9 },
    { size: 4, x: '72%', y: '60%', color: PALETTE.cyan400,   delay: 0.8, dur: 8 },
    { size: 2, x: '28%', y: '72%', color: PALETTE.rose400,   delay: 2.2, dur: 10 },
    { size: 3, x: '55%', y: '14%', color: PALETTE.emerald400,delay: 1.1, dur: 6 },
    { size: 2, x: '90%', y: '78%', color: PALETTE.violet300, delay: 3.0, dur: 11 },
    { size: 3, x: '5%',  y: '55%', color: PALETTE.gold300,   delay: 0.4, dur: 8.5 },
    { size: 2, x: '42%', y: '88%', color: PALETTE.sapphire400,delay: 1.8, dur: 9.5 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.9, 0.3], scale: [1, 1.4, 1] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: p.x, top: p.y,
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 5}px ${p.color}${isDark ? 'CC' : '99'}`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-LUXURY PROFILE CARD — 5-orbit constellation + multi-glow
═══════════════════════════════════════════════════════════════════════ */
function LuxuryProfileCard({ isMobile, isSmall, isXS }: { isMobile: boolean; isSmall: boolean; isXS: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { springX, springY } = useMagneticParallax(0.012);
  const [hovered, setHovered] = useState(false);

  /* Four-tier sizing — never overflows the column */
  const cardSize = isXS ? 148 : isSmall ? 180 : isMobile ? 248 : 420;

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
      {/* Outermost conic gradient ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: cardSize + 80, height: cardSize + 80, borderRadius: '50%',
          background: `conic-gradient(from 0deg,
            ${PALETTE.violet500}00,
            ${PALETTE.violet400}44,
            ${PALETTE.gold400}33,
            ${PALETTE.cyan400}44,
            ${PALETTE.rose400}33,
            ${PALETTE.violet500}00)`,
          padding: 1,
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'transparent' }} />
      </motion.div>

      {/* Gold-violet dashed counter ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: cardSize + 120, height: cardSize + 120, borderRadius: '50%',
          border: `1px dashed ${isDark ? `${PALETTE.gold400}33` : `${PALETTE.gold500}40`}`,
        }}
      />

      {/* Inner spinning violet ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: cardSize + 50, height: cardSize + 50, borderRadius: '50%',
          border: `1.5px solid ${isDark ? `${PALETTE.violet400}1F` : `${PALETTE.violet600}18`}`,
          borderTopColor: isDark ? `${PALETTE.violet400}CC` : `${PALETTE.violet600}AA`,
          borderRightColor: isDark ? `${PALETTE.gold400}88` : `${PALETTE.gold500}77`,
        }}
      />

      {/* 5-dot constellation orbit */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const colors = [PALETTE.violet400, PALETTE.gold400, PALETTE.cyan400, PALETTE.rose400, PALETTE.emerald400];
        const sizes  = [8, 5, 6, 4, 5];
        return (
          <motion.div
            key={deg}
            animate={{ rotate: [deg, deg + 360] }}
            transition={{ duration: 20 + i * 2, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: cardSize + 80, height: cardSize + 80,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: sizes[i], height: sizes[i], borderRadius: '50%',
              background: colors[i],
              boxShadow: `0 0 ${sizes[i] * 3}px ${colors[i]}${isDark ? 'CC' : '99'}`,
              marginTop: -sizes[i] / 2,
            }} />
          </motion.div>
        );
      })}

      {/* Multi-layer ambient glow */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.88, 1.08, 0.88] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: cardSize * 1.25, height: cardSize * 1.25, borderRadius: '50%',
          background: isDark
            ? `radial-gradient(circle, ${PALETTE.violet500}30 0%, ${PALETTE.gold400}14 40%, ${PALETTE.cyan400}08 65%, transparent 80%)`
            : `radial-gradient(circle, ${PALETTE.violet500}20 0%, ${PALETTE.gold400}08 40%, transparent 70%)`,
          filter: 'blur(35px)',
          zIndex: 0,
        }}
      />

      {/* ── MAIN IMAGE CARD ── */}
      <motion.div
        animate={hovered ? { scale: 1.04 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        style={{
          position: 'relative',
          width: cardSize, height: cardSize,
          borderRadius: isMobile ? '42% 58% 52% 48% / 46% 44% 56% 54%' : '36% 64% 58% 42% / 42% 38% 62% 58%',
          overflow: 'hidden', zIndex: 2, flexShrink: 0,
          boxShadow: isDark
            ? `0 0 0 1px ${PALETTE.violet400}33,
               0 0 0 3px ${PALETTE.gold400}15,
               0 35px 90px -15px rgba(0,0,0,0.88),
               0 0 70px -10px ${PALETTE.violet500}38,
               0 0 140px -20px ${PALETTE.gold400}1A`
            : `0 0 0 1px ${PALETTE.violet600}22,
               0 0 0 3px ${PALETTE.gold500}12,
               0 30px 80px -15px rgba(0,0,0,0.22),
               0 0 60px -10px ${PALETTE.violet500}22,
               0 0 100px -20px ${PALETTE.gold500}15`,
        }}
      >
        {/* Profile Image */}
        <img
          src={profileImg}
          alt="Suraj Tharu Chaudhary"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            display: 'block',
            filter: isDark
              ? 'contrast(1.08) saturate(1.08) brightness(0.95)'
              : 'contrast(1.04) saturate(1.04)',
            transition: 'filter 0.5s ease',
          }}
        />

        {/* Luxury gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? `linear-gradient(to top, rgba(4,4,26,0.5) 0%, transparent 45%), linear-gradient(to bottom-right, ${PALETTE.violet500}1F, transparent 60%)`
            : `linear-gradient(to top, rgba(255,255,255,0.25) 0%, transparent 50%), linear-gradient(to bottom-right, ${PALETTE.violet400}10, transparent 60%)`,
          pointerEvents: 'none',
        }} />

        {/* Gold shimmer accent */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? `radial-gradient(ellipse at 80% 8%, ${PALETTE.gold400}2E, transparent 55%)`
            : `radial-gradient(ellipse at 80% 8%, ${PALETTE.gold300}22, transparent 55%)`,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }} />

        {/* Hover shimmer sweep */}
        <motion.div
          animate={hovered ? { x: ['-130%', '130%'] } : { x: '-130%' }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.17) 50%, transparent 62%)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* ── Floating Badge: Open to Work ── */}
      <motion.div
        initial={{ opacity: 0, x: 22, y: -22 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.08, y: -3 }}
        style={{
          position: 'absolute',
          top: isXS ? -10 : isSmall ? -10 : isMobile ? -12 : 14,
          right: isXS ? -10 : isSmall ? -10 : isMobile ? -12 : -22,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: isXS ? '7px 12px' : '10px 18px',
          borderRadius: 999,
          background: isDark ? 'rgba(4,4,18,0.9)' : 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isDark ? `${PALETTE.emerald400}40` : `${PALETTE.emerald500}30`}`,
          boxShadow: isDark
            ? `0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${PALETTE.emerald400}20, inset 0 1px 0 rgba(255,255,255,0.06)`
            : `0 8px 32px rgba(0,0,0,0.1), 0 0 20px ${PALETTE.emerald500}14, inset 0 1px 0 rgba(255,255,255,0.9)`,
          zIndex: 10, cursor: 'default',
        }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: PALETTE.emerald400,
          boxShadow: `0 0 12px ${PALETTE.emerald400}CC`,
          animation: 'hero-dot-pulse 1.8s ease-in-out infinite',
          display: 'inline-block', flexShrink: 0,
        }} />
        <span style={{
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          fontSize: isXS ? '0.62rem' : '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
          color: isDark ? PALETTE.emerald400 : PALETTE.emerald500,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>Open to Work</span>
      </motion.div>

      {/* ── Floating Badge: MSc ── */}
      <motion.div
        initial={{ opacity: 0, x: -22, y: 22 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.08, y: 3 }}
        style={{
          position: 'absolute',
          bottom: isXS ? -10 : isSmall ? -10 : isMobile ? -12 : 24,
          left: isXS ? -10 : isSmall ? -10 : isMobile ? -12 : -26,
          display: 'flex', alignItems: 'center', gap: 9,
          padding: isXS ? '8px 12px' : '11px 16px',
          borderRadius: 18,
          background: isDark ? 'rgba(4,4,18,0.92)' : 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isDark ? `${PALETTE.violet400}30` : `${PALETTE.violet600}20`}`,
          boxShadow: isDark
            ? `0 8px 32px rgba(0,0,0,0.6), 0 0 24px ${PALETTE.violet500}18, inset 0 1px 0 rgba(255,255,255,0.06)`
            : `0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)`,
          zIndex: 10, cursor: 'default',
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 11,
          background: isDark
            ? `linear-gradient(135deg, ${PALETTE.violet500}44, ${PALETTE.gold400}22)`
            : `linear-gradient(135deg, ${PALETTE.violet500}22, ${PALETTE.gold400}14)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          border: `1px solid ${isDark ? `${PALETTE.violet400}30` : `${PALETTE.violet500}20`}`,
        }}>
          <BookOpen size={14} style={{ color: isDark ? PALETTE.violet300 : PALETTE.violet700 }} />
        </div>
        <div>
          <div style={{
            fontFamily: '"Syne", system-ui, sans-serif',
            fontSize: isXS ? '0.7rem' : '0.78rem', fontWeight: 800,
            color: isDark ? '#FFFFFF' : '#0A0A1A',
            lineHeight: 1.15,
          }}>MSc Candidate</div>
          <div style={{
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            fontSize: isXS ? '0.55rem' : '0.62rem', fontWeight: 500,
            color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.48)',
          }}>Information Systems</div>
        </div>
      </motion.div>

      {/* ── Floating Badge: ML/AI (desktop only) ── */}
      {!isMobile && !isSmall && (
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
          style={{
            position: 'absolute', top: '52%', right: -40,
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            padding: '13px 15px', borderRadius: 18,
            background: isDark ? 'rgba(4,4,18,0.92)' : 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${isDark ? `${PALETTE.rose400}25` : `${PALETTE.rose500}18`}`,
            boxShadow: isDark
              ? `0 8px 32px rgba(0,0,0,0.6), 0 0 22px ${PALETTE.rose400}15, inset 0 1px 0 rgba(255,255,255,0.06)`
              : `0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`,
            zIndex: 10, cursor: 'default',
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: isDark
              ? `linear-gradient(135deg, ${PALETTE.rose400}30, ${PALETTE.violet400}20)`
              : `linear-gradient(135deg, ${PALETTE.rose400}18, ${PALETTE.violet400}12)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${isDark ? `${PALETTE.rose400}25` : `${PALETTE.rose400}15`}`,
          }}>
            <Sparkles size={17} style={{ color: isDark ? PALETTE.rose400 : PALETTE.rose500 }} />
          </div>
          <span style={{
            fontFamily: '"Syne", system-ui, sans-serif',
            fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.08em',
            color: isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.75)',
            textTransform: 'uppercase',
          }}>ML / AI</span>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-PREMIUM ROLE BADGE — Multi-color gradient accent
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
        initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '10px 24px', borderRadius: 999,
          background: isDark
            ? `linear-gradient(135deg, ${PALETTE.violet500}1A, ${PALETTE.gold400}0F, ${PALETTE.cyan400}0A)`
            : `linear-gradient(135deg, ${PALETTE.violet500}0F, ${PALETTE.gold400}08, ${PALETTE.cyan400}06)`,
          border: `1px solid ${isDark ? `${PALETTE.violet400}38` : `${PALETTE.violet600}25`}`,
          backdropFilter: 'blur(18px)',
          boxShadow: isDark
            ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px ${PALETTE.violet500}14`
            : `inset 0 1px 0 rgba(255,255,255,0.75), 0 2px 16px ${PALETTE.violet400}0D`,
        }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: `linear-gradient(135deg, ${PALETTE.violet400}, ${PALETTE.gold400})`,
          boxShadow: `0 0 14px ${PALETTE.violet400}BB`,
          animation: 'hero-dot-pulse 2s ease-in-out infinite',
          display: 'inline-block', flexShrink: 0,
        }} />
        <span style={{
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          color: isDark ? PALETTE.violet300 : PALETTE.violet700,
          fontSize: '0.86rem', fontWeight: 700, letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}>
          {role}
        </span>
        <span style={{
          width: 2, height: 17, borderRadius: 1,
          background: `linear-gradient(to bottom, ${PALETTE.violet400}, ${PALETTE.gold400})`,
          animation: 'hero-cursor-blink 1s steps(2) infinite',
          display: 'inline-block', opacity: 0.85,
        }} />
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PREMIUM TAG PILL
═══════════════════════════════════════════════════════════════════════ */
function TagPill({ label, color, delay }: { label: string; color: string; delay: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 13px', borderRadius: 999,
        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        textTransform: 'uppercase',
        color: color,
        background: `${color}${isDark ? '16' : '10'}`,
        border: `1px solid ${color}${isDark ? '33' : '28'}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Star size={9} fill="currentColor" />
      {label}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-PREMIUM STAT CARD — gradient top accent + gradient suffix
═══════════════════════════════════════════════════════════════════════ */
interface StatCardProps {
  value: string | number;
  suffix: string;
  label: string;
  accentColor: string;
  gradColors: [string, string];
  icon: React.ReactNode;
  delay: number;
}

function StatCard({ value, suffix, label, accentColor, gradColors, icon, delay }: StatCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 7,
        padding: '24px 16px', borderRadius: 22,
        background: isDark
          ? hov
            ? `linear-gradient(145deg, ${gradColors[0]}14, ${gradColors[1]}0A)`
            : 'rgba(255,255,255,0.03)'
          : hov
            ? `linear-gradient(145deg, ${gradColors[0]}0E, ${gradColors[1]}08, rgba(255,255,255,0.95))`
            : 'rgba(255,255,255,0.68)',
        border: `1px solid ${isDark
          ? hov ? `${accentColor}38` : 'rgba(255,255,255,0.06)'
          : hov ? `${accentColor}2A` : 'rgba(0,0,0,0.06)'}`,
        backdropFilter: 'blur(24px)',
        boxShadow: hov
          ? isDark
            ? `0 16px 48px -10px ${accentColor}2A, inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 1px ${accentColor}14`
            : `0 16px 48px -10px ${accentColor}1A, inset 0 1px 0 rgba(255,255,255,0.95)`
          : isDark
            ? 'inset 0 1px 0 rgba(255,255,255,0.05)'
            : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 10px rgba(0,0,0,0.04)',
        transform: hov ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
        transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top gradient accent line */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: 2,
        background: `linear-gradient(90deg, transparent, ${gradColors[0]}${hov ? 'CC' : '77'}, ${gradColors[1]}${hov ? 'CC' : '77'}, transparent)`,
        borderRadius: '0 0 2px 2px',
        transition: 'all 0.38s ease',
      }} />

      {/* Icon */}
      <motion.div
        animate={hov ? { scale: 1.18, rotate: 8 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        style={{
          width: 40, height: 40, borderRadius: 13,
          background: `linear-gradient(135deg, ${gradColors[0]}2A, ${gradColors[1]}1A)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${accentColor}33`,
          marginBottom: 3,
          boxShadow: hov ? `0 4px 18px ${accentColor}22` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <span style={{ color: accentColor, display: 'flex' }}>{icon}</span>
      </motion.div>

      {/* Value + gradient suffix */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{
          fontFamily: '"Syne", system-ui, sans-serif',
          fontSize: '1.65rem', fontWeight: 800, lineHeight: 1,
          color: isDark ? '#F2F4FF' : '#0A0A1A',
        }}>
          {value || ''}
        </span>
        <span style={{
          fontFamily: '"Syne", system-ui, sans-serif',
          fontSize: '1.08rem', fontWeight: 700,
          background: `linear-gradient(135deg, ${gradColors[0]}, ${gradColors[1]})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {suffix}
        </span>
      </div>
      <span style={{
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontSize: 'clamp(0.65rem, 2.5vw, 0.7rem)', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.38)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-PREMIUM SHIMMER CTA BUTTON — multi-gradient + gold edge glow
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
        display: 'inline-flex', alignItems: 'center', gap: 11,
        padding: '15px 36px', borderRadius: 999,
        fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.015em',
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        textDecoration: 'none',
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
        ...(isPrimary ? {
          background: `linear-gradient(135deg, ${PALETTE.violet600} 0%, ${PALETTE.violet500} 35%, ${PALETTE.rose400}99 70%, ${PALETTE.gold400}55 100%)`,
          color: '#FFFFFF',
          border: 'none',
          boxShadow: isDark
            ? `0 4px 32px -4px ${PALETTE.violet500}66, 0 0 48px -12px ${PALETTE.gold400}22, inset 0 1px 0 rgba(255,255,255,0.22)`
            : `0 4px 32px -4px ${PALETTE.violet500}4D, 0 0 36px -12px ${PALETTE.gold400}18, inset 0 1px 0 rgba(255,255,255,0.3)`,
        } : {
          background: isDark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.92)',
          color: isDark ? '#E8EAFF' : '#1A1A2E',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.11)'}`,
          backdropFilter: 'blur(18px)',
          boxShadow: isDark
            ? `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px rgba(255,255,255,0.04)`
            : `inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 10px rgba(0,0,0,0.05)`,
        }),
      }}
      whileHover={{
        y: -5,
        boxShadow: isPrimary
          ? (isDark
            ? `0 20px 56px -8px ${PALETTE.violet500}70, 0 0 60px -12px ${PALETTE.gold400}30, inset 0 1px 0 rgba(255,255,255,0.28)`
            : `0 20px 56px -8px ${PALETTE.violet500}55, 0 0 48px -12px ${PALETTE.gold400}22, inset 0 1px 0 rgba(255,255,255,0.35)`)
          : (isDark
            ? `0 12px 36px -8px ${PALETTE.violet500}2A, inset 0 1px 0 rgba(255,255,255,0.12)`
            : `0 12px 36px -8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.98)`),
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {isPrimary && (
        <>
          {/* Shimmer sweep */}
          <span style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
            animation: 'hero-shimmer 3.5s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          {/* Gold bottom edge glow */}
          <span style={{
            position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
            background: `linear-gradient(90deg, transparent, ${PALETTE.gold400}99, transparent)`,
            pointerEvents: 'none',
          }} />
        </>
      )}
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 11 }}>
        {children}
      </span>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-PREMIUM SCROLL INDICATOR — gradient line
═══════════════════════════════════════════════════════════════════════ */
function ScrollIndicator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2, duration: 1.4 }}
      style={{
        position: 'absolute', bottom: 30, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
        zIndex: 5,
      }}
    >
      <span style={{
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.24)' : 'rgba(0,0,0,0.3)',
      }}>
        Explore
      </span>
      <div style={{
        width: 1.5, height: 44, borderRadius: 1,
        background: isDark
          ? `linear-gradient(to bottom, ${PALETTE.violet400}99, ${PALETTE.gold400}66, transparent)`
          : `linear-gradient(to bottom, ${PALETTE.violet600}88, ${PALETTE.gold500}55, transparent)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '42%',
            background: `linear-gradient(to bottom, ${PALETTE.violet400}, ${PALETTE.gold400})`,
            borderRadius: 1,
          }}
        />
      </div>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={14} style={{ color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.24)' }} />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN HERO — Ultra-Premium, Ultra-Responsive
═══════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const greeting = useGreeting();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isXL      = useMediaQuery(`(min-width: ${BREAKPOINT_XL}px)`);
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINT_LG}px)`);
  const isMobile  = useMediaQuery(`(max-width: ${BREAKPOINT_MD - 1}px)`);
  const isSmall   = useMediaQuery(`(max-width: ${BREAKPOINT_SM - 1}px)`);
  const isXS      = useMediaQuery(`(max-width: ${BREAKPOINT_XS - 1}px)`);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const stagger = {
    greeting: 0.1,
    tags:     0.22,
    name:     0.32,
    role:     0.56,
    meta:     0.76,
    desc:     0.96,
    cta:      1.22,
    stats:    1.50,
    photo:    0.55,
  };

  const nameFontSize = isXS
    ? 'clamp(1.8rem, 8.5vw, 2.3rem)'
    : isSmall
      ? 'clamp(2.1rem, 9vw, 2.7rem)'
      : isMobile
        ? 'clamp(2.5rem, 10vw, 3.2rem)'
        : isXL
          ? 'clamp(3.4rem, 4.5vw, 5.8rem)'
          : 'clamp(2.9rem, 4.8vw, 5.2rem)';

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{ position: 'relative', width: '100%' }}
    >
      <CinematicBackground />
      <LuxuryParticles isDark={isDark} />

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
            margin: 'auto 0',
            width: '100%',
            maxWidth: CONTENT_MAX_W,
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: isXS ? 14 : isSmall ? 18 : isMobile ? 24 : 52,
            paddingRight: isXS ? 14 : isSmall ? 18 : isMobile ? 24 : 52,
            boxSizing: 'border-box',
          }}>

            {/* ══════════════ MAIN GRID ══════════════ */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? '1fr 0.9fr' : '1fr',
              gap: isDesktop ? 64 : isMobile ? 28 : 40,
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
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: stagger.greeting, ease: [0.16, 1, 0.3, 1] }}
                      style={{ marginBottom: isXS ? 12 : isSmall ? 14 : isMobile ? 18 : 24 }}
                    >
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '9px 22px', borderRadius: 999,
                        background: isDark
                          ? `linear-gradient(135deg, ${PALETTE.violet500}10, ${PALETTE.gold400}08)`
                          : `linear-gradient(135deg, ${PALETTE.violet500}08, ${PALETTE.gold400}05)`,
                        border: `1px solid ${isDark ? `${PALETTE.violet400}28` : `${PALETTE.violet600}18`}`,
                        backdropFilter: 'blur(18px)',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: isDark
                          ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 24px ${PALETTE.violet500}10`
                          : `inset 0 1px 0 rgba(255,255,255,0.7)`,
                      }}>
                        <span style={{
                          position: 'absolute', inset: -1,
                          borderRadius: 999,
                          background: `conic-gradient(from 0deg, transparent 0%, ${isDark ? `${PALETTE.violet400}44` : `${PALETTE.violet600}28`} 25%, ${isDark ? `${PALETTE.gold400}33` : `${PALETTE.gold500}20`} 50%, transparent 75%)`,
                          animation: 'hero-border-rotate 5s linear infinite',
                          zIndex: 0, filter: 'blur(2px)',
                        }} />
                        <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: PALETTE.emerald400,
                            boxShadow: `0 0 12px ${PALETTE.emerald400}CC`,
                            animation: 'hero-dot-pulse 2s ease-in-out infinite',
                            display: 'inline-block',
                          }} />
                          <span style={{
                             fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                            fontSize: isXS ? '0.62rem' : '0.72rem', fontWeight: 600, letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.62)',
                          }}>
                            {greeting} — Welcome
                          </span>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Luxury tag pills */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: stagger.tags }}
                  style={{
                    display: 'flex', gap: 8, flexWrap: 'wrap',
                    justifyContent: isDesktop ? 'flex-start' : 'center',
                    marginBottom: isXS ? 14 : isSmall ? 16 : isMobile ? 20 : 26,
                  }}
                >
                  <TagPill label="Nepal 🇳🇵" color={PALETTE.emerald400} delay={stagger.tags + 0.05} />
                  <TagPill label="GIS Expert" color={PALETTE.cyan400} delay={stagger.tags + 0.15} />
                  <TagPill label="AI/ML" color={PALETTE.violet400} delay={stagger.tags + 0.25} />
                  <TagPill label="Educator" color={PALETTE.gold400} delay={stagger.tags + 0.35} />
                </motion.div>

                {/* Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1.1, delay: stagger.name, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: '"Syne", system-ui, sans-serif',
                    fontWeight: 800,
                    fontSize: nameFontSize,
                    lineHeight: 1.04,
                    letterSpacing: '-0.038em',
                    marginBottom: isXS ? 12 : isSmall ? 14 : isMobile ? 18 : 24,
                    /* Ultra-premium multi-stop gradient — vivid in BOTH modes */
                    background: isDark
                      ? `linear-gradient(148deg,
                          #FFFFFF 0%,
                          ${PALETTE.violet200} 28%,
                          ${PALETTE.violet300} 48%,
                          ${PALETTE.gold300} 68%,
                          ${PALETTE.violet400} 85%,
                          ${PALETTE.cyan300} 100%)`
                      : `linear-gradient(148deg,
                          ${PALETTE.violet900} 0%,
                          ${PALETTE.violet700} 28%,
                          ${PALETTE.violet600} 48%,
                          ${PALETTE.gold500} 68%,
                          ${PALETTE.violet700} 85%,
                          ${PALETTE.cyan500} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                    backgroundSize: '200% 200%',
                    animation: 'hero-name-shift 8s ease-in-out infinite',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'keep-all',
                    overflowWrap: 'normal',
                  }}
                >
                  {language === 'ne' ? 'सुरज थारु\nचौधरी' : 'Suraj Tharu\nChaudhary'}
                </motion.h1>

                {/* Role Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: stagger.role }}
                  style={{ marginBottom: isXS ? 12 : isSmall ? 14 : isMobile ? 16 : 22 }}
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
                    marginBottom: isXS ? 14 : isSmall ? 16 : isMobile ? 20 : 28,
                    fontSize: isXS ? '0.68rem' : isSmall ? '0.72rem' : '0.8rem', fontWeight: 500,
                    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                    color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)',
                    letterSpacing: '0.01em',
                    flexWrap: 'wrap',
                    justifyContent: isDesktop ? 'flex-start' : 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={13} style={{ color: isDark ? PALETTE.violet400 : PALETTE.violet600, flexShrink: 0 }} />
                    <span>{t('hero.location')}</span>
                  </div>
                  <span style={{
                    width: 3, height: 3, borderRadius: '50%',
                    background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)',
                    display: 'inline-block',
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Zap size={12} style={{ color: PALETTE.emerald400, flexShrink: 0 }} />
                    <span style={{ color: isDark ? PALETTE.emerald400 : PALETTE.emerald500, fontWeight: 700 }}>
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
                    maxWidth: 530,
                    marginBottom: isXS ? 20 : isSmall ? 22 : isMobile ? 28 : 38,
                    fontSize: isXS ? '0.82rem' : isSmall ? '0.86rem' : isMobile ? '0.9rem' : 'clamp(0.92rem, 1.15vw, 1.03rem)',
                    lineHeight: 1.76,
                    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                    color: isDark ? 'rgba(255,255,255,0.52)' : 'rgba(0,0,0,0.58)',
                    fontWeight: 400,
                    wordBreak: 'keep-all',
                    overflowWrap: 'normal',
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
                initial={{ opacity: 0, scale: 0.86, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.3, delay: stagger.photo, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  order: isDesktop ? 2 : 1,
                  paddingTop: !isDesktop ? (isXS ? 6 : isSmall ? 10 : 18) : 0,
                  paddingBottom: !isDesktop ? (isXS ? 6 : isSmall ? 10 : 18) : 0,
                  position: 'relative',
                  minWidth: 0,
                  overflow: 'visible',
                }}
              >
                <LuxuryProfileCard isMobile={isMobile} isSmall={isSmall} isXS={isXS} />
              </motion.div>
            </div>

            {/* ════════ STATS BAR ════════ */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: stagger.stats, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: isXS ? 'repeat(2, 1fr)' : isSmall ? 'repeat(2, 1fr)' : isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: isXS ? 7 : isSmall ? 8 : isMobile ? 10 : 14,
                width: '100%',
                marginTop: isDesktop ? 60 : isXS ? 20 : isSmall ? 24 : 36,
              }}
            >
              {([
                {
                  value: 5, suffix: '+', label: 'Years Teaching',
                  accentColor: PALETTE.violet400, gradColors: [PALETTE.violet400, PALETTE.violet300] as [string,string],
                  icon: <BookOpen size={17} />,
                },
                {
                  value: '', suffix: 'MSc', label: 'Info Systems',
                  accentColor: PALETTE.cyan400, gradColors: [PALETTE.cyan400, PALETTE.sapphire400] as [string,string],
                  icon: <Award size={17} />,
                },
                {
                  value: '', suffix: 'GIS', label: 'Spatial Analysis',
                  accentColor: PALETTE.emerald400, gradColors: [PALETTE.emerald400, PALETTE.cyan400] as [string,string],
                  icon: <Globe size={17} />,
                },
                {
                  value: '', suffix: 'ML', label: 'Deep Learning',
                  accentColor: PALETTE.rose400, gradColors: [PALETTE.rose400, PALETTE.gold400] as [string,string],
                  icon: <Sparkles size={17} />,
                },
              ] as const).map((s, i) => (
                <StatCard
                  key={s.label}
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  accentColor={s.accentColor}
                  gradColors={s.gradColors}
                  icon={s.icon}
                  delay={stagger.stats + i * 0.1}
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
          0% { transform: translateX(-130%); }
          60%, 100% { transform: translateX(130%); }
        }
        @keyframes hero-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.42; transform: scale(0.8); }
        }
        @keyframes hero-cursor-blink {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 0; }
        }
        @keyframes hero-border-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes hero-name-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @media (max-width: 359px) {
          #hero { min-height: 100svh; }
        }
      `}</style>
    </section>
  );
}
