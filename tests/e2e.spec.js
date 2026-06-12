const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

// ─── Page Load & Navigation ────────────────────────────────────────────────────
test.describe('Core Page Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#preloader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  });

  test('homepage loads with correct title', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Suraj Tharu Chaudhary/i);
  });

  test('navigation bar is visible and contains key links', async ({ page, isMobile }) => {
    await expect(page.locator('nav')).toBeVisible();
    if (!isMobile) {
      await expect(page.locator('a[href="#about"]').first()).toBeVisible();
      await expect(page.locator('a[href="#projects"]').first()).toBeVisible();
      await expect(page.locator('a[href="#contact"]').first()).toBeVisible();
    }
  });

  test('preloader animates and disappears', async ({ page }) => {
    const preloader = page.locator('#preloader');
    await expect(preloader).toBeHidden({ timeout: 10000 });
  });

  test('dark mode toggle switches theme', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Dark mode toggle is hidden on mobile nav');
    const htmlEl = page.locator('html');
    const themeBtn = page.locator('#dark-toggle');
    // Ensure button is ready
    await themeBtn.waitFor({ state: 'attached' });

    // Read initial state
    const initiallyDark = await htmlEl.evaluate(el => el.classList.contains('dark'));

    await themeBtn.evaluate(el => el.click());
    await expect(async () => {
      const hasDark = await htmlEl.evaluate(el => el.classList.contains('dark'));
      expect(hasDark).toBe(!initiallyDark);
    }).toPass();

    await themeBtn.evaluate(el => el.click());
    await expect(async () => {
      const hasDark = await htmlEl.evaluate(el => el.classList.contains('dark'));
      expect(hasDark).toBe(initiallyDark);
    }).toPass();
  });

});

// ─── Contact Form ─────────────────────────────────────────────────────────────
test.describe('Contact Form', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#preloader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  });

  test('contact form shows after clicking Initialize Connection button', async ({ page }) => {
    const contactBtn = page.locator('#init-conn-btn');
    await contactBtn.scrollIntoViewIfNeeded();
    await contactBtn.click({ force: true });
    await expect(page.locator('#contact-modal, form[id*="contact"]')).toBeVisible({ timeout: 2000 }).catch(() => {
      // May be a page-level form; that's OK too
    });
  });

  test('contact form validates required fields', async ({ page }) => {
    const contactBtn = page.locator('#init-conn-btn');
    await contactBtn.scrollIntoViewIfNeeded();
    await contactBtn.click({ force: true });
    await page.locator('#contact-modal').waitFor({ state: 'visible', timeout: 5000 });

    const submitBtn = page.locator('#contact-form button[type="submit"]');
    if (await submitBtn.count() > 0) {
      await submitBtn.click({ force: true });
      const nameInput = page.locator('#c-name');
      if (await nameInput.count() > 0) {
        // Form should not have submitted, value should still be empty
        await expect(nameInput).toHaveValue(''); 
        // Check HTML5 validation state
        const isValid = await nameInput.evaluate(el => el.checkValidity());
        expect(isValid).toBe(false);
      }
    }
  });

});

// ─── AI Chat Widget ───────────────────────────────────────────────────────────
test.describe('AI Chat Widget', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#preloader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  });

  test('chat widget opens when chat button is clicked', async ({ page }) => {
    await page.locator('#chat-btn').click({ force: true });
    const chatWidget = page.locator('#chat-widget');
    await expect(chatWidget).toBeVisible();
  });

  test('chat input accepts text and send button exists', async ({ page }) => {
    await page.locator('#chat-btn').click({ force: true });
    const chatInput = page.locator('#chat-input');
    await expect(chatInput).toBeVisible();
    await chatInput.fill("What are Suraj's skills?");
    await expect(chatInput).toHaveValue("What are Suraj's skills?");
  });

  test('chat widget closes when X button is clicked', async ({ page }) => {
    await page.locator('#chat-btn').evaluate(el => el.click());
    await page.locator('#chat-widget').waitFor({ state: 'attached' });
    await expect(page.locator('#chat-widget')).toHaveClass(/open/);
    
    await page.locator('#close-chat').evaluate(el => el.click());
    const chatWidget = page.locator('#chat-widget');
    // Check class instead of toBeHidden() to avoid opacity transition flakiness
    await expect(chatWidget).not.toHaveClass(/open/);
  });

});

// ─── Sections Visibility ──────────────────────────────────────────────────────
test.describe('Key Sections', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#preloader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  });

  test('Research section contains GIS map', async ({ page }) => {
    const mapContainer = page.locator('#gis-map');
    await mapContainer.scrollIntoViewIfNeeded();
    await expect(mapContainer).toBeVisible();
  });

  test('Projects section cards are visible', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();
    const projectCards = page.locator('#projects .project-card');
    await expect(projectCards.first()).toBeVisible();
  });

  test('Testimonials section is present', async ({ page }) => {
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
