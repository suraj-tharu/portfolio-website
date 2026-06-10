// generate_debug.js
// This script launches a headless Chromium instance, navigates to the local dev server,
// captures any console messages (errors, warnings), takes a screenshot, and saves both.
// Usage: node generate_debug.js

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const url = process.env.DEBUG_URL || 'http://localhost:3000';
  const screenshotPath = path.resolve(__dirname, 'debug_screenshot.png');
  const consoleLogPath = path.resolve(__dirname, 'debug_console.log');

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const messages = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    // Capture only errors and warnings for debugging
    if (type === 'error' || type === 'warning') {
      messages.push(`[${type}] ${text}`);
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    // Give some extra time for any async scripts to run
    // Wait for a short period to allow scripts to run
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: screenshotPath, fullPage: true });
    fs.writeFileSync(consoleLogPath, messages.join('\n'), 'utf8');
    console.log('Debug capture completed.');
    console.log('Screenshot saved to:', screenshotPath);
    console.log('Console log saved to:', consoleLogPath);
  } catch (err) {
    console.error('Error during debugging:', err);
  } finally {
    await browser.close();
  }
})();
