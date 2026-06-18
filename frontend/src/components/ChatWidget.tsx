import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Suraj's AI assistant. Feel free to ask me anything about his skills, experience, or projects." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(1) // exclude initial greeting
        })
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't process that right now."
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Network error. I am currently offline."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Bottom Right with "Chat with AI Assistant" label */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed z-[97] flex items-center gap-3 shadow-2xl hover:scale-105 transition-all group"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              bottom: '2rem',
              right: '2rem',
              background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent-2) 50%, var(--brand-dark) 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 4s ease infinite',
              padding: '14px 24px 14px 18px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              cursor: 'pointer',
            }}
            aria-label="Chat with AI Assistant"
            title="Chat with AI Assistant"
          >
            {/* Animated sparkle icon */}
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="flex-shrink-0"
            >
              <Sparkles size={20} />
            </motion.span>
            <span className="font-semibold text-sm tracking-wide whitespace-nowrap hidden sm:inline">
              Chat with AI Assistant
            </span>
            <span className="font-semibold text-sm tracking-wide whitespace-nowrap sm:hidden">
              AI Chat
            </span>
            {/* Pulsing dot indicator */}
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window - Bottom Right */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="w-[92vw] max-w-[420px] h-[520px] max-h-[80vh] rounded-2xl shadow-2xl z-[97] flex flex-col overflow-hidden"
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 97,
              background: 'var(--surface)',
              border: '1px solid var(--stroke)',
            }}
            role="dialog"
            aria-labelledby="chat-header"
            aria-modal="true"
          >
            {/* Header — premium gradient */}
            <div
              className="text-white px-5 py-4 flex justify-between items-center relative overflow-hidden"
              id="chat-header"
              style={{
                background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent-2) 100%)',
              }}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold font-display tracking-wide">AI Assistant</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                    </span>
                    Powered by Gemini
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
                title="Close chat"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ background: 'var(--bg)' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'text-white' : 'border text-brand-400'}`}
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, var(--brand), var(--accent-2))'
                        : 'var(--surface)',
                      borderColor: msg.role === 'user' ? 'transparent' : 'var(--stroke)',
                    }}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'rounded-tl-sm'
                    }`}
                    style={{
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, var(--brand), var(--brand-dark))'
                        : 'var(--surface)',
                      color: msg.role === 'user' ? '#fff' : 'var(--text)',
                      border: msg.role === 'user' ? 'none' : '1px solid var(--stroke)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border text-brand-400"
                    style={{ background: 'var(--surface)', borderColor: 'var(--stroke)' }}
                  >
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                    style={{ background: 'var(--surface)', border: '1px solid var(--stroke)' }}
                  >
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full" style={{ background: 'var(--brand)', opacity: 0.5 }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full" style={{ background: 'var(--brand)', opacity: 0.5 }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full" style={{ background: 'var(--brand)', opacity: 0.5 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4" style={{ background: 'var(--surface)', borderTop: '1px solid var(--stroke)' }}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none transition-colors"
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--stroke)',
                    color: 'var(--text)',
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 text-white rounded-full disabled:opacity-50 transition-colors"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand), var(--accent-2))',
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
