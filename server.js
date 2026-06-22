require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const { z } = require('zod');
const morgan = require('morgan');
const compression = require('compression');

const { marked } = require('marked');
const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify')(new JSDOM('').window);

const app = express();

const multer = require('multer');
const fs = require('fs');

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to save uploaded file buffer directly to the database and return public URL
async function saveUploadedFile(file) {
  if (!file) return null;
  const ext = path.extname(file.originalname);
  const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;

  await prisma.uploadedFile.create({
    data: {
      filename: uniqueFilename,
      mimeType: file.mimetype,
      content: file.buffer
    }
  });

  return '/assets/uploads/' + uniqueFilename;
}

// --- Edge Caching & Optimization ---
app.use(compression({
  level: 6, // optimal balance between speed and compression
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// --- Audit Logging ---
app.use(morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms'));
app.disable('x-powered-by');
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`,
  'https://portfolio-website-vto2.onrender.com'
];
if (process.env.RENDER_EXTERNAL_HOSTNAME) {
  allowedOrigins.push(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}`);
}
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === 'null' || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      // For development, just allow it anyway to prevent 500 crashes
      callback(null, true);
    }
  }
};

const io = new Server(server, { cors: corsOptions });

const renderHost = process.env.RENDER_EXTERNAL_HOSTNAME ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}` : null;

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
        "https://cdn.socket.io",           // Socket.io CDN
        "https://fonts.googleapis.com",
        "blob:",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",                           // Allow all HTTPS images
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com",
      ],
      connectSrc: [
        "'self'",
        "ws://localhost:3000",
        "wss://localhost:3000",
        "ws://127.0.0.1:3000",
        "https://nominatim.openstreetmap.org",
        "https://api.github.com",          // GitHub Activity Feed
        "https://cdn.jsdelivr.net",        // Source maps
        "https://unpkg.com",               // Source maps
        "https://cdn.socket.io",           // Socket.io
        "https://cdnjs.cloudflare.com",    // Monaco editor source maps
        "https://*.basemaps.cartocdn.com", // Leaflet CARTO tile provider
        "https://basemaps.cartocdn.com",   // Leaflet CARTO tile provider (direct)
        "https://fonts.googleapis.com",    // Google Fonts (needed by SW fetch)
        "https://fonts.gstatic.com",       // Google Fonts actual font files
        "https://images.unsplash.com",     // Unsplash project/blog images
        "https://api.dicebear.com",        // DiceBear avatar API
        "https://stream.mux.com",          // HLS Video Stream
        ...(renderHost ? [`wss://${process.env.RENDER_EXTERNAL_HOSTNAME}`, renderHost] : []),
      ],
      mediaSrc: ["'self'", "blob:", "https://stream.mux.com", "https://d8j0ntlcm91z4.cloudfront.net"],
      workerSrc: ["'self'", "blob:"],
    },
  },
}));

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true })); // Added to parse form submissions
app.use(cookieParser());

app.use('/api', (req, res, next) => {
  const referer = req.get('Referer');
  const origin = req.get('Origin');

  if (process.env.NODE_ENV === 'production') {
    if (!referer && !origin) {
      return res.status(403).json({ error: 'Direct API access forbidden.' });
    }

    let isAllowed = false;
    for (const allowed of allowedOrigins) {
      if ((referer && referer.startsWith(allowed)) || (origin && origin === allowed)) {
        isAllowed = true;
        break;
      }
    }

    if (!isAllowed) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
  }
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many contact requests from this IP' }
});

app.use((req, res, next) => {
  // Case-insensitive block for sensitive files and directories
  const sensitiveRegex = /(\.env|\.git|package(?:-lock)?\.json|server\.js|app\.js|seed\.js|prisma\/|node_modules\/|\.npmrc|\.dockerignore|Dockerfile|docker-compose)/i;
  if (sensitiveRegex.test(req.url)) {
    console.warn(`[SECURITY] Blocked access to sensitive file: ${req.url}`);
    return res.status(403).send('Forbidden');
  }
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve only safe, explicitly-listed static directories
// Never serve the project root to avoid leaking server.js, .env, prisma/, etc.
app.use('/dist', express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  immutable: true,
}));
app.use('/assets/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
}));

