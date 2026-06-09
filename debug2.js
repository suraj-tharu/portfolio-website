const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Test the chat widget API
  console.log('Testing chat API...');
  const chatResponse = await page.evaluate(async () => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' })
      });
      return await res.json();
    } catch(e) {
      return { error: e.message };
    }
  });
  console.log('Chat API Response:', chatResponse);

  // Test Socket.io
  const socketConnected = await page.evaluate(() => {
    return new Promise(resolve => {
      if (typeof io === 'undefined') return resolve('io is not defined');
      const socket = io();
      socket.on('connect', () => resolve('Connected!'));
      socket.on('connect_error', (err) => resolve('Connect Error: ' + err.message));
      setTimeout(() => resolve('Timeout'), 3000);
    });
  });
  console.log('Socket Status:', socketConnected);

  await browser.close();
})();
