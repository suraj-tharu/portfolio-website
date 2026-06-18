import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';

export default function TerminalResume() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'input' | 'output', text: string | React.ReactNode }[]>([
    { type: 'output', text: 'Welcome to SC-OS v2.0. Type "help" for a list of available commands.' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', text: `root@suraj:~$ ${input}` } as const];

    let output: string | React.ReactNode = '';

    switch (cmd) {
      case 'help':
        output = (
          <div className="flex flex-col gap-1 mt-2 text-gray-300">
            <div><span className="text-brand-light">whoami</span>     - Display biography</div>
            <div><span className="text-brand-light">skills --all</span> - List all technical skills</div>
            <div><span className="text-brand-light">contact</span>    - Show contact information</div>
            <div><span className="text-brand-light">clear</span>      - Clear terminal output</div>
            <div><span className="text-brand-light">sudo rm -rf</span> - [REDACTED]</div>
          </div>
        );
        break;
      case 'whoami':
        output = 'Suraj Tharu Chaudhary. Engineer, Educator, Researcher. Specializing in AI, GIS, and Full-Stack Development.';
        break;
      case 'skills --all':
        output = 'Languages: Python, JS/TS, C++, C#. Frameworks: React, Django, Express. Tools: Docker, QGIS, TensorFlow.';
        break;
      case 'contact':
        output = 'Email: suraj.tharu@example.com | Location: Nawalparasi West, Nepal';
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'sudo rm -rf':
        output = <span className="text-red-500">Permission denied. Nice try!</span>;
        break;
      default:
        output = `Command not found: ${cmd}. Type "help" for available commands.`;
    }

    setHistory([...newHistory, { type: 'output', text: output }]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-surface/80 backdrop-blur-md border border-stroke p-3 rounded-full hover:bg-brand-500 hover:border-brand-light transition-all shadow-lg group"
        aria-label="Open Terminal"
      >
        <TerminalIcon size={24} className="text-text-primary group-hover:text-white" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-32 left-6 w-[90vw] md:w-[500px] h-[400px] bg-[#050505]/95 backdrop-blur-xl border border-stroke rounded-xl shadow-2xl z-50 flex flex-col font-mono text-sm overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-surface/50 border-b border-stroke">
            <div className="flex items-center gap-2">
              <TerminalIcon size={14} className="text-muted" />
              <span className="text-muted text-xs">bash - SC-OS</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 overflow-y-auto" onClick={() => inputRef.current?.focus()}>
            {history.map((item, i) => (
              <div key={i} className={`mb-2 ${item.type === 'input' ? 'text-brand-light' : 'text-gray-400'}`}>
                {item.text}
              </div>
            ))}
            
            <form onSubmit={handleCommand} className="flex items-center mt-2 text-brand-light">
              <span className="mr-2">root@suraj:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none text-white focus:ring-0 p-0"
                autoComplete="off"
                spellCheck="false"
              />
            </form>
            <div ref={bottomRef} />
          </div>
        </motion.div>
      )}
    </>
  );
}
