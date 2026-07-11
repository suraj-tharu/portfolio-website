import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { TextReveal } from './premium/TextReveal';
import Hero3D from './Hero3D';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';
import { Sparkles, ArrowRight, MapPin, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA-LUXURY BACKGROUND (Simplified Aurora + Depth)
═══════════════════════════════════════════════════════════════════════ */
function UltraAuroraBg() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      {/* Base Depth */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isDark 
          ? 'linear-gradient(145deg, #050508 0%, #0A0B12 50%, #050508 100%)'
          : 'linear-gradient(145deg, #FAFAFA 0%, #F5F5F7 50%, #FAFAFA 100%)'
      }} />

      {/* Cinematic noise texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: isDark ? 0.035 : 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '128px 128px',
        mixBlendMode: 'overlay',
      }} />

      {/* Ambient Orbs (Reduced to 2 for elegance) */}
      <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0], 
          scale: [1, 1.05, 0.95, 1],
          x: [0, 30, -20, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '70vw', height: '70vw', borderRadius: '50%',
          background: isDark 
            ? 'radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.15), transparent 60%)'
            : 'radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08), transparent 60%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }} 
      />
      
      <motion.div
        animate={{ 
          rotate: [0, -5, 5, 0], 
          scale: [1, 0.95, 1.05, 1],
          x: [0, -30, 20, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle at 60% 60%, rgba(56, 189, 248, 0.12), rgba(244, 114, 182, 0.08) 40%, transparent 65%)'
            : 'radial-gradient(circle at 60% 60%, rgba(56, 189, 248, 0.06), rgba(244, 114, 182, 0.04) 40%, transparent 65%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} 
      />
    </>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   ROLES ANIMATION
═══════════════════════════════════════════════════════════════════════ */
const roles = [
  "Machine Learning Engineer",
  "Geospatial Analyst",
  "Computer Engineering Educator",
  "Tech Researcher"
];

function RoleBadge({ role }: { role: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={role}
        initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '6px 16px', borderRadius: 999,
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <span style={{ 
          color: isDark ? '#A78BFA' : '#7C3AED', 
          fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' 
        }}>
          {role}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ULTRA STAT CARD (Cleaned)
═══════════════════════════════════════════════════════════════════════ */
function UltraStatCard({ value, suffix, label, icon, isLast }: { value: string | number; suffix: string; label: string; icon: React.ReactNode; isLast: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div
      whileHover={{ y: -4, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 16px',
        borderRight: isLast ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
        position: 'relative',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem', marginBottom: 16,
      }}>
        {icon}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
        <span style={{ 
          fontSize: '2rem', fontWeight: 400, 
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          color: isDark ? '#FFFFFF' : '#0F0F1A',
          lineHeight: 1
        }}>
          {value || ''}
        </span>
        <span style={{ 
          fontSize: '1.25rem', fontWeight: 600, 
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          color: isDark ? '#A78BFA' : '#7C3AED'
        }}>
          {suffix}
        </span>
      </div>

      <span style={{ 
        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', 
        textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' 
      }}>
        {label}
      </span>
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

  /* Scroll effects */
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.95]);
  const yContent = useTransform(scrollY, [0, 600], [0, -40]);

  /* Roles rotation */
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      ref={containerRef}
      id="hero"
      className="relative w-full flex items-start justify-center overflow-hidden"
      style={{ 
        opacity, scale, 
        position: 'relative', 
        minHeight: '100vh', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      <UltraAuroraBg />

      {/* Hero3D — Subtle Background Accent */}
      <div style={{
        position: 'absolute', top: '25%', right: '5%',
        width: '50vw', height: '50vw',
        maxWidth: '800px', maxHeight: '800px',
        opacity: 0.35, pointerEvents: 'none', zIndex: 1,
        filter: 'blur(8px)',
      }}>
        <Hero3D />
      </div>

      {/* ── CONTENT ── */}
      <motion.div
        style={{ y: yContent }}
        className="relative z-10 w-full"
      >
        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          padding: 'clamp(160px, 22vh, 220px) clamp(20px, 5vw, 40px) clamp(40px, 8vh, 80px)',
        }}>
          
          {/* Greeting */}
          <AnimatePresence>
            {greeting && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ marginBottom: 40 }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '8px 20px', borderRadius: 999,
                  background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
                  backdropFilter: 'blur(12px)',
                  boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#34D399',
                    boxShadow: '0 0 10px rgba(52, 211, 153, 0.4)',
                  }} />
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)',
                    lineHeight: 1.5,
                    whiteSpace: 'nowrap'
                  }}>
                    {greeting} — Welcome
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
              lineHeight: 1.1,
              marginBottom: 32,
              paddingTop: 4,
              background: isDark 
                ? 'linear-gradient(135deg, #FFFFFF 0%, #A78BFA 100%)' 
                : 'linear-gradient(135deg, #0F0F1A 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            {language === 'ne' ? 'सुरज थारु चौधरी' : 'Suraj Tharu Chaudhary'}
          </motion.h1>

          {/* Role */}
          <div style={{ marginBottom: 24 }}>
            <RoleBadge role={roles[roleIndex]} />
          </div>

          {/* Location & Availability */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32,
              fontSize: '0.8rem', fontWeight: 500, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              letterSpacing: '0.02em',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={12} style={{ color: isDark ? '#A78BFA' : '#7C3AED' }} />
              <span>{t('hero.location')}</span>
            </div>
            <span style={{ opacity: 0.3 }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={10} style={{ color: '#34D399' }} />
              <span style={{ color: isDark ? '#FFF' : '#000', fontWeight: 600 }}>Available</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              maxWidth: 600, marginBottom: 48,
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', lineHeight: 1.7,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
            }}
          >
            <TextReveal text={t('hero.description')} delay={0.9} staggerDuration={0.015} />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{ display: 'flex', gap: 16, marginBottom: 64, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <a href="#work" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', borderRadius: 999,
              background: isDark ? '#FFFFFF' : '#0F0F1A',
              color: isDark ? '#000000' : '#FFFFFF',
              fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isDark 
                ? '0 10px 30px -10px rgba(255,255,255,0.4)' 
                : '0 10px 30px -10px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <Sparkles size={16} />
              View My Work
            </a>
            <a href="#contact" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', borderRadius: 999,
              background: 'transparent',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
              color: isDark ? '#FFFFFF' : '#0F0F1A',
              fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em',
              transition: 'background 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}>
              Get In Touch
              <ArrowRight size={16} />
            </a>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: 840, position: 'relative' }}
          >
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              borderRadius: 24,
              background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.01)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}>
              {[
                { value: 5, suffix: '+',   label: 'Years Teaching',  icon: '🎓' },
                { value: 0, suffix: 'MSc', label: 'Info Systems',    icon: '📡' },
                { value: 0, suffix: 'GIS', label: 'Spatial Analysis', icon: '🗺️' },
                { value: 0, suffix: 'ML',  label: 'Deep Learning',   icon: '🤖' },
              ].map((s, i) => (
                <UltraStatCard
                  key={s.label}
                  value={s.value} suffix={s.suffix} label={s.label}
                  icon={s.icon} isLast={i === 3}
                />
              ))}
            </div>
          </motion.div>
          
        </div>
      </motion.div>
    </motion.section>
  );
}
