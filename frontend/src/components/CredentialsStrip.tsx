import { motion } from 'framer-motion';

const credentials = [
  { label: 'Tribhuvan University', type: 'Alumni' },
  { label: 'IEEE', type: 'Published In' },
  { label: 'ResearchGate', type: 'Top Researcher' },
  { label: 'Google Scholar', type: 'Indexed' },
  { label: 'GIS & RS', type: 'Specialist' },
  { label: 'Ministry of Education', type: 'Certified' },
];

export default function CredentialsStrip() {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/5 bg-black/20 backdrop-blur-md py-4 md:py-6">
      {/* Left/Right fading gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-fit">
        <motion.div
          className="flex whitespace-nowrap items-center gap-12 md:gap-24 px-6 md:px-12"
          animate={{ x: [0, -1035] }}
          transition={{ ease: 'linear', duration: 25, repeat: Infinity }}
          style={{ width: 'max-content' }}
        >
          {/* Duplicate the array twice to ensure smooth infinite loop */}
          {[...credentials, ...credentials, ...credentials].map((cred, i) => (
            <div key={i} className="flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300">
              <span className="text-[0.6rem] uppercase tracking-widest text-brand-300/80 mb-1">{cred.type}</span>
              <span className="text-xl md:text-2xl font-cinzel font-bold tracking-wider text-white">
                {cred.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
