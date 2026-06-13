const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Core Page Tests', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Suraj Tharu Chaudhary/i);
  });
});

test.describe('API Endpoints', () => {
  test('/api/chat returns a reply for valid input', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/chat`, {
      data: { message: "What are Suraj's skills?" }
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json).toHaveProperty('reply');
  });

  test('sensitive file access is blocked', async ({ request }) => {
    const r1 = await request.get(`${BASE_URL}/.env`);
    const r2 = await request.get(`${BASE_URL}/package.json`);
    expect(r1.status()).toBe(403);
    expect(r2.status()).toBe(403);
  });
});
