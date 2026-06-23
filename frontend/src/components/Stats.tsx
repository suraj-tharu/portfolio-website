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
    { label: "Years Teaching", value: "05+" },
    { label: "Students Taught", value: "500+" },
    { label: "Research Papers", value: "02" },
  ];

  return (
    <section className="bg-bg py-16 md:py-24 border-t border-stroke relative z-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-stroke">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
              className="flex flex-col items-center justify-center pt-8 md:pt-0"
            >
              <div className="text-6xl md:text-7xl lg:text-8xl font-display text-text-primary mb-2 gradient-text-premium drop-shadow-md">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="text-sm md:text-base text-muted uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
