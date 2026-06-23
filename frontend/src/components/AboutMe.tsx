import { FadeIn } from './FadeIn';
import { motion } from 'framer-motion';

// Inline SVG decorations — always visible, no external dependencies
const DecorStar = ({ className }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
  >
    <path
      d="M40 4L43.8 36.2L76 40L43.8 43.8L40 76L36.2 43.8L4 40L36.2 36.2L40 4Z"
      stroke="url(#starGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="starGrad" x1="4" y1="4" x2="76" y2="76" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const DecorCircle = ({ className }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: -360 }}
    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
  >
    <circle cx="60" cy="60" r="50" stroke="url(#circleGrad)" strokeWidth="1" strokeDasharray="6 6" />
    <circle cx="60" cy="60" r="30" stroke="url(#circleGrad2)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
    <circle cx="60" cy="10" r="4" fill="#8B5CF6" opacity="0.7" />
    <defs>
      <linearGradient id="circleGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#22D3EE" />
      </linearGradient>
      <linearGradient id="circleGrad2" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EC4899" />
        <stop offset="1" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const DecorDots = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[0, 1, 2, 3].map(col =>
      [0, 1, 2, 3].map(row => (
        <motion.circle
          key={`${col}-${row}`}
          cx={8 + col * 22}
          cy={8 + row * 22}
          r="2.5"
          fill="#8B5CF6"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: (col + row) * 0.15 }}
        />
      ))
    )}
  </svg>
);

export default function AboutMe() {

  return (
    <section id="about" className="relative w-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 bg-[var(--bg)] overflow-hidden font-kanit z-20">

      {/* SVG Decorations — always visible, brand-styled */}
      <div className="absolute z-0 top-[4%] left-[2%] md:left-[4%] w-[80px] sm:w-[110px] md:w-[140px] h-auto hidden md:block opacity-60">
        <DecorStar className="w-full h-auto" />
      </div>

      <div className="absolute z-0 bottom-[8%] left-[4%] md:left-[10%] w-[80px] sm:w-[110px] md:w-[140px] h-auto hidden md:block opacity-40">
        <DecorDots className="w-full h-auto" />
      </div>

      <div className="absolute z-0 top-[4%] right-[2%] md:right-[4%] w-[100px] sm:w-[140px] md:w-[180px] h-auto hidden md:block opacity-50">
        <DecorCircle className="w-full h-auto" />
      </div>

      <div className="absolute z-0 bottom-[8%] right-[4%] md:right-[10%] w-[80px] sm:w-[110px] md:w-[140px] h-auto hidden md:block opacity-40">
        <DecorDots className="w-full h-auto" />
      </div>

      {/* Center Content */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center justify-center gap-16 w-full">

        {/* Group 1: Heading + Text */}
        <div className="flex flex-col items-center justify-center gap-10">
          <FadeIn delay={0} y={40} className="w-full">
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(3rem,10vw,140px)]">
              About me
            </h2>
          </FadeIn>

          {/* Section Summary */}
          <FadeIn delay={0.1} y={30} className="text-text-primary dark:text-white font-medium text-center leading-relaxed max-w-[700px] text-[clamp(1rem,2vw,1.3rem)]">
            <p>
              Computer Engineering professional with expertise in <strong className="text-[var(--brand-light)]">GIS, Remote Sensing,</strong> and <strong className="text-[var(--brand-light)]">Machine Learning</strong>. Passionate about leveraging technology for sustainable development and innovation.
            </p>
          </FadeIn>

          {/* Remaining Biography Paragraphs */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
              hidden: { opacity: 0 }
            }}
            className="flex flex-col gap-6 text-text-primary dark:text-white text-[clamp(0.9rem,1.5vw,1.1rem)] max-w-[700px] text-center md:text-left mt-8 premium-card luxury-glow glass rounded-3xl border border-stroke backdrop-blur-md"
          >
            {[
              <>I completed my <strong className="text-[var(--accent)]">Bachelor of Engineering (B.E.) in Computer Engineering</strong> from Mid-West University and earned a <strong className="text-[var(--accent-2)]">Master of Science (M.Sc.) in Information System Engineering</strong> from Purbanchal University.</>,
              <>I successfully completed a six-month internship at <strong className="text-[var(--brand-light)]">Nepal Telecom</strong>, where I gained practical experience in telecommunications systems and information technology infrastructure.</>,
              <>I have extensive experience in technical education and vocational training. I served as a Senior Instructor at <strong className="text-[var(--accent)]">Shree Buddhi Bikash Secondary School</strong> and <strong className="text-[var(--accent-2)]">Additional Technical School</strong>, Ratamata-6, Rolpa, delivering technical and computer engineering education.</>,
              <>Currently, I am working as a <strong className="text-[var(--brand-light)]">Coordinator</strong> at Shree Tri Shaheed Model Secondary School, Aandhikhola-1, Syangja. My professional focus includes computer engineering education, technology-driven learning, research, web and mobile application development, and capacity building in technical and vocational education.</>
            ].map((text, index) => (
              <motion.p
                key={index}
                variants={{
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } },
                  hidden: { opacity: 0, y: 20, filter: "blur(5px)" }
                }}
              >
                {text}
              </motion.p>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
