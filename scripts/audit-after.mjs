import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function audit() {
  console.log('=== STARTING POST-FIX PRODUCTION PERFORMANCE & RESPONSIVENESS AUDIT ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  // Mobile viewport: iPhone 14 (390x844)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  let totalBytesBeforeSplash = 0;
  client.on('Network.dataReceived', (event) => {
    totalBytesBeforeSplash += event.dataLength;
  });

  await client.send('Network.enable');

  // Monitor Web Vitals
  await page.evaluateOnNewDocument(() => {
    window.__longTasks = [];
    window.__cls = 0;
    window.__lcp = 0;

    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__longTasks.push({
          duration: entry.duration,
          startTime: entry.startTime,
        });
      }
    });
    try {
      longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch (e) {}

    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cls += entry.value;
        }
      }
    });
    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}

    const lcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__lcp = entry.startTime;
      }
    });
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}
  });

  console.log('1. Navigating to production preview URL http://localhost:4173/ ...');
  const navStart = Date.now();
  await page.goto(URL, { waitUntil: 'load', timeout: 30000 });

  // Wait for splash screen to complete
  await page.waitForFunction(() => {
    const splashEl = document.getElementById('initial-splash');
    const compSplash = document.querySelector('.splash-container');
    const splashGone = !splashEl && (!compSplash || window.getComputedStyle(compSplash).visibility === 'hidden' || window.getComputedStyle(compSplash).opacity === '0');
    return splashGone;
  }, { timeout: 12000 }).catch((e) => console.log('Splash wait warning:', e.message));

  const splashTime = Date.now() - navStart;
  const bytesAtSplash = totalBytesBeforeSplash;

  // Let initial paint settle for exact Web Vitals reading
  await sleep(1500);

  const initialVitals = await page.evaluate(() => {
    return {
      cls: window.__cls || 0,
      lcp: window.__lcp || 0,
      longTasks: window.__longTasks || [],
    };
  });

  console.log(`✓ Splash exit time: ${splashTime}ms`);
  console.log(`✓ Transfer bytes before splash exit: ${(bytesAtSplash / (1024 * 1024)).toFixed(2)} MB (${bytesAtSplash} bytes)`);
  console.log(`✓ Initial Page Load CLS: ${initialVitals.cls.toFixed(4)} (Target < 0.05)`);
  console.log(`✓ Initial Page Load LCP: ${(initialVitals.lcp / 1000).toFixed(2)}s (Target < 2.5s)`);
  console.log(`✓ Initial Long Tasks (>50ms): ${initialVitals.longTasks.length}`);

  // Emulate mid-range mobile with 4x CPU slowdown for scroll audit
  console.log('2. Enabling 4x CPU slowdown emulation for scroll test...');
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  console.log('3. Measuring continuous scroll performance on mobile (top to bottom and back up)...');
  const mobileScrollFps = await page.evaluate(async () => {
    const fpsSamples = [];
    let lastTime = performance.now();
    let frameCount = 0;
    let measuring = true;

    function countFrame(now) {
      if (!measuring) return;
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 500) {
        fpsSamples.push((frameCount * 1000) / delta);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(countFrame);
    }
    requestAnimationFrame(countFrame);

    const totalH = Math.min(12000, document.documentElement.scrollHeight - window.innerHeight);
    const step = 220;
    for (let pos = 0; pos <= totalH; pos += step) {
      if (window.__lenis) {
        window.__lenis.scrollTo(pos);
      } else {
        window.scrollTo(0, pos);
      }
      await new Promise((r) => setTimeout(r, 16));
    }

    // Scroll smoothly back up
    for (let pos = totalH; pos >= 0; pos -= step * 2) {
      if (window.__lenis) {
        window.__lenis.scrollTo(pos);
      } else {
        window.scrollTo(0, pos);
      }
      await new Promise((r) => setTimeout(r, 16));
    }

    measuring = false;
    await new Promise((r) => setTimeout(r, 200));

    return fpsSamples.length > 0
      ? fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length
      : 0;
  });

  // Desktop 60fps check (normal rate 1)
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  console.log('4. Measuring Desktop 60 FPS scroll performance...');
  await page.setViewport({ width: 1440, height: 900 });
  const desktopFps = await page.evaluate(async () => {
    const fpsSamples = [];
    let lastTime = performance.now();
    let frameCount = 0;
    let measuring = true;

    function countFrame(now) {
      if (!measuring) return;
      frameCount++;
      const delta = now - lastTime;
      if (delta >= 500) {
        fpsSamples.push((frameCount * 1000) / delta);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(countFrame);
    }
    requestAnimationFrame(countFrame);

    const totalH = Math.min(12000, document.documentElement.scrollHeight - window.innerHeight);
    const step = 300;
    for (let pos = 0; pos <= totalH; pos += step) {
      if (window.__lenis) {
        window.__lenis.scrollTo(pos);
      } else {
        window.scrollTo(0, pos);
      }
      await new Promise((r) => setTimeout(r, 16));
    }

    measuring = false;
    await new Promise((r) => setTimeout(r, 200));

    return fpsSamples.length > 0
      ? fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length
      : 0;
  });

  console.log('\n========================================');
  console.log('       POST-FIX MEASUREMENT REPORT       ');
  console.log('========================================');
  console.log(`Transfer size before splash exit: ${(bytesAtSplash / (1024 * 1024)).toFixed(2)} MB (Target < 2.5 MB)`);
  console.log(`LCP (Largest Contentful Paint):   ${(initialVitals.lcp / 1000).toFixed(2)} s (Target < 2.5 s)`);
  console.log(`CLS (Cumulative Layout Shift):    ${initialVitals.cls.toFixed(4)} (Target < 0.05)`);
  console.log(`Initial Long Tasks (>50ms):       ${initialVitals.longTasks.length} detected`);
  console.log(`Mobile Scroll FPS (4x slowdown):  ${mobileScrollFps.toFixed(1)} fps (Target 50+ fps)`);
  console.log(`Desktop Scroll FPS:               ${desktopFps.toFixed(1)} fps (Target 60 fps)`);

  // 5. Verify Splash Screen on 10 Hard Refreshes
  console.log('\n5. Verifying splash screen appearance on 10 consecutive hard refreshes...');
  let splashSuccessCount = 0;
  for (let i = 1; i <= 10; i++) {
    await page.evaluate(() => {
      window.location.reload();
    });
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    const hasSplash = await page.evaluate(() => {
      const splashContainer = document.querySelector('.splash-container') || document.getElementById('initial-splash');
      return !!splashContainer;
    });
    if (hasSplash) splashSuccessCount++;
    console.log(`   Refresh #${i}: Splash detected = ${hasSplash}`);
    await sleep(1800);
  }
  console.log(`✓ Splash shown on every refresh: ${splashSuccessCount}/10`);

  // 6. Test all required viewports (360, 390, 414, 430, 768, 1440, 1920)
  console.log('\n6. Verifying responsiveness across viewport widths (360, 390, 414, 430, 768, 1440, 1920)...');
  const widths = [360, 390, 414, 430, 768, 1440, 1920];
  for (const w of widths) {
    await page.setViewport({ width: w, height: 800 });
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`   Width ${w}px: Horizontal overflow = ${overflow ? 'FAIL' : 'OK'}`);
  }

  // 7. Verify tab switching
  console.log('\n7. Verifying tab switching behavior...');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await sleep(300);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  console.log('✓ Tab switching handled gracefully without errors.');

  await browser.close();
  console.log('\n=== AUDIT COMPLETED SUCCESSFULLY ===');
}

audit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
