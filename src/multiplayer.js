// src/multiplayer.js — Real-time Multiplayer Cursors (Socket.io)

export function initMultiplayer() {
  try {
    const socket = io();
    const cursors = {};

    document.addEventListener('mousemove', (e) => {
      if (socket.connected && document.hasFocus()) {
        socket.emit('cursor-move', {
          x: e.pageX / window.innerWidth,
          y: e.pageY / window.innerHeight
        });
      }
    });

    socket.on('cursor-update', (data) => {
      let el = cursors[data.id];
      if (!el) {
        el = document.createElement('div');
        el.className = 'absolute w-3 h-3 rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-75 ease-out';
        el.style.backgroundColor = data.color;
        document.body.appendChild(el);
        cursors[data.id] = el;
      }
      el.style.left = (data.x * window.innerWidth) + 'px';
      el.style.top = (data.y * window.innerHeight) + 'px';
    });

    socket.on('cursor-remove', (id) => {
      if (cursors[id]) {
        cursors[id].remove();
        delete cursors[id];
      }
    });

    socket.on('user-left', (data) => {
      if (cursors[data.id]) {
        cursors[data.id].remove();
        delete cursors[data.id];
      }
    });

    console.log('[Multiplayer] Socket.io cursors initialized.');
  } catch (e) {
    console.warn('[Multiplayer] Socket.io not available — cursors disabled.');
  }
}
