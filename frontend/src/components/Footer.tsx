import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform } from 'framer-motion';
import VisitorCounter from './VisitorCounter';
import { Briefcase, Terminal, GraduationCap, Microscope } from 'lucide-react';

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const marqueeItems = [
    "BUILDING THE FUTURE",
    "INNOVATING TOMORROW",
    "SHAPING POSSIBILITIES",
    "CREATING EXCELLENCE",
    "ENGINEERING DREAMS",
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);

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
    <footer ref={containerRef} className="relative bg-[#050505] text-white pt-24 md:pt-32 pb-8 md:pb-12 overflow-hidden flex flex-col z-20 border-t border-white/10 rounded-t-[40px] md:rounded-t-[80px]">

      {/* Massive Background Typography */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03] select-none z-0">
        <h1 className="text-[20vw] font-display italic font-black whitespace-nowrap">SURAJ THARU</h1>
      </div>

      {/* Premium Background Orbs */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] translate-x-[-50%]" />
      </motion.div>

      {/* Marquee */}
      <div className="relative z-10 w-full overflow-hidden pb-16 md:pb-24 flex whitespace-nowrap border-b border-white/5">
        <div ref={marqueeRef} className="flex text-7xl md:text-9xl font-display italic text-white/10 tracking-tight">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="px-4 hover:text-white/30 transition-colors duration-500 cursor-default">{marqueeItems[i % marqueeItems.length]} •</span>
          ))}
          {/* Duplicate for seamless looping */}
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={`dup-${i}`} className="px-4 hover:text-white/30 transition-colors duration-500 cursor-default">{marqueeItems[i % marqueeItems.length]} •</span>
          ))}
        </div>
      </div>

      {/* Premium CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 py-24 md:py-32 text-center"
      >
        <motion.div className="text-xs text-white/50 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
          <div className="w-12 h-px bg-white/20" />
          <span>Let's collaborate</span>
          <div className="w-12 h-px bg-white/20" />
        </motion.div>
        
        <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-display tracking-tighter leading-[0.9] mb-12 drop-shadow-2xl">
          Ready to create <br />
          <span className="italic text-transparent bg-gradient-to-r from-brand-400 via-pink-400 to-cyan-400 bg-clip-text">something special?</span>
        </h2>

        <motion.a
          href="mailto:suraj.xaudhary@gmail.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center justify-center rounded-full px-12 py-6 text-lg font-medium overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-pink-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute inset-[1px] bg-[#0a0a0a] rounded-full group-hover:bg-transparent transition-colors duration-500" />
          <span className="relative z-10 text-white/80 group-hover:text-white flex items-center gap-3 transition-colors duration-300">
            suraj.xaudhary@gmail.com
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </motion.a>
      </motion.div>

      {/* Premium Footer Bar */}
      <div className="relative z-10 mt-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/10">
        
        {/* Availability Status */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-3"
        >
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-sm font-medium text-white/80">Available for projects</span>
        </motion.div>

        {/* Social Links */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {[
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/suraj-tharu/', icon: Briefcase },
            { label: 'GitHub', url: 'https://github.com/suraj-tharu', icon: Terminal },
            { label: 'Scholar', url: 'https://scholar.google.com', icon: GraduationCap },
            { label: 'ResearchGate', url: 'https://www.researchgate.net', icon: Microscope },
          ].map((social) => {
            const Icon = social.icon;
            return (
            <motion.a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2, backgroundColor: 'rgba(255,255,255,0.1)' }}
              className="flex items-center gap-2 text-sm font-medium bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/70 hover:text-white transition-all duration-300"
            >
              <Icon size={14} /> {social.label}
            </motion.a>
          )})}
        </div>

        {/* Copyright & Stats */}
        <div className="flex flex-col items-center gap-3 md:items-end">
          <div className="text-xs font-semibold tracking-widest uppercase text-transparent bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text">
            © 2026 Er. Suraj Tharu Chaudhary. All rights reserved.
          </div>
          <VisitorCounter />
        </div>
      </div>

    </footer>
  );
}
