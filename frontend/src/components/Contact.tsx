import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Send, CheckCircle, Mail, MapPin, Clock, ExternalLink, Link2, Code, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useToast } from './Toast';
import { useFormValidation, FormValidator } from '../utils/formValidation';
import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { ValidationRule } from '../utils/formValidation';

interface ContactFormData {
  [key: string]: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
}

/* ═══════════════════════════════════════════════════════
   LUXURY INPUT
═══════════════════════════════════════════════════════ */
function LuxuryInput({
  id, name, label, type = 'text', value, placeholder, required,
  error, onChange, onBlur,
}: {
  id: string; name: string; label: string; type?: string; value: string;
  placeholder: string; required?: boolean; error?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  const borderColor = error ? '#f87171' : focused ? '#a78bfa' : 'rgba(255,255,255,0.08)';
  const shadow = focused ? '0 0 0 1px rgba(167,139,250,0.3), 0 4px 20px rgba(167,139,250,0.05)' : 'none';

  const sharedStyle = {
    width: '100%',
    background: focused ? 'rgba(167,139,250,0.04)' : 'rgba(255,255,255,0.025)',
    borderRadius: 14,
    border: `1px solid ${borderColor}`,
    padding: '14px 16px',
    color: 'rgba(255,255,255,0.88)',
    outline: 'none',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: shadow,
  };

  return (
    <div style={{ position: 'relative' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block', marginBottom: 8,
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: focused ? '#a78bfa' : 'rgba(255,255,255,0.25)',
          transition: 'color 0.2s ease',
        }}
      >
        {label}{required && <span style={{ color: '#f472b6', marginLeft: 4 }}>*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id} name={name} rows={5} value={value} required={required}
          onChange={onChange}
          onBlur={e => { setFocused(false); onBlur(e); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          style={{ ...sharedStyle, resize: 'none', lineHeight: 1.6 } as React.CSSProperties}
          aria-invalid={!!error}
        />
      ) : (
        <input
          type={type} id={id} name={name} value={value} required={required}
          onChange={onChange}
          onBlur={e => { setFocused(false); onBlur(e); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          style={sharedStyle as React.CSSProperties}
          aria-invalid={!!error}
        />
      )}

      {/* Animated gradient underline */}
      <motion.div
        animate={{ scaleX: focused || hasValue ? 1 : 0, opacity: focused ? 1 : hasValue ? 0.4 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', bottom: error ? 28 : 0, left: 0, right: 0,
          height: 1.5, borderRadius: 999, originX: 0.5,
          background: 'linear-gradient(90deg,#7c3aed,#db2777,#06b6d4)',
        }}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 6, fontSize: '0.72rem', color: '#f87171', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INFO CARD
═══════════════════════════════════════════════════════ */
function InfoCard({ icon: Icon, label, value, link, color, delay }: {
  icon: LucideIcon; label: string; value: string;
  link?: string | null; color: string; delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px', borderRadius: 16,
        background: hovered ? `${color}08` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? color + '30' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s ease',
        cursor: link ? 'pointer' : 'default',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hovered ? `0 0 20px ${color}20` : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <p style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.22)', marginBottom: 3,
        }}>
          {label}
        </p>
        {link ? (
          <a href={link} style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem',
            color: hovered ? color : 'rgba(255,255,255,0.7)',
            textDecoration: 'none', transition: 'color 0.2s ease',
          }}>
            {value}
          </a>
        ) : (
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem',
            color: 'rgba(255,255,255,0.7)',
          }}>
            {value}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   SOCIAL LINK
═══════════════════════════════════════════════════════ */
const SOCIALS = [
  { icon: Link2,        label: 'LinkedIn', url: 'https://www.linkedin.com/in/suraj-tharu/', color: '#0A66C2' },
  { icon: Code,         label: 'GitHub',   url: 'https://github.com/suraj-tharu',          color: '#a78bfa' },
  { icon: ExternalLink, label: 'Scholar',  url: 'https://scholar.google.com',              color: '#4285F4' },
];

function SocialLink({ s }: { s: typeof SOCIALS[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={s.url} target="_blank" rel="noopener noreferrer"
      whileHover={{ y: -3, scale: 1.06 }} whileTap={{ scale: 0.96 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', borderRadius: 999,
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.78rem',
        letterSpacing: '0.04em',
        border: `1px solid ${hovered ? s.color + '50' : 'rgba(255,255,255,0.08)'}`,
        background: hovered ? `${s.color}10` : 'rgba(255,255,255,0.025)',
        color: hovered ? s.color : 'rgba(255,255,255,0.45)',
        textDecoration: 'none',
        boxShadow: hovered ? `0 0 20px ${s.color}20` : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <s.icon size={13} />
      {s.label}
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
export default function Contact() {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const validationSchema: Record<keyof ContactFormData, ValidationRule[]> = {
    name:     [{ type: 'required', message: 'Name is required' }, { type: 'minLength', value: 2, message: 'At least 2 characters' }],
    email:    [{ type: 'required', message: 'Email is required' }, { type: 'email', message: 'Invalid email address' }],
    subject:  [{ type: 'maxLength', value: 100, message: 'Max 100 characters' }],
    message:  [{ type: 'required', message: 'Message is required' }, { type: 'minLength', value: 10, message: 'At least 10 characters' }, { type: 'maxLength', value: 5000, message: 'Max 5000 characters' }],
    honeypot: [],
  };

  const resetFormRef = useRef<() => void>(() => {});

  const handleSubmit = async (values: ContactFormData) => {
    if (values.honeypot) return;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: FormValidator.sanitize(values.name),
          email: FormValidator.sanitize(values.email),
          subject: FormValidator.sanitize(values.subject),
          message: FormValidator.sanitize(values.message),
        }),
      });
      if (res.ok) {
        setSubmittedName(values.name.split(' ')[0]);
        setSubmitted(true);
        resetFormRef.current();
        confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 }, colors: ['#a78bfa', '#f472b6', '#38bdf8'] });
      } else {
        const error = await res.json();
        addToast(error.message || 'Failed to send. Please try again.', 'error');
      }
    } catch {
      addToast('An error occurred. Please email me directly.', 'error');
    }
  };

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit: formSubmit, resetForm } =
    useFormValidation<ContactFormData>({ name: '', email: '', subject: '', message: '', honeypot: '' }, validationSchema, handleSubmit);

  useEffect(() => { resetFormRef.current = resetForm; }, [resetForm]);

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 20, background: 'var(--bg)', overflow: 'hidden' }} className="section-py">

      {/* Aurora ambient */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-15%', right: '-10%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,58,237,0.08),transparent 65%)',
          filter: 'blur(90px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-10%',
          width: '45vw', height: '45vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(6,182,212,0.06),transparent 65%)',
          filter: 'blur(70px)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '40%',
          width: '30vw', height: '30vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(244,114,182,0.05),transparent 65%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="section-container relative" style={{ zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
          gap: 'clamp(40px,6vw,80px)',
          alignItems: 'start',
        }}>

          {/* ══ LEFT PANEL — Editorial ══ */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
          >
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '8px 20px', borderRadius: 999, width: 'fit-content',
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.25)',
                boxShadow: '0 0 20px rgba(52,211,153,0.08)',
              }}
            >
              <span style={{ position: 'relative', width: 8, height: 8 }}>
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: '#34d399',
                  animation: 'badge-dot-glow 2s ease-in-out infinite',
                }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'rgba(52,211,153,0.3)',
                  transform: 'scale(2)',
                  animation: 'badge-dot-glow 2s ease-in-out infinite 0.5s',
                }} />
              </span>
              <Zap size={11} style={{ color: '#34d399' }} />
              <span style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(52,211,153,0.85)',
              }}>
                Available for Work
              </span>
            </motion.div>

            {/* Big editorial headline */}
            <div>
              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 900,
                fontSize: 'clamp(2.4rem,5vw,4.5rem)',
                lineHeight: 0.95, letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.95)',
                marginBottom: 6,
              }}>
                Let's build
              </h2>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 700,
                fontStyle: 'italic',
                fontSize: 'clamp(2.4rem,5vw,4.5rem)',
                lineHeight: 0.95, letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                marginBottom: 24,
              }}>
                something extraordinary.
              </h2>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 'clamp(0.88rem,1.3vw,1rem)',
                color: 'rgba(255,255,255,0.38)',
                lineHeight: 1.8, maxWidth: 400,
              }}>
                Open to GIS projects, research collaborations, development contracts,
                and speaking opportunities across Nepal and globally.
              </p>
            </div>

            {/* Divider */}
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg,rgba(167,139,250,0.4),rgba(244,114,182,0.3),transparent)',
            }} />

            {/* Info cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <InfoCard icon={Mail}   label="Email"    value="suraj.xaudhary@gmail.com" link="mailto:suraj.xaudhary@gmail.com" color="#a78bfa" delay={0.1} />
              <InfoCard icon={MapPin} label="Location" value="Nawalparasi West, Nepal"   link={null}                             color="#f472b6" delay={0.18} />
              <InfoCard icon={Clock}  label="Response" value="Within 24 hours"           link={null}                             color="#34d399" delay={0.26} />
            </div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <p style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.2)', marginBottom: 12,
              }}>
                Connect
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SOCIALS.map(s => <SocialLink key={s.label} s={s} />)}
              </div>
            </motion.div>

            {/* Decorative large ornament */}
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(6rem,12vw,10rem)',
              lineHeight: 1, color: 'rgba(167,139,250,0.04)',
              userSelect: 'none', pointerEvents: 'none',
              marginTop: -8,
            }} aria-hidden>
              "
            </div>
          </motion.div>

          {/* ══ RIGHT PANEL — Form ══ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    padding: 'clamp(2rem,5vw,3.5rem)',
                    borderRadius: 24,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(52,211,153,0.2)',
                    boxShadow: '0 0 40px rgba(52,211,153,0.08)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', gap: 20,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 250, damping: 20 }}
                    style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: 'rgba(52,211,153,0.1)',
                      border: '1px solid rgba(52,211,153,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <CheckCircle size={32} style={{ color: '#34d399' }} />
                  </motion.div>
                  <div>
                    <h3 style={{
                      fontFamily: 'Syne, sans-serif', fontWeight: 900,
                      fontSize: '1.5rem', color: 'rgba(255,255,255,0.92)',
                      letterSpacing: '-0.02em', marginBottom: 8,
                    }}>
                      Thank you, {submittedName}! 🎉
                    </h3>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>
                      Your message has been sent successfully. I'll get back to you within 24 hours.
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setSubmitted(false)}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 28px', borderRadius: 999,
                      fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem',
                      background: 'rgba(167,139,250,0.1)',
                      border: '1px solid rgba(167,139,250,0.25)',
                      color: '#a78bfa', cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={13} />
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={formSubmit}
                  noValidate
                  style={{
                    padding: 'clamp(1.5rem,4vw,2.5rem)',
                    borderRadius: 24,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
                    display: 'flex', flexDirection: 'column', gap: 22,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Aurora glow inside form */}
                  <div style={{
                    position: 'absolute', top: -40, right: -40,
                    width: 180, height: 180, borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(167,139,250,0.06),transparent 70%)',
                    pointerEvents: 'none',
                  }} />

                  {/* Form header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(167,139,250,0.1)',
                      border: '1px solid rgba(167,139,250,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Mail size={16} style={{ color: '#a78bfa' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1 }}>
                        Send a Message
                      </p>
                      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
                        I read every message personally
                      </p>
                    </div>
                  </div>

                  {/* Honeypot */}
                  <input type="text" name="honeypot" value={values.honeypot} onChange={handleChange}
                    style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  {/* Name + Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    <LuxuryInput
                      id="name" name="name" label="Your Name" required value={values.name}
                      placeholder="Suraj Tharu" error={touched.name && errors.name ? errors.name[0] : undefined}
                      onChange={handleChange} onBlur={handleBlur}
                    />
                    <LuxuryInput
                      id="email" name="email" label="Email Address" type="email" required value={values.email}
                      placeholder="you@example.com" error={touched.email && errors.email ? errors.email[0] : undefined}
                      onChange={handleChange} onBlur={handleBlur}
                    />
                  </div>

                  <LuxuryInput
                    id="subject" name="subject" label="Subject (Optional)" value={values.subject}
                    placeholder="GIS Project Collaboration" error={touched.subject && errors.subject ? errors.subject[0] : undefined}
                    onChange={handleChange} onBlur={handleBlur}
                  />

                  <div>
                    <LuxuryInput
                      id="message" name="message" label="Message" type="textarea" required value={values.message}
                      placeholder="Tell me about your project, research, or idea..."
                      error={touched.message && errors.message ? errors.message[0] : undefined}
                      onChange={handleChange} onBlur={handleBlur}
                    />
                    <p style={{ marginTop: 6, textAlign: 'right', fontSize: '0.67rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
                      {values.message.length}/5000
                    </p>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.03, y: isSubmitting ? 0 : -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      padding: '16px 28px', borderRadius: 999,
                      fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.92rem',
                      letterSpacing: '0.04em',
                      background: 'linear-gradient(135deg,#7c3aed 0%,#a855f7 30%,#ec4899 65%,#0ea5e9 100%)',
                      backgroundSize: '250% 250%',
                      animation: 'hero-shimmer-cta 5s linear infinite',
                      color: '#fff', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                      boxShadow: '0 12px 36px rgba(124,58,237,0.5), 0 4px 12px rgba(236,72,153,0.25)',
                      overflow: 'hidden', position: 'relative',
                    }}
                    aria-busy={isSubmitting}
                  >
                    {/* Shimmer */}
                    <span style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%)',
                      backgroundSize: '200% 100%',
                      animation: 'hero-shimmer-cta 2.8s linear infinite',
                    }} />
                    {isSubmitting ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                        <span style={{ display: 'flex', gap: 4 }}>
                          {[0, 0.15, 0.3].map((d, i) => (
                            <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: `bounce 1s ${d}s infinite` }} />
                          ))}
                        </span>
                        Sending…
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                        <Send size={15} />
                        Send Message
                        <ArrowRight size={14} />
                      </span>
                    )}
                  </motion.button>

                  <p style={{ textAlign: 'center', fontSize: '0.67rem', color: 'rgba(255,255,255,0.18)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Your information is kept private and secure ✦
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