// Fallback to serve uploaded files directly from PostgreSQL database if not present on disk
app.get('/assets/uploads/:filename', async (req, res, next) => {
  try {
    const file = await prisma.uploadedFile.findUnique({
      where: { filename: req.params.filename }
    });
    if (!file) {
      return next(); // Fall through to subsequent routes and eventually 404 handler
    }
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
    res.send(file.content);
  } catch (err) {
    console.error('[DATABASE FILE SERVER] Error serving file:', err);
    next(err);
  }
});
app.use('/assets', express.static(path.join(__dirname, 'frontend', 'dist', 'assets'), {
  maxAge: '1y',
  immutable: true,
}));
app.use('/icons', express.static(path.join(__dirname, 'icons'), { maxAge: '1d' }));
app.use(express.static(path.join(__dirname, '.'), {
  maxAge: '1d',
  // Allowlist: only serve known safe top-level files
  index: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.ejs')) {
      res.setHeader('Cache-Control', 'public, max-age=0');
    } else if (filePath.includes('/dist/') || filePath.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));
// Explicit safe top-level file routes
const safeTopLevelFiles = ['style.css', 'manifest.json', 'robots.txt', 'sitemap.xml', 'sw.js', 'Suraj_Tharu_CV.pdf'];
const safeImageExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.pdf', '.mp4'];
app.use((req, res, next) => {
  const urlPath = req.path;
  const ext = path.extname(urlPath).toLowerCase();
  const base = path.basename(urlPath);
  // Block any request that tries to reach a sensitive file at the root level
  if (!urlPath.startsWith('/dist/') && !urlPath.startsWith('/icons/') && !urlPath.startsWith('/assets/') &&
    !safeTopLevelFiles.includes(base) && !safeImageExts.includes(ext) &&
    urlPath !== '/') {
    // Allow only known safe patterns — everything else goes to route handlers
    return next();
  }
  next();
});

app.get('/api/portfolio-data', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    const blogs = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
    res.json({ projects, blogs });
  } catch (error) {
    console.error('[DATABASE] Error fetching API data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/timeline', async (req, res) => {
  try {
    const timeline = await prisma.timelineEvent.findMany({ orderBy: { orderIndex: 'asc' } });
    res.json({ timeline });
  } catch (error) {
    console.error('[DATABASE] Error fetching timeline data:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// NOTE: The SPA wildcard MUST come before the specific EJS routes, otherwise
// React Router pages like /about, /projects etc. return 404 on refresh.
// We skip it only if the path is a known server-side route.
app.get('*', (req, res, next) => {
  const urlPath = req.path;
  // Skip for server-rendered EJS pages and API endpoints
  if (
    urlPath.startsWith('/api') ||
    urlPath.startsWith('/admin') ||
    urlPath.startsWith('/learning-hub') ||
    urlPath.startsWith('/blog/') ||
    urlPath.startsWith('/dist/') ||
    urlPath.startsWith('/assets/') ||
    urlPath.startsWith('/icons/')
  ) {
    return next();
  }
  const indexPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('[SPA] Failed to serve index.html:', err.message, indexPath);
      res.status(500).render('404', { message: 'Application failed to load. Please try again. Error: ' + err.message });
    }
  });
});

app.get('/learning-hub', async (req, res) => {
  try {
    const materials = await prisma.learningMaterial.findMany({ orderBy: { createdAt: 'asc' } });
    res.render('learning-hub', { materials });
  } catch (error) {
    console.error('[DATABASE] Error fetching learning materials:', error);
    res.render('learning-hub', { materials: [] });
  }
});

// ─── ADMIN ROUTES & AUTH ──────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

function authenticateAdmin(req, res, next) {
  const token = req.cookies.admin_token;
  if (!token) return res.redirect('/admin/login');
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.redirect('/admin/login');
  }
}

app.get('/admin/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'password123';

  if (username === validUser && password === validPass) {
    const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: '2h' });
    res.cookie('admin_token', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
    res.redirect('/admin');
  } else {
    res.render('login', { error: 'Invalid username or password' });
  }
});

