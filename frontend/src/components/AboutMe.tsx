import { FadeIn } from './FadeIn';

export default function AboutMe() {

  return (
    <section id="about" className="relative w-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 bg-[var(--bg)] overflow-hidden font-kanit">

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

          {/* Section Summary */}
          <FadeIn delay={0.1} y={30} className="text-white font-medium text-center leading-relaxed max-w-[700px] text-[clamp(1rem,2vw,1.3rem)]">
            <p>
              Computer Engineering professional with expertise in <strong className="text-[var(--brand-light)]">GIS, Remote Sensing,</strong> and <strong className="text-[var(--brand-light)]">Machine Learning</strong>. Passionate about leveraging technology for sustainable development and innovation.
            </p>
          </FadeIn>

          {/* Remaining Biography Paragraphs */}
          <FadeIn delay={0.2} y={30} className="flex flex-col gap-6 text-white text-[clamp(0.9rem,1.5vw,1.1rem)] max-w-[700px] text-center md:text-left mt-8 bg-[var(--surface)]/50 p-8 rounded-3xl border border-[var(--stroke)] shadow-xl backdrop-blur-sm">
            <p>
              I completed my <strong className="text-[var(--accent)]">Bachelor of Engineering (B.E.) in Computer Engineering</strong> from Mid-West University and earned a <strong className="text-[var(--accent-2)]">Master of Science (M.Sc.) in Information System Engineering</strong> from Purbanchal University.
            </p>
            <p>
              I successfully completed a six-month internship at <strong className="text-[var(--brand-light)]">Nepal Telecom</strong>, where I gained practical experience in telecommunications systems and information technology infrastructure.
            </p>
            <p>
              I have extensive experience in technical education and vocational training. I served as a Senior Instructor at <strong className="text-[var(--accent)]">Shree Buddhi Bikash Secondary School</strong> and <strong className="text-[var(--accent-2)]">Additional Technical School</strong>, Ratamata-6, Rolpa, delivering technical and computer engineering education.
            </p>
            <p>
              Currently, I am working as a <strong className="text-[var(--brand-light)]">Coordinator</strong> at Shree Tri Shaheed Model Secondary School, Aandhikhola-1, Syangja. I have been actively involved in teaching, curriculum implementation, ICT integration in education, technical coordination, and academic leadership. My professional focus includes computer engineering education, technology-driven learning, research, web and mobile application development, and capacity building in technical and vocational education.
            </p>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
