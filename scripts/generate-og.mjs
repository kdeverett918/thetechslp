import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'og-image.html');
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2, // 2x for crisp rendering
});

await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`);
// Wait for fonts to load
await page.waitForTimeout(2000);

await page.screenshot({
  path: outputPath,
  type: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

console.log(`OG image saved to ${outputPath}`);
await browser.close();
