import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:4173/';

async function audit() {
  console.log('--- STARTING INITIAL PRODUCTION AUDIT ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  // Mobile viewport: iPhone 12/13/14 (390x844)
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  let totalBytesBeforeSplash = 0;
  const requests = [];

  client.on('Network.dataReceived', (event) => {
    totalBytesBeforeSplash += event.dataLength;
  });

  await client.send('Network.enable');

  // Monitor long tasks and Web Vitals
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

  console.log('Navigating to http://localhost:4173/ ...');
  const navStart = Date.now();
  await page.goto(URL, { waitUntil: 'load', timeout: 30000 });

  // Wait for splash screen to complete (or time out after 5s)
  await page.waitForFunction(() => {
    return document.getElementById('initial-splash') === null &&
      (!document.querySelector('.splash-container') || window.getComputedStyle(document.querySelector('.splash-container')).visibility === 'hidden');
  }, { timeout: 10000 }).catch(() => {});

  const splashTime = Date.now() - navStart;
  const bytesAtSplash = totalBytesBeforeSplash;
  console.log(`Splash exit time: ${splashTime}ms`);
  console.log(`Transfer bytes before splash exit: ${(bytesAtSplash / (1024 * 1024)).toFixed(2)} MB (${bytesAtSplash} bytes)`);

  // Emulate mid-range mobile with 4x CPU slowdown for scroll audit
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  // Scroll through the page from top to bottom
  console.log('Measuring scroll performance with 4x CPU slowdown...');
  const scrollMetrics = await page.evaluate(async () => {
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

    // Scroll smoothly down the page
    const totalH = document.documentElement.scrollHeight - window.innerHeight;
    const step = 80;
    for (let pos = 0; pos <= totalH; pos += step) {
      if (window.__lenis) {
        window.__lenis.scrollTo(pos, { immediate: true });
      } else {
        window.scrollTo(0, pos);
      }
      await new Promise((r) => setTimeout(r, 16));
    }

    measuring = false;
    await new Promise((r) => setTimeout(r, 200));

    const avgFps = fpsSamples.length > 0
      ? fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length
      : 0;

    return {
      avgFps,
      fpsSamples,
      longTasks: window.__longTasks || [],
      cls: window.__cls || 0,
      lcp: window.__lcp || 0,
    };
  });

  console.log(`\n--- AUDIT RESULTS (BEFORE FIXES) ---`);
  console.log(`Transfer size before splash exit: ${(bytesAtSplash / (1024 * 1024)).toFixed(2)} MB (target < 2.5 MB)`);
  console.log(`LCP: ${(scrollMetrics.lcp / 1000).toFixed(2)} s (target < 2.5 s)`);
  console.log(`CLS: ${scrollMetrics.cls.toFixed(4)} (target < 0.05)`);
  console.log(`Long tasks (>50ms): ${scrollMetrics.longTasks.length} detected`);
  scrollMetrics.longTasks.forEach((t, i) => {
    console.log(`   Task ${i + 1}: ${t.duration.toFixed(1)}ms at ${t.startTime.toFixed(1)}ms`);
  });
  console.log(`Average Scroll FPS (4x CPU slowdown): ${scrollMetrics.avgFps.toFixed(1)} fps`);

  await browser.close();
}

audit().catch(console.error);
