import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const panels = [
  {
    title: "Institutions",
    subtitle: "Shaping the minds of tomorrow",
    content: (
      <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-light">
        I have shaped the minds of tomorrow at prestigious institutions including <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-semibold drop-shadow-sm">Buddhi Bikash Secondary School</span>, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-semibold drop-shadow-sm">Trishahid Namuna Ma. Vi.</span>, and various other technical schools across Nepal.
      </p>
    )
  },
  {
    title: "Courses Taught",
    subtitle: "Core technical disciplines",
    content: (
      <ul className="text-xl text-text-secondary leading-relaxed space-y-6">
        {[
          "Digital Design & Architecture",
          "Object-Oriented Programming (C++)",
          "Database Management Systems",
          "Geographic Information Systems"
        ].map((course, idx) => (
          <motion.li 
            key={idx}
            whileHover={{ x: 10, color: 'var(--text-primary)' }}
            className="flex items-center gap-4 group cursor-default transition-colors duration-300"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-600/20 border border-amber-500/30 group-hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all duration-300 shrink-0">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 group-hover:scale-150 transition-transform duration-300" />
            </div>
            <span className="font-medium group-hover:tracking-wide transition-all duration-300">{course}</span>
          </motion.li>
        ))}
      </ul>
    )
  },
  {
    title: "Philosophy",
    subtitle: "My approach to education",
    content: (
      <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[var(--surface)] to-transparent border border-stroke/50 backdrop-blur-md shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-orange-600" />
        <p className="relative z-10 text-xl md:text-2xl text-text-secondary leading-relaxed italic font-serif">
          "Education is not just about transferring knowledge; it is about inspiring curiosity, fostering critical thinking, and empowering students to build solutions for real-world problems. I believe in a hands-on, practical approach to engineering."
        </p>
        <div className="absolute -bottom-10 -right-10 text-9xl text-[var(--surface)] opacity-20 font-serif leading-none rotate-12">"</div>
      </div>
    )
  },
];

export default function TeachingExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${100 * (panels.length - 1) / panels.length}%`]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.round(latest * (panels.length - 1));
    setActivePanel(index);
  });

  return (
    <section
      ref={containerRef}
      className="relative z-20 h-[300vh] bg-[var(--bg)]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--bg)] flex flex-col justify-center">
        
        {/* Ultra Premium Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]),
              scale: useTransform(scrollYProgress, [0, 1], [1, 1.2])
            }}
            className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-b from-amber-500/10 to-purple-600/10 blur-[120px]"
          />
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.5, 0.2]),
              x: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
            }}
            className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-blue-600/10 to-emerald-500/10 blur-[100px]"
          />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]"></div>
        </div>
        
        <div className="absolute top-10 sm:top-16 left-4 sm:left-8 lg:left-24 z-40 pointer-events-none flex flex-col gap-1 sm:gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-amber-400 to-transparent"></div>
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 uppercase tracking-[0.4em]">Pedagogy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl text-text-primary font-display font-bold tracking-tight">
            5+ Years of <span className="italic font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-100 drop-shadow-sm dark:from-zinc-100 dark:to-zinc-500">Teaching</span>
          </h2>
        </div>

        {/* Premium Animated Panel Indicators */}
        <div className="absolute bottom-6 sm:bottom-12 left-4 sm:left-8 lg:left-24 z-40 flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-[var(--surface)]/50 backdrop-blur-xl p-2 sm:p-3 rounded-full border border-stroke/50 shadow-lg">
            {panels.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (containerRef.current) {
                    const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
                    const targetScroll = (i / (panels.length - 1)) * scrollHeight + containerRef.current.offsetTop;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }}
                className="relative group h-3 flex items-center justify-center cursor-pointer"
              >
                <motion.div
                  animate={{
                    width: activePanel === i ? 32 : 12,
                    backgroundColor: activePanel === i ? 'rgba(251, 191, 36, 1)' : 'rgba(107, 114, 128, 0.4)'
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-full rounded-full group-hover:bg-amber-400/60 transition-colors"
                />
                {activePanel === i && (
                  <motion.div 
                    layoutId="activeIndicatorGlow"
                    className="absolute inset-0 bg-amber-400 rounded-full blur-[8px] opacity-60"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--surface)]/50 backdrop-blur-xl border border-stroke/50 shadow-lg font-mono text-xs sm:text-sm font-bold text-amber-500">
            0{activePanel + 1}
          </div>
        </div>

        {/* Horizontal Scrolling Content */}
        <motion.div 
          style={{ x, width: `${panels.length * 100}vw` }} 
          className="flex h-[75vh] sm:h-[70vh] md:h-[60vh] mt-24 sm:mt-32 relative z-10"
        >
          {panels.map((panel, i) => (
            <div key={i} className="w-screen h-full flex-shrink-0 flex items-center px-4 sm:px-8 lg:px-24">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl relative"
              >
                <div className="mb-4 inline-block px-4 py-1.5 rounded-full border border-stroke/50 bg-[var(--surface)]/30 backdrop-blur-md">
                  <span className="text-xs font-bold tracking-widest uppercase text-text-secondary">{panel.subtitle}</span>
                </div>
                <h3 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-text-primary to-text-secondary mb-6 sm:mb-8 drop-shadow-sm">
                  {panel.title}
                </h3>
                <div className="pl-6 md:pl-10 border-l border-stroke/30 relative">
                  <div className="absolute top-0 -left-[1px] w-[2px] h-12 bg-gradient-to-b from-amber-400 to-transparent" />
                  {panel.content}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
