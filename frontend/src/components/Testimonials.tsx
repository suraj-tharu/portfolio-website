import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeader from './SectionHeader';

const testimonials = [
  {
    id: 1,
    quote: "Suraj has a unique ability to bridge complex engineering concepts with real-world applications. His work in GIS and ML is truly outstanding.",
    name: "Dr. Anil Kumar",
    role: "Professor of Computer Engineering",
    company: "Tribhuvan University"
  },
  {
    id: 2,
    quote: "Working with Suraj was a game-changer. He completely transformed our data pipeline, bringing efficiency and clarity to our research projects.",
    name: "Priya Sharma",
    role: "Lead Researcher",
    company: "Nepal Tech Innovation"
  },
  {
    id: 3,
    quote: "An exceptional educator and an brilliant mind. Suraj doesn't just teach; he inspires the next generation of engineers to think bigger.",
    name: "Ramesh Thapa",
    role: "Former Student",
    company: "Now Software Engineer at Google"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-py relative z-20 bg-[var(--bg)] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="section-container">
        <SectionHeader 
          badge="Endorsements" 
          title="What People Say" 
          description="Reflections from colleagues, mentors, and students on our shared journey." 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors duration-500"
            >
              <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-30 group-hover:-translate-y-2 transition-all duration-500">
                <Quote size={48} className="text-brand-400" />
              </div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <p className="text-white/80 font-jakarta text-[0.95rem] leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-pink-500 flex items-center justify-center text-white font-syne font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-syne text-sm tracking-wide">{testimonial.name}</h4>
                    <p className="text-white/50 text-xs mt-0.5">{testimonial.role}</p>
                    <p className="text-brand-400/80 text-[0.65rem] uppercase tracking-wider mt-1">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
