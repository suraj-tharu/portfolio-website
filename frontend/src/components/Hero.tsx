import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { TextReveal } from './premium/TextReveal';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';
import { Sparkles, ArrowRight, MapPin, Code2, Globe2, BrainCircuit, GraduationCap } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   Animated gradient mesh background
────────────────────────────────────────────────────────── */
function MeshGradient() {
  return (
    <>
      <style>{`
        @keyframes mesh1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-35px) scale(1.12)} 66%{transform:translate(-25px,30px) scale(0.94)} }
        @keyframes mesh2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-45px,25px) scale(1.1)} 66%{transform:translate(30px,-20px) scale(0.96)} }
        @keyframes mesh3 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,40px) scale(1.05)} 66%{transform:translate(-30px,-35px) scale(1.08)} }
        @keyframes hero-shimmer { 0%{background-position:200% 50%} 100%{background-position:-200% 50%} }
        @keyframes badge-pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,0.4)} 50%{box-shadow:0 0 0 8px rgba(167,139,250,0)} }
        @keyframes scroll-line  { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }
        @keyframes float-tag    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes grid-fade    { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
      `}</style>

      {/* Dark base */}
      <div className="absolute inset-0 bg-[#06040f] dark:bg-[#06040f]
        light:bg-gradient-to-br light:from-slate-50 light:via-violet-50/30 light:to-pink-50/20" />

      {/* Animated orbs */}
      <div style={{
        position:'absolute', top:'-20%', left:'-15%',
        width:'70vw', height:'70vw', borderRadius:'50%',
        background:'radial-gradient(circle at 30% 30%,rgba(124,58,237,0.45),rgba(219,39,119,0.2) 50%,transparent 75%)',
        filter:'blur(80px)', animation:'mesh1 12s ease-in-out infinite',
      }} />
      <div style={{
        position:'absolute', bottom:'-15%', right:'-15%',
        width:'60vw', height:'60vw', borderRadius:'50%',
        background:'radial-gradient(circle at 60% 60%,rgba(6,182,212,0.35),rgba(124,58,237,0.2) 50%,transparent 75%)',
        filter:'blur(90px)', animation:'mesh2 14s ease-in-out infinite',
      }} />
      <div style={{
        position:'absolute', top:'35%', left:'50%', transform:'translateX(-50%)',
        width:'45vw', height:'45vw', borderRadius:'50%',
        background:'radial-gradient(circle,rgba(244,114,182,0.2),rgba(56,189,248,0.15) 50%,transparent 75%)',
        filter:'blur(70px)', animation:'mesh3 10s ease-in-out infinite 1s',
      }} />

      {/* Dot grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'radial-gradient(rgba(167,139,250,0.4) 1px, transparent 1px)',
        backgroundSize:'40px 40px',
        animation:'grid-fade 6s ease-in-out infinite',
      }} />

      {/* Vignette */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 80% 70% at 50% 50%,transparent 40%,rgba(6,4,15,0.6) 100%)',
      }} />

      {/* Bottom fade */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:'35%',
        background:'linear-gradient(to top,#06040f 0%,transparent 100%)',
      }} />
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   Floating skill tags
────────────────────────────────────────────────────────── */
const TAGS = [
  { label:'GIS & Remote Sensing', icon:<Globe2 size={11}/>, delay:0,   x:'-60%', y:'-130%' },
  { label:'Machine Learning',     icon:<BrainCircuit size={11}/>, delay:0.3, x:'55%',  y:'-110%' },
  { label:'Computer Engineering', icon:<Code2 size={11}/>, delay:0.6, x:'-55%', y:'130%'  },
  { label:'MSc Info Systems',     icon:<GraduationCap size={11}/>, delay:0.9, x:'50%',  y:'125%'  },
];

