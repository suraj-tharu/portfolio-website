import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TeachingExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.teach-panel');

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1.5,
          snap: 1 / (panels.length - 1),
          end: () => "+=" + (scrollWrapperRef.current?.offsetWidth || 2000)
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-gradient-to-br from-[#0a0f1d] via-[#1c0a2e] to-[#000000] relative z-20 overflow-hidden h-screen flex flex-col justify-center font-helvetica border-y border-stroke/30">

      <div className="absolute top-12 left-6 md:left-16 z-30">
        <span className="text-xs dark:text-muted text-amber-600 uppercase tracking-[0.3em] mb-2 block">Pedagogy</span>
        <h2 className="text-3xl md:text-5xl dark:text-text-primary text-amber-600 font-display italic">
          5+ Years of Teaching
        </h2>
      </div>

      <div ref={scrollWrapperRef} className="flex h-[60vh] md:h-[50vh] mt-24">

        {/* Panel 1 */}
        <div className="teach-panel w-screen h-full flex-shrink-0 flex items-center px-6 md:px-16">
          <div className="max-w-2xl">
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">Institutions</h3>
            <p className="text-xl text-white/70 leading-relaxed">
              I have shaped the minds of tomorrow at prestigious institutions including <span className="text-white">Buddhi Bikash Secondary School</span>, <span className="text-white">Trishahid Namuna Ma. Vi.</span>, and various other technical schools across Nepal.
            </p>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="teach-panel w-screen h-full flex-shrink-0 flex items-center px-6 md:px-16">
          <div className="max-w-2xl">
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">Courses Taught</h3>
            <ul className="text-xl text-white/70 leading-relaxed space-y-4">
              <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500" /> Digital Design & Architecture</li>
              <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500" /> Object-Oriented Programming (C++)</li>
              <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500" /> Database Management Systems</li>
              <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500" /> Geographic Information Systems</li>
            </ul>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="teach-panel w-screen h-full flex-shrink-0 flex items-center px-6 md:px-16">
          <div className="max-w-2xl">
            <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">Philosophy</h3>
            <p className="text-xl text-white/70 leading-relaxed italic border-l-4 border-blue-500 pl-6">
              "Education is not just about transferring knowledge; it is about inspiring curiosity, fostering critical thinking, and empowering students to build solutions for real-world problems. I believe in a hands-on, practical approach to engineering."
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
