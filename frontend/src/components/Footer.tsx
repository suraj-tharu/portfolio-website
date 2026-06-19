import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import VisitorCounter from './VisitorCounter';

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeItems = [
    "BUILDING THE FUTURE",
    "INNOVATING TOMORROW",
    "SHAPING POSSIBILITIES",
    "CREATING EXCELLENCE",
    "ENGINEERING DREAMS",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden flex flex-col z-20">

      {/* Premium Background */}
      <div className="absolute inset-0 z-0" style={{ background: 'var(--bg)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(236,72,153,0.03) 50%, rgba(34,211,238,0.05) 100%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Marquee */}
      <div className="relative z-10 w-full overflow-hidden py-10 md:py-20 flex whitespace-nowrap">
        <div ref={marqueeRef} className="flex text-7xl md:text-9xl font-display italic text-text-primary/10 tracking-tight">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="px-4">{marqueeItems[i % marqueeItems.length]} •</span>
          ))}
          {/* Duplicate for seamless looping */}
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={`dup-${i}`} className="px-4">{marqueeItems[i % marqueeItems.length]} •</span>
          ))}
        </div>
      </div>

      {/* Premium CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 py-20 text-center"
      >
        <motion.div className="text-xs text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-500" />
          Let's talk
          <div className="w-2 h-2 rounded-full bg-pink-500" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[7rem] font-display text-text-primary tracking-tight leading-none mb-12 bg-gradient-to-r from-white via-slate-200 to-cyan-100 bg-clip-text text-transparent"
        >
          Ready to create <br className="hidden md:block" />
          <span className="italic">something special?</span>
        </motion.h2>

        <motion.a
          href="mailto:suraj.xaudhary@gmail.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center justify-center rounded-full px-10 py-5 text-base md:text-lg font-medium overflow-hidden"
        >
          {/* Animated background gradient */}
          <span className="absolute inset-0 bg-gradient-to-r from-brand-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          <span className="absolute inset-[2px] bg-bg rounded-full group-hover:bg-black/20 transition-colors" />
          <span className="relative z-10 text-text-primary group-hover:text-white transition-colors">suraj.xaudhary@gmail.com</span>
        </motion.a>
      </motion.div>

      {/* Premium Footer Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mt-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/10 backdrop-blur-sm"
      >
        {/* Availability Status */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="group flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-md border border-green-500/30 rounded-full px-4 py-2.5 hover:border-green-500/50 transition-all duration-300"
        >
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 group-hover:bg-green-400 transition-colors"></span>
          </div>
          <span className="text-sm font-medium text-green-100">Available for projects</span>
        </motion.div>

        {/* Social Links */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center mt-4 md:mt-0">
          {[
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/suraj-tharu/', icon: '💼' },
            { label: 'GitHub', url: 'https://github.com/suraj-tharu', icon: '🐙' },
            { label: 'Scholar', url: 'https://scholar.google.com', icon: '📚' },
            { label: 'ResearchGate', url: 'https://www.researchgate.net', icon: '🔬' },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              className="text-sm font-medium bg-gradient-to-r from-brand-500/20 to-pink-500/20 border border-brand-500/30 hover:border-brand-500 rounded-full px-3 py-1.5 text-brand-200 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              {social.icon} {social.label}
            </motion.a>
          ))}
          <div className="text-sm text-muted px-3 py-1.5">📍 Nawalparasi West, NP</div>
        </div>

        {/* Copyright & Stats */}
        <motion.div
          className="flex flex-col items-center gap-2.5 md:items-end"
        >
          <div className="text-xs font-semibold tracking-widest uppercase text-transparent bg-gradient-to-r from-brand-300 to-cyan-300 bg-clip-text">
            © 2026 Suraj Tharu Chaudhary
          </div>
          <VisitorCounter />
        </motion.div>
      </motion.div>

    </footer>
  );
}
