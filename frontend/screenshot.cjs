const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Match the user's viewport
  await page.setViewport({ width: 1098, height: 517 });
  
  console.log("Navigating to http://localhost:3000...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Take screenshot
  const screenshotPath = 'C:\\Users\\ACER\\.gemini\\antigravity-ide\\brain\\2e38f945-d29c-4a18-bd75-5b7224c991df\\screenshot.png';
  await page.screenshot({ path: screenshotPath });
  
  console.log(`Screenshot saved to ${screenshotPath}`);
  
  await browser.close();
})();