function FloatingTags() {
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:5 }}>
      {TAGS.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity:0, scale:0.7 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ delay:1.8 + t.delay, duration:0.6, ease:[0.16,1,0.3,1] }}
          style={{
            position:'absolute', top:'50%', left:'50%',
            transform:`translate(${t.x}, ${t.y})`,
            animation:`float-tag ${3.5 + i * 0.7}s ease-in-out infinite`,
            animationDelay:`${t.delay}s`,
          }}
        >
          <div style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'6px 12px', borderRadius:999,
            background:'rgba(167,139,250,0.08)',
            border:'1px solid rgba(167,139,250,0.2)',
            backdropFilter:'blur(12px)',
            color:'rgba(167,139,250,0.85)',
            fontSize:'0.68rem', fontWeight:700,
            letterSpacing:'0.08em', whiteSpace:'nowrap',
          }}>
            {t.icon}
            {t.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Role cycling
────────────────────────────────────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={role}
        initial={{ opacity:0, y:12, filter:'blur(6px)' }}
        animate={{ opacity:1, y:0,  filter:'blur(0px)' }}
        exit={{   opacity:0, y:-10, filter:'blur(4px)' }}
        transition={{ duration:0.45, ease:[0.16,1,0.3,1] }}
        className="inline-block"
      >
        {role}
      </motion.span>
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────
   Word reveal
────────────────────────────────────────────────────────── */
function RollingWord({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ y:80, opacity:0, rotateX:45 }}
      animate={{ y:0,  opacity:1, rotateX:0  }}
      transition={{ duration:1.1, delay, ease:[0.16,1,0.3,1] }}
    >
      {text}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────
   Main Hero
────────────────────────────────────────────────────────── */
export default function Hero() {
  const { t } = useLanguage();
  const greeting = useGreeting();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = [
    t('hero.role.engineer'),
    t('hero.role.educator'),
    t('hero.role.researcher'),
    t('hero.role.gis'),
  ];

  /* HLS video */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';
    if (Hls.isSupported()) {
      const hls = new Hls({ startPosition:-1, capLevelToPlayerSize:true });
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
    const id = setInterval(() => setRoleIndex(p => (p + 1) % roles.length), 2500);
    return () => clearInterval(id);
  }, [roles.length]);

  /* Scroll parallax */
  const { scrollY } = useScroll();
  const yBg     = useTransform(scrollY, [0, 900], [0, 200]);
  const opacity = useTransform(scrollY, [0, 650], [1, 0]);
  const scale   = useTransform(scrollY, [0, 650], [1, 0.96]);

  const nameWords = ['Suraj', 'Tharu', 'Chaudhary'];

  const stats = [
    { value:'5+',  label:'Years Teaching',   icon:'🎓' },
    { value:'MSc', label:'Info Systems',      icon:'📡' },
    { value:'GIS', label:'Spatial Analysis',  icon:'🗺️' },
    { value:'ML',  label:'Deep Learning',     icon:'🤖' },
  ];

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── BACKGROUND ──────────────────────────────────── */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <MeshGradient />

        {/* Video overlay */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover
            -translate-x-1/2 -translate-y-1/2 opacity-[0.06] mix-blend-screen"
        />
      </motion.div>

      {/* ── FLOATING TAGS ───────────────────────────────── */}
      <FloatingTags />

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-5 sm:px-8 pt-28 pb-32">

        {/* Greeting pill */}
        {greeting && (
          <motion.div
            initial={{ opacity:0, y:-20, scale:0.9 }}
            animate={{ opacity:1, y:0,   scale:1   }}
            transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
            className="mb-8"
          >
            <div style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'10px 20px', borderRadius:999,
              background:'rgba(124,58,237,0.12)',
              border:'1px solid rgba(167,139,250,0.3)',
              backdropFilter:'blur(16px)',
              animation:'badge-pulse 3s ease-in-out infinite',
            }}>
              <span style={{
                width:8, height:8, borderRadius:'50%',
                background:'linear-gradient(135deg,#a78bfa,#34d399)',
                display:'inline-block', animation:'corner-pulse 1.5s ease-in-out infinite',
              }} />
              <span style={{
                fontSize:'0.75rem', fontWeight:800, letterSpacing:'0.22em',
                textTransform:'uppercase',
                background:'linear-gradient(135deg,#a78bfa,#f472b6)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>
                {greeting}
              </span>
              <span style={{
                fontSize:'0.72rem', color:'rgba(167,139,250,0.5)',
                fontWeight:500,
              }}>
                — Welcome
              </span>
            </div>
          </motion.div>
        )}

        {/* ── BIG NAME ────────────────────────────────── */}
        <h1 style={{ marginBottom:20, lineHeight:0.88, perspective:1000 }}>
          <div style={{
            display:'flex', flexWrap:'wrap', justifyContent:'center',
            gap:'clamp(8px,2vw,24px)',
            fontFamily:'Georgia, serif',
            fontStyle:'italic', fontWeight:900,
            fontSize:'clamp(3rem,11.5vw,9rem)',
          }}>
            {nameWords.map((word, i) => (
              <span
                key={word}
                style={{
                  background: i === 0
                    ? 'linear-gradient(135deg,#c4b5fd 0%,#a78bfa 40%,#f472b6 100%)'
                    : i === 1
                    ? 'linear-gradient(135deg,#f472b6 0%,#fb7185 40%,#f97316 100%)'
                    : 'linear-gradient(135deg,#38bdf8 0%,#818cf8 40%,#a78bfa 100%)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                  filter:`drop-shadow(0 0 40px ${i===0?'rgba(167,139,250,0.5)':i===1?'rgba(244,114,182,0.5)':'rgba(56,189,248,0.5)'})`,
                }}
              >
                <RollingWord text={word} delay={0.2 + i * 0.18} />
              </span>
            ))}
          </div>
        </h1>

        {/* Decorative line under name */}
        <motion.div
          initial={{ scaleX:0, opacity:0 }}
          animate={{ scaleX:1, opacity:1 }}
          transition={{ delay:0.85, duration:1.2, ease:[0.16,1,0.3,1] }}
          style={{
            height:2, width:'min(320px,60%)', marginBottom:20, originX:0.5,
            background:'linear-gradient(90deg,transparent,rgba(167,139,250,0.6),rgba(244,114,182,0.6),transparent)',
            borderRadius:999,
          }}
        />

        {/* ── ROLE ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0  }}
          transition={{ duration:0.8, delay:0.78 }}
          style={{
            marginBottom:8,
            fontSize:'clamp(1.1rem,2.5vw,1.75rem)',
            fontFamily:'Georgia, serif', fontStyle:'italic', fontWeight:700,
            minHeight:'2.4rem',
            background:'linear-gradient(135deg,#a78bfa,#f472b6)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          }}
        >
          <RoleBadge role={roles[roleIndex]} />
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity:0, y:12 }}
          animate={{ opacity:1, y:0  }}
          transition={{ duration:0.7, delay:0.9 }}
          style={{
            display:'flex', alignItems:'center', gap:6, marginBottom:28,
            fontSize:'0.875rem', fontWeight:500, color:'rgba(167,139,250,0.6)',
          }}
        >
          <MapPin size={13} style={{ color:'#a78bfa', flexShrink:0 }} />
          {t('hero.location')}
        </motion.div>

        {/* ── DESCRIPTION ───────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0  }}
          transition={{ duration:0.8, delay:1.0 }}
          style={{
            maxWidth:640, marginBottom:36,
            fontSize:'clamp(0.95rem,1.5vw,1.1rem)',
            lineHeight:1.75, color:'rgba(203,213,225,0.8)',
            fontWeight:400,
          }}
        >
          <TextReveal
            text={t('hero.description')}
            delay={1.1}
            staggerDuration={0.025}
            splitBy="word"
          />
        </motion.div>

        {/* ── CTA BUTTONS ───────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0  }}
          transition={{ duration:0.8, delay:1.25 }}
          style={{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'center', gap:14, marginBottom:52 }}
        >
          {/* Primary */}
          <motion.a
            href="#work"
            whileHover={{ scale:1.06, y:-3 }}
            whileTap={{ scale:0.97 }}
            style={{
              position:'relative', display:'inline-flex', alignItems:'center', gap:10,
              borderRadius:999, padding:'14px 34px',
              fontSize:'0.925rem', fontWeight:800, color:'#fff',
              background:'linear-gradient(135deg,#7c3aed,#db2777,#0ea5e9)',
              backgroundSize:'200% 200%', animation:'hero-shimmer 4s linear infinite',
              boxShadow:'0 8px 32px rgba(124,58,237,0.5),0 0 0 1px rgba(167,139,250,0.2)',
              textDecoration:'none', overflow:'hidden', letterSpacing:'0.02em',
            }}
          >
            {/* shimmer overlay */}
            <span style={{
              position:'absolute', inset:0,
              background:'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.18) 50%,transparent 60%)',
              backgroundSize:'200% 100%', animation:'hero-shimmer 2.5s linear infinite',
            }} />
            <Sparkles size={16} style={{ flexShrink:0 }} />
            See My Work
          </motion.a>

          {/* Secondary */}
          <motion.a
            href="#contact"
            whileHover={{ scale:1.06, y:-3 }}
            whileTap={{ scale:0.97 }}
            style={{
              position:'relative', display:'inline-flex', alignItems:'center', gap:10,
              borderRadius:999, padding:'14px 34px',
              fontSize:'0.925rem', fontWeight:800,
              border:'1px solid rgba(167,139,250,0.35)',
              color:'rgba(196,181,253,0.9)',
              background:'rgba(124,58,237,0.08)',
              backdropFilter:'blur(16px)',
              textDecoration:'none', letterSpacing:'0.02em',
              transition:'all 0.3s ease',
            }}
          >
            Get In Touch
            <ArrowRight size={15} style={{ flexShrink:0 }} />
          </motion.a>
        </motion.div>

        {/* ── STATS STRIP ───────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0  }}
          transition={{ duration:0.9, delay:1.5 }}
          style={{
            width:'100%', maxWidth:520,
            display:'grid', gridTemplateColumns:'repeat(4,1fr)',
            borderRadius:20, padding:'18px 12px',
            background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(167,139,250,0.15)',
            backdropFilter:'blur(20px)',
            boxShadow:'0 4px 40px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {stats.map(({ value, label, icon }, i) => (
            <motion.div
              key={label}
              whileHover={{ scale:1.05 }}
              style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                borderRight: i < 3 ? '1px solid rgba(167,139,250,0.12)' : 'none',
                padding:'4px 6px',
              }}
            >
              <span style={{ fontSize:'1rem', lineHeight:1 }}>{icon}</span>
              <span style={{
                fontSize:'clamp(1rem,2.5vw,1.35rem)', fontWeight:900,
                fontFamily:'Georgia, serif', fontStyle:'italic',
                background:'linear-gradient(135deg,#a78bfa,#f472b6)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>
                {value}
              </span>
              <span style={{
                fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.12em',
                fontWeight:700, color:'rgba(167,139,250,0.45)', textAlign:'center', lineHeight:1.3,
              }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ────────────────────────────── */}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:2.2, duration:0.8 }}
        style={{
          position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:8, zIndex:10,
        }}
      >
        <span style={{
          fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.3em',
          fontWeight:700, color:'rgba(167,139,250,0.35)',
        }}>
          Scroll
        </span>
        <div style={{
          width:1.5, height:48,
          background:'rgba(167,139,250,0.12)',
          borderRadius:999, overflow:'hidden', position:'relative',
        }}>
          <motion.div
            style={{
              position:'absolute', top:0, left:0, width:'100%',
              height:'50%', borderRadius:999,
              background:'linear-gradient(to bottom,#a78bfa,#f472b6)',
            }}
            animate={{ y:['0%','200%'] }}
            transition={{ duration:1.6, repeat:Infinity, ease:'linear' }}
          />
        </div>
      </motion.div>

      {/* ── Inline keyframes ─────────────────────────────── */}
      <style>{`
        @keyframes corner-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>
    </motion.section>
  );
}
