import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Star, Trophy, BookOpen } from 'lucide-react';

const awards = [
  {
    title: "Best Engineering Project Award",
    description: "Awarded for the final year B.E. project on automated systems.",
    year: "2021",
    icon: Trophy,
    accentColor: "from-yellow-500/20 to-amber-500/10",
    iconColor: "text-yellow-400",
    borderHover: "hover:border-yellow-500/40"
  },
  {
    title: "Excellence in Teaching",
    description: "Recognized as the top instructor at Trishahid Namuna Ma. Vi.",
    year: "2025",
    icon: Star,
    accentColor: "from-brand-500/20 to-pink-500/10",
    iconColor: "text-brand-light",
    borderHover: "hover:border-brand-500/40"
  },
  {
    title: "Research Grant Recipient",
    description: "Secured funding for MSc thesis on spatial decision support.",
    year: "2026",
    icon: BookOpen,
    accentColor: "from-cyan-500/20 to-blue-500/10",
    iconColor: "text-cyan-400",
    borderHover: "hover:border-cyan-500/40"
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function AwardsAchievements() {
  return (
    <section className="bg-bg py-20 md:py-28 relative z-20 overflow-hidden">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-yellow-500/50" />
            <Star className="text-yellow-500" size={20} />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-yellow-500/50" />
          </div>
          <h2 className="text-3xl md:text-5xl text-text-primary tracking-tight font-display italic">
            Awards &amp; Honors
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col gap-6"
        >
          {awards.map((award, i) => {
            const Icon = award.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`relative p-6 md:p-8 rounded-3xl bg-gradient-to-br ${award.accentColor} border border-stroke ${award.borderHover} transition-all duration-300 group glass backdrop-blur-sm overflow-hidden`}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/3 rounded-bl-full -z-0 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10 flex items-start gap-5">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${award.iconColor} bg-white/5 border border-white/10 shrink-0`}>
                    <Icon size={22} />
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2 group-hover:text-white transition-colors leading-snug">
                      {award.title}
                    </h3>
                    <p className="text-muted leading-relaxed">{award.description}</p>
                  </div>

                  {/* Year badge */}
                  <div className="text-sm font-display italic font-bold text-yellow-500/80 shrink-0 mt-1">
                    {award.year}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
