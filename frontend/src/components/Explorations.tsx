import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const images = [
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    title: "Generative Art",
    tag: "Design Systems",
  },
  {
    src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80",
    title: "Data Viz",
    tag: "Information Design",
  },
  {
    src: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=800&q=80",
    title: "Motion Graphics",
    tag: "UI Animation",
  },
  {
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    title: "3D Renders",
    tag: "Spatial Design",
  },
  {
    src: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=800&q=80",
    title: "Typography",
    tag: "Type Experiments",
  },
  {
    src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=800&q=80",
    title: "Color Theory",
    tag: "Visual Research",
  },
];

/* ── Individual card with tilt + reveal ──────────────────── */
function ExplorationCard({ img, index }: { img: typeof images[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], ['6deg', '-6deg']), { stiffness: 150, damping: 15 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], ['-6deg', '6deg']), { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotX, rotateY: rotY,
        transformPerspective: 1000,
        flexShrink: 0,
      }}
      className="relative cursor-pointer"
    >
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
        style={{ width: 320, height: 400 }}
      >
        {/* Image */}
        <motion.img
          src={img.src}
          alt={img.title}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hover reveal overlay */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end p-6"
          animate={{ opacity: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] uppercase tracking-[0.2em] font-bold font-syne mb-2"
            style={{ color: '#a78bfa' }}
          >
            {img.tag}
          </motion.span>

          <h3
            className="font-syne font-black text-[var(--text)] text-xl leading-tight tracking-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {img.title}
          </h3>
        </motion.div>

        {/* Holographic border on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, transparent 50%, rgba(244,114,182,0.08) 100%)',
            boxShadow: 'inset 0 0 0 1.5px rgba(167,139,250,0.3)',
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Explorations() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Map vertical scroll to horizontal translate
  const cardWidth = 336; // 320 card + 16 gap
  const totalScroll = -(images.length - 3) * cardWidth; // visible ~3 cards at once
  const rawX = useTransform(scrollYProgress, [0.1, 0.9], [0, totalScroll]);
  const x = useSpring(rawX, { stiffness: 60, damping: 20 });

  return (
    <section
      ref={sectionRef}
      id="explorations"
      className="relative bg-[var(--bg)] overflow-hidden z-20"
      style={{ height: '200vh' }} // tall section = more scroll room for horizontal
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/3 -translate-y-1/2 pointer-events-none"
          style={{
            width: '50vw', height: '50vw', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Section header */}
        <div className="relative z-10 px-6 md:px-16 mb-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-pink-500" />
            <span className="text-[10px] text-[rgba(var(--text-base-rgb),0.30)] uppercase tracking-[0.3em] font-syne font-bold">
              Visual Explorations
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: 'rgba(var(--text-base-rgb), 0.95)',
            }}
          >
            Visual{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              Playground
            </span>
          </h2>

          <p className="mt-4 font-jakarta text-[rgba(var(--text-base-rgb),0.35)] text-sm md:text-base leading-relaxed max-w-md">
            Scroll to explore — a collection of experiments, generative art, and conceptual UI interactions.
          </p>
        </div>

        {/* Horizontal scroll track */}
        <div ref={trackRef} className="relative w-full overflow-hidden pl-6 md:pl-16">
          <motion.div
            style={{ x }}
            className="flex gap-4 md:gap-5"
            // fallback touch drag
            drag="x"
            dragConstraints={{ left: totalScroll, right: 0 }}
            dragElastic={0.05}
          >
            {images.map((img, i) => (
              <ExplorationCard key={i} img={img} index={i} />
            ))}

            {/* End CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ flexShrink: 0, width: 320, height: 400 }}
              className="relative rounded-3xl border border-[rgba(var(--text-base-rgb),0.08)] flex flex-col items-center justify-center text-center gap-4 p-8 cursor-pointer group hover:bg-[var(--text)] transition-colors duration-500"
              onClick={() => window.open('https://dribbble.com', '_blank')}
            >
              {/* Rotating ring background */}
              <div
                className="absolute inset-4 rounded-2xl border border-dashed border-white/10"
                style={{ animation: 'ring-rotate 12s linear infinite' }}
              />

              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}
              >
                →
              </div>

              <div>
                <p className="font-syne font-bold text-[var(--text)] group-hover:text-[var(--bg)] text-lg transition-colors duration-500">View All</p>
                <p className="font-jakarta text-[rgba(var(--text-base-rgb),0.30)] group-hover:text-[var(--bg)] group-hover:opacity-60 text-xs mt-1 tracking-widest uppercase transition-colors duration-500">On Dribbble</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Fade masks */}
          <div className="absolute inset-y-0 right-0 w-32 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--bg), transparent)' }} />
          <div className="absolute inset-y-0 left-0 w-16 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--bg), transparent)' }} />
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-6 md:left-16 flex items-center gap-2"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-10 h-px bg-gradient-to-r from-violet-500 to-transparent" />
          <span className="text-[10px] text-[rgba(var(--text-base-rgb),0.20)] uppercase tracking-[0.2em] font-syne">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}
