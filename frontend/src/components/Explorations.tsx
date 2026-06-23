import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AnimatedDecoration = () => (
  <motion.svg
    className="absolute left-[5%] top-[10%] md:left-[10%] md:top-[15%] w-64 h-64 md:w-96 md:h-96 text-[var(--brand)]/30 pointer-events-none z-0"
    viewBox="0 0 200 200"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: false, margin: "-100px" }}
  >
    <motion.path
      d="M20,100 C20,50 80,20 100,50 C120,80 180,50 180,100 C180,150 120,180 100,150 C80,120 20,150 20,100 Z"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="2"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: { 
          pathLength: 1, 
          opacity: 1, 
          transition: { duration: 3, ease: "easeInOut" } 
        }
      }}
    />
    <motion.path
      d="M50,100 L150,100 M100,50 L100,150"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="4 4"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: { 
          pathLength: 1, 
          opacity: 0.5, 
          transition: { duration: 2, delay: 1, ease: "easeInOut" } 
        }
      }}
    />
  </motion.svg>
);

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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section ref={sectionRef} id="explorations" className="relative bg-bg py-24 md:py-36 overflow-hidden z-20">
      
      <AnimatedDecoration />

      {/* Section header — in normal flow, no absolute/pinning */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mb-16 md:mb-24">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">Explorations</span>
          <div className="w-8 h-px bg-stroke" />
        </div>
        
        <h2 className="text-5xl md:text-7xl lg:text-8xl text-text-primary tracking-tight mb-6">
          Visual <span className="font-display italic">playground</span>
        </h2>
        
        <p className="text-sm md:text-base text-muted max-w-md text-center mb-10">
          A collection of experiments, generative art, and conceptual UI interactions.
        </p>

        <a
          href="https://dribbble.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm bg-surface border border-stroke hover:border-transparent transition-colors overflow-hidden"
        >
          <span className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,rgba(137,170,204,1)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite] transition-opacity duration-300" />
          <div className="absolute inset-[2px] bg-bg rounded-full" />
          <span className="relative z-10 flex items-center gap-2">View Dribbble →</span>
        </a>
      </div>

      {/* Parallax image columns — normal flow with relative positioning */}
      <div className="relative z-20 max-w-[1200px] mx-auto w-full px-6 md:px-16">
        <div className="grid grid-cols-2 gap-6 md:gap-12">
          
          {/* Column 1 */}
          <motion.div style={{ y: y1 }} className="flex flex-col gap-6 md:gap-10 items-end">
            {images.slice(0, 3).map((img, i) => (
              <motion.div 
                key={`col1-${i}`} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="w-full max-w-[280px] md:max-w-[380px] aspect-square rounded-3xl overflow-hidden cursor-pointer border border-stroke group"
              >
                <img 
                  src={img} 
                  alt={`Exploration ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Column 2 (offset start) */}
          <motion.div style={{ y: y2 }} className="flex flex-col gap-6 md:gap-10 mt-[10vh] md:mt-[20vh] items-start">
            {images.slice(3, 6).map((img, i) => (
              <motion.div 
                key={`col2-${i}`} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 + 0.15 }}
                className="w-full max-w-[280px] md:max-w-[380px] aspect-square rounded-3xl overflow-hidden cursor-pointer border border-stroke group"
              >
                <img 
                  src={img} 
                  alt={`Exploration ${i + 4}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
      
    </section>
  );
}
