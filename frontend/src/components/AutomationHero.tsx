import { FadeUp } from './FadeUp';

const headingText = "WE BUILD END-TO-END AI AUTOMATION SYSTEMS.";
const headingWords = headingText.split(' ');

export default function AutomationHero() {
  return (
    <>
      {/* Fixed Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-screen object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4"
      />

      {/* Transparent Section Content */}
      <section className="relative z-10 flex flex-col justify-center h-screen px-[18px] md:px-[32px] pt-[90px] md:pt-[70px] pb-[32px] font-helvetica bg-transparent pointer-events-none">
        <div className="flex flex-col items-start max-w-[720px] mx-auto w-full pointer-events-auto">
          
          <h2 className="flex flex-wrap gap-[0.25em] m-0 text-white font-bold leading-[1.08] tracking-[-0.01em] uppercase text-[clamp(26px,3vw,42px)]">
            {headingWords.map((word, index) => (
              <FadeUp
                key={index}
                as="span"
                delay={0.15 + (index * 0.08)}
                duration={0.7}
                y={32}
              >
                {word}
              </FadeUp>
            ))}
          </h2>

          <FadeUp
            as="p"
            delay={0.9}
            duration={0.7}
            y={24}
            className="mt-6 text-[14px] leading-[1.65] text-white/85 max-w-[260px]"
          >
            We provide all-in-one AI automation services in one place.
          </FadeUp>

        </div>
      </section>
    </>
  );
}
