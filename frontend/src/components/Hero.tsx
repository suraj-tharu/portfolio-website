import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { gsap } from 'gsap';


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
    // GSAP Animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3.2 }); // Wait for loading screen (2.7s + 0.4s)
      
      tl.fromTo('.name-reveal', 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.blur-in',
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1, ease: "power3.out" },
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

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
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-60"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-12">
        <div className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
          Collection '26
        </div>
        
        <h1 className="name-reveal text-6xl md:text-8xl lg:text-[10rem] font-display italic leading-[0.85] tracking-tight text-text-primary mb-6">
          Suraj Tharu
        </h1>
        
        <div className="blur-in text-xl md:text-3xl font-display italic text-text-primary mb-8 flex items-center gap-2">
          An <span key={roleIndex} className="animate-role-fade-in inline-block text-white/90">{roles[roleIndex]}</span> from Nawalparasi West, Nepal.
        </div>
        
        <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12">
          Applying machine learning and geospatial analysis to drive sustainable development and engineering solutions.
        </p>

        <div className="blur-in flex flex-col sm:flex-row items-center gap-4">
          <a href="#work" className="group relative inline-flex items-center justify-center rounded-full text-sm px-7 py-3.5 bg-text-primary text-bg hover:bg-bg hover:text-text-primary transition-all hover:scale-105 overflow-hidden">
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 accent-gradient z-0 transition-opacity" />
            <span className="absolute inset-[1px] bg-bg rounded-full opacity-0 group-hover:opacity-100 z-0 transition-opacity" />
            <span className="relative z-10">See Works</span>
          </a>
          
          <a href="#contact" className="group relative inline-flex items-center justify-center rounded-full text-sm px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary hover:border-transparent transition-all hover:scale-105 overflow-hidden">
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 accent-gradient z-0 transition-opacity" />
            <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 z-0 transition-opacity" />
            <span className="relative z-10">Reach out &rarr;</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 opacity-70">
        <span className="text-[10px] text-muted uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/50 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
