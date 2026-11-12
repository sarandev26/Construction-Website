import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const VIDEOS_DIR = path.resolve('public/videos');
const FRAMES_DIR = path.resolve('public/frames');

// Specification:
// Desktop: 1280x720, WebP q=65, 96 frames
// Mobile: 960x540, WebP q=62, 48 frames
// Poster: 960x540, WebP q=70 (first frame)

const DESKTOP_CONFIG = {
  width: 1280,
  height: 720,
  quality: 65,
  count: 96,
  targetSizeMB: 3.0,
};

const MOBILE_CONFIG = {
  width: 960,
  height: 540,
  quality: 62,
  count: 48,
  targetSizeMB: 1.5,
};

const POSTER_CONFIG = {
  width: 960,
  height: 540,
  quality: 70,
};

const VIDEO_MAP = [
  { video: 'Hero.mp4', folder: 'section1', title: 'Hero (Blueprint to house)' },
  { video: 'Hall.mp4', folder: 'living-room', title: 'Living hall' },
  { video: 'Kitchen.mp4', folder: 'kitchen', title: 'Modular kitchen' },
  { video: 'Bedroom.mp4', folder: 'bedroom', title: 'Master bedroom' },
  { video: 'Bathroom.mp4', folder: 'bathroom', title: 'Spa bathroom' },
  { video: 'Backyard.mp4', folder: 'backyard', title: 'Private backyard' },
  { video: 'BuildProcess.mp4', folder: 'build-process', title: 'Empty plot to finished home' },
];

function getDirSize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  const files = fs.readdirSync(dirPath);
  let total = 0;
  for (const f of files) {
    if (f.endsWith('.webp')) {
      const stats = fs.statSync(path.join(dirPath, f));
      total += stats.size;
    }
  }
  return total;
}

function getVideoDuration(videoPath) {
  const probe = spawnSync(ffmpegPath, ['-i', videoPath], { encoding: 'utf8' });
  const stderr = probe.stderr || '';
  const durMatch = stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d+)/);
  if (durMatch) {
    const hours = parseFloat(durMatch[1]);
    const mins = parseFloat(durMatch[2]);
    const secs = parseFloat(durMatch[3]);
    return hours * 3600 + mins * 60 + secs;
  }
  return 6.0;
}

console.log('================================================================');
console.log('Monolith Constructions — Production Frame & Poster Extractor');
console.log(`Desktop Target: 1280x720, q=65, 96 frames (< 3.0 MB)`);
console.log(`Mobile Target: 960x540, q=62, 48 frames (< 1.5 MB)`);
console.log(`Poster: 960x540, q=70 (Frame 1)`);
console.log('================================================================\n');

const summary = [];

