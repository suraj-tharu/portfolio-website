import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  badge?: string; // Add badge alias for backward compatibility
  title: string;
  highlightWord?: string;   // word to render in gradient
  subtitle?: string;
  description?: string; // Add description alias for backward compatibility
  align?: 'left' | 'center';
  id?: string;
  sectionNumber?: string; // Editorial section number e.g. "01", "02"
}

/* Split words into animated spans */
function WordReveal({ text, highlightWord, delay }: {
  text: string;
  highlightWord?: string;
  delay: number;
}) {
  const words = text.split(' ');
  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'inherit', gap: '0.25em' }}>
      {words.map((word, i) => {
        const isHighlight = word.replace(/[^a-zA-Z]/g, '').toLowerCase() === highlightWord?.replace(/[^a-zA-Z]/g, '').toLowerCase();
        return (
          <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: delay + i * 0.06,
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                display: 'inline-block',
                ...(isHighlight ? {
                  background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.35))',
                } : {}),
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

export default function SectionHeader({
  eyebrow,
  badge,
  title,
  highlightWord,
  subtitle,
  description,
  align = 'center',
  id,
  sectionNumber,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const isCenter = align === 'center';
  const displayEyebrow = eyebrow || badge;
  const displaySubtitle = subtitle || description;

  return (
    <div
      ref={ref}
      id={id}
      className={`relative flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} mb-16 md:mb-24 gap-4`}
    >
      {/* Editorial Section Number Background */}
      {sectionNumber && (
        <div className={`absolute top-0 ${isCenter ? 'left-1/2 -translate-x-1/2' : 'left-0'} -translate-y-1/3 select-none pointer-events-none overflow-hidden z-0`}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.04, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="font-syne font-black inline-block"
            style={{ fontSize: 'clamp(8rem, 15vw, 15rem)', lineHeight: 0.8, color: 'var(--text)' }}
          >
            {sectionNumber}
          </motion.span>
        </div>
      )}

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Eyebrow label */}
        {displayEyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`flex items-center gap-3 mb-4 w-full ${isCenter ? 'justify-center' : ''}`}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 32, height: 1.5, originX: 0,
                background: 'linear-gradient(90deg,#7c3aed,#f472b6)',
                borderRadius: 999,
                boxShadow: '0 0 8px rgba(124,58,237,0.5)',
              }}
            />
            <span style={{
              fontSize: '0.7rem', fontWeight: 800,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg,#a78bfa,#f472b6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {displayEyebrow}
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 32, height: 1.5, originX: 1,
                background: 'linear-gradient(270deg,#7c3aed,#f472b6)',
                borderRadius: 999,
                boxShadow: '0 0 8px rgba(124,58,237,0.5)',
              }}
            />
          </motion.div>
        )}

        {/* Main title */}
        <h2 style={{
          fontSize: 'clamp(2.4rem,6vw,5.5rem)',
          fontWeight: 900,
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          letterSpacing: '-0.025em',
          lineHeight: 0.95,
          color: 'var(--text)',
        }}>
          <WordReveal text={title} highlightWord={highlightWord} delay={0.2} />
        </h2>

        {/* Subtitle / Description */}
        {displaySubtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`mt-6 ${isCenter ? 'mx-auto' : ''}`}
            style={{
              maxWidth: 540,
              fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              fontWeight: 400,
            }}
          >
            {displaySubtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
