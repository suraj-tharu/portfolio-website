import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { MicroInteractionButton } from './premium/MicroInteractionButton';
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
        console.warn('HLS Error:', data);
        // Fallback: hide video if it fails
        if (video.parentElement) {
          video.parentElement.style.opacity = '0';
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
  }, []);

  useEffect(() => {
    // GSAP Animations for elements not handled by framer-motion
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3.2 });
      tl.fromTo('.blur-in',
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const name = "Suraj Tharu Chaudhary".split(" ");

  return (
    <section ref={containerRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video with Premium Lighting */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#06080F] via-[#1a0a2e] to-[#06080F]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-20 mix-blend-screen"
        />
        {/* Premium Gradient Overlay with sophistication */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/80 via-transparent to-[var(--bg)]" />

        {/* Ultra-premium ambient lighting effects */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '4s' }} />

        {/* Additional glow overlay */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-30" />
      </div>

      {/* Content with premium spacing and animations */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-12 pb-20 w-full max-w-[100vw] overflow-x-hidden">
        {/* Premium Greeting */}
        {greeting && (
          <motion.div
            className="mb-8 md:mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="text-sm md:text-base tracking-widest uppercase font-medium text-text-secondary/80">
              <span className="text-brand-light font-semibold">{greeting}</span>
              <span className="mx-2 text-text-secondary/60">•</span>
              <span className="text-text-secondary/70">Welcome back</span>
            </p>
            <div className="mt-3 h-px w-12 mx-auto bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50" />
          </motion.div>
        )}

        <h1 className="text-fluid-3xl md:text-fluid-5xl lg:text-fluid-6xl font-display italic leading-[0.9] tracking-tight hero-heading mb-4 md:mb-6 flex flex-wrap justify-center gap-2 md:gap-4 drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] px-2 w-full text-text-primary" style={{ animation: 'luxury-float 6s cubic-bezier(0.4, 0.0, 0.2, 1) infinite' }}>
          {name.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block text-text-primary hover:text-brand-light transition-all duration-300"
              initial={{ y: 100, opacity: 0, rotateZ: 5 }}
              animate={{ y: 0, opacity: 1, rotateZ: 0 }}
              transition={{ duration: 1.2, delay: 3.2 + i * 0.15, ease: [0.2, 0.65, 0.3, 0.9] }}
              whileHover={{ scale: 1.05 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <div className="blur-in text-fluid-lg md:text-fluid-2xl font-display italic text-[var(--text-secondary)] mb-6 md:mb-8 flex flex-col items-center gap-3 px-4 text-center justify-center drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">
          <motion.span
            key={roleIndex}
            className="animate-role-fade-in inline-block text-[var(--accent)] font-semibold bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent"
          >
            {roles[roleIndex]}
          </motion.span>
          <span className="text-base md:text-lg bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent font-bold">{t('hero.location')}</span>
        </div>

        <motion.p
          className="blur-in text-fluid-xs md:text-fluid-base bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent font-bold max-w-[90%] md:max-w-md mb-8 md:mb-12 px-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-relaxed"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {t('hero.description')}
        </motion.p>

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
    </section >
  );
}
