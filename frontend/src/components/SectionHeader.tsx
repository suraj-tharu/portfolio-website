import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlightWord?: string;   // word to render in gradient
  subtitle?: string;
  align?: 'left' | 'center';
  id?: string;
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
  title,
  highlightWord,
  subtitle,
  align = 'center',
  id,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const isCenter = align === 'center';

  return (
    <div
      ref={ref}
      id={id}
      className={`flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'} mb-16 md:mb-24 gap-4`}
    >
      {/* Eyebrow label */}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`flex items-center gap-3 ${isCenter ? 'justify-center' : ''}`}
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
            {eyebrow}
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 32, height: 1.5, originX: 1,
              background: 'linear-gradient(90deg,#f472b6,#7c3aed)',
              borderRadius: 999,
              boxShadow: '0 0 8px rgba(244,114,182,0.5)',
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
        margin: 0,
      }}>
        <WordReveal text={title} highlightWord={highlightWord} delay={0.15} />
      </h2>

      {/* Animated underline */}
      {inView && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 2, width: isCenter ? 'min(200px,40%)' : 80,
            originX: isCenter ? 0.5 : 0,
            background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.6),rgba(244,114,182,0.6),transparent)',
            borderRadius: 999,
            boxShadow: '0 0 10px rgba(167,139,250,0.4)',
          }}
        />
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{
            fontSize: 'clamp(0.9rem,1.4vw,1.05rem)',
            lineHeight: 1.75,
            color: 'rgba(167,139,250,0.5)',
            fontWeight: 400,
            maxWidth: isCenter ? 520 : 600,
            margin: 0,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
