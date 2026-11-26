import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const screenDir = path.join(rootDir, 'audit', 'screens');

if (!fs.existsSync(screenDir)) {
  fs.mkdirSync(screenDir, { recursive: true });
}

const VIEWPORTS = [
  { width: 320, height: 568, name: '320' },
  { width: 360, height: 640, name: '360' },
  { width: 390, height: 844, name: '390' },
  { width: 430, height: 932, name: '430' },
  { width: 768, height: 1024, name: '768' },
  { width: 834, height: 1194, name: '834' },
  { width: 1024, height: 768, name: '1024' },
  { width: 1280, height: 800, name: '1280' },
  { width: 1440, height: 900, name: '1440' },
  { width: 1920, height: 1080, name: '1920' },
  { width: 2560, height: 1440, name: '2560' },
  { width: 844, height: 390, name: '844x390-landscape' },
];

const PAGES = [
  { route: '/', file: 'index.html', name: 'home' },
  { route: '/work', file: 'work', name: 'work' },
  { route: '/about-us', file: 'about-us', name: 'about' },
  { route: '/project/dependency-x-ray-pro', file: 'project/dependency-x-ray-pro.html', name: 'dependency-x-ray' },
  { route: '/project/signalzero-pro', file: 'project/signalzero-pro.html', name: 'signalzero' },
  { route: '/project/hackmate', file: 'project/hackmate.html', name: 'hackmate' },
  { route: '/project/learning-management-system', file: 'project/learning-management-system.html', name: 'lms' },
  { route: '/project/crm-application', file: 'project/crm-application.html', name: 'crm' },
];

async function runAudit() {
  console.log('Starting Playwright Responsive Audit...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (e1) {
    try {
      browser = await chromium.launch({ channel: 'msedge', headless: true });
    } catch (e2) {
      browser = await chromium.launch({ headless: true });
    }
  }
  const results = [];

  for (const p of PAGES) {
    const fileUrl = 'file://' + path.join(rootDir, p.file).replace(/\\/g, '/');
    console.log(`Auditing page: ${p.name} (${fileUrl})`);

    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      try {
        await page.goto(fileUrl, { waitUntil: 'load', timeout: 15000 });
        await page.waitForTimeout(500);

        // Measure metrics
        const metrics = await page.evaluate(() => {
          const scrollWidth = document.documentElement.scrollWidth;
          const innerWidth = window.innerWidth;
          const hasOverflow = scrollWidth > innerWidth;

          // Find overflow elements if any
          let overflowEls = [];
          if (hasOverflow) {
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > innerWidth + 1) {
                overflowEls.push({
                  tag: el.tagName,
                  className: (el.className || '').toString().slice(0, 50),
                  right: r.right,
                  width: r.width
                });
              }
            });
          }

          // Check typography
          let smallTextCount = 0;
          document.querySelectorAll('p, span, li, a').forEach(el => {
            const fs = parseFloat(window.getComputedStyle(el).fontSize);
            if (fs < 11 && el.textContent.trim().length > 0) smallTextCount++;
          });

          // Check 3D Canvas
          const canvas = document.getElementById('glcanvas');
          const canvasVisible = canvas ? window.getComputedStyle(canvas).display !== 'none' : false;

          return {
            scrollWidth,
            innerWidth,
            hasOverflow,
            overflowEls: overflowEls.slice(0, 5),
            smallTextCount,
            canvasPresent: !!canvas,
            canvasVisible
          };
        });

        // Screenshot
        const screenPath = path.join(screenDir, `${p.name}-${vp.name}.png`);
        await page.screenshot({ path: screenPath, fullPage: false });

        results.push({
          page: p.name,
          viewport: vp.name,
          width: vp.width,
          metrics,
          consoleErrors
        });

        if (metrics.hasOverflow) {
          console.warn(`[OVERFLOW] ${p.name} @ ${vp.name}px: scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`);
        }
      } catch (err) {
        console.error(`Error auditing ${p.name} at ${vp.name}:`, err.message);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();

  // Write audit summary
  fs.writeFileSync(path.join(rootDir, 'audit-results.json'), JSON.stringify(results, null, 2));
  console.log('Responsive Audit complete. Results saved to audit-results.json');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
