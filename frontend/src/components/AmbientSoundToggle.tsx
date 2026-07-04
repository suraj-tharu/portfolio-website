import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * AmbientSoundToggle — optional lo-fi ambient audio button.
 * A tiny floating element (bottom-left) with an animated waveform
 * when active. Uses the Web Audio API to generate procedural ambient
 * sound (no external audio file required).
 */

function Waveform({ active }: { active: boolean }) {
  const bars = [3, 5, 8, 5, 3, 7, 4, 6, 3, 5];
  return (
    <div className="flex items-center gap-[2px] h-4">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-violet-400"
          animate={active ? {
            scaleY: [1, h / 4, 1, h / 6, 1],
            opacity: [0.7, 1, 0.7],
          } : { scaleY: 0.3, opacity: 0.4 }}
          transition={{
            duration: 0.9 + i * 0.07,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.06,
          }}
          style={{ height: 16, originY: 0.5 }}
        />
      ))}
    </div>
  );
}

export default function AmbientSoundToggle() {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ gain: GainNode; oscillators: OscillatorNode[] } | null>(null);

  // Show button after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const startAudio = () => {
    if (audioCtxRef.current) return;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
    masterGain.connect(ctx.destination);

    const oscillators: OscillatorNode[] = [];

    // Create layered drone tones — a gentle ambient hum
    const frequencies = [55, 82.5, 110, 165, 220]; // A1, E2, A2, E3, A3
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.15 / (i + 1), ctx.currentTime);

      // Subtle LFO tremolo
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.08 + i * 0.03, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.04, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });

    // Noise layer — soft rain/white noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(400, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.02, ctx.currentTime);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseSource.start();

    nodesRef.current = { gain: masterGain, oscillators };
  };

  const stopAudio = () => {
    if (!nodesRef.current || !audioCtxRef.current) return;
    const { gain } = nodesRef.current;
    const ctx = audioCtxRef.current;
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      nodesRef.current = null;
    }, 1600);
  };

  const toggle = () => {
    if (!active) {
      startAudio();
    } else {
      stopAudio();
    }
    setActive((p) => !p);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-8 left-6 z-[200]"
        >
          <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            aria-label={active ? 'Mute ambient sound' : 'Play ambient sound'}
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-white/[0.08] backdrop-blur-xl overflow-hidden transition-all duration-300"
            style={{
              background: active
                ? 'rgba(124,58,237,0.15)'
                : 'rgba(var(--text-base-rgb),0.03)',
              borderColor: active ? 'rgba(167,139,250,0.3)' : 'rgba(var(--text-base-rgb),0.08)',
              boxShadow: active
                ? '0 0 20px rgba(124,58,237,0.2), 0 4px 16px rgba(0,0,0,0.3)'
                : '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            {/* Ambient glow behind */}
            {active && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.15), transparent 70%)',
                }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2">
              {active ? (
                <Waveform active={active} />
              ) : (
                <VolumeX size={13} className="text-white/40" />
              )}

              <span
                className="text-[10px] font-bold uppercase tracking-[0.12em] font-jakarta"
                style={{ color: active ? '#a78bfa' : 'rgba(var(--text-base-rgb),0.3)' }}
              >
                {active ? 'Ambient' : 'Sound'}
              </span>

              {active && (
                <Volume2 size={11} className="text-violet-400 opacity-70" />
              )}
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
