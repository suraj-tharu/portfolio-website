import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   KEYFRAMES & SCOPED CSS
───────────────────────────────────────────── */
const CSS = `
  @keyframes cred-border-flow {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes cred-pulse-ring {
    0%   { transform: scale(1);    opacity: 0.5; }
    60%  { transform: scale(1.35); opacity: 0;   }
    100% { transform: scale(1.35); opacity: 0;   }
  }
  @keyframes cred-shimmer {
    0%   { background-position: -300% center; }
    100% { background-position: 300% center; }
  }
  @keyframes cred-dot-glow {
    0%,100% { opacity: 0.5; box-shadow: 0 0 4px currentColor; }
    50%      { opacity: 1;   box-shadow: 0 0 12px currentColor, 0 0 24px currentColor; }
  }
  @keyframes cred-float {
    0%,100% { transform: translateY(0px);  }
    50%      { transform: translateY(-4px); }
  }

  /* ── Scoped Theme Variables ── */
  .cred-section {
    --cred-bg-strip:   linear-gradient(180deg, rgba(10,5,25,0.0) 0%, rgba(10,5,25,0.3) 50%, rgba(10,5,25,0.0) 100%);
    --cred-border-top: rgba(167,139,250,0.08);
    --cred-card:       rgba(20, 20, 30, 0.45);
    --cred-card-hov:   rgba(30, 30, 45, 0.65);
    --cred-text:       rgba(255, 255, 255, 0.95);
    --cred-text-inv:   rgba(255, 255, 255, 0.95);
  }
  .light .cred-section {
    --cred-bg-strip:   linear-gradient(180deg, rgba(245,245,247,0.0) 0%, rgba(245,245,247,0.8) 50%, rgba(245,245,247,0.0) 100%);
    --cred-border-top: rgba(139,92,246,0.12);
    --cred-card:       rgba(255, 255, 255, 0.7);
    --cred-card-hov:   rgba(255, 255, 255, 0.9);
    --cred-text:       rgba(15, 15, 26, 0.95);
    --cred-text-inv:   rgba(255, 255, 255, 0.95); /* text on hover gradient is usually light */
  }
`;

/* ─────────────────────────────────────────────
   DATA — rich per-credential theming
───────────────────────────────────────────── */
const CREDENTIALS = [
  {
    label: 'Tribhuvan University',
    type: 'Alumni',
    emoji: '🎓',
    color: '#F59E0B',
    colorRgb: '245,158,11',
    gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24,#fde68a)',
    desc: 'Engineering Faculty',
  },
  {
    label: 'IEEE',
    type: 'Published In',
    emoji: '📡',
    color: '#38BDF8',
    colorRgb: '56,189,248',
    gradient: 'linear-gradient(135deg,#0284c7,#38bdf8,#7dd3fc)',
    desc: 'Peer-Reviewed Research',
  },
  {
    label: 'ResearchGate',
    type: 'Top Researcher',
    emoji: '🔬',
    color: '#34D399',
    colorRgb: '52,211,153',
    gradient: 'linear-gradient(135deg,#059669,#34d399,#6ee7b7)',
    desc: 'RG Score Recognition',
  },
  {
    label: 'Google Scholar',
    type: 'Indexed',
    emoji: '📚',
    color: '#A78BFA',
    colorRgb: '167,139,250',
    gradient: 'linear-gradient(135deg,#7c3aed,#a78bfa,#c4b5fd)',
    desc: 'Academic Citations',
  },
  {
    label: 'GIS & Remote Sensing',
    type: 'Specialist',
    emoji: '🌍',
    color: '#22D3EE',
    colorRgb: '34,211,238',
    gradient: 'linear-gradient(135deg,#0891b2,#22d3ee,#67e8f9)',
    desc: 'Geospatial Expert',
  },
  {
    label: 'Ministry of Education',
    type: 'Certified',
    emoji: '🏛️',
    color: '#F472B6',
    colorRgb: '244,114,182',
    gradient: 'linear-gradient(135deg,#db2777,#f472b6,#f9a8d4)',
    desc: 'Nepal Government',
  },
];

