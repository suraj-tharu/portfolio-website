// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',

  // Run tests in parallel for speed
  fullyParallel: false,

  // Retry failed tests once (good for flaky CI environments)
  retries: 1,

  // Report to terminal + HTML report
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  use: {
    // Base URL so tests can use page.goto('/')
    baseURL: 'http://localhost:3000',

    // Record trace on first retry for debugging
    trace: 'on-first-retry',

    // Screenshots on failure only
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Automatically start the dev server before running tests
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 15000,
  },
});
