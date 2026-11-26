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
  const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
  
  const files = ['story-backend', 'story-application', 'story-automation'];
  for (const f of files) {
    const svgUrl = pathToFileURL(path.resolve(`assets/portfolio/${f}.svg`)).href;
    await page.goto(svgUrl);
    await page.screenshot({ path: path.resolve(`assets/portfolio/${f}.png`), clip: { x: 0, y: 0, width: 900, height: 600 } });
    console.log(`Rendered ${f}.png`);
  }
  await browser.close();
}
render();
