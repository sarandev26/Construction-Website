const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop Test
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 800 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4500)); // wait for splash

  // Scroll to backyard section
  await page.evaluate(() => {
    const el = document.getElementById('backyard');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scratch/desktop-backyard-fixed.png' });

  // 2. Mobile Test
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4500)); // wait for splash

  await mobilePage.screenshot({ path: 'scratch/mobile-hero-fixed.png' });

  // Test opening mobile menu
  const menuBtn = await mobilePage.$('button[aria-label="Open mobile menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await mobilePage.screenshot({ path: 'scratch/mobile-menu-open.png' });
  }

  await browser.close();
  console.log('Puppeteer test finished successfully!');
})().catch(e => {
  console.error(e);
  process.exit(1);
});

