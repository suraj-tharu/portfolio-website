require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

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
    // Allow requests with no origin (mobile apps, curl, same-origin)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const io = new Server(server, { cors: corsOptions });

// Use Helmet for advanced security headers
// NOTE: 'unsafe-eval' removed. Tailwind CDN in production should be replaced with
// a built CSS file. For dev, use the CDN and run behind a dev proxy.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com",
        "https://cdn.jsdelivr.net",
        "https://cdn.socket.io"
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      workerSrc: ["'self'", "blob:"],
      imgSrc: ["'self'", "data:", "https://api.dicebear.com", "https://avatars.githubusercontent.com", "https://images.unsplash.com", "https://*.tile.openstreetmap.org"],
      connectSrc: ["'self'", "https:", "wss://*", "https://api.github.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginResourcePolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Permissions Policy
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Enable CORS and Strict JSON parsing
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // DDoS Protection

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
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many contact requests from this IP, please try again after an hour' }
});

// Security: Block access to sensitive files
app.use((req, res, next) => {
  const sensitiveRegex = /(^\.|\/\.|\.env|\.git|package\.json|server\.js)/;
  if (sensitiveRegex.test(req.url)) {
    console.warn(`[SECURITY] Blocked access to sensitive file: ${req.url}`);
    return res.status(403).send('Forbidden');
  }
  next();
});

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from root
app.use(express.static(path.join(__dirname, '.')));

// Server-Side Rendered Main Page
app.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    const blogs = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
    res.render('index', { projects, blogs });
  } catch (error) {
    console.error('[DATABASE] Error fetching data:', error);
    res.render('index', { projects: [], blogs: [] });
  }
});


// ─── OpenAI / Cloudflare AI ───────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.CLOUDFLARE_API_KEY,
  baseURL: "https://api.cloudflare.com/client/v4/accounts/05511958e1d4f6bea91d7577b9d72db5/ai/v1",
});

const SYSTEM_PROMPT = `You are an AI assistant embedded in the portfolio website of Suraj Tharu Chaudhary, a Computer Engineer from Nepal.
Your goal is to answer questions about Suraj's skills, experience, and projects.
Suraj specializes in GIS, Remote Sensing, Land Use/Land Cover Analysis, and Machine Learning (Random Forest, Google Earth Engine).
He has a M.Sc. in Information System Engineering and B.E. in Computer Engineering.
He also teaches computer engineering at Shree Tri Shaheed Model Secondary School.
Keep your answers professional, concise, and enthusiastic. Never break character.`;

const chatSchema = z.object({
  message: z.string().min(1).max(500),
  context: z.string().max(100).optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(500)
  })).max(10).optional() // max 10 turns of history
});

// ─── /api/chat ────────────────────────────────────────────────────────────────
app.post('/api/chat', apiLimiter, async (req, res) => {
  try {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    let { message, context, history } = parseResult.data;
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

    // Build messages array with history for multi-turn conversation
    const messages = [{ role: 'system', content: dynamicSystemPrompt }];

    if (history && history.length > 0) {
      history.forEach(turn => {
        messages.push({ role: turn.role, content: xss(turn.content) });
      });
    }

    messages.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: '@cf/meta/llama-3.1-8b-instruct',
      messages,
      max_tokens: 200,
      temperature: 0.7,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('AI API Error:', error.message || error);
    res.json({
      reply: "I'm currently in offline/demo mode. Suraj is a talented Computer Engineer specializing in GIS, Remote Sensing, Machine Learning, and full-stack development!"
    });
  }
});

// ─── Nodemailer Email Transporter ─────────────────────────────────────────────
let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  emailTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  emailTransporter.verify((err) => {
    if (err) {
      console.warn('[EMAIL] Transporter verification failed:', err.message);
      emailTransporter = null;
    } else {
      console.log('[EMAIL] Transporter ready. Contact form will send email notifications.');
    }
  });
} else {
  console.warn('[EMAIL] EMAIL_USER / EMAIL_PASS not set. Email notifications disabled.');
}

