import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/* ─────────────────────────────────────────────
   KEYFRAMES
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
  @keyframes cred-scan {
    0%   { left: -30%; }
    100% { left: 110%; }
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
      flexShrink: 0, margin: '0 8px',
    }}>
      <div style={{ width: 32, height: 1, background: `linear-gradient(to right, transparent, ${color}40)` }} />
      <div style={{
        width: 6, height: 6, transform: 'rotate(45deg)',
        background: color, opacity: 0.5,
        boxShadow: `0 0 8px ${color}`,
      }} />
      <div style={{ width: 32, height: 1, background: `linear-gradient(to left, transparent, ${color}40)` }} />
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
  const rotX = useSpring(useTransform(my, [-30, 30], [6, -6]), { stiffness: 300, damping: 30 });
  const rotY = useSpring(useTransform(mx, [-50, 50], [-6, 6]), { stiffness: 300, damping: 30 });

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
      style={{ perspective: 600, flexShrink: 0 }}
    >
      <motion.div
        style={{
          rotateX: rotX, rotateY: rotY,
          transformStyle: 'preserve-3d',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 20px', borderRadius: 999,
          background: hovered
            ? `linear-gradient(135deg, rgba(${cred.colorRgb},0.18), rgba(${cred.colorRgb},0.06))`
            : 'rgba(255,255,255,0.03)',
          border: `1px solid rgba(${cred.colorRgb},${hovered ? '0.4' : '0.12'})`,
          boxShadow: hovered
            ? `0 0 30px rgba(${cred.colorRgb},0.25), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`
            : '0 2px 12px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          cursor: 'default', position: 'relative', overflow: 'hidden',
          whiteSpace: 'nowrap',
          animation: hovered ? 'none' : 'cred-float 4s ease-in-out infinite',
        }}
      >
        {/* Shimmer sweep */}
        {hovered && (
          <motion.div
            initial={{ left: '-30%' }}
            animate={{ left: '110%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: 0, width: '30%', height: '100%', zIndex: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
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
              background: `linear-gradient(90deg, ${cred.color}60, transparent, ${cred.color}60)`,
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

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Emoji icon with pulse ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {hovered && (
              <div style={{
                position: 'absolute', inset: -4, borderRadius: '50%',
                border: `1px solid rgba(${cred.colorRgb},0.6)`,
                animation: 'cred-pulse-ring 1.2s ease-out infinite',
              }} />
            )}
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, rgba(${cred.colorRgb},0.25), rgba(${cred.colorRgb},0.08))`,
              border: `1px solid rgba(${cred.colorRgb},0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.95rem',
              boxShadow: hovered ? `0 0 20px rgba(${cred.colorRgb},0.4)` : 'none',
              transition: 'box-shadow 0.3s ease',
            }}>
              {cred.emoji}
            </div>
          </div>

          {/* Text */}
          <div>
            {/* Type label */}
            <div style={{
              fontSize: '0.52rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: `rgba(${cred.colorRgb},0.8)`,
              marginBottom: 1,
            }}>{cred.type}</div>

            {/* Main label */}
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(0.82rem,1.5vw,0.98rem)',
              background: hovered ? cred.gradient : 'rgba(255,255,255,0.8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 100%',
              animation: hovered ? 'cred-shimmer 3s linear infinite' : 'none',
              letterSpacing: '0.01em',
              transition: 'all 0.3s ease',
            }}>{cred.label}</div>

            {/* Desc */}
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: '0.56rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: `rgba(${cred.colorRgb},0.55)`, marginTop: 1,
                  letterSpacing: '0.06em',
                }}
              >{cred.desc}</motion.div>
            )}
          </div>

          {/* Live dot */}
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: cred.color,
            color: cred.color,
            animation: 'cred-dot-glow 2.4s ease-in-out infinite',
            flexShrink: 0, marginLeft: 2,
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

  // Total pixel width ≈ (badge ~220px + sep ~80px) × 24 items × 2 sets
  const SCROLL_PX = (220 + 80) * CREDENTIALS.length * 2;

  return (
    <div style={{
      position: 'relative', width: '100%', overflow: 'hidden',
      padding: '20px 0',
      background: 'linear-gradient(180deg, rgba(10,5,25,0.0) 0%, rgba(10,5,25,0.6) 50%, rgba(10,5,25,0.0) 100%)',
      borderTop: '1px solid rgba(167,139,250,0.08)',
      borderBottom: '1px solid rgba(167,139,250,0.08)',
    }}>
      <style>{CSS}</style>

      {/* Fade edges */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 140, zIndex: 10,
        background: 'linear-gradient(to right, var(--bg) 20%, transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 140, zIndex: 10,
        background: 'linear-gradient(to left, var(--bg) 20%, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Glow line top */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3), rgba(244,114,182,0.3), rgba(56,189,248,0.3), transparent)',
        pointerEvents: 'none',
      }} />
      {/* Glow line bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.3), rgba(167,139,250,0.3), rgba(244,114,182,0.3), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Scrolling track */}
      <motion.div
        animate={{ x: [`0px`, `-${SCROLL_PX / 2}px`] }}
        transition={{ ease: 'linear', duration: 35, repeat: Infinity }}
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
