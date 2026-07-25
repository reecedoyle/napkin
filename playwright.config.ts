import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Tests are independent: each Playwright test runs in its own browser
  // context with isolated localStorage, and the preview server is static,
  // so there is no shared state to serialize on. Run them in parallel —
  // ~60% of the suite is trivial "slide URL loads" checks that fan out
  // cleanly. CI gets a fixed worker count for reproducibility; locally we
  // use two-thirds of the cores. The suite is memory- rather than
  // CPU-bound (each Chromium context is cheap; the preview server is
  // static), so on a 12-core / 8 GB dev box '66%' (~8 workers, ~2 GB of
  // browser contexts) trims the ~2.5-min test phase without swapping.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 4 : '66%',
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
  // and incidental processes.
  //
  // CI always does a fresh `build && preview` so it never tests a stale
  // build. Locally, `reuseExistingServer: true` lets you skip the ~38s
  // rebuild on every run: start one persistent server once with
  //   npm run build && npm run preview -- --host 127.0.0.1 --port 4323
  // in a side terminal, then re-run `npm run test:e2e` as many times as
  // you like against it (rebuild manually when you change a slide). If no
  // server is running, Playwright falls back to building one for the run.
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4323',
    url: 'http://127.0.0.1:4323',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
