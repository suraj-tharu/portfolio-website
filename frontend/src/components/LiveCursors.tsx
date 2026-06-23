import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

type Cursor = {
  id: string;
  x: number;
  y: number;
  color: string;
};

export default function LiveCursors() {
  const [cursors, setCursors] = useState<Map<string, Cursor>>(new Map());

  useEffect(() => {
    // Only connect if we are in browser
    if (typeof window === 'undefined') return;

    // Connect to backend websocket
    const newSocket = io(window.location.origin, {
      path: '/socket.io',
      reconnectionAttempts: 5,
    });

    newSocket.on('current-users', (users: [string, Cursor][]) => {
      setCursors(new Map(users.filter(([id]) => id !== newSocket.id)));
    });

    newSocket.on('cursor-update', (data: Cursor) => {
      if (data.id === newSocket.id) return;
      setCursors(prev => {
        const newMap = new Map(prev);
        newMap.set(data.id, data);
        return newMap;
      });
    });

    newSocket.on('user-left', ({ id }) => {
      setCursors(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    });

    // Track local mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (newSocket && newSocket.connected) {
        newSocket.emit('cursor-move', { x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {Array.from(cursors.values()).map(cursor => (
          <motion.div
            key={cursor.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: cursor.x, 
              y: cursor.y 
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              mass: 0.5,
              stiffness: 400,
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          >
            {/* Custom SVG Cursor */}
            <svg
              width="24"
              height="36"
              viewBox="0 0 24 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
              style={{ transform: 'translate(-2px, -2px)' }}
            >
              <path
                d="M5.65376 2.00033L2.24278 28.5345C1.86877 31.4429 5.37893 33.3615 7.64161 31.4883L12.5694 27.4116C12.9238 27.1184 13.3853 26.9749 13.854 27.0118L19.4678 27.4526C22.4214 27.6845 23.9405 24.084 21.849 21.8028L7.84803 2.50294C5.83689 0.334057 2.39291 1.77708 2.56376 4.70033L5.65376 2.00033Z"
                fill={cursor.color}
                stroke="white"
                strokeWidth="2"
              />
            </svg>
            <div 
              className="absolute left-6 top-6 px-2 py-1 rounded-full text-[10px] font-bold text-text-primary dark:text-white whitespace-nowrap shadow-sm"
              style={{ backgroundColor: cursor.color }}
            >
              Visitor
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
