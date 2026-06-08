require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');
const { Pool } = require('pg');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

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

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

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
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some managed databases like Neon or Supabase
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
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
      return console.error('Error creating table', err.stack);
    }
  });
});

// Contact form API route
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const query = `INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id`;
    const result = await pool.query(query, [name, email, subject, message]);
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error inserting message:', err.message);
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

// Socket.io for Multiplayer Cursors
const activeUsers = new Map();

io.on('connection', (socket) => {
  // Assign random color
  const hue = Math.floor(Math.random() * 360);
  const color = `hsl(${hue}, 80%, 60%)`;

  socket.on('cursor-move', (data) => {
    activeUsers.set(socket.id, { x: data.x, y: data.y, color });
    socket.broadcast.emit('cursor-update', { id: socket.id, x: data.x, y: data.y, color });
  });

  socket.on('disconnect', () => {
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
