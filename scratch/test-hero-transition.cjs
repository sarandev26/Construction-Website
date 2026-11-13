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

  // Wait for splash screen to complete
  await new Promise(r => setTimeout(r, 4500));

  console.log('Splash completed.');

  // Find hero offset and height
  const heroInfo = await page.evaluate(() => {
    const hero = document.getElementById('hero');
    const living = document.getElementById('living-room');
    return {
      heroTop: hero.offsetTop,
      heroHeight: hero.offsetHeight,
      livingTop: living.offsetTop,
      livingHeight: living.offsetHeight,
      stHero: window.ScrollTrigger.getById ? window.ScrollTrigger.getById('hero') : null,
      triggers: window.ScrollTrigger.getAll().map(t => ({
        id: t.trigger?.id,
        start: t.start,
        end: t.end,
        pin: !!t.pin
      }))
    };
  });

  console.log('Hero & Living Room info:', JSON.stringify(heroInfo, null, 2));

  const outDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Check frames loaded in Section 1 and Section 2 right after splash
  const frameCounts1 = await page.evaluate(() => {
    return {
      sec1Loaded: window.__frameLoader?.getLoadedCount(1),
      sec2Loaded: window.__frameLoader?.getLoadedCount(2),
    };
  });
  console.log('Initial loaded frames:', frameCounts1);

  // Now simulate scrolling from Hero (end is heroHeight - 844 = 3798 - 844 = 2954)
  // Let's scroll in steps of 150px from 2500 to 4200 (passing through the transition into living-room)
  const transitionLogs = [];

  for (let y = 2600; y <= 4200; y += 150) {
    await page.evaluate((scrollY) => {
      window.scrollTo(0, scrollY);
    }, y);
    await new Promise(r => setTimeout(r, 60));

    const check = await page.evaluate((scrollY) => {
      const hero = document.getElementById('hero');
      const living = document.getElementById('living-room');
      const heroCanvas = hero.querySelector('canvas');
      const livingCanvas = living.querySelector('canvas');
      const livingImg = living.querySelector('img');
      const hCtx = heroCanvas.getContext('2d');
      const lCtx = livingCanvas.getContext('2d');

      const heroBottom = hero.getBoundingClientRect().bottom;
      const livingTop = living.getBoundingClientRect().top;
      const livingSticky = living.querySelector('.w-full.h-\\[100svh\\]');
      const livingStickyTop = livingSticky ? livingSticky.getBoundingClientRect().top : null;

      // Sample living room canvas pixel
      const lPixel = Array.from(lCtx.getImageData(100, 100, 1, 1).data);
      const hPixel = Array.from(hCtx.getImageData(100, 100, 1, 1).data);

      return {
        y: scrollY,
        windowScrollY: window.scrollY,
        heroBottom: Math.round(heroBottom),
        livingTop: Math.round(livingTop),
        livingStickyTop: Math.round(livingStickyTop),
        heroPixel: hPixel,
        livingPixel: lPixel,
        livingImgComplete: livingImg?.complete,
        livingImgNaturalW: livingImg?.naturalWidth,
      };
    }, y);

    transitionLogs.push(check);

    // Save screenshot around the transition
    if (y === 2950 || y === 3400 || y === 3800) {
      await page.screenshot({ path: path.join(outDir, `hero-to-living-${y}.png`) });
    }
  }

  console.log('Transition logs:', JSON.stringify(transitionLogs, null, 2));

  // Check section 2 loaded frames after scrolling into it
  const frameCounts2 = await page.evaluate(() => {
    return {
      sec1Loaded: window.__frameLoader?.getLoadedCount(1),
      sec2Loaded: window.__frameLoader?.getLoadedCount(2),
    };
  });
  console.log('Frames after scrolling to living-room:', frameCounts2);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

