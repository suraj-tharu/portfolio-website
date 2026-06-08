require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');
const { Pool } = require('pg');

const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const { z } = require('zod');
const morgan = require('morgan');

const app = express();

// --- Audit Logging ---
app.use(morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms'));
app.disable('x-powered-by');
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const allowedOrigins = [
  `http://localhost:${port}`, 
  `http://127.0.0.1:${port}`,
  'https://portfolio-website-vto2.onrender.com'
];
if (process.env.RENDER_EXTERNAL_HOSTNAME) {
  allowedOrigins.push(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}`);
}
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const io = new Server(server, { cors: corsOptions });

// Use Helmet for advanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "https://unpkg.com", "https://cdn.jsdelivr.net", "https://cdn.socket.io"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://api.dicebear.com"],
      connectSrc: ["'self'", "https://api.github.com", "wss://*"], // allow socket.io wss
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Permissions Policy (Helmet doesn't support this natively yet, set manually)
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Enable CORS and Strict JSON parsing
app.use(cors(corsOptions));
app.use(express.json({ limit: '5kb' })); // DDoS Protection

// Strict Origin/Referer Checking for APIs
app.use('/api', (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  if (origin && !allowedOrigins.some(o => origin.startsWith(o))) {
    console.warn(`[SECURITY] Blocked cross-origin request from: ${origin}`);
    return res.status(403).json({ error: 'Strict Origin Policy Violation' });
  }
  next();
});

// Set up rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 contact requests per hour
  message: { error: 'Too many contact requests from this IP, please try again after an hour' }
});

// Serve static files from the current directory (for index.html, etc.)
app.use(express.static(path.join(__dirname, '.')));

const openai = new OpenAI({
  apiKey: process.env.CLOUDFLARE_API_KEY,
  baseURL: "https://api.cloudflare.com/client/v4/accounts/05511958e1d4f6bea91d7577b9d72db5/ai/v1",
});

// System prompt to define the AI's behavior
const SYSTEM_PROMPT = `You are an AI assistant embedded in the portfolio website of Suraj Tharu Chaudhary, a Computer Engineer from Nepal.
Your goal is to answer questions about Suraj's skills, experience, and projects.
Suraj specializes in embedded systems, FPGA architectures (Verilog, Xilinx Artix-7), and RISC-V processor design.
He has built a 32-bit pipelined RV32I softcore from scratch and an IoT Weather Station using ESP32 and MQTT.
He also writes bare-metal drivers in C for STM32.
Keep your answers professional, concise, and enthusiastic. Never break character.`;

const chatSchema = z.object({
  message: z.string().min(1).max(500),
  context: z.string().max(100).optional()
});

app.post('/api/chat', apiLimiter, async (req, res) => {
  try {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    
    let { message, context } = parseResult.data;
    message = xss(message);
    if (context) context = xss(context);

    if (!process.env.CLOUDFLARE_API_KEY) {
      return res.json({
        reply: "Error: The Cloudflare API key has not been configured on the server yet. Please update the .env file with your key."
      });
    }

    let dynamicSystemPrompt = SYSTEM_PROMPT;
    if (context) {
      dynamicSystemPrompt += `\n\nCURRENT CONTEXT: The user is currently looking at: ${context}. If relevant, tailor your response to this section.`;
    }

    const response = await openai.chat.completions.create({
      model: '@cf/meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: dynamicSystemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with the AI.' });
  }
});

// Initialize Postgres database
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for some managed databases like Neon or Supabase
    }
  });

  pool.connect((err, client, release) => {
    if (err) {
      console.error('Error acquiring client. Check your DATABASE_URL.', err.message);
      pool = null; // Disable DB if connection fails
      return;
    }
    console.log('Connected to the PostgreSQL database.');
    client.query(`CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err, result) => {
      release();
      if (err) {
        console.error('Error creating table', err.stack);
      }
    });
  });
} else {
  console.warn("WARNING: DATABASE_URL is not set. Contact form messages will not be saved to a database.");
}

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(2000),
  honeypot: z.string().max(0).optional() // must be empty
});

// Contact form API route
app.post('/api/contact', contactLimiter, async (req, res) => {
  const parseResult = contactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  let { name, email, subject, message, honeypot } = parseResult.data;

  // Honeypot check for bots
  if (honeypot && honeypot.length > 0) {
    // Pretend it was successful to trick the bot
    return res.json({ success: true, id: Math.floor(Math.random() * 1000) });
  }

  name = xss(name);
  email = xss(email);
  subject = subject ? xss(subject) : '';
  message = xss(message);

  try {
    if (pool) {
      const query = `INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id`;
      const result = await pool.query(query, [name, email, subject, message]);
      res.json({ success: true, id: result.rows[0].id });
    } else {
      console.log('Contact message received (no DB configured):', { name, email, subject, message });
      // Return a simulated success response
      res.json({ success: true, id: Math.floor(Math.random() * 1000) });
    }
  } catch (err) {
    console.error('Error inserting message:', err.message);
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

// Socket.io for Multiplayer Cursors
const activeUsers = new Map();

// Zod schema for socket data
const cursorSchema = z.object({
  x: z.number().min(-10000).max(10000),
  y: z.number().min(-10000).max(10000)
});

io.on('connection', (socket) => {
  // Assign random color
  const hue = Math.floor(Math.random() * 360);
  const color = `hsl(${hue}, 80%, 60%)`;
  
  // Rate limiting map per socket
  let msgCount = 0;
  const rateLimitInterval = setInterval(() => { msgCount = 0; }, 1000);

  socket.on('cursor-move', (data) => {
    // Rate limit: max 50 events per second
    if (++msgCount > 50) {
      console.warn(`[SECURITY] Socket ${socket.id} rate limited`);
      return;
    }
    
    // Payload validation
    const parsed = cursorSchema.safeParse(data);
    if (!parsed.success) return;

    activeUsers.set(socket.id, { x: parsed.data.x, y: parsed.data.y, color });
    socket.broadcast.emit('cursor-update', { id: socket.id, x: parsed.data.x, y: parsed.data.y, color });
  });

  socket.on('disconnect', () => {
    clearInterval(rateLimitInterval);
    activeUsers.delete(socket.id);
    io.emit('cursor-remove', socket.id);
  });
});

server.listen(port, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🌐 Open http://localhost:${port}/index.html in your browser`);
  console.log(`=========================================\n`);
});
