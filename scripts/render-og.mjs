import { chromium } from 'playwright';
import path from 'path';
import { pathToFileURL } from 'url';

async function render() {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const svgUrl = pathToFileURL(path.resolve('assets/og-preview.svg')).href;
  await page.goto(svgUrl);
  await page.screenshot({ path: path.resolve('assets/og-preview.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  console.log('Saved og-preview.png successfully');
}
render();
