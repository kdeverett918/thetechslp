import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
const captureUrl = process.argv[2] || process.env.OG_CAPTURE_URL || 'http://127.0.0.1:4178/';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2, // 2x for crisp rendering
});

await page.goto(captureUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);

await page.screenshot({
  path: outputPath,
  type: 'png',
});

console.log(`OG image saved from ${captureUrl} to ${outputPath}`);
await browser.close();
