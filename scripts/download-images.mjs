import fs from 'fs';
import path from 'path';

const images = [
  {
    name: 'about-building.webp',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'about-house.webp',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'services-1.webp',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'services-2.webp',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'services-3.webp',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'services-4.webp',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'services-5.webp',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'services-6.webp',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'projects-1.webp',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'projects-2.webp',
    url: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'projects-3.webp',
    url: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'projects-4.webp',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'projects-5.webp',
    url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'projects-6.webp',
    url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'team-collage.webp',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'leader-1.webp',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85&fm=webp',
  },
  {
    name: 'leader-2.webp',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85&fm=webp',
  },
  {
    name: 'leader-3.webp',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85&fm=webp',
  },
  {
    name: 'testimonial-family.webp',
    url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'journal-1.webp',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'journal-2.webp',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'journal-3.webp',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85&fm=webp',
  },
  {
    name: 'cta-bg.webp',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85&fm=webp',
  },
  {
    name: 'marquee-1.webp',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=85&fm=webp',
  },
  {
    name: 'marquee-2.webp',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=85&fm=webp',
  },
];

const destDir = path.resolve('public', 'images');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function downloadAll() {
  console.log(`Starting download of ${images.length} images...`);
  for (const item of images) {
    const destPath = path.join(destDir, item.name);
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(destPath, Buffer.from(buffer));
      console.log(`✓ Saved ${item.name} (${Math.round(buffer.byteLength / 1024)} KB)`);
    } catch (err) {
      console.error(`✗ Failed ${item.name}:`, err.message);
    }
  }
  console.log('All image downloads completed.');
}

downloadAll();

