import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

function AnimatedCounter({ value }: { value: string }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, current => Math.floor(current));

  useEffect(() => {
    if (inView) {
      spring.set(numericValue);
    }
  }, [inView, spring, numericValue]);

  return (
    <span ref={ref} className="inline-flex items-center">
      {numericValue > 0 ? <motion.span>{display}</motion.span> : <span>{value}</span>}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export default function Stats() {
  const stats = [
    { label: "Years Teaching", value: "05+", icon: "🎓", color: "from-violet-500 to-purple-600" },
    { label: "Students Taught", value: "500+", icon: "👥", color: "from-pink-500 to-rose-600" },
    { label: "Research Papers", value: "02", icon: "📄", color: "from-cyan-500 to-blue-600" },
    { label: "Projects Delivered", value: "10+", icon: "🚀", color: "from-amber-500 to-orange-600" },
  ];

  return (
    <section className="bg-bg py-20 md:py-28 border-t border-stroke relative z-20 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className={`flex flex-col items-center justify-center py-10 px-4 relative ${
                i < stats.length - 1 ? 'border-r border-stroke/50' : ''
              } ${i >= 2 ? 'border-t border-stroke/50 md:border-t-0' : ''}`}
            >
              {/* Animated gradient top accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 + 0.3 }}
                className={`absolute top-0 left-[10%] right-[10%] h-[2px] rounded-full bg-gradient-to-r ${stat.color} origin-left`}
              />

              <div className="text-3xl mb-3">{stat.icon}</div>

              <div className={`text-5xl md:text-6xl lg:text-7xl font-display text-text-primary mb-2 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent drop-shadow-md`}>
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-xs md:text-sm text-muted uppercase tracking-[0.2em] text-center">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
