import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { TextReveal } from './premium/TextReveal';
import Hero3D from './Hero3D';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';
import { Sparkles, ArrowRight, MapPin, Star, Zap } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-LUXURY KEYFRAMES & GLOBAL ANIMATIONS
═══════════════════════════════════════════════════════════════════════ */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Cinzel:wght@400;500;600;700;800;900&display=swap');

  @keyframes aurora-drift-1 {
    0%,100% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.7; }
    25%      { transform: translate(60px,-50px) scale(1.18) rotate(6deg); opacity: 0.9; }
    50%      { transform: translate(-20px,40px) scale(1.05) rotate(-3deg); opacity: 0.75; }
    75%      { transform: translate(40px,20px) scale(1.12) rotate(4deg); opacity: 0.85; }
  }
  @keyframes aurora-drift-2 {
    0%,100% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.6; }
    30%      { transform: translate(-70px,35px) scale(1.15) rotate(-7deg); opacity: 0.8; }
    60%      { transform: translate(45px,-30px) scale(0.92) rotate(5deg); opacity: 0.65; }
    85%      { transform: translate(-25px,55px) scale(1.08) rotate(-2deg); opacity: 0.72; }
  }
  @keyframes aurora-drift-3 {
    0%,100% { transform: translate(0,0) scale(1); opacity: 0.5; }
    40%      { transform: translate(30px,50px) scale(1.1); opacity: 0.7; }
    70%      { transform: translate(-40px,-35px) scale(1.14); opacity: 0.55; }
  }
  @keyframes aurora-drift-4 {
    0%,100% { transform: translate(0,0) scale(1); opacity: 0.4; }
    50%      { transform: translate(25px,-40px) scale(1.12); opacity: 0.6; }
  }
  @keyframes aurora-drift-5 {
    0%,100% { transform: translate(0,0) scale(1) rotate(0deg); opacity: 0.35; }
    33%      { transform: translate(-55px,20px) scale(1.08) rotate(-4deg); opacity: 0.55; }
    66%      { transform: translate(35px,45px) scale(0.96) rotate(3deg); opacity: 0.42; }
  }

  @keyframes hero-shimmer-cta {
    0%   { background-position: 200% 50%; }
    100% { background-position: -200% 50%; }
  }
  @keyframes badge-pulse-luxury {
    0%,100% { box-shadow: 0 0 0 0 rgba(196,167,255,0.4), 0 0 20px rgba(139,92,246,0.2); }
    50%     { box-shadow: 0 0 0 12px rgba(196,167,255,0), 0 0 40px rgba(139,92,246,0.4); }
  }
  @keyframes badge-dot-glow {
    0%,100% { transform: scale(1); opacity: 0.7; box-shadow: 0 0 0 0 rgba(167,139,250,0.6); }
    50%     { transform: scale(1.6); opacity: 1; box-shadow: 0 0 0 6px rgba(167,139,250,0); }
  }
  @keyframes scroll-dot-flow {
    0%   { transform: translateY(0); opacity: 1; }
    60%  { transform: translateY(20px); opacity: 0.3; }
    61%  { transform: translateY(0); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes float-skill {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%     { transform: translateY(-10px) rotate(0.8deg); }
    66%     { transform: translateY(-4px) rotate(-0.5deg); }
  }
  @keyframes ring-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes ring-rotate-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
  @keyframes holo-shift {
    0%,100% { background-position: 0% 50%; }
    50%     { background-position: 100% 50%; }
  }
  @keyframes gold-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes name-glow-pulse {
    0%,100% { filter: drop-shadow(0 0 20px rgba(167,139,250,0.3)) drop-shadow(0 0 60px rgba(167,139,250,0.1)); }
    50%     { filter: drop-shadow(0 0 40px rgba(244,114,182,0.5)) drop-shadow(0 0 90px rgba(167,139,250,0.2)); }
  }
  @keyframes particle-float {
    0%   { transform: translate(0,0) scale(1); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.8; }
    100% { transform: translate(var(--px), var(--py)) scale(0.3); opacity: 0; }
  }
  @keyframes luxury-divider {
    0%,100% { opacity: 0.6; background-position: 0% 50%; }
    50%     { opacity: 1; background-position: 100% 50%; }
  }
  @keyframes cta-border-flow {
    0%   { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }
  @keyframes orb-breathe {
    0%,100% { transform: scale(1); opacity: 0.85; }
    50%     { transform: scale(1.04); opacity: 1; }
  }
  @keyframes grid-pulse-luxury {
    0%,100% { opacity: 0.018; }
    50%     { opacity: 0.045; }
  }
  @keyframes grid-pulse-light {
    0%,100% { opacity: 0.06; }
    50%     { opacity: 0.14; }
  }

  :root {
    --name-grad-1: linear-gradient(135deg,#ddd6fe 0%,#c4b5fd 25%,#a78bfa 50%,#f472b6 80%,#fb7185 100%);
    --name-grad-2: linear-gradient(135deg,#f9a8d4 0%,#f472b6 25%,#ec4899 50%,#f97316 80%,#fbbf24 100%);
    --name-grad-3: linear-gradient(135deg,#bae6fd 0%,#7dd3fc 25%,#38bdf8 50%,#818cf8 75%,#a78bfa 100%);
    --role-grad: linear-gradient(135deg,#c4b5fd,#a78bfa 30%,#f472b6 70%,#fb7185);
    --desc-color: rgba(203,213,225,0.65);
    --loc-color: rgba(148,163,184,0.55);
  }

  .light {
    --name-grad-1: linear-gradient(135deg,#4c1d95 0%,#7c3aed 25%,#db2777 50%,#e11d48 80%,#be123c 100%);
    --name-grad-2: linear-gradient(135deg,#db2777 0%,#be185d 25%,#9d174d 50%,#b45309 80%,#b45309 100%);
    --name-grad-3: linear-gradient(135deg,#0284c7 0%,#0369a1 25%,#1d4ed8 50%,#4338ca 75%,#4c1d95 100%);
    --role-grad: linear-gradient(135deg,#4c1d95,#7c3aed 30%,#db2777 70%,#be185d);
    --desc-color: rgba(30,27,75,0.78);
    --loc-color: rgba(79,70,229,0.75);
  }

  .hero-section {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }
  .hero-name-word {
    animation: name-glow-pulse 5s ease-in-out infinite;
  }
  .hero-divider {
    background-size: 300% 300%;
    animation: luxury-divider 6s ease-in-out infinite;
  }

  /* ── LIGHT MODE HERO OVERRIDES ───────────────────────────────────────
     Ensures all text and UI elements are crisp & readable in day mode.
  ──────────────────────────────────────────────────────────────────── */
  .light .hero-section {
    background: linear-gradient(160deg, #faf8ff 0%, #f3f0ff 40%, #fdf2ff 70%, #f0f8ff 100%) !important;
  }
  /* Dark background orbs → off in light mode */
  .light .hero-aurora-base {
    background: linear-gradient(160deg, #faf8ff 0%, #f1edff 50%, #fdf4ff 100%) !important;
  }
  /* Greeting pill — light mode */
  .light .hero-greeting-pill {
    background: linear-gradient(rgba(250,248,255,0.96), rgba(250,248,255,0.96)) padding-box,
                linear-gradient(135deg, rgba(109,40,217,0.5), rgba(219,39,119,0.4), rgba(6,182,212,0.3)) border-box !important;
    box-shadow: 0 4px 20px rgba(109,40,217,0.12) !important;
  }
  /* Name headline — light keeps gradient but stronger */
  .light .hero-name-word {
    animation: none !important;
    filter: none !important;
  }
  /* Role badge text */
  .light .hero-role span {
    background: linear-gradient(135deg, #5b21b6, #7c3aed 35%, #db2777 70%, #e11d48) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
    color: transparent !important;
  }
  /* Description text */
  .light .hero-description {
    color: rgba(30, 27, 75, 0.72) !important;
  }
  /* Location */
  .light .hero-location {
    color: rgba(79, 70, 229, 0.6) !important;
  }
  /* Stats strip */
  .light .hero-stats-strip {
    background: linear-gradient(135deg, rgba(245,243,255,0.9), rgba(255,255,255,0.85), rgba(240,253,255,0.8)) !important;
    border: 1px solid rgba(109,40,217,0.15) !important;
    box-shadow: 0 4px 32px rgba(109,40,217,0.1), inset 0 1px 0 rgba(255,255,255,0.9) !important;
  }
  .light .hero-stat-value {
    background: linear-gradient(135deg, #4c1d95, #6d28d9, #be185d) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
  }
  .light .hero-stat-label {
    color: rgba(79, 70, 229, 0.5) !important;
  }
  /* Scroll indicator */
  .light .hero-scroll-label {
    color: rgba(79, 70, 229, 0.45) !important;
  }
  .light .hero-scroll-shell {
    border-color: rgba(109,40,217,0.25) !important;
    background: rgba(109,40,217,0.04) !important;
  }
  /* Overline */
  .light .hero-overline {
    color: rgba(109, 40, 217, 0.5) !important;
  }
  /* Corner accents */
  .light .hero-corners path {
    stroke: url(#corner-grad-light) !important;
  }
  /* Floating tags — light mode */
  .light .hero-tag {
    background: linear-gradient(rgba(250,248,255,0.95), rgba(250,248,255,0.95)) !important;
    box-shadow: 0 4px 20px rgba(109,40,217,0.12), inset 0 1px 0 rgba(255,255,255,0.9) !important;
  }
  /* Grid visible in light mode */
  .light .hero-dot-grid {
    animation: grid-pulse-light 9s ease-in-out infinite !important;
    opacity: 0.08 !important;
  }
  /* Orb opacity reduced in light mode (subtle tint) */
  .light .hero-orb {
    opacity: 0.18 !important;
  }
  /* Vignette hidden in light mode */
  .light .hero-vignette,
  .light .hero-bottom-fade {
    display: none !important;
  }
  /* Particle field hidden in light mode (would clash) */
  .light .hero-particles {
    display: none !important;
  }
  /* Secondary CTA button — light mode */
  .light .hero-cta-secondary {
    color: rgba(79, 70, 229, 0.9) !important;
    box-shadow: 0 4px 16px rgba(109,40,217,0.12) !important;
  }
  /* Available badge */
  .light .hero-available {
    color: rgba(5, 150, 105, 0.7) !important;
  }
  /* Badge dot */
  .light .hero-badge-dot-pulse {
    animation: badge-dot-glow 2s ease-in-out infinite;
  }
`;

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-LUXURY AURORA BACKGROUND (7 LAYER)
═══════════════════════════════════════════════════════════════════════ */
function UltraAuroraBg() {
  return (
    <>
      <style>{globalStyles}</style>

      {/* Absolute depth base */}
      <div className="hero-aurora-base" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,#04020e 0%,#060412 40%,#08050f 70%,#030209 100%)' }} />

      {/* Cinematic noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
      }} />

      {/* ORBS — layered depth */}
      {/* Violet primary */}
      <div className="hero-orb" style={{
        position: 'absolute', top: '-30%', left: '-25%',
        width: '90vw', height: '90vw', borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%,rgba(124,58,237,0.62),rgba(219,39,119,0.3) 40%,rgba(56,189,248,0.08) 65%,transparent 75%)',
        filter: 'blur(100px)',
        animation: 'aurora-drift-1 18s ease-in-out infinite',
      }} />
      {/* Cyan-teal */}
      <div className="hero-orb" style={{
        position: 'absolute', bottom: '-25%', right: '-22%',
        width: '80vw', height: '80vw', borderRadius: '50%',
        background: 'radial-gradient(circle at 65% 65%,rgba(6,182,212,0.45),rgba(59,130,246,0.28) 40%,rgba(124,58,237,0.12) 65%,transparent 78%)',
        filter: 'blur(110px)',
        animation: 'aurora-drift-2 22s ease-in-out infinite',
      }} />
      {/* Pink midfield */}
      <div className="hero-orb" style={{
        position: 'absolute', top: '28%', left: '42%', transform: 'translateX(-50%)',
        width: '65vw', height: '65vw', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(244,114,182,0.28),rgba(167,139,250,0.22) 40%,transparent 68%)',
        filter: 'blur(90px)',
        animation: 'aurora-drift-3 14s ease-in-out infinite 1.5s',
      }} />
      {/* Emerald accent */}
      <div className="hero-orb" style={{
        position: 'absolute', top: '55%', right: '10%',
        width: '40vw', height: '40vw', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(52,211,153,0.22),rgba(16,185,129,0.1) 50%,transparent 72%)',
        filter: 'blur(70px)',
        animation: 'aurora-drift-4 12s ease-in-out infinite 2s',
      }} />
      {/* Royal gold accent */}
      <div className="hero-orb" style={{
        position: 'absolute', top: '15%', right: '5%',
        width: '30vw', height: '30vw', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(245,158,11,0.14),rgba(251,191,36,0.08) 50%,transparent 70%)',
        filter: 'blur(60px)',
        animation: 'aurora-drift-5 17s ease-in-out infinite 3s',
      }} />
      {/* Deep indigo upper-right */}
      <div className="hero-orb" style={{
        position: 'absolute', top: '-10%', right: '-10%',
        width: '55vw', height: '55vw', borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(79,70,229,0.3),rgba(99,102,241,0.14) 50%,transparent 70%)',
        filter: 'blur(85px)',
        animation: 'aurora-drift-1 20s ease-in-out infinite 4s',
      }} />

      {/* Luxury dot grid */}
      <div className="hero-dot-grid" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(167,139,250,0.55) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        animation: 'grid-pulse-luxury 9s ease-in-out infinite',
      }} />

      {/* Diagonal luxury lines overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.015,
        backgroundImage: 'repeating-linear-gradient(135deg,rgba(167,139,250,1) 0px,rgba(167,139,250,1) 1px,transparent 1px,transparent 60px)',
      }} />

      {/* Center radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 42%,rgba(124,58,237,0.12) 0%,transparent 70%)',
      }} />

      {/* Vignette */}
      <div className="hero-vignette" style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 80% at 50% 48%,transparent 30%,rgba(3,1,9,0.8) 100%)',
      }} />

      {/* Bottom fade to next section */}
      <div className="hero-bottom-fade" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%',
        background: 'linear-gradient(to top,rgba(4,2,14,1) 0%,transparent 100%)',
      }} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PARTICLE SYSTEM — data hoisted to module scope (fixes React purity rule)
═══════════════════════════════════════════════════════════════════════ */
const PARTICLE_COLORS = [
  'rgba(167,139,250,',
  'rgba(244,114,182,',
  'rgba(56,189,248,',
  'rgba(52,211,153,',
  'rgba(251,191,36,',
];

// Seeded deterministic values — generated once at module load, never on re-render
const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  // Simple LCG-like deterministic spread based on index
  const t = (i * 137.508 + 42) % 100;
  const u = (i * 97.321 + 17) % 100;
  const v = (i * 61.803 + 5) % 1;
  const w = (i * 53.1 + 3.7) % 1;
  const d = (i * 41.2 + 1.9) % 1;
  const px = ((i * 73.9 + 11) % 200) - 100;
  const py = -((i * 89.3 + 23) % 300) - 80;
  return {
    id: i,
    x: t,
    y: u,
    size: v * 2.5 + 0.8,
    delay: w * 8,
    duration: d * 6 + 5,
    px,
    py,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  };
});

function ParticleField() {
  return (
    <div className="hero-particles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 2 }}>
      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `${p.color}0.9)`,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}0.8)`,
            ['--px' as string]: `${p.px}px`,
            ['--py' as string]: `${p.py}px`,
            animation: `particle-float ${p.duration}s ease-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATED SVG RINGS (holographic orbital)
═══════════════════════════════════════════════════════════════════════ */
function HolographicRings() {
  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '520px', height: '520px',
      pointerEvents: 'none', zIndex: 3,
    }}>
      {/* Outer ring */}
      <svg style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        animation: 'ring-rotate 24s linear infinite',
        opacity: 0.12,
      }} viewBox="0 0 520 520">
        <circle cx="260" cy="260" r="255" fill="none"
          stroke="url(#ring-grad-outer)" strokeWidth="1"
          strokeDasharray="8 16" />
        <defs>
          <linearGradient id="ring-grad-outer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Mid ring */}
      <svg style={{
        position: 'absolute', inset: '15%', width: '70%', height: '70%',
        animation: 'ring-rotate-reverse 18s linear infinite',
        opacity: 0.18,
      }} viewBox="0 0 364 364">
        <circle cx="182" cy="182" r="178" fill="none"
          stroke="url(#ring-grad-mid)" strokeWidth="1.5"
          strokeDasharray="4 20" />
        <defs>
          <linearGradient id="ring-grad-mid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner ring */}
      <svg style={{
        position: 'absolute', inset: '30%', width: '40%', height: '40%',
        animation: 'ring-rotate 12s linear infinite',
        opacity: 0.22,
      }} viewBox="0 0 208 208">
        <circle cx="104" cy="104" r="100" fill="none"
          stroke="url(#ring-grad-inner)" strokeWidth="2"
          strokeDasharray="2 10" />
        <defs>
          <linearGradient id="ring-grad-inner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>

      {/* Dot nodes on outer ring */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 260 + 255 * Math.cos(rad);
        const y = 260 + 255 * Math.sin(rad);
        const colors = ['#a78bfa', '#f472b6', '#38bdf8', '#34d399', '#f5a623'];
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${(x / 520) * 100}%`,
            top: `${(y / 520) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 6, height: 6, borderRadius: '50%',
            background: colors[i],
            boxShadow: `0 0 12px ${colors[i]}, 0 0 24px ${colors[i]}88`,
            opacity: 0.7,
          }} />
        );
      })}
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════════════
   ROLE BADGE — cinematic blur swap
═══════════════════════════════════════════════════════════════════════ */
function RoleBadge({ role }: { role: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={role}
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)', scale: 0.95 }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        exit={{ opacity: 0, y: -14, filter: 'blur(8px)', scale: 1.02 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
        style={{
          background: 'var(--role-grad)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {role}
      </motion.span>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CINEMATIC CHARACTER REVEAL WITH LUXURY GRADIENT
═══════════════════════════════════════════════════════════════════════ */
function CinematicWord({ text, delay = 0, gradient }: { text: string; delay?: number; gradient: string }) {
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', perspective: 1000 }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: '115%', rotateX: 65, opacity: 0, scale: 0.9 }}
          animate={{ y: '0%', rotateX: 0, opacity: 1, scale: 1 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            display: 'inline-block',
            background: gradient,
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'holo-shift 8s ease-in-out infinite',
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════════════════════ */
function AnimCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = to / 45;
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 35);
    return () => clearInterval(id);
  }, [started, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════
   3D MOUSE-TRACKING TILT
═══════════════════════════════════════════════════════════════════════ */
function use3DTilt() {
  const rotateX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 22 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 7);
    rotateY.set(dx * 7);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

/* ═══════════════════════════════════════════════════════════════════════
   LUXURY GOLD LINE DIVIDER
═══════════════════════════════════════════════════════════════════════ */
function LuxuryDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 1.2, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 'min(380px, 70%)',
        marginBottom: 24,
        originX: 0.5,
        position: 'relative',
      }}
    >
      {/* Main gradient line */}
      <div style={{
        height: 1.5,
        background: 'linear-gradient(90deg,transparent 0%,rgba(167,139,250,0.5) 20%,rgba(244,114,182,0.8) 50%,rgba(56,189,248,0.6) 80%,transparent 100%)',
        backgroundSize: '300% 300%',
        animation: 'luxury-divider 6s ease-in-out infinite',
        borderRadius: 999,
        boxShadow: '0 0 16px rgba(167,139,250,0.35), 0 0 32px rgba(244,114,182,0.2)',
      }} />
      {/* Center diamond accent */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        width: 7, height: 7,
        background: 'linear-gradient(135deg,#a78bfa,#f472b6)',
        boxShadow: '0 0 12px rgba(167,139,250,0.8)',
      }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LUXURY CTA PRIMARY BUTTON
═══════════════════════════════════════════════════════════════════════ */
function PrimaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      data-magnetic="true"
      whileHover={{ scale: 1.06, y: -5 }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 12,
        borderRadius: 999, padding: '16px 40px',
        fontSize: '0.92rem', fontWeight: 800,
        color: '#fff',
        background: 'linear-gradient(135deg,#7c3aed 0%,#a855f7 30%,#ec4899 65%,#0ea5e9 100%)',
        backgroundSize: '250% 250%',
        animation: 'hero-shimmer-cta 5s linear infinite',
        boxShadow: '0 12px 42px rgba(124,58,237,0.6), 0 4px 16px rgba(236,72,153,0.3), 0 0 0 1px rgba(167,139,250,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        textDecoration: 'none',
        letterSpacing: '0.04em',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Shimmer sweep */}
      <span style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.22) 50%,transparent 65%)',
        backgroundSize: '200% 100%',
        animation: 'hero-shimmer-cta 2.8s linear infinite',
      }} />
      {children}
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LUXURY CTA SECONDARY BUTTON (animated border)
═══════════════════════════════════════════════════════════════════════ */
function SecondaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      data-magnetic="true"
      whileHover={{ scale: 1.06, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="hero-cta-secondary"
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 12,
        borderRadius: 999, padding: '16px 40px',
        fontSize: '0.92rem', fontWeight: 800,
        color: hovered ? '#fff' : 'rgba(196,181,253,0.92)',
        border: '1px solid transparent',
        background: hovered
          ? 'linear-gradient(rgba(15,8,35,0.95),rgba(15,8,35,0.95)) padding-box, linear-gradient(135deg,#7c3aed,#ec4899,#0ea5e9) border-box'
          : 'linear-gradient(rgba(10,5,25,0.8),rgba(10,5,25,0.8)) padding-box, linear-gradient(135deg,rgba(167,139,250,0.3),rgba(244,114,182,0.3),rgba(56,189,248,0.3)) border-box',
        backdropFilter: 'blur(20px)',
        textDecoration: 'none',
        letterSpacing: '0.04em',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered
          ? '0 8px 32px rgba(124,58,237,0.35), 0 0 0 1px rgba(167,139,250,0.2), inset 0 0 24px rgba(124,58,237,0.08)'
          : '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {children}
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PREMIUM SCROLL INDICATOR
═══════════════════════════════════════════════════════════════════════ */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, duration: 1.2 }}
      style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        zIndex: 12, cursor: 'pointer',
      }}
      onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
    >
      <span className="hero-scroll-label" style={{
        fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.45em',
        fontWeight: 700, color: 'rgba(167,139,250,0.35)',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}>
        Scroll
      </span>

      {/* Luxury mouse shape */}
      <div className="hero-scroll-shell" style={{
        width: 28, height: 48, borderRadius: 14,
        border: '1.5px solid rgba(167,139,250,0.22)',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: '7px 0',
        background: 'rgba(124,58,237,0.04)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>
        <div style={{
          width: 4, height: 10, borderRadius: 999,
          background: 'linear-gradient(to bottom,#a78bfa,#f472b6)',
          boxShadow: '0 0 10px rgba(167,139,250,0.9)',
          animation: 'scroll-dot-flow 2.2s ease-in-out infinite',
        }} />
      </div>

      {/* Side lines decoration */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 20, height: 1, background: 'linear-gradient(to right,transparent,rgba(167,139,250,0.3))' }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(167,139,250,0.4)' }} />
        <div style={{ width: 20, height: 1, background: 'linear-gradient(to left,transparent,rgba(167,139,250,0.3))' }} />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LUXURY CORNER ACCENTS
═══════════════════════════════════════════════════════════════════════ */
function CornerAccents() {
  const corners = [
    { top: 24, left: 24, rotate: '0deg' },
    { top: 24, right: 24, rotate: '90deg' },
    { bottom: 100, left: 24, rotate: '-90deg' },
    { bottom: 100, right: 24, rotate: '180deg' },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5 + i * 0.1, duration: 0.8 }}
          style={{
            position: 'absolute', ...c,
            width: 24, height: 24,
            pointerEvents: 'none', zIndex: 4,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: `rotate(${c.rotate})` }}>
            <path d="M2 22 L2 4 Q2 2 4 2 L22 2" fill="none"
              stroke="url(#corner-grad)" strokeWidth="1.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="corner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN HERO — ULTRA LUXURY WORLD CLASS
═══════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const { t } = useLanguage();
  const greeting = useGreeting();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt();

  const roles = [
    t('hero.role.engineer'),
    t('hero.role.educator'),
    t('hero.role.researcher'),
    t('hero.role.gis'),
  ];

  /* HLS video background */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
    if (Hls.isSupported()) {
      const hls = new Hls({ startPosition: -1, capLevelToPlayerSize: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      hls.on(Hls.Events.ERROR, (_e, d) => {
        if (d.fatal) { hls.destroy(); if (video.parentElement) video.parentElement.style.opacity = '0'; }
      });
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => video.play().catch(() => {}));
    }
  }, []);

  /* Role rotation */
  useEffect(() => {
    const id = setInterval(() => setRoleIndex(p => (p + 1) % roles.length), 2800);
    return () => clearInterval(id);
  }, [roles.length]);

  /* Scroll parallax */
  const { scrollY } = useScroll();
  const yBg     = useTransform(scrollY, [0, 900], [0, 200]);
  const opacity  = useTransform(scrollY, [0, 600], [1, 0]);
  const scale    = useTransform(scrollY, [0, 600], [1, 0.94]);
  const yContent = useTransform(scrollY, [0, 600], [0, -60]);

  /* Name config with ultra-luxury gradients */
  const nameConfig = [
    {
      word: 'Suraj',
      gradient: 'var(--name-grad-1)',
      delay: 0.2,
    },
    {
      word: 'Tharu',
      gradient: 'var(--name-grad-2)',
      delay: 0.55,
    },
    {
      word: 'Chaudhary',
      gradient: 'var(--name-grad-3)',
      delay: 0.9,
    },
  ];

  /* Luxury stats with rich data */
  const stats = [
    { value: 5, suffix: '+', label: 'Years Teaching', icon: '🎓', isText: false },
    { value: 0, suffix: 'MSc', label: 'Info Systems', icon: '📡', isText: true },
    { value: 0, suffix: 'GIS', label: 'Spatial Analysis', icon: '🗺️', isText: true },
    { value: 0, suffix: 'ML', label: 'Deep Learning', icon: '🤖', isText: true },
  ];

  return (
    <motion.section
      ref={containerRef}
      className="hero-section"
      style={{ opacity, scale }}
      onMouseMove={handleMouseMove as unknown as React.MouseEventHandler<HTMLElement>}
      onMouseLeave={handleMouseLeave}
      css-hero="true"
    >
      {/* ── FULL VIEWPORT WRAPPER ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>

        {/* ── BACKGROUND (parallax) ── */}
        <motion.div style={{ y: yBg, position: 'absolute', inset: 0, zIndex: 0 }}>
          <UltraAuroraBg />
          <video
            ref={videoRef}
            autoPlay muted loop playsInline
            style={{
              position: 'absolute', top: '50%', left: '50%',
              minWidth: '100%', minHeight: '100%', objectFit: 'cover',
              transform: 'translate(-50%,-50%)',
              opacity: 0.04, mixBlendMode: 'screen',
            }}
          />
        </motion.div>

        {/* ── 3D HERO CANVAS ── */}
        <Hero3D />

        {/* ── PARTICLES ── */}
        <ParticleField />

        {/* ── HOLOGRAPHIC RINGS (centered absolute) ── */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3, pointerEvents: 'none' }}>
          <HolographicRings />
        </div>

        {/* Floating skill tags removed */}

        {/* ── CORNER ACCENTS ── */}
        <CornerAccents />

        {/* ── CONTENT ── */}
        <motion.div
          style={{ y: yContent }}
          className="relative z-10 w-full"
        >
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(100px,14vh,160px) clamp(16px,5vw,48px) clamp(80px,12vh,140px)',
          }}>

            {/* ── GREETING PILL ── */}
            {greeting && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: 36 }}
              >
                <div className="hero-greeting-pill" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  padding: '11px 26px', borderRadius: 999,
                  background: 'linear-gradient(rgba(8,4,20,0.92),rgba(8,4,20,0.92)) padding-box, linear-gradient(135deg,rgba(124,58,237,0.5),rgba(244,114,182,0.4),rgba(56,189,248,0.3)) border-box',
                  border: '1px solid transparent',
                  backdropFilter: 'blur(20px)',
                  animation: 'badge-pulse-luxury 3.5s ease-in-out infinite',
                  boxShadow: '0 8px 32px rgba(124,58,237,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
                }}>
                  {/* Live indicator */}
                  <span style={{ position: 'relative', width: 8, height: 8 }}>
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: '#34d399',
                      animation: 'badge-dot-glow 2s ease-in-out infinite',
                    }} />
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      background: 'rgba(52,211,153,0.3)',
                      animation: 'badge-dot-glow 2s ease-in-out infinite 0.5s',
                      transform: 'scale(2)',
                    }} />
                  </span>
                  <Star size={11} style={{ color: '#fbbf24', opacity: 0.8 }} />
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(135deg,#a78bfa,#f472b6,#38bdf8)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {greeting}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(167,139,250,0.4)', fontWeight: 500 }}>
                    — Welcome
                  </span>
                </div>
              </motion.div>
            )}


            {/* ── 3D TILT NAME ── */}
            <motion.h1
              style={{
                marginBottom: 28,
                lineHeight: 0.86,
                perspective: 1400,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="hero-name-word"
            >
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 'clamp(6px,2vw,28px)',
                fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: 'clamp(2rem,7vw,6rem)',
                lineHeight: 0.88,
              }}>
                {nameConfig.map(({ word, gradient, delay }) => (
                  <span
                    key={word}
                    style={{ filter: 'drop-shadow(0 0 50px rgba(167,139,250,0.3)) drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }}
                  >
                    <CinematicWord text={word} delay={delay} gradient={gradient} />
                  </span>
                ))}
              </div>
            </motion.h1>

            {/* ── LUXURY DIVIDER ── */}
            <LuxuryDivider />

            {/* ── ANIMATED ROLE ── */}
            <motion.div
              className="hero-role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1 }}
              style={{
                marginBottom: 12,
                fontSize: 'clamp(1.05rem,2.4vw,1.7rem)',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 600,
                minHeight: '2.5rem',
                letterSpacing: '0.01em',
              }}
            >
              <RoleBadge role={roles[roleIndex]} />
            </motion.div>

            {/* ── LOCATION ── */}
            <motion.div
              className="hero-location"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.25 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36,
                fontSize: '0.83rem', fontWeight: 500, color: 'var(--loc-color)',
                letterSpacing: '0.04em',
              }}
            >
              <MapPin size={12} style={{ color: '#a78bfa', flexShrink: 0 }} />
              {t('hero.location')}
              <span style={{ color: 'rgba(167,139,250,0.25)', margin: '0 4px' }}>·</span>
              <Zap size={10} style={{ color: '#34d399' }} />
              <span style={{ color: 'rgba(52,211,153,0.6)', fontSize: '0.75rem', fontWeight: 600 }}>Available</span>
            </motion.div>

            {/* ── DESCRIPTION ── */}
            <motion.div
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 1.35 }}
              style={{
                maxWidth: 660,
                marginBottom: 46,
                fontSize: 'clamp(0.92rem,1.4vw,1.08rem)',
                lineHeight: 1.85,
                color: 'var(--desc-color)',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              <TextReveal
                text={t('hero.description')}
                delay={1.4}
                staggerDuration={0.018}
                splitBy="word"
              />
            </motion.div>

            {/* ── CTA BUTTONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.55 }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 16,
                marginBottom: 64,
              }}
            >
              <PrimaryCTA href="#work">
                <Sparkles size={16} style={{ flexShrink: 0, position: 'relative', zIndex: 1 }} />
                <span style={{ position: 'relative', zIndex: 1 }}>View My Work</span>
              </PrimaryCTA>
              <SecondaryCTA href="#contact">
                Get In Touch
                <ArrowRight size={15} style={{ flexShrink: 0 }} />
              </SecondaryCTA>
            </motion.div>

            {/* ── LUXURY STATS STRIP ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 1.75 }}
              style={{ width: '100%', maxWidth: 580 }}
            >
              {/* Top accent line */}
              <div style={{
                height: 1,
                background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.2),rgba(244,114,182,0.15),rgba(167,139,250,0.2),transparent)',
                marginBottom: 0,
              }} />

              <div className="hero-stats-strip" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,1fr)',
                borderRadius: 20,
                padding: 'clamp(16px,2.5vw,24px) clamp(10px,2vw,18px)',
                background: 'linear-gradient(135deg,rgba(124,58,237,0.06),rgba(15,8,35,0.85),rgba(56,189,248,0.04))',
                border: '1px solid rgba(167,139,250,0.1)',
                backdropFilter: 'blur(28px)',
                boxShadow: '0 8px 56px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(167,139,250,0.06)',
              }}>
                {stats.map(({ value, suffix, label, icon, isText }, i) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.1, y: -3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      borderRight: i < 3 ? '1px solid rgba(167,139,250,0.08)' : 'none',
                      padding: '6px 8px',
                      cursor: 'default',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{icon}</span>
                    <span className="hero-stat-value" style={{
                      fontSize: 'clamp(0.9rem,2.2vw,1.3rem)',
                      fontWeight: 900,
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontStyle: 'italic',
                      background: 'linear-gradient(135deg,#ddd6fe,#a78bfa,#f472b6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: 1,
                    }}>
                      {isText ? suffix : <><AnimCounter to={value} />{suffix}</>}
                    </span>
                    <span className="hero-stat-label" style={{
                      fontSize: '0.56rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      fontWeight: 700,
                      color: 'rgba(167,139,250,0.38)',
                      textAlign: 'center',
                      lineHeight: 1.4,
                    }}>
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom accent line */}
              <div style={{
                height: 1,
                background: 'linear-gradient(90deg,transparent,rgba(56,189,248,0.15),rgba(167,139,250,0.2),rgba(56,189,248,0.15),transparent)',
                marginTop: 0,
              }} />
            </motion.div>

          </div>
        </motion.div>

        {/* ── SCROLL INDICATOR ── */}
        <ScrollIndicator />

      </div>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 640px) {
          .hero-section [data-floating-tags] {
            display: none;
          }
        }
        @media (max-width: 768px) {
          .hero-section [data-rings] {
            width: 320px !important;
            height: 320px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </motion.section>
  );
}