for (const item of VIDEO_MAP) {
  const videoPath = path.join(VIDEOS_DIR, item.video);
  const sectionDir = path.join(FRAMES_DIR, item.folder);

  if (!fs.existsSync(videoPath)) {
    console.log(`ℹ️ [${item.folder}] Video ${item.video} not present in ${VIDEOS_DIR}. Skipping.`);
    continue;
  }

  const duration = getVideoDuration(videoPath);
  console.log(`\n----------------------------------------------------------------`);
  console.log(`Processing: ${item.video} -> ${item.folder} (Duration: ${duration.toFixed(2)}s)`);
  console.log(`----------------------------------------------------------------`);

  const desktopDir = path.join(sectionDir, 'desktop');
  const mobileDir = path.join(sectionDir, 'mobile');

  fs.mkdirSync(desktopDir, { recursive: true });
  fs.mkdirSync(mobileDir, { recursive: true });

  // 1. Poster: first frame at 960x540, quality 70
  const posterPath = path.join(sectionDir, 'poster.webp');
  console.log(`  Extracting poster: 960x540 (q=${POSTER_CONFIG.quality})...`);
  spawnSync(ffmpegPath, [
    '-y',
    '-i', videoPath,
    '-vframes', '1',
    '-vf', `scale=${POSTER_CONFIG.width}:${POSTER_CONFIG.height}:flags=lanczos`,
    '-c:v', 'libwebp',
    '-quality', String(POSTER_CONFIG.quality),
    posterPath,
  ]);
  const posterSizeKB = (fs.statSync(posterPath).size / 1024).toFixed(1);
  console.log(`  ✓ Poster created: ${posterPath} (${posterSizeKB} KB)`);

  // 2. Desktop Set: 1280x720, quality 65, 96 frames
  console.log(`  Extracting desktop set: 1280x720 (q=${DESKTOP_CONFIG.quality}, ${DESKTOP_CONFIG.count} frames)...`);
  // Clean existing frames in desktop
  fs.readdirSync(desktopDir).forEach(f => {
    if (f.endsWith('.webp')) fs.unlinkSync(path.join(desktopDir, f));
  });

  const desktopFps = DESKTOP_CONFIG.count / duration;
  spawnSync(ffmpegPath, [
    '-y',
    '-i', videoPath,
    '-vf', `fps=${desktopFps},scale=${DESKTOP_CONFIG.width}:${DESKTOP_CONFIG.height}:flags=lanczos`,
    '-vframes', String(DESKTOP_CONFIG.count),
    '-c:v', 'libwebp',
    '-quality', String(DESKTOP_CONFIG.quality),
    path.join(desktopDir, 'frame_%04d.webp'),
  ]);

  const desktopManifest = {
    count: DESKTOP_CONFIG.count,
    width: DESKTOP_CONFIG.width,
    height: DESKTOP_CONFIG.height,
  };
  fs.writeFileSync(path.join(desktopDir, 'manifest.json'), JSON.stringify(desktopManifest, null, 2));
  const desktopSizeBytes = getDirSize(desktopDir);
  const desktopSizeMB = (desktopSizeBytes / (1024 * 1024)).toFixed(2);
  const desktopPass = desktopSizeBytes <= DESKTOP_CONFIG.targetSizeMB * 1024 * 1024;
  console.log(`  ✓ Desktop set: ${desktopSizeMB} MB [Target < ${DESKTOP_CONFIG.targetSizeMB} MB] ${desktopPass ? '✅ PASS' : '⚠️ OVER'}`);

  // 3. Mobile Set: 960x540, quality 62, 48 frames
  console.log(`  Extracting mobile set: 960x540 (q=${MOBILE_CONFIG.quality}, ${MOBILE_CONFIG.count} frames)...`);
  fs.readdirSync(mobileDir).forEach(f => {
    if (f.endsWith('.webp')) fs.unlinkSync(path.join(mobileDir, f));
  });

  const mobileFps = MOBILE_CONFIG.count / duration;
  spawnSync(ffmpegPath, [
    '-y',
    '-i', videoPath,
    '-vf', `fps=${mobileFps},scale=${MOBILE_CONFIG.width}:${MOBILE_CONFIG.height}:flags=lanczos`,
    '-vframes', String(MOBILE_CONFIG.count),
    '-c:v', 'libwebp',
    '-quality', String(MOBILE_CONFIG.quality),
    path.join(mobileDir, 'frame_%04d.webp'),
  ]);

  const mobileManifest = {
    count: MOBILE_CONFIG.count,
    width: MOBILE_CONFIG.width,
    height: MOBILE_CONFIG.height,
  };
  fs.writeFileSync(path.join(mobileDir, 'manifest.json'), JSON.stringify(mobileManifest, null, 2));
  const mobileSizeBytes = getDirSize(mobileDir);
  const mobileSizeMB = (mobileSizeBytes / (1024 * 1024)).toFixed(2);
  const mobilePass = mobileSizeBytes <= MOBILE_CONFIG.targetSizeMB * 1024 * 1024;
  console.log(`  ✓ Mobile set: ${mobileSizeMB} MB [Target < ${MOBILE_CONFIG.targetSizeMB} MB] ${mobilePass ? '✅ PASS' : '⚠️ OVER'}`);

  summary.push({
    folder: item.folder,
    video: item.video,
    posterKB: posterSizeKB,
    desktopMB: desktopSizeMB,
    desktopPass,
    mobileMB: mobileSizeMB,
    mobilePass,
  });
}

console.log('\n================================================================');
console.log('FRAME EXTRACTION SUMMARY');
console.log('================================================================');
console.table(summary);
console.log('All manifests written successfully.\n');
