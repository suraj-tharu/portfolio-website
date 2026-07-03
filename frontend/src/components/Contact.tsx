import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Mail, MapPin, Clock, ExternalLink, Link2, Code } from 'lucide-react';
import { useToast } from './Toast';
import { useFormValidation, FormValidator } from '../utils/formValidation';
import { useState } from 'react';
import type { ValidationRule } from '../utils/formValidation';

interface ContactFormData {
  [key: string]: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
}

/* ── Luxury Input Field ──────────────────────────────────── */
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

  return (
    <div className="relative">
      {/* Floating label */}
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-[0.15em] mb-2 font-syne transition-colors duration-200"
        style={{ color: focused ? '#a78bfa' : 'rgba(255,255,255,0.25)' }}
      >
        {label}{required && <span className="text-pink-400 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          value={value}
          required={required}
          onChange={onChange}
          onBlur={(e) => { setFocused(false); onBlur(e); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] rounded-xl border px-4 py-3.5 text-white placeholder-white/20 outline-none resize-none font-jakarta text-sm transition-all duration-300"
          style={{
            borderColor: error ? '#f87171' : focused ? '#a78bfa' : 'rgba(255,255,255,0.08)',
            boxShadow: focused ? '0 0 0 1px rgba(167,139,250,0.3), 0 4px 20px rgba(167,139,250,0.05)' : 'none',
          }}
          aria-invalid={!!error}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          required={required}
          onChange={onChange}
          onBlur={(e) => { setFocused(false); onBlur(e); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] rounded-xl border px-4 py-3.5 text-white placeholder-white/20 outline-none font-jakarta text-sm transition-all duration-300"
          style={{
            borderColor: error ? '#f87171' : focused ? '#a78bfa' : 'rgba(255,255,255,0.08)',
            boxShadow: focused ? '0 0 0 1px rgba(167,139,250,0.3), 0 4px 20px rgba(167,139,250,0.05)' : 'none',
          }}
          aria-invalid={!!error}
        />
      )}

      {/* Animated gradient underline */}
      <motion.div
        animate={{ scaleX: focused || hasValue ? 1 : 0, opacity: focused ? 1 : hasValue ? 0.4 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full origin-left"
        style={{ background: 'linear-gradient(90deg,#7c3aed,#db2777,#06b6d4)' }}
      />

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-400 font-jakarta"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

const socials = [
  { icon: Link2,       label: 'LinkedIn', url: 'https://www.linkedin.com/in/suraj-tharu/', color: '#0A66C2' },
  { icon: Code,        label: 'GitHub',   url: 'https://github.com/suraj-tharu',          color: '#a78bfa' },
  { icon: ExternalLink,label: 'Scholar',  url: 'https://scholar.google.com',              color: '#4285F4' },
];

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
        resetForm();
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

  return (
    <section id="contact" className="section-py relative z-20 bg-[var(--bg)] overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '-10%', right: '-8%',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(124,58,237,0.07),transparent 65%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-8%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(6,182,212,0.05),transparent 65%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="float-badge mx-auto mb-6 inline-flex">
            <Mail size={10} />
            Contact Me
          </span>
          <h2
            className="font-syne font-black text-white/95 tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6rem)', lineHeight: 0.92, letterSpacing: '-0.035em' }}
          >
            Let's build something{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 50%,#38bdf8 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              extraordinary.
            </span>
          </h2>
          <motion.p
            className="font-jakarta text-white/35 mt-5 max-w-xl mx-auto"
            style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)', lineHeight: 1.8 }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            Open to GIS projects, research collaborations, development contracts, and speaking opportunities.
          </motion.p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

          {/* LEFT — Info column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Contact info cards */}
            {[
              { icon: Mail,    label: 'Email',    value: 'suraj.xaudhary@gmail.com', link: 'mailto:suraj.xaudhary@gmail.com', color: '#a78bfa' },
              { icon: MapPin,  label: 'Location', value: 'Nawalparasi West, Nepal',   link: null,                              color: '#f472b6' },
              { icon: Clock,   label: 'Response', value: 'Within 24 hours',           link: null,                              color: '#34d399' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bento-card group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/25 font-bold font-syne mb-0.5">{item.label}</p>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="font-jakarta text-sm text-white/75 hover:text-white transition-colors duration-200"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-jakarta text-sm text-white/75">{item.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="bento-card"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/20 font-bold font-syne mb-4">Connect</p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full border font-jakarta text-xs font-semibold transition-all duration-200"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = s.color + '60';
                      (e.currentTarget as HTMLElement).style.color = s.color;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${s.color}25`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '';
                    }}
                  >
                    <s.icon size={13} />
                    {s.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — Form column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="bento-card flex flex-col items-center text-center gap-6 py-16"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 250, damping: 20 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                  >
                    <CheckCircle size={36} className="text-emerald-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-syne font-black text-2xl text-white/90 mb-2">
                      Thank you, {submittedName}! 🎉
                    </h3>
                    <p className="font-jakarta text-white/40 text-sm">
                      Your message has been sent. I'll get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-outline-luxury font-jakarta text-sm"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={formSubmit}
                  className="bento-card flex flex-col gap-6"
                  style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}
                  noValidate
                >
                  {/* Honeypot */}
                  <input
                    type="text" name="honeypot" value={values.honeypot} onChange={handleChange}
                    className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  />

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      placeholder="Tell me about your project, research, or idea..." error={touched.message && errors.message ? errors.message[0] : undefined}
                      onChange={handleChange} onBlur={handleBlur}
                    />
                    <p className="mt-2 text-right text-[0.67rem] text-white/20 font-mono">
                      {values.message.length}/5000
                    </p>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-gradient w-full font-jakarta font-bold py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="flex gap-1">
                          {[0, 0.15, 0.3].map((d, i) => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: `${d}s` }} />
                          ))}
                        </span>
                        Sending…
                      </span>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-[0.67rem] text-white/20 font-jakarta">
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
