import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { useToast } from './Toast';
import { useFormValidation, FormValidator } from '../utils/formValidation';
import MeetingWidget from './MeetingWidget';
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

export default function Contact() {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  // Form validation schema
  const validationSchema: Record<keyof ContactFormData, ValidationRule[]> = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' },
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' },
    ],
    subject: [
      { type: 'maxLength', value: 100, message: 'Subject must be less than 100 characters' },
    ],
    message: [
      { type: 'required', message: 'Message is required' },
      { type: 'minLength', value: 10, message: 'Message must be at least 10 characters' },
      { type: 'maxLength', value: 5000, message: 'Message must be less than 5000 characters' },
    ],
    honeypot: [],
  };

  const handleSubmit = async (values: ContactFormData) => {
    if (values.honeypot) {
      console.warn('Honeypot field filled - potential spam');
      addToast('Something went wrong. Please try again.', 'error');
      return;
    }

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
        addToast(error.message || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      addToast('An error occurred. Please try again later or email me directly.', 'error');
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: formSubmit,
    resetForm,
  } = useFormValidation<ContactFormData>(
    {
      name: '',
      email: '',
      subject: '',
      message: '',
      honeypot: '',
    },
    validationSchema,
    handleSubmit
  );

  return (
    <section id="contact" className="bg-bg py-24 relative overflow-hidden z-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-brand-500/50" />
            <span className="text-xs text-brand-400 font-mono tracking-widest uppercase">Get In Touch</span>
            <div className="w-8 h-px bg-brand-500/50" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-tight mb-6 font-bold">
            Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-500 italic font-display">extraordinary.</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Have a project in mind or just want to say hi? I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Meeting Widget Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <MeetingWidget />
          </motion.div>

          {/* Form Column — with success state */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                /* Success State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[var(--surface)] border border-brand-500/40 p-8 md:p-10 rounded-3xl shadow-xl text-center flex flex-col items-center gap-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center"
                  >
                    <CheckCircle size={40} className="text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                    Thank you, {submittedName}!
                  </h3>
                  <p className="text-muted">
                    Your message has been sent successfully. I'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-full border border-stroke text-text-secondary hover:border-brand-light hover:text-text-primary transition-all text-sm"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                /* Form State */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={formSubmit}
                  className="bg-[var(--surface)] border border-[var(--stroke)] p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden"
                >
                  {/* Honeypot field (hidden) */}
                  <input
                    type="text"
                    name="honeypot"
                    value={values.honeypot}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* Name Field */}
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-[var(--bg)] border rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none transition-all placeholder:text-[var(--muted)]/50 ${touched.name && errors.name
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[var(--stroke)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]'
                        }`}
                      placeholder="John Doe"
                      aria-invalid={touched.name && errors.name ? 'true' : 'false'}
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.name[0]}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-[var(--bg)] border rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none transition-all placeholder:text-[var(--muted)]/50 ${touched.email && errors.email
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[var(--stroke)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]'
                        }`}
                      placeholder="john@example.com"
                      aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.email[0]}</p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Subject (Optional)
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-[var(--bg)] border rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none transition-all placeholder:text-[var(--muted)]/50 ${touched.subject && errors.subject
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[var(--stroke)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]'
                        }`}
                      placeholder="Project Inquiry"
                    />
                    {touched.subject && errors.subject && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.subject[0]}</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="mb-8">
                    <label htmlFor="message" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full bg-[var(--bg)] border rounded-xl px-4 py-3 text-[var(--text)] focus:outline-none transition-all placeholder:text-[var(--muted)]/50 resize-none ${touched.message && errors.message
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[var(--stroke)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]'
                        }`}
                      placeholder="Tell me about your project..."
                      aria-invalid={touched.message && errors.message ? 'true' : 'false'}
                    />
                    {touched.message && errors.message && (
                      <p className="mt-1 text-sm text-red-500" role="alert">{errors.message[0]}</p>
                    )}
                    <p className="mt-2 text-xs text-muted">
                      {values.message.length}/5000 characters
                    </p>
                  </div>

                  {/* Submit Button with animated loading */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-[var(--brand)] relative overflow-hidden group"
                    aria-busy={isSubmitting}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        /* Animated loading bars */
                        <span className="flex items-center gap-1.5">
                          {[0.0, 0.15, 0.3].map((delay, i) => (
                            <span
                              key={i}
                              className="block w-1 bg-white rounded-full animate-bounce"
                              style={{ height: '16px', animationDelay: `${delay}s` }}
                            />
                          ))}
                          <span className="ml-1">Sending…</span>
                        </span>
                      ) : (
                        <>
                          <Send className="h-5 w-5" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
