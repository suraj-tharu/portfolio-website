import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';

const roles = ["Engineer", "Educator", "Researcher", "GIS Analyst"];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    // Setup HLS Video
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
        video.play().catch(() => {});
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
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
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-bg">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-30 mix-blend-screen"
        />
        {/* Obsidian Space Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-12 w-full max-w-[100vw] overflow-x-hidden">
        <div className="blur-in text-[clamp(0.6rem,1vw,0.75rem)] text-brand-light uppercase tracking-[0.3em] mb-4 md:mb-8 font-semibold">
          Collection '26
        </div>
        
        <h1 className="text-fluid-6xl md:text-fluid-8xl lg:text-fluid-9xl font-display italic leading-[0.9] tracking-tight text-white mb-4 md:mb-6 flex flex-wrap justify-center gap-2 md:gap-4 drop-shadow-2xl px-2 w-full">
          {name.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: 100, opacity: 0, rotateZ: 5 }}
              animate={{ y: 0, opacity: 1, rotateZ: 0 }}
              transition={{ duration: 1.2, delay: 3.2 + i * 0.15, ease: [0.2, 0.65, 0.3, 0.9] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        
        <div className="blur-in text-fluid-lg md:text-fluid-2xl font-display italic text-text-secondary mb-6 md:mb-8 flex items-center gap-2 px-4 text-center justify-center">
          An <span key={roleIndex} className="animate-role-fade-in inline-block text-accent font-semibold">{roles[roleIndex]}</span> from Nawalparasi West, Nepal.
        </div>
        
        <p className="blur-in text-fluid-xs md:text-fluid-base text-muted max-w-[90%] md:max-w-md mb-8 md:mb-12 px-4">
          Applying machine learning and geospatial analysis to drive sustainable development and engineering solutions.
        </p>

        <div className="blur-in flex flex-col sm:flex-row items-center gap-6">
          <MagneticButton>
            <a href="#work" className="inline-flex items-center justify-center rounded-full text-sm px-8 py-4 bg-white text-black font-semibold hover:scale-105 transition-transform duration-300">
              See Works
            </a>
          </MagneticButton>
          
          <MagneticButton>
            <a href="#contact" className="inline-flex items-center justify-center rounded-full text-sm px-8 py-4 border-2 border-stroke bg-bg/50 backdrop-blur-md text-white hover:border-brand-light transition-all hover:scale-105">
              Reach out &rarr;
            </a>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 opacity-70">
        <span className="text-[10px] text-muted uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-light/50 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
