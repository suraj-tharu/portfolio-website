// SkillRadarChart - Interactive radial skill visualization
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  value: number; // 0-100
}

export const SkillRadarChart = ({ skills }: { skills: Skill[] }) => {
  const n = skills.length;
  const angle = (Math.PI * 2) / n;

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Grid circles */}
      {[1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={i * 30}
          fill="none"
          stroke="rgba(212, 175, 55, 0.1)"
          strokeDasharray="5,5"
        />
      ))}

      {/* Axis lines */}
      {skills.map((_, i) => {
        const x = 200 + 150 * Math.cos(angle * i - Math.PI / 2);
        const y = 200 + 150 * Math.sin(angle * i - Math.PI / 2);
        return (
          <line
            key={`axis-${i}`}
            x1="200"
            y1="200"
            x2={x}
            y2={y}
            stroke="rgba(212, 175, 55, 0.2)"
          />
        );
      })}

      {/* Skill polygon */}
      <motion.polygon
        points={skills.map((skill, i) => {
          const r = (skill.value / 100) * 150;
          const x = 200 + r * Math.cos(angle * i - Math.PI / 2);
          const y = 200 + r * Math.sin(angle * i - Math.PI / 2);
          return `${x},${y}`;
        }).join(' ')}
        fill="rgba(212, 175, 55, 0.2)"
        stroke="rgb(212, 175, 55)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      {/* Data points and labels */}
      {skills.map((skill, i) => {
        const r = (skill.value / 100) * 150;
        const x = 200 + r * Math.cos(angle * i - Math.PI / 2);
        const y = 200 + r * Math.sin(angle * i - Math.PI / 2);

        const labelX = 200 + 180 * Math.cos(angle * i - Math.PI / 2);
        const labelY = 200 + 180 * Math.sin(angle * i - Math.PI / 2);

        return (
          <motion.g key={`skill-${i}`}>
            <motion.circle
              cx={x}
              cy={y}
              r="6"
              fill="rgb(212, 175, 55)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.5 }}
            />
            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              className="text-xs fill-white font-semibold"
            >
              {skill.name}
            </text>
          </motion.g>
        );
      })}
    </motion.svg>
  );
};
