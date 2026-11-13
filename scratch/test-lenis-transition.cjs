const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Wait for splash
  await new Promise(r => setTimeout(r, 4500));

  const outDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Test at:
  // 1. 2954 (Hero just finishing at 100%)
  // 2. 3376 (Halfway between Hero unpin and Living Room pin)
  // 3. 3798 (Living Room just reaching top top and pinning)
  const testScrolls = [2954, 3200, 3400, 3600, 3798];

  for (const targetY of testScrolls) {
    await page.evaluate((y) => {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    }, targetY);

    await new Promise(r => setTimeout(r, 300));

    const info = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const living = document.getElementById('living-room');
      const hSticky = hero.querySelector('.w-full.h-\\[100svh\\]');
      const lSticky = living.querySelector('.w-full.h-\\[100svh\\]');
      const lCanvas = living.querySelector('canvas');
      const lImg = living.querySelector('img');
      const lCtx = lCanvas.getContext('2d');

      const heroRect = hero.getBoundingClientRect();
      const hStickyRect = hSticky.getBoundingClientRect();
      const livingRect = living.getBoundingClientRect();
      const lStickyRect = lSticky.getBoundingClientRect();
      const lPixel = Array.from(lCtx.getImageData(100, 100, 1, 1).data);

      return {
        scrollY: window.scrollY,
        heroRect: { top: Math.round(heroRect.top), bottom: Math.round(heroRect.bottom) },
        hStickyRect: { top: Math.round(hStickyRect.top), bottom: Math.round(hStickyRect.bottom) },
        livingRect: { top: Math.round(livingRect.top), bottom: Math.round(livingRect.bottom) },
        lStickyRect: { top: Math.round(lStickyRect.top), bottom: Math.round(lStickyRect.bottom) },
        livingPixel: lPixel,
        livingImgNaturalW: lImg?.naturalWidth,
      };
    });

    console.log(`Scroll at ${targetY}:`, JSON.stringify(info, null, 2));
    await page.screenshot({ path: path.join(outDir, `transition-${targetY}.png`) });
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

