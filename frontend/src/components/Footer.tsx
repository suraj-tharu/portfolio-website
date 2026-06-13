import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { gsap } from 'gsap';

export default function Footer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup HLS Video
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({ startPosition: -1, capLevelToPlayerSize: true });
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }
  }, []);

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
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-bg">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1] opacity-60"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-bg to-transparent" />
      </div>

      {/* Marquee */}
      <div className="relative z-10 w-full overflow-hidden py-10 md:py-20 flex whitespace-nowrap">
        <div ref={marqueeRef} className="flex text-7xl md:text-9xl font-display italic text-text-primary/10 tracking-tight">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="px-4">BUILDING THE FUTURE •</span>
          ))}
          {/* Duplicate for seamless looping */}
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={`dup-${i}`} className="px-4">BUILDING THE FUTURE •</span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 py-20 text-center">
        <div className="text-xs text-muted uppercase tracking-[0.3em] mb-6">Let's talk</div>
        <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-display text-text-primary tracking-tight leading-none mb-12">
          Ready to create <br className="hidden md:block" />
          <span className="italic">something special?</span>
        </h2>
        
        <a href="mailto:suraj.xaudhary@gmail.com" className="group relative inline-flex items-center justify-center rounded-full px-10 py-5 text-base md:text-lg bg-surface border border-stroke hover:border-transparent transition-colors overflow-hidden">
           <span className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,rgba(137,170,204,1)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite] transition-opacity duration-300" />
           <div className="absolute inset-[2px] bg-bg rounded-full" />
           <span className="relative z-10 text-text-primary font-medium">suraj.xaudhary@gmail.com</span>
        </a>
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 mt-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
        
        {/* Availability */}
        <div className="flex items-center gap-3 bg-surface/50 backdrop-blur-sm border border-stroke rounded-full px-4 py-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-sm text-text-primary">Available for projects</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center mt-4 md:mt-0">
          <a href="https://www.linkedin.com/in/suraj-tharu/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-text-primary transition-colors">LinkedIn</a>
          <a href="https://github.com/suraj-tharu" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-text-primary transition-colors">GitHub</a>
          <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-text-primary transition-colors">Google Scholar</a>
          <a href="https://www.researchgate.net" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-text-primary transition-colors">ResearchGate</a>
          <span className="text-sm text-muted">Nawalparasi West, NP</span>
        </div>
        
        {/* Copyright */}
        <div className="text-sm text-muted">
          © 2026 Suraj Tharu Chaudhary
        </div>
      </div>

    </footer>
  );
}
