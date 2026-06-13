import { motion } from 'framer-motion';

export default function Stats() {
  const stats = [
    { label: "Years Experience", value: "05+" },
    { label: "Projects Done", value: "95+" },
    { label: "Satisfied Clients", value: "200%" },
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
              <div className="text-6xl md:text-7xl lg:text-8xl font-display text-text-primary mb-2">
                {stat.value}
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