// ─── PostgreSQL ───────────────────────────────────────────────────────────────
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // Initialize PostgreSQL pool; connection errors will be handled per query.
  // Optional: create messages table on first use.

} else {
  console.warn("WARNING: DATABASE_URL is not set. Contact form messages will not be saved to a database.");
}

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(2000),
  honeypot: z.string().max(0).optional()
});

// ─── /api/contact ─────────────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const parseResult = contactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  let { name, email, subject, message, honeypot } = parseResult.data;

  // Honeypot check for bots
  if (honeypot && honeypot.length > 0) {
    return res.json({ success: true, id: Math.floor(Math.random() * 1000) });
  }

  name = xss(name);
  email = xss(email);
  subject = subject ? xss(subject) : '';
  message = xss(message);

  let savedId = Math.floor(Math.random() * 1000);

  try {
    // Ensure messages table exists before any insert
    if (pool) {
      await pool.query(`CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    }

    if (pool) {
      const query = `INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id`;
      const result = await pool.query(query, [name, email, subject, message]);
      savedId = result.rows[0].id;
    } else {
      console.log('Contact message received (no DB configured):', { name, email, subject, message });
    }

    // Send email notification if transporter is configured
    if (emailTransporter && process.env.EMAIL_TO) {
      const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `[Portfolio] New Message from ${name}: ${subject || '(no subject)'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding:8px; font-weight:bold; width:100px;">From:</td><td style="padding:8px;">${name}</td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Email:</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px; font-weight:bold;">Subject:</td><td style="padding:8px;">${subject || '(none)'}</td></tr>
              <tr><td style="padding:8px; font-weight:bold; vertical-align:top;">Message:</td><td style="padding:8px; white-space:pre-wrap;">${message}</td></tr>
            </table>
            <p style="color:#94a3b8; font-size:12px; margin-top:20px;">
              Received at ${new Date().toLocaleString()} · Portfolio ID: ${savedId}
            </p>
          </div>
        `
      };

      emailTransporter.sendMail(mailOptions).catch(err => {
        console.error('[EMAIL] Failed to send notification:', err.message);
      });
    } else {
      console.warn('[EMAIL] Email transporter not configured; skipping notification.');
    }

    res.json({ success: true, id: savedId });
  } catch (err) {
    console.error('Error inserting message:', err.message);
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

// ─── /api/health ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: pool ? 'connected' : 'disconnected',
    email: emailTransporter ? 'configured' : 'not configured',
    timestamp: new Date().toISOString()
  });
});

// ─── Socket.io — Multiplayer Cursors ─────────────────────────────────────────
const activeUsers = new Map();

const cursorSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1)
});

io.on('connection', (socket) => {
  const hue = Math.floor(Math.random() * 360);
  const color = `hsl(${hue}, 80%, 60%)`;

  let msgCount = 0;
  const rateLimitInterval = setInterval(() => { msgCount = 0; }, 1000);

  socket.on('cursor-move', (data) => {
    if (++msgCount > 50) {
      console.warn(`[SECURITY] Socket ${socket.id} rate limited`);
      return;
    }

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

// ─── Fallback: serve index.html for any unmatched GET routes ──────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// ─── Error handling middleware ─────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

server.listen(port, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🌐 Open http://localhost:${port} in your browser`);
  console.log(`🏥 Health check: http://localhost:${port}/api/health`);
  console.log(`=========================================\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
function gracefulShutdown(signal) {
  console.log(`\n[SHUTDOWN] Received ${signal}. Closing server...`);
  server.close(async () => {
    console.log('[SHUTDOWN] HTTP server closed.');
    if (pool) {
      await pool.end();
      console.log('[SHUTDOWN] DB pool closed.');
    }
    process.exit(0);
  });
  // Force exit after 10s if server doesn't close
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

