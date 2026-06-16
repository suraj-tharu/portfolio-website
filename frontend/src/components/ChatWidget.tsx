import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

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
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:bg-brand-400 hover:scale-105 transition-all"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <span style={{ transform: "perspective(1000px) rotateX(20deg) rotateY(-20deg)" }}>
          <MessageCircle size={28} />
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[90vw] max-w-[400px] h-[500px] max-h-[80vh] bg-surface border border-stroke rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-500 text-white px-5 py-4 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-transparent opacity-50"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <span style={{ transform: "perspective(1000px) rotateX(20deg) rotateY(-20deg)" }}>
                    <Bot size={20} />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold font-display tracking-wide">AI Assistant</h3>
                  <p className="text-xs text-white/80">Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <span style={{ transform: "perspective(1000px) rotateX(20deg) rotateY(-20deg)" }}>
                  <X size={20} />
                </span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-bg/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-brand-500 text-white' : 'bg-surface border border-stroke text-brand-400'}`}>
                    <span style={{ transform: "perspective(800px) rotateX(20deg) rotateY(-20deg)" }}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </span>
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-brand-500 text-white rounded-tr-sm'
                    : 'bg-surface border border-stroke text-text-primary rounded-tl-sm'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-surface border border-stroke text-brand-400">
                    <span style={{ transform: "perspective(800px) rotateX(20deg) rotateY(-20deg)" }}>
                      <Bot size={16} />
                    </span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-surface border border-stroke rounded-tl-sm flex items-center gap-1.5">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-brand-500/50" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-brand-500/50" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-brand-500/50" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-surface border-t border-stroke">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-bg border border-stroke rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors text-text-primary placeholder:text-muted"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-brand-500 text-white rounded-full hover:bg-brand-400 disabled:opacity-50 disabled:hover:bg-brand-500 transition-colors"
                >
                  <span style={{ transform: "perspective(1000px) rotateX(20deg) rotateY(-20deg)" }}>
                    <Send size={16} />
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
