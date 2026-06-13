import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=600&q=80",
];

export default function Explorations() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin center content
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });

      // Parallax columns
      gsap.to(col1Ref.current, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(col2Ref.current, {
        yPercent: -80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-bg min-h-[300vh] overflow-hidden z-20">
      
      {/* Layer 1: Pinned Center */}
      <div ref={contentRef} className="absolute inset-0 h-screen w-full flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">Explorations</span>
          <div className="w-8 h-px bg-stroke" />
        </div>
        
        <h2 className="text-5xl md:text-7xl lg:text-8xl text-text-primary tracking-tight mb-6 text-center">
          Visual <span className="font-display italic">playground</span>
        </h2>
        
        <p className="text-sm md:text-base text-muted max-w-md text-center mb-10">
          A collection of experiments, generative art, and conceptual UI interactions.
        </p>

        <button className="pointer-events-auto group relative inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm bg-surface border border-stroke hover:border-transparent transition-colors overflow-hidden">
           <span className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,rgba(137,170,204,1)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite] transition-opacity duration-300" />
           <div className="absolute inset-[2px] bg-bg rounded-full" />
           <span className="relative z-10 flex items-center gap-2">View Dribbble</span>
        </button>
      </div>

      {/* Layer 2: Parallax Columns */}
      <div className="absolute inset-0 z-20 max-w-[1400px] mx-auto w-full h-full pointer-events-none px-6 md:px-20 lg:px-32">
        <div className="grid grid-cols-2 gap-12 md:gap-40 h-full relative pt-[100vh]">
          
          {/* Column 1 */}
          <div ref={col1Ref} className="flex flex-col gap-12 md:gap-32 pointer-events-auto items-end">
            {images.slice(0, 3).map((img, i) => (
              <div 
                key={`col1-${i}`} 
                className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-105 hover:rotate-2 border border-stroke"
              >
                <img src={img} alt="Exploration" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Column 2 (Offset starting position) */}
          <div ref={col2Ref} className="flex flex-col gap-12 md:gap-32 mt-[30vh] pointer-events-auto items-start">
            {images.slice(3, 6).map((img, i) => (
              <div 
                key={`col2-${i}`} 
                className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-105 hover:-rotate-2 border border-stroke"
              >
                <img src={img} alt="Exploration" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

        </div>
      </div>
      
    </section>
  );
}
