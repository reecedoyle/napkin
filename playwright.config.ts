import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? 'list' : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4323',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Dedicated port (4323) for tests, leaving 4321/4322 free for `npm run dev`
  // and incidental processes. `reuseExistingServer: false` means a fresh
  // build + preview every time — costs ~3s, buys us confidence that we're
  // never running against an old build.
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4323',
    url: 'http://127.0.0.1:4323',
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
