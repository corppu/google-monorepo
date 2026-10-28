import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3190);

export default defineConfig({
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  testDir: './src',
  use: {
    baseURL: `http://localhost:${PORT}`,
    // The app sends a strict CSP that would block axe-core's injected script.
    bypassCSP: true,
    colorScheme: 'light',
    deviceScaleFactor: 1,
    viewport: { height: 900, width: 1280 },
  },
  webServer: {
    command: 'npm start --workspace=app-express',
    cwd: '..',
    env: {
      GOOGLE_CLIENT_ID: 'e2e',
      GOOGLE_CLIENT_SECRET: 'e2e',
      PORT: String(PORT),
      TOKEN_ENCRYPTION_KEY: 'e2e-only-key',
    },
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    url: `http://localhost:${PORT}/spa/google?mock=true`,
  },
  workers: 1,
});
