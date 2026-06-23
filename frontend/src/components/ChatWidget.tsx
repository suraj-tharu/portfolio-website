import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

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

  // Listen for global open event (from FloatingActionButton or anywhere)
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
          {
            role: 'assistant',
            content: data.reply || "Sorry, I couldn't process that right now.",
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              "I'm having trouble connecting right now. Please try again in a moment!",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [input, isTyping, messages]
  );

  return (
    <>
      {/* ── TOGGLE BUTTON (always rendered, never unmounted) ─────────────── */}
      {!isOpen && (
        <button
          id="chat-widget-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Chat with AI Assistant"
          title="Chat with AI Assistant"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 200,          // highest z-index so nothing covers it
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '13px 22px 13px 16px',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(109,40,217,0.45)',
            fontFamily: 'inherit',
            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          {/* Animated sparkle */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              animation: 'spin-slow 4s linear infinite',
            }}
          >
            <Sparkles size={20} />
          </span>

          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            Chat with AI
          </span>

          {/* Online pulse indicator */}
          <span
            style={{ position: 'relative', display: 'flex', width: '10px', height: '10px' }}
          >
            <span
              style={{
                position: 'absolute',
                display: 'inline-flex',
                borderRadius: '50%',
                width: '100%',
                height: '100%',
                backgroundColor: '#34d399',
                opacity: 0.75,
                animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
              }}
            />
            <span
              style={{
                position: 'relative',
                display: 'inline-flex',
                borderRadius: '50%',
                width: '10px',
                height: '10px',
                backgroundColor: '#34d399',
              }}
            />
          </span>
        </button>
      )}

      {/* ── CHAT WINDOW ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              zIndex: 200,
              width: 'min(92vw, 420px)',
              height: 'min(80vh, 540px)',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow:
                '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(109,40,217,0.2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              background: 'var(--surface, #1e1b4b)',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-header-title"
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #6d28d9 0%, #2563eb 100%)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    padding: '7px',
                    display: 'flex',
                  }}
                >
                  <Bot size={18} color="#fff" />
                </div>
                <div>
                  <h3
                    id="chat-header-title"
                    style={{
                      margin: 0,
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    AI Assistant
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#34d399',
                        display: 'inline-block',
                        boxShadow: '0 0 0 2px rgba(52,211,153,0.3)',
                      }}
                    />
                    Online · Powered by Groq
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
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(255,255,255,0.15)';
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
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
                    maxWidth: '85%',
                  }}
                >
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #6d28d9, #2563eb)'
                          : 'rgba(255,255,255,0.08)',
                      border:
                        msg.role === 'user'
                          ? 'none'
                          : '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                    }}
                  >
                    {msg.role === 'user' ? (
                      <User size={14} />
                    ) : (
                      <Bot size={14} />
                    )}
                  </div>
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                      fontSize: '13.5px',
                      lineHeight: 1.5,
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, #6d28d9, #1d4ed8)'
                          : 'rgba(255,255,255,0.07)',
                      color: '#fff',
                      border:
                        msg.role === 'user'
                          ? 'none'
                          : '1px solid rgba(255,255,255,0.1)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
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
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                    }}
                  >
                    <Bot size={14} />
                  </div>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '4px 18px 18px 18px',
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    {[0, 0.2, 0.4].map((delay, k) => (
                      <motion.span
                        key={k}
                        style={{
                          display: 'block',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: '#818cf8',
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

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              style={{
                padding: '12px 14px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(0,0,0,0.15)',
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
                    padding: '11px 48px 11px 16px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.07)',
                    color: '#fff',
                    fontSize: '13.5px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(109,40,217,0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(109,40,217,0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  style={{
                    position: 'absolute',
                    right: '6px',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: 'none',
                    background:
                      !input.trim() || isTyping
                        ? 'rgba(255,255,255,0.15)'
                        : 'linear-gradient(135deg, #6d28d9, #2563eb)',
                    color: '#fff',
                    cursor: !input.trim() || isTyping ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline keyframes for ping + slow-spin animations */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin-slow {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(15deg); }
          75%  { transform: rotate(-15deg); }
          100% { transform: rotate(0deg); }
        }
        #chat-widget-toggle {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        #chat-widget-toggle:hover {
          box-shadow: 0 12px 40px rgba(109,40,217,0.6) !important;
        }
      `}</style>
    </>
  );
}
