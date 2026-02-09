import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright testes de API
 * 
 */

export default defineConfig({
  testDir: './api/tests',
  testMatch: '**/*.spec.ts',
 
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report/api' }],
    ['json', { outputFile: 'test-results/api-results.json' }],
    ['junit', { outputFile: 'test-results/api-junit.xml' }],
    ['list'],
  ],
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    httpCredentials: undefined,
  },
 
  projects: [
    {
      name: 'api',
      use: {},
    },
  ],
});
