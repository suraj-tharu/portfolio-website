import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from './FadeIn';

const paragraphText = "Suraj Tharu Chaudhary is a Computer Engineering professional, educator, and researcher from Ramgram-18, Nawalparasi West, Nepal.";

// Extracted into its own component so hooks are called at top-level, not inside a .map()
function AnimatedChar({ char, index, total, scrollYProgress }: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const charProgress = index / total;
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="invisible">{char === ' ' ? '\u00A0' : char}</span>
      <motion.span className="absolute top-0 left-0" style={{ opacity }}>
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
}

export default function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const chars = paragraphText.split('');

  return (
    <section ref={containerRef} id="about" className="relative w-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 bg-[#0C0C0C] overflow-hidden font-kanit">
      
      {/* Decorative Images */}
      <FadeIn delay={0.1} duration={0.9} x={-80} y={0} className="absolute z-0 top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] h-auto hidden md:block">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="Moon icon" className="w-full h-auto" onError={e => (e.currentTarget.style.display = 'none')} />
      </FadeIn>

      <FadeIn delay={0.25} duration={0.9} x={-80} y={0} className="absolute z-0 bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] h-auto hidden md:block">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="3D object" className="w-full h-auto" onError={e => (e.currentTarget.style.display = 'none')} />
      </FadeIn>

      <FadeIn delay={0.15} duration={0.9} x={80} y={0} className="absolute z-0 top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] h-auto hidden md:block">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="Lego icon" className="w-full h-auto" onError={e => (e.currentTarget.style.display = 'none')} />
      </FadeIn>

      <FadeIn delay={0.3} duration={0.9} x={80} y={0} className="absolute z-0 bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] h-auto hidden md:block">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="3D group" className="w-full h-auto" onError={e => (e.currentTarget.style.display = 'none')} />
      </FadeIn>

      {/* Center Content */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center justify-center gap-16 w-full">
        
        {/* Group 1: Heading + Text */}
        <div className="flex flex-col items-center justify-center gap-10">
          <FadeIn delay={0} y={40} className="w-full">
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(3rem,10vw,140px)]">
              About me
            </h2>
          </FadeIn>

          {/* Progressive Reveal Text */}
          <p className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[600px] text-[clamp(1.2rem,2.5vw,1.6rem)]">
            {chars.map((char, index) => (
              <AnimatedChar
                key={index}
                char={char}
                index={index}
                total={chars.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </p>

          {/* Remaining Biography Paragraphs */}
          <FadeIn delay={0.2} y={30} className="flex flex-col gap-6 text-muted text-[clamp(0.9rem,1.5vw,1.1rem)] max-w-[700px] text-center md:text-left mt-8 bg-surface/50 p-8 rounded-3xl border border-stroke shadow-xl backdrop-blur-sm">
            <p>
              He completed his <strong className="text-[#D7E2EA]">Bachelor of Engineering (B.E.) in Computer Engineering</strong> from Mid-West University (Himalaya College of Engineering) and earned a <strong className="text-[#D7E2EA]">Master of Science (M.Sc.) in Information System Engineering</strong> from Purbanchal University.
            </p>
            <p>
              He successfully completed a six-month internship at <strong className="text-[#D7E2EA]">Nepal Telecom</strong>, where he gained practical experience in telecommunications systems and information technology infrastructure.
            </p>
            <p>
              Mr. Tharu has extensive experience in technical education and vocational training. He served as an Instructor at <strong className="text-[#D7E2EA]">Shree Buddhi Bikash Secondary School</strong> and <strong className="text-[#D7E2EA]">Additional Technical School</strong>, Ratamata-6, Rolpa, delivering technical and computer engineering education.
            </p>
            <p>
              Currently, he is working as a <strong className="text-[#D7E2EA]">Senior Instructor</strong> at Shree Tri Shaheed Model Secondary School, Andhikhola-1, Syangja. He has been actively involved in teaching, curriculum implementation, ICT integration in education, and technical coordination.
            </p>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
