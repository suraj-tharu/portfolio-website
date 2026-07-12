import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import React from 'react';

const galleryItems = [
  { img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80", title: "LULC Map Analysis", span: "md:col-span-8 md:row-span-2" },
  { img: "https://images.unsplash.com/photo-1526778548025-fa2fbfb2cbdf?auto=format&fit=crop&w=800&q=80", title: "GIS Visualization", span: "md:col-span-4 md:row-span-1" },
  { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", title: "Satellite Data Processing", span: "md:col-span-4 md:row-span-1" },
  { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80", title: "Research Poster", span: "md:col-span-6 md:row-span-1" },
  { img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", title: "Conference Presentation", span: "md:col-span-6 md:row-span-1" },
];

function TiltCard({ item, i }: { item: typeof galleryItems[0], i: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] ${item.span} shadow-lg`}
    >
      <div style={{ transform: "translateZ(30px)", width: '100%', height: '100%' }}>
        <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div 
        style={{ transform: "translateZ(50px)" }} 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none"
      >
        <h3 className="text-white font-medium text-lg shadow-black/50 drop-shadow-md">{item.title}</h3>
      </div>
    </motion.div>
  );
}

export default function ResearchGallery() {
  return (
    <section className="bg-[var(--bg)] py-12 md:py-16 relative z-20" style={{ perspective: 1000 }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--muted)] uppercase tracking-[0.3em]">Gallery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[250px]">
          {galleryItems.map((item, i) => (
            <TiltCard key={i} item={item} i={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