/* ─────────────────────────────────────────────
   SEPARATOR — diamond + line
───────────────────────────────────────────── */
function Separator({ color }: { color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      flexShrink: 0, margin: '0 12px',
    }}>
      <div style={{ width: 40, height: 1, background: `linear-gradient(to right, transparent, ${color}50)` }} />
      <div style={{
        width: 8, height: 8, transform: 'rotate(45deg)',
        background: color, opacity: 0.6,
        boxShadow: `0 0 10px ${color}`,
      }} />
      <div style={{ width: 40, height: 1, background: `linear-gradient(to left, transparent, ${color}50)` }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   CREDENTIAL BADGE — the main unit
───────────────────────────────────────────── */
function CredentialBadge({ cred }: { cred: typeof CREDENTIALS[0] }) {
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-30, 30], [8, -8]), { stiffness: 400, damping: 40 });
  const rotY = useSpring(useTransform(mx, [-50, 50], [-8, 8]), { stiffness: 400, damping: 40 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };
  const handleLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      style={{ perspective: 800, flexShrink: 0, padding: '10px 0' }}
    >
      <motion.div
        style={{
          rotateX: rotX, rotateY: rotY,
          transformStyle: 'preserve-3d',
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 24px', borderRadius: 999,
          background: hovered
            ? `linear-gradient(135deg, rgba(${cred.colorRgb},0.2), rgba(${cred.colorRgb},0.05))`
            : 'var(--cred-card)',
          border: `1px solid ${hovered ? `rgba(${cred.colorRgb},0.5)` : 'var(--cred-border-top)'}`,
          boxShadow: hovered
            ? `0 0 40px rgba(${cred.colorRgb},0.2), 0 10px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)`
            : '0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'border 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          whiteSpace: 'nowrap',
          animation: hovered ? 'none' : 'cred-float 5s ease-in-out infinite',
        }}
      >
        {/* Shimmer sweep */}
        {hovered && (
          <motion.div
            initial={{ left: '-30%' }}
            animate={{ left: '110%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: 0, width: '40%', height: '100%', zIndex: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Animated border glow when hovered */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'absolute', inset: -1, borderRadius: 999,
              background: `linear-gradient(90deg, ${cred.color}80, transparent, ${cred.color}80)`,
              backgroundSize: '200% 100%',
              animation: 'cred-border-flow 2s linear infinite',
              zIndex: 0, pointerEvents: 'none',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
              WebkitMaskComposite: 'xor',
              padding: 1,
            }}
          />
        )}

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Emoji icon with pulse ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {hovered && (
              <div style={{
                position: 'absolute', inset: -5, borderRadius: '50%',
                border: `1.5px solid rgba(${cred.colorRgb},0.7)`,
                animation: 'cred-pulse-ring 1.5s cubic-bezier(0.2, 0, 0, 1) infinite',
              }} />
            )}
            <div style={{
              width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, rgba(${cred.colorRgb},0.25), rgba(${cred.colorRgb},0.05))`,
              border: `1px solid rgba(${cred.colorRgb},0.4)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: hovered ? `0 0 25px rgba(${cred.colorRgb},0.5), inset 0 0 10px rgba(${cred.colorRgb},0.3)` : 'none',
              transition: 'box-shadow 0.3s ease',
            }}>
              {cred.emoji}
            </div>
          </div>

          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Type label */}
            <div style={{
              fontSize: '0.6rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase',
              color: hovered ? `rgba(${cred.colorRgb},0.9)` : 'var(--cred-text-sub)',
              marginBottom: 2,
              transition: 'color 0.3s ease',
            }}>{cred.type}</div>

            {/* Main label */}
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(0.9rem,1.5vw,1.1rem)',
              background: hovered ? cred.gradient : 'var(--cred-text)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 100%',
              animation: hovered ? 'cred-shimmer 3s linear infinite' : 'none',
              letterSpacing: '0.02em',
              transition: 'all 0.3s ease',
            }}>{cred.label}</div>

            {/* Desc - sliding in */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -5 }} 
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontSize: '0.65rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
                    color: `rgba(${cred.colorRgb},0.8)`, marginTop: 2,
                    letterSpacing: '0.05em', fontWeight: 600
                  }}
                >{cred.desc}</motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live dot */}
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: cred.color,
            color: cred.color,
            animation: 'cred-dot-glow 2.5s ease-in-out infinite',
            flexShrink: 0, marginLeft: 4,
            boxShadow: `0 0 10px ${cred.color}`
          }} />
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function CredentialsStrip() {
  type BadgeItem = { type: 'badge'; cred: typeof CREDENTIALS[0] };
  type SepItem   = { type: 'sep';   color: string };
  type StripItem = BadgeItem | SepItem;

  // Build an interleaved array: badge, separator, badge, separator …
  const items: StripItem[] = [];
  const repeated = [...CREDENTIALS, ...CREDENTIALS, ...CREDENTIALS, ...CREDENTIALS];
  repeated.forEach((cred, i) => {
    items.push({ type: 'badge', cred });
    const nextColor = repeated[(i + 1) % repeated.length]?.color ?? cred.color;
    items.push({ type: 'sep', color: nextColor });
  });

  // Total pixel width ≈ (badge ~260px + sep ~100px) × 24 items × 2 sets
  const SCROLL_PX = (280 + 100) * CREDENTIALS.length * 2;

  return (
    <div className="cred-section" style={{
      position: 'relative', width: '100%', overflow: 'hidden',
      padding: '30px 0',
      background: 'var(--cred-bg-strip)',
      borderTop: '1px solid var(--cred-border-top)',
      borderBottom: '1px solid var(--cred-border-top)',
    }}>
      <style>{CSS}</style>

      {/* Fade edges */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 160, zIndex: 10,
        background: 'linear-gradient(to right, var(--bg) 10%, transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 160, zIndex: 10,
        background: 'linear-gradient(to left, var(--bg) 10%, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Glow line top */}
      <div style={{
        position: 'absolute', top: 0, left: '5%', right: '5%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), rgba(244,114,182,0.4), rgba(56,189,248,0.4), transparent)',
        pointerEvents: 'none',
        filter: 'blur(1px)'
      }} />
      {/* Glow line bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: '5%', right: '5%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), rgba(167,139,250,0.4), rgba(244,114,182,0.4), transparent)',
        pointerEvents: 'none',
        filter: 'blur(1px)'
      }} />

      {/* Scrolling track */}
      <motion.div
        animate={{ x: [`0px`, `-${SCROLL_PX / 2}px`] }}
        transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
        style={{
          display: 'flex', alignItems: 'center',
          width: 'max-content', gap: 0,
          willChange: 'transform',
        }}
      >
        {items.map((item, i) =>
          item.type === 'badge'
            ? <CredentialBadge key={i} cred={item.cred} />
            : <Separator key={i} color={item.color} />
        )}
      </motion.div>
    </div>
  );
}
