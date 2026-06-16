import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useToast } from './Toast';
import { useFormValidation, FormValidator } from '../utils/formValidation';
import MeetingWidget from './MeetingWidget';
import type { ValidationRule } from '../utils/formValidation';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
}

export default function Contact() {
  const { addToast } = useToast();

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
    // Check honeypot (spam protection)
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
        addToast('Message sent successfully! I\'ll get back to you soon.', 'success');
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
    <section id="contact" className="bg-bg py-24 relative overflow-hidden">
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

          {/* Form Column */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={formSubmit}
            className="bg-[var(--surface)] border border-[var(--stroke)] p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden w-full max-w-md mx-auto lg:mx-0"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-[var(--brand)] relative overflow-hidden group"
              aria-busy={isSubmitting}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting && (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {!isSubmitting && <Send className="h-5 w-5" aria-hidden="true" />}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
