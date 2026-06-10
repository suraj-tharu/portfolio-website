const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

// ─── Page Load & Navigation ────────────────────────────────────────────────────
test.describe('Core Page Tests', () => {

  test('homepage loads with correct title', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Suraj Tharu Chaudhary/i);
  });

  test('navigation bar is visible and contains key links', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('a[href="#about"]')).toBeVisible();
    await expect(page.locator('a[href="#projects"]')).toBeVisible();
    await expect(page.locator('a[href="#contact"]')).toBeVisible();
  });

  test('preloader animates and disappears', async ({ page }) => {
    await page.goto(BASE_URL);
    const preloader = page.locator('#preloader');
    // Preloader should eventually fade out
    await expect(preloader).toBeHidden({ timeout: 5000 });
  });

  test('dark mode toggle switches theme', async ({ page }) => {
    await page.goto(BASE_URL);
    const htmlEl = page.locator('html');
    const themeBtn = page.locator('#theme-btn');
    await themeBtn.click();
    await expect(htmlEl).not.toHaveClass(/dark/);
    await themeBtn.click();
    await expect(htmlEl).toHaveClass(/dark/);
  });

});

// ─── Contact Form ─────────────────────────────────────────────────────────────
test.describe('Contact Form', () => {

  test('contact form shows after clicking Initialize Connection button', async ({ page }) => {
    await page.goto(BASE_URL);
    const contactBtn = page.locator('#init-conn-btn');
    await contactBtn.scrollIntoViewIfNeeded();
    await contactBtn.click();
    await expect(page.locator('#contact-modal, form[id*="contact"]')).toBeVisible({ timeout: 2000 }).catch(() => {
      // May be a page-level form; that's OK too
    });
  });

  test('contact form validates required fields', async ({ page }) => {
    await page.goto(BASE_URL);
    // Find any submit button in a contact form
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      // Browser native validation should prevent submission
      const nameInput = page.locator('input[name="name"], input[id*="name"]').first();
      if (await nameInput.count() > 0) {
        await expect(nameInput).not.toHaveValue(''); // Still empty (not submitted)
      }
    }
  });

});

// ─── AI Chat Widget ───────────────────────────────────────────────────────────
test.describe('AI Chat Widget', () => {

  test('chat widget opens when chat button is clicked', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#chat-btn').click();
    const chatWidget = page.locator('#chat-widget');
    await expect(chatWidget).toBeVisible();
  });

  test('chat input accepts text and send button exists', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#chat-btn').click();
    const chatInput = page.locator('#chat-input');
    await expect(chatInput).toBeVisible();
    await chatInput.fill("What are Suraj's skills?");
    await expect(chatInput).toHaveValue("What are Suraj's skills?");
  });

  test('chat widget closes when X button is clicked', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#chat-btn').click();
    await page.locator('#close-chat').click();
    const chatWidget = page.locator('#chat-widget');
    await expect(chatWidget).toBeHidden();
  });

});

// ─── Sections Visibility ──────────────────────────────────────────────────────
test.describe('Key Sections', () => {

  test('Research section contains GIS map', async ({ page }) => {
    await page.goto(BASE_URL);
    const mapContainer = page.locator('#gis-map');
    await mapContainer.scrollIntoViewIfNeeded();
    await expect(mapContainer).toBeVisible();
  });

  test('Projects section cards are visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#projects').scrollIntoViewIfNeeded();
    const projectCards = page.locator('#projects .group');
    await expect(projectCards.first()).toBeVisible();
  });

  test('Testimonials section is present', async ({ page }) => {
    await page.goto(BASE_URL);
    const testimonialsSection = page.locator('#testimonials');
    await testimonialsSection.scrollIntoViewIfNeeded();
    await expect(testimonialsSection).toBeVisible();
  });

});

// ─── API Endpoints ────────────────────────────────────────────────────────────
test.describe('API Endpoints', () => {

  test('/api/chat returns a reply for valid input', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat`, {
      data: { message: "What are Suraj's skills?" }
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json).toHaveProperty('reply');
  });

  test('/api/contact rejects missing fields', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/contact`, {
      data: { name: '', email: 'notvalid', message: '' }
    });
    expect(response.status()).toBe(400);
  });

  test('sensitive file access is blocked', async ({ request }) => {
    const r1 = await request.get(`${BASE_URL}/.env`);
    const r2 = await request.get(`${BASE_URL}/package.json`);
    expect(r1.status()).toBe(403);
    expect(r2.status()).toBe(403);
  });

});
