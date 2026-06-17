import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

type TimelineEvent = {
  id?: number;
  year: string;
  role: string;
  location: string;
};

const defaultTimeline: TimelineEvent[] = [
  { year: "2017 - 2021", role: "B.E. Computer Engineering", location: "Mid-West University (Himalaya College of Engineering)" },
  { year: "2021", role: "Nepal Telecom Internship", location: "Kathmandu" },
  { year: "2021 - 2023", role: "Instructor", location: "Buddhi Bikash Secondary School" },
  { year: "2023 - 2024", role: "Instructor", location: "Additional Technical School" },
  { year: "2024 - 2026", role: "Senior Instructor", location: "Trishahid Namuna Ma. Vi." },
  { year: "2024 - Present", role: "MSc Information System Engineering", location: "Purbanchal University" },
];

export default function AcademicTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        if (data.timeline && data.timeline.length > 0) {
          setTimeline(data.timeline);
        } else {
          setTimeline(defaultTimeline);
        }
      })
      .catch((error) => {
        console.error('Error fetching timeline:', error);
        setTimeline(defaultTimeline);
      });
  }, []);

  return (
    <section id="timeline" className="py-20 relative z-20 font-helvetica bg-cover bg-center bg-no-repeat bg-fixed" style={{
      backgroundImage: "url('/cosmic_origin.png'), linear-gradient(135deg, rgba(10,10,26,0.95) 0%, rgba(28,10,46,0.9) 50%, rgba(0,0,0,0.98) 100%)",
      backgroundSize: "cover, cover",
      backgroundColor: "#0a0a1a"
    }}>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-[#0a0a0a]/70 dark:bg-[#0a0a0a]/70 z-0 pointer-events-none"></div>
      <div className="max-w-[800px] mx-auto px-6 md:px-10 relative z-10">

        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs dark:text-muted text-gray-600 uppercase tracking-[0.3em] mb-4">Journey</span>
          <h2 className="text-4xl md:text-6xl dark:text-text-primary text-gray-900 tracking-tight font-display italic">
            Academic Timeline
          </h2>
        </div>

        <div ref={containerRef} className="relative">
          {/* Glowing Line Background */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] dark:bg-stroke bg-gray-300 -translate-x-1/2" />

          {/* Animated Glowing Line */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-[2px] dark:accent-gradient bg-blue-500 -translate-x-1/2 origin-top dark:shadow-[0_0_15px_rgba(137,170,204,0.8)] shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            style={{ height: lineHeight }}
          />

          <div className="flex flex-col gap-12 py-10">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex items-center justify-start md:justify-between w-full pl-20 md:pl-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Node Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full dark:bg-surface bg-gray-300 dark:border-stroke border-gray-400 border-2 -translate-x-1/2 z-10" />
                <motion.div
                  className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-blue-400 -translate-x-1/2 z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ boxShadow: '0 0 10px rgba(96,165,250,0.5)' }}
                />

                {/* Content Box */}
                <div className={`w-full md:w-[45%] flex ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                  <div className="dark:bg-[#0f0f15]/80 bg-white/80 backdrop-blur-md dark:border-[#3b3b4f] border-gray-200 border-2 p-8 rounded-2xl w-full dark:hover:bg-[#1a1a24]/90 hover:bg-white/90 transition-all duration-300 dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] shadow-[0_0_20px_rgba(200,200,200,0.3)]">
                    <span className="dark:text-[#d9b876] text-gray-800 text-base md:text-lg font-medium tracking-widest uppercase">{item.year}</span>
                    <h3 className="text-2xl md:text-3xl font-display italic dark:text-[#f3f0e8] text-gray-900 mt-3 mb-2">{item.role}</h3>
                    <p className="dark:text-[#a1a1aa] text-gray-700 text-base md:text-lg">{item.location}</p>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
