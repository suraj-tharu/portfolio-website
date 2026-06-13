import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
    
    // Reset status after a few seconds
    setTimeout(() => {
      setStatus('idle');
    }, 5000);
  };

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

        <div className="max-w-3xl mx-auto">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-surface border border-stroke p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden"
          >
            {/* Honeypot field (hidden) */}
            <input 
              type="text" 
              name="honeypot" 
              value={formData.honeypot} 
              onChange={handleChange} 
              className="hidden" 
              tabIndex={-1} 
              autoComplete="off" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-muted/50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-muted/50"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-2">Subject (Optional)</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-muted/50"
                placeholder="Project Inquiry"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-bg border border-stroke rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all placeholder:text-muted/50 resize-none"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full bg-brand-500 hover:bg-brand-400 text-white font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-brand-500 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">
                {status === 'loading' && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {status === 'success' && <CheckCircle className="h-5 w-5" />}
                {status === 'error' && <AlertCircle className="h-5 w-5" />}
                {status === 'idle' && <Send className="h-5 w-5" />}
                
                {status === 'loading' ? 'Sending...' : 
                 status === 'success' ? 'Message Sent!' : 
                 status === 'error' ? 'Failed to Send' : 'Send Message'}
              </span>
            </button>
            
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center mt-4">
                Something went wrong. Please try again later or reach out directly via email.
              </p>
            )}
            {status === 'success' && (
              <p className="text-green-400 text-sm text-center mt-4">
                Thanks for reaching out! I'll get back to you soon.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