app.get('/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.redirect('/admin/login');
});

app.get('/admin', authenticateAdmin, async (req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  const blogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  const learningMaterials = await prisma.learningMaterial.findMany({ orderBy: { createdAt: 'desc' } });
  const timelineEvents = await prisma.timelineEvent.findMany({ orderBy: { orderIndex: 'asc' } });
  res.render('admin', { projects, blogs, messages, learningMaterials, timelineEvents });
});

app.post('/admin/api/projects', authenticateAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, description, imageUrl, githubUrl, liveUrl, tags } = req.body;
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = await saveUploadedFile(req.file);
    }
    await prisma.project.create({ data: { title, description, imageUrl: finalImageUrl, githubUrl, liveUrl, tags } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error creating project'); }
});

app.post('/admin/api/projects/:id/delete', authenticateAdmin, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error deleting project'); }
});

app.post('/admin/api/blogs', authenticateAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { title, slug, content, published } = req.body;
    let finalImageUrl = null;
    if (req.file) {
      finalImageUrl = await saveUploadedFile(req.file);
    }
    await prisma.blogPost.create({ data: { title, slug, content, imageUrl: finalImageUrl, published: published === 'on' } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error creating blog'); }
});

app.post('/admin/api/blogs/:id/delete', authenticateAdmin, async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: parseInt(req.params.id) } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error deleting blog'); }
});

app.post('/admin/api/messages/:id/delete', authenticateAdmin, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: parseInt(req.params.id) } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error deleting message'); }
});

