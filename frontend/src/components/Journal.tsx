import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const defaultEntries = [
  { title: "The future of interactive web design", date: "Oct 12, 2026", read: "4 min read", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=100&q=80", url: "#" },
  { title: "Building accessible animations", date: "Sep 28, 2026", read: "6 min read", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80", url: "#" },
  { title: "Why typography matters in digital products", date: "Sep 15, 2026", read: "5 min read", img: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?auto=format&fit=crop&w=100&q=80", url: "#" },
  { title: "My workflow for high-performance sites", date: "Aug 30, 2026", read: "8 min read", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=100&q=80", url: "#" },
];

type Blog = {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
};

// Skeleton card
const SkeletonEntry = () => (
  <div className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-surface/30 border border-stroke rounded-[40px] sm:rounded-full animate-pulse">
    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-surface" />
    <div className="flex flex-col gap-2 w-full pr-4">
      <div className="h-4 bg-surface rounded-full w-3/4" />
      <div className="h-3 bg-surface/70 rounded-full w-1/3" />
    </div>
  </div>
);

export default function Journal() {
  const [dbBlogs, setDbBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio-data')
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        if (data.blogs && data.blogs.length > 0) {
          setDbBlogs(data.blogs.slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => {
        // Short delay so skeleton is visible even on fast connections
        setTimeout(() => setIsLoading(false), 600);
      });
  }, []);

  const displayEntries = dbBlogs.length > 0 ? dbBlogs.map((b, i) => {
    const wordCount = b.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    return {
      title: b.title,
      date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: `${readTime} min read`,
      img: defaultEntries[i]?.img || defaultEntries[0].img,
      url: `/blog/${b.slug}`
    };
  }) : defaultEntries;

  return (
    <section className="bg-bg py-12 md:py-16 relative z-20">
      <div className="max-w-[1000px] mx-auto px-6 md:px-10 lg:px-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">Journal</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight mb-4">
              Recent <span className="font-display italic">thoughts</span>
            </h2>
          </div>
          
          <Link
            to="/learning-hub"
            className="hidden md:inline-flex group relative items-center justify-center rounded-full px-6 py-3 text-sm bg-surface border border-stroke hover:border-transparent transition-colors overflow-hidden"
          >
            <span className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,rgba(137,170,204,1)_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_2s_linear_infinite] transition-opacity duration-300" />
            <div className="absolute inset-[2px] bg-bg rounded-full" />
            <span className="relative z-10 flex items-center gap-2">View all &rarr;</span>
          </Link>
        </motion.div>

        {/* Entries or Skeletons */}
        <div className="flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonEntry key={i} />)
            : displayEntries.map((entry, i) => (
              <motion.a 
                href={entry.url}
                key={entry.title + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-all duration-300 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-full">
                  <img src={entry.img} alt={entry.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 sm:pr-8 gap-2 sm:gap-4">
                  <h3 className="text-lg sm:text-xl font-medium text-text-primary group-hover:text-white transition-colors">{entry.title}</h3>
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-muted shrink-0">
                    <span>{entry.read}</span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-stroke" />
                    <span>{entry.date}</span>
                  </div>
                </div>
              </motion.a>
            ))
          }
        </div>

      </div>
    </section>
  );
}
