import { motion } from 'framer-motion';

const galleryItems = [
  { img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80", title: "LULC Map Analysis", span: "md:col-span-8 md:row-span-2" },
  { img: "https://images.unsplash.com/photo-1526778548025-fa2fbfb2cbdf?auto=format&fit=crop&w=800&q=80", title: "GIS Visualization", span: "md:col-span-4 md:row-span-1" },
  { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", title: "Satellite Data Processing", span: "md:col-span-4 md:row-span-1" },
  { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80", title: "Research Poster", span: "md:col-span-6 md:row-span-1" },
  { img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", title: "Conference Presentation", span: "md:col-span-6 md:row-span-1" },
];

export default function ResearchGallery() {
  return (
    <section className="bg-bg py-24 relative z-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">Gallery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[250px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className={`group relative overflow-hidden rounded-3xl border border-stroke ${item.span}`}
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h3 className="text-white font-medium text-lg">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
