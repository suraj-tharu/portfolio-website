import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * ChatWidget — panel only, no duplicate toggle button.
 * Opened exclusively via `openChatWidget()` event (FloatingActionButton → Chat).
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Suraj's AI assistant. Ask me anything about his skills, projects, or experience! 😊",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Listen for global open event dispatched by FloatingActionButton → Chat
  useEffect(() => {
    const handleGlobalOpen = () => setIsOpen(true);
    window.addEventListener('chat-widget:open', handleGlobalOpen);
    return () => window.removeEventListener('chat-widget:open', handleGlobalOpen);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const userMsg = input.trim();
      if (!userMsg || isTyping) return;

      setInput('');
      setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
      setIsTyping(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg,
            history: messages.filter((m) => m.role !== 'assistant' || messages.indexOf(m) > 0),
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || "Sorry, I couldn't process that right now." },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment!" },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping, messages]
  );

  return (
    <>
      {/* ── CHAT WINDOW (no separate toggle — FAB is the entry point) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — tap outside to close on mobile */}
            <motion.div
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 199,
                background: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
              }}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              style={{
                position: 'fixed',
                bottom: 'clamp(1rem, 3vw, 2rem)',
                right: 'clamp(0.75rem, 3vw, 2rem)',
                zIndex: 200,
                /* Responsive width: 92vw on phones, cap at 380px */
                width: 'clamp(280px, 92vw, 380px)',
                /* Responsive height: up to 75vh but max 520px */
                height: 'clamp(360px, 75vh, 520px)',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(var(--text-base-rgb),0.12)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(109,40,217,0.22)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'var(--surface, #1e1b4b)',
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chat-header-title"
            >
              {/* ── Header ── */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexShrink: 0,
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.18)',
                      borderRadius: '50%',
                      padding: '7px',
                      display: 'flex',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={17} color="#fff" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3
                      id="chat-header-title"
                      style={{
                        margin: 0,
                        fontSize: 'clamp(13px, 2.5vw, 15px)',
                        fontWeight: 700,
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      AI Assistant
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: 'clamp(9px, 1.8vw, 11px)',
                        color: 'rgba(255,255,255,0.75)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#34d399', display: 'inline-block', flexShrink: 0,
                          boxShadow: '0 0 0 2px rgba(52,211,153,0.3)',
                        }}
                      />
                      Online · Groq
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px', height: '32px',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.28)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)'; }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* ── Messages ── */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      /* Prevent single messages from bleeding out */
                      maxWidth: '88%',
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '28px', height: '28px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #6d28d9, #2563eb)'
                          : 'rgba(var(--text-base-rgb),0.08)',
                        border: msg.role === 'user' ? 'none' : '1px solid rgba(var(--text-base-rgb),0.15)',
                        color: 'var(--white)',
                      }}
                    >
                      {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                    </div>
                    <div
                      style={{
                        padding: '9px 13px',
                        borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                        fontSize: 'clamp(12px, 2.5vw, 13.5px)',
                        lineHeight: 1.55,
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #6d28d9, #1d4ed8)'
                          : 'rgba(var(--text-base-rgb),0.07)',
                        color: 'var(--white)',
                        border: msg.role === 'user' ? 'none' : '1px solid rgba(var(--text-base-rgb),0.1)',
                        /* Critical: prevent text overflow */
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                    <div
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(var(--text-base-rgb),0.08)',
                        border: '1px solid rgba(var(--text-base-rgb),0.15)',
                        color: 'var(--white)',
                      }}
                    >
                      <Bot size={13} />
                    </div>
                    <div
                      style={{
                        padding: '11px 15px', borderRadius: '4px 18px 18px 18px',
                        background: 'rgba(var(--text-base-rgb),0.07)',
                        border: '1px solid rgba(var(--text-base-rgb),0.1)',
                        display: 'flex', gap: '4px', alignItems: 'center',
                      }}
                    >
                      {[0, 0.2, 0.4].map((delay, k) => (
                        <motion.span
                          key={k}
                          style={{
                            display: 'block', width: '6px', height: '6px',
                            borderRadius: '50%', background: '#818cf8',
                          }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.7, delay }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Input ── */}
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: '10px 12px',
                  borderTop: '1px solid rgba(var(--text-base-rgb),0.08)',
                  background: 'rgba(0,0,0,0.18)',
                  flexShrink: 0,
                }}
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    disabled={isTyping}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '10px 46px 10px 15px',
                      borderRadius: '999px',
                      border: '1px solid rgba(var(--text-base-rgb),0.15)',
                      background: 'rgba(var(--text-base-rgb),0.07)',
                      color: 'var(--white)',
                      fontSize: 'clamp(12px, 2.5vw, 13.5px)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      minWidth: 0,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(109,40,217,0.6)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(109,40,217,0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(var(--text-base-rgb),0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                    style={{
                      position: 'absolute', right: '5px',
                      width: '34px', height: '34px',
                      borderRadius: '50%', border: 'none',
                      background: !input.trim() || isTyping
                        ? 'rgba(var(--text-base-rgb),0.15)'
                        : 'linear-gradient(135deg, #6d28d9, #2563eb)',
                      color: 'var(--white)',
                      cursor: !input.trim() || isTyping ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
