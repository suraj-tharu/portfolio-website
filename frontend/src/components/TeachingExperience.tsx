import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    title: "Institutions",
    content: (
      <p className="text-xl text-text-secondary dark:text-white/70 leading-relaxed">
        I have shaped the minds of tomorrow at prestigious institutions including <span className="text-text-primary dark:text-white">Buddhi Bikash Secondary School</span>, <span className="text-text-primary dark:text-white">Trishahid Namuna Ma. Vi.</span>, and various other technical schools across Nepal.
      </p>
    )
  },
  {
    title: "Courses Taught",
    content: (
      <ul className="text-xl text-text-secondary dark:text-white/70 leading-relaxed space-y-4">
        <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> Digital Design &amp; Architecture</li>
        <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> Object-Oriented Programming (C++)</li>
        <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> Database Management Systems</li>
        <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" /> Geographic Information Systems</li>
      </ul>
    )
  },
  {
    title: "Philosophy",
    content: (
      <p className="text-xl text-text-secondary dark:text-white/70 leading-relaxed italic border-l-4 border-blue-500 pl-6">
        "Education is not just about transferring knowledge; it is about inspiring curiosity, fostering critical thinking, and empowering students to build solutions for real-world problems. I believe in a hands-on, practical approach to engineering."
      </p>
    )
  },
];

export default function TeachingExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panelEls = gsap.utils.toArray<HTMLElement>('.teach-panel');

      const tween = gsap.to(panelEls, {
        xPercent: -100 * (panelEls.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1.5,
          snap: 1 / (panelEls.length - 1),
          end: () => "+=" + (scrollWrapperRef.current?.offsetWidth || 2000),
          onUpdate: (self) => {
            // Update the active dot indicator
            const index = Math.round(self.progress * (panelEls.length - 1));
            setActivePanel(index);
          }
        }
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-gradient-to-br from-[#0a0f1d] via-[#1c0a2e] to-[#000000] relative z-20 overflow-hidden h-screen flex flex-col justify-center font-helvetica border-y border-stroke/30"
    >
      <div className="absolute top-12 left-6 md:left-16 z-40 pointer-events-none">
        <span className="text-xs dark:text-muted text-amber-600 uppercase tracking-[0.3em] mb-2 block">Pedagogy</span>
        <h2 className="text-3xl md:text-5xl dark:text-text-primary text-amber-600 font-display italic">
          5+ Years of Teaching
        </h2>
      </div>

      {/* Panel dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
        {panels.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: activePanel === i ? 24 : 8,
              backgroundColor: activePanel === i ? 'rgb(139, 92, 246)' : 'rgba(255,255,255,0.3)'
            }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full"
          />
        ))}
        <span className="ml-2 text-xs text-muted dark:text-white/50">
          {activePanel + 1} / {panels.length}
        </span>
      </div>

      <div ref={scrollWrapperRef} className="flex h-[60vh] md:h-[50vh] mt-24 relative z-10">
        {panels.map((panel, i) => (
          <div key={i} className="teach-panel w-screen h-full flex-shrink-0 flex items-center px-6 md:px-16">
            <div className="max-w-2xl">
              <h3 className="text-4xl md:text-6xl font-bold text-text-primary dark:text-white mb-6">{panel.title}</h3>
              {panel.content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