app.post('/admin/api/learning-materials', authenticateAdmin, upload.single('pdfFile'), async (req, res) => {
  try {
    const { grade, category, subject, description, pdfUrl } = req.body;
    let finalPdfUrl = pdfUrl;
    if (req.file) {
      finalPdfUrl = await saveUploadedFile(req.file);
    }
    await prisma.learningMaterial.create({ data: { grade, category, subject, description, pdfUrl: finalPdfUrl } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error creating learning material'); }
});

app.post('/admin/api/learning-materials/:id/delete', authenticateAdmin, async (req, res) => {
  try {
    await prisma.learningMaterial.delete({ where: { id: parseInt(req.params.id) } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error deleting learning material'); }
});

app.post('/admin/api/timeline', authenticateAdmin, async (req, res) => {
  try {
    const { year, role, location, orderIndex } = req.body;
    await prisma.timelineEvent.create({ data: { year, role, location, orderIndex: parseInt(orderIndex) || 0 } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error creating timeline event'); }
});

app.post('/admin/api/timeline/:id/delete', authenticateAdmin, async (req, res) => {
  try {
    await prisma.timelineEvent.delete({ where: { id: parseInt(req.params.id) } });
    res.redirect('/admin');
  } catch (e) { res.status(500).send('Error deleting timeline event'); }
});

// ─── Blog Detail Page ─────────────────────────────────────────────────────────
app.get('/blog/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (!post || !post.published) {
      return res.status(404).render('404', { message: 'Blog post not found.' });
    }

    // Calculate Read Time
    const wordCount = post.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200); // 200 WPM

    // Extract Table of Contents
    const toc = [];
    const renderer = new marked.Renderer();
    renderer.heading = function ({ text, depth }) {
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      if (depth <= 3) {
        toc.push({ id, text, depth });
      }
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    };
    const htmlWithIds = marked.parse(post.content, { renderer });
    const finalHtml = DOMPurify.sanitize(htmlWithIds);

    res.render('blog-post', { post, htmlContent: finalHtml, readTime, toc });
  } catch (error) {
    console.error('[BLOG] Error fetching post:', error);
    res.status(500).send('Server error');
  }
});

// ─── OpenAI / Cloudflare AI ───────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an AI assistant embedded in the portfolio website of Suraj Tharu Chaudhary, a Computer Engineer from Nepal.
Your goal is to answer questions about Suraj's skills, experience, and projects.
Suraj specializes in GIS, Remote Sensing, Land Use/Land Cover Analysis, and Machine Learning.
He has a M.Sc. in Information System Engineering and B.E. in Computer Engineering.
Keep your answers professional, concise, and enthusiastic. Never break character.`;

const chatSchema = z.object({
  message: z.string().min(1).max(500),
  context: z.string().max(200).optional().nullable(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(500)
  })).max(30).optional().nullable()
});

app.post('/api/chat', apiLimiter, async (req, res) => {
  try {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    let { message, context, history } = parseResult.data;
    message = xss(message);
    if (context) context = xss(context);

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return res.json({
        reply: "Error: The Google AI API key has not been configured on the server yet."
      });
    }

    let dynamicSystemPrompt = SYSTEM_PROMPT;
    if (context) {
      dynamicSystemPrompt += `\n\nCURRENT CONTEXT: The user is looking at: ${context}.`;
    }

    const geminiMessages = [];
    geminiMessages.push({ role: 'user', parts: [{ text: dynamicSystemPrompt }] });
    geminiMessages.push({ role: 'model', parts: [{ text: 'Understood.' }] });

    if (history && history.length > 0) {
      history.forEach(turn => {
        geminiMessages.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: xss(turn.content) }]
        });
      });
    }
    geminiMessages.push({ role: 'user', parts: [{ text: message }] });

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const fetchResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: geminiMessages })
    });

    if (!fetchResponse.ok) {
      const errData = await fetchResponse.text();
      console.error('Gemini API Error:', errData);
      throw new Error(`Gemini API returned ${fetchResponse.status}`);
    }

    const data = await fetchResponse.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

    res.json({ reply: replyText });
  } catch (error) {
    console.error('AI API Error:', error.message || error);
    res.json({
      reply: "I'm currently offline. Suraj is a talented Computer Engineer specializing in GIS and full-stack!"
    });
  }
});

// ─── Nodemailer Email Transporter ─────────────────────────────────────────
let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  emailTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(2000),
  honeypot: z.string().max(0).optional()
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const parseResult = contactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  let { name, email, subject, message, honeypot } = parseResult.data;
  if (honeypot && honeypot.length > 0) {
    return res.json({ success: true, id: Math.floor(Math.random() * 1000) });
  }

  name = xss(name);
  email = xss(email);
  subject = subject ? xss(subject) : '';
  message = xss(message);

  let savedId = Math.floor(Math.random() * 1000);

  try {
    const newMsg = await prisma.contactMessage.create({
      data: { name, email, subject, message }
    });
    savedId = newMsg.id;

    if (emailTransporter && process.env.EMAIL_TO) {
      const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `[Portfolio] New Message from ${name}: ${subject || '(no subject)'}`,
        html: `<p>From: ${name} (${email})</p><p>${message}</p>`
      };
      await emailTransporter.sendMail(mailOptions);
    }

    res.json({ success: true, id: savedId });
  } catch (error) {
    console.error('[CONTACT DB] Error saving message:', error);
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

// ─── Socket.io Logic ──────────────────────────────────────────────────────
const activeUsers = new Map();

io.on('connection', (socket) => {
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;

  activeUsers.set(socket.id, {
    id: socket.id,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    x: 0,
    y: 0,
    ip: ip
  });

  io.emit('user-joined', { count: activeUsers.size, id: socket.id, color: activeUsers.get(socket.id).color });
  socket.emit('current-users', Array.from(activeUsers.entries()));

  socket.on('cursor-move', (data) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      user.x = data.x;
      user.y = data.y;
      socket.broadcast.emit('cursor-update', { id: socket.id, x: data.x, y: data.y, color: user.color });
    }
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.id);
    io.emit('user-left', { count: activeUsers.size, id: socket.id });
  });
});

// 404 catch-all — must come AFTER all routes and BEFORE the error handler
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  if (req.accepts('html')) {
    return res.status(404).render('404', { message: 'The page you are looking for could not be found.' });
  }
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[EXPRESS ERROR]', err.stack);
  if (req.accepts('html')) {
    return res.status(500).render('404', { message: 'An unexpected server error occurred.' });
  }
  res.status(500).json({ error: 'Something broke!' });
});

server.listen(port, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`🌐 Open http://localhost:${port} in your browser`);
  console.log(`=========================================\n`);
});
