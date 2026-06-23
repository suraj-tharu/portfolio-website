import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MicroInteractionButton } from './premium/MicroInteractionButton';
import { TextReveal } from './premium/TextReveal';
import { useLanguage } from '../context/LanguageContext';
import { useGreeting } from './GreetingBanner';

export default function Hero() {
  const { t } = useLanguage();
  const greeting = useGreeting();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = [t('hero.role.engineer'), t('hero.role.educator'), t('hero.role.researcher'), t('hero.role.gis')];

  useEffect(() => {
    // Setup HLS Video with fallback
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({
        startPosition: -1,
        capLevelToPlayerSize: true,
      });
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => { });
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.warn('HLS Fatal Error, disabling video:', data.type);
          hls.destroy();
          // Fallback: hide video if it fails
          if (video.parentElement) {
            video.parentElement.style.opacity = '0';
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => { });
      });
      video.addEventListener('error', () => {
        console.warn('Video playback error');
        if (video.parentElement) {
          video.parentElement.style.opacity = '0';
        }
      });
    } else {
      // Fallback for browsers that don't support HLS
      if (video.parentElement) {
        video.parentElement.style.opacity = '0';
      }
    }
  }, []);

  useEffect(() => {
    // Role rotation
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [roles.length]);

  useEffect(() => {
    // GSAP Animations for elements not handled by framer-motion
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.fromTo('.blur-in',
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const name = "Suraj Tharu Chaudhary".split(" ");

  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const sectionOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  return (
    <motion.section ref={containerRef} style={{ opacity: sectionOpacity }} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video with Premium Lighting & Fallback */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 overflow-hidden">
        {/* Premium Animated Gradient Background Base */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(250,251,252,1)_0%,rgba(235,230,240,1)_50%,rgba(255,255,255,1)_100%)] dark:bg-[linear-gradient(135deg,rgba(10,10,26,1)_0%,rgba(28,10,46,1)_50%,rgba(0,0,0,1)_100%)] transition-colors duration-500" />
        
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-20 mix-blend-screen transition-opacity duration-1000"
        />
        
        {/* Premium Gradient Overlay with sophistication */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/80 via-transparent to-[var(--bg)]" />

        {/* Ultra-premium ambient lighting effects */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-blob" style={{ animationDelay: '4s' }} />

        {/* Additional glow overlay */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />
      </motion.div>

      {/* Content with premium spacing and animations */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-12 pb-20 w-full max-w-[100vw] overflow-x-hidden">
        {/* Ultra Premium Greeting */}
        {greeting && (
          <motion.div
            className="mb-4 md:mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500/20 to-pink-500/20 border border-brand-500/30 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-brand-300 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
              <p className="text-xs md:text-sm tracking-widest uppercase font-bold text-white dark:text-brand-100 bg-gradient-to-r from-brand-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent dark:text-white dark:bg-none hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]">
                {greeting}
              </p>
              <div className="w-2 h-2 rounded-full bg-pink-300 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
            </div>
            <p className="text-xs md:text-sm tracking-widest uppercase font-medium text-text-secondary/80">
              <span className="text-text-secondary/70">Welcome back</span>
            </p>
          </motion.div>
        )}

        <h1 className="text-fluid-4xl md:text-fluid-7xl lg:text-fluid-8xl font-display italic leading-[0.9] tracking-tight hero-heading mb-2 md:mb-3 flex flex-wrap justify-center gap-2 md:gap-3 drop-shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] px-2 w-full text-text-primary" style={{ animation: 'luxury-float 6s cubic-bezier(0.4, 0.0, 0.2, 1) infinite' }}>
          {name.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block gradient-text-premium hover:text-brand-light transition-all duration-300"
              initial={{ y: 100, opacity: 0, rotateZ: 5 }}
              animate={{ y: 0, opacity: 1, rotateZ: 0 }}
              transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: [0.2, 0.65, 0.3, 0.9] }}
              whileHover={{ scale: 1.05 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <div className="blur-in text-fluid-lg md:text-fluid-2xl font-display italic text-[var(--text-secondary)] mb-4 md:mb-5 flex flex-col items-center gap-1 md:gap-2 px-4 text-center justify-center drop-shadow-[0_6px_24px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">
          <motion.span
            key={roleIndex}
            className="animate-role-fade-in inline-block font-semibold bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent"
          >
            {roles[roleIndex]}
          </motion.span>
          <span className="text-base md:text-lg bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent font-bold">{t('hero.location')}</span>
        </div>

        <div className="blur-in text-fluid-xs md:text-fluid-base bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent font-bold max-w-[90%] md:max-w-md mb-6 md:mb-8 px-4 drop-shadow-sm dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-relaxed text-center">
          <TextReveal text={t('hero.description')} delay={1.2} staggerDuration={0.03} splitBy="word" />
        </div>

        <div className="blur-in flex flex-col sm:flex-row items-center gap-6">
          <a href="#work">
            <MicroInteractionButton variant="primary" glowColor="#8B5CF6">
              ✨ See Works
            </MicroInteractionButton>
          </a>

          <a href="#contact">
            <MicroInteractionButton variant="secondary" glowColor="#F59E0B">
              Reach out →
            </MicroInteractionButton>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 opacity-70">
        <span className="text-[10px] text-muted uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-light/50 animate-scroll-down" />
        </div>
      </div>
    </motion.section >
  );
}
