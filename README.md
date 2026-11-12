# Monolith Constructions — Premium Architectural & Construction Website

A modern, editorial, scroll-animated brand experience built for **Monolith Constructions**, engineering luxury residences, custom villas, and landmark commercial spaces across South India.

---

## 🚀 Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS (custom design tokens)
- **Smooth Scrolling**: Lenis Smooth Scroll (`lenis`) with deliberate pacing (`duration: 1.4`, `wheelMultiplier: 0.6`)
- **Scroll Pinning & Sequences**: GSAP 3 + ScrollTrigger (`scrub: 1.8`, 8% end hold, and 0.08 damping frame lerp smoothing)
- **Frame Player**: Canvas 2D frame-sequence player with DPI scaling, aspect-ratio cover math, and architectural CAD blueprint fallback
- **Icons**: Lucide Icons & Custom Architectural SVGs (strictly single-icon per button/CTA)

---

## 🎨 Design System

| Token | Hex / Value | Role |
| :--- | :--- | :--- |
| `--lime` | `#E3F25B` | Primary brand accent: buttons, highlights, badges, active progress |
| `--olive` | `#1B1D0F` | Dark sections, dark cards, footer, CAD backgrounds |
| `--cream` | `#F2EFE6` | Light panels, editorial section backdrops |
| `--white` | `#FFFFFF` | Nav pill base, crisp page backgrounds |
| `--ink` | `#111111` | Headings & dark editorial text on light backdrops |
| `--muted` | `#8A8A80` | Body copy, metadata, secondary captions |

- **Typography**: `Urbanist` (500, 600) for headlines with tight leading (1.05) and negative tracking (-0.02em); `Inter` (400, 500) for body copy.
- **Radii**: 24px - 32px (`rounded-28` for cards), pill-shaped action buttons (`rounded-full`).
- **Card Hover Physics**: 6px upward lift (`-translate-y-1.5`), 45° corner arrow chip rotation (`group-hover:rotate-45`), 1.05x image zoom (`group-hover:scale-105`).

---

## 🎬 Scroll-Video Pinned Section Structure

The site features 7 distinct pinned scroll-video sections in sequential order:
1. **Section 1**: Hero: Blueprint to house (`/frames/section1/`)
2. **Section 2**: Living hall (`/frames/living-room/`)
3. **Section 3**: Modular kitchen (`/frames/kitchen/`)
4. **Section 4**: Master bedroom (`/frames/bedroom/`)
5. **Section 5**: Spa bathroom (`/frames/bathroom/`)
6. **Section 6**: Private backyard (`/frames/backyard/`)
7. **Section 7**: From empty plot to finished home (`/frames/build-process/`)

Each room section features:
- Pinned pacing: ~700vh on desktop, ~500vh on mobile (~6–7s continuous scroll).
- Canvas frame-sequence engine with lerp smoothing (0.08 damping) and 8% hold at the end.
- Bottom-left text layout (`absolute left-[6vw] bottom-[8vh] max-w-[520px]`) with soft dark gradient backdrop.
- 3 scroll stages (0–30%, 30–65%, 65–100%) with 0.8s ease transitions and spec tags on Stage 3.
- Thin vertical lime progress bar on right edge.
- If a frame folder is empty, the interactive architectural CAD blueprint automatically displays with the label `Video placeholder · [section name]`.

Followed immediately by:
8. **Section 8: Our promise** ("Built to last. Backed in writing." with 4 guarantee cards and dark olive consultation banner).

---

## ✂️ Watermark Delogo & Pristine Frame Extraction (No Crop, No Zoom)

Source MP4 videos in `/public/videos/` have a small watermark in the bottom-right corner. The extraction scripts do **NOT** crop or zoom; they preserve the full 16:9 frame, apply FFmpeg's `delogo` filter to seamlessly repair the watermark box from surrounding pixels, and output crisp 1280x720 WebP frames (quality 72, Lanczos downsampling).

### Configurable Parameters:
- `WIDTH_PCT=0.11`: Watermark box width (11% of video width)
- `HEIGHT_PCT=0.06`: Watermark box height (6% of video height)
- `MARGIN_R_PCT=0.005`: Margin from right edge (0.5% of width)
- `MARGIN_B_PCT=0.005`: Margin from bottom edge (0.5% of height)
- `FRAME_COUNT=120`: 120 evenly spaced frames per video
- `WEBP_QUALITY=72`: Optimal balance of visual clarity and file size (~40-80 KB/frame)

### Re-Extracting Frames for All Videos:
```bash
# Via Node.js (cross-platform):
node scripts/extract-frames.mjs

# With preview bounding box enabled (to tune delogo rectangle):
node scripts/extract-frames.mjs --preview

# Via Bash:
chmod +x scripts/extract-frames.sh
./scripts/extract-frames.sh

# With preview bounding box enabled:
./scripts/extract-frames.sh --preview
```

Frames are extracted into:
- `/public/frames/section1/` (Hero.mp4)
- `/public/frames/living-room/` (Hall.mp4)
- `/public/frames/kitchen/` (Kitchen.mp4)
- `/public/frames/bedroom/` (Bedroom.mp4)
- `/public/frames/bathroom/` (Bathroom.mp4)
- `/public/frames/backyard/` (Backyard.mp4)
- `/public/frames/build-process/` (BuildProcess.mp4 / interactive CAD blueprint engine)

---

## 📁 File Structure

```
construction-website/
├── public/
│   ├── favicon.svg              # Brand favicon
│   ├── images/                  # High-res WebP images (Indian demographics for leadership & clients)
│   ├── videos/                  # 6 source 4K/HD video files
│   └── frames/                  # Extracted WebP frame sequences
├── scripts/
│   ├── extract-frames.mjs       # Cross-platform Node frame extractor with watermark crop
│   └── extract-frames.sh        # Bash frame extractor using ffmpeg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Floating pill navbar
│   │   ├── ScrollProgressBar.tsx # Lime page progress line
│   │   ├── ScrollVideoSection.tsx# Canvas engine (lerp damping, 8% hold, CAD fallback)
│   │   ├── RoomVideoSection.tsx # Reusable room section with bottom-left 3-stage layout
│   │   ├── VideoSection1.tsx    # Blueprint to house Hero
│   │   ├── OurPromise.tsx       # 4 guarantee cards + dark consultation banner
│   │   ├── WhoWeAre.tsx         # Section: 3 cards (Olive, Lime, Photo)
│   │   ├── ServicesMarquee.tsx  # Infinite horizontal marquee
│   │   ├── Services.tsx         # 6 capability cards with zoom
│   │   ├── FeaturedProjects.tsx # 6 projects responsive grid with filters
│   │   ├── WhatMakesUsDifferent.tsx # Team collage + 2x3 points grid
│   │   ├── Leadership.tsx       # Indian leadership portraits (Meera Raghavan, Arvind Menon, Karthik Subramanian)
│   │   ├── Recognitions.tsx     # Award pills marquee
│   │   ├── Testimonials.tsx     # Client quotes + Indian family photo
│   │   ├── Journal.tsx          # 3 editorial insight articles
│   │   ├── FinalCta.tsx         # Dark skyline banner + contact form
│   │   ├── Footer.tsx           # Deep olive footer with Monolith branding
│   │   ├── QuoteModal.tsx       # Interactive quote consultation modal
│   │   └── VideoModal.tsx       # 4K Ultra HD video showcase player
│   ├── data/
│   │   └── content.ts           # Central single source of truth for all copy & config
│   ├── App.tsx                  # Main layout orchestrator + Lenis & GSAP ticker
│   ├── index.css                # Tailwind directives & CSS variables
│   └── main.tsx                 # React DOM root
├── index.html                   # SEO metadata, Open Graph & Google Fonts
├── tailwind.config.js           # Strict design system tokens & typography
├── package.json
└── README.md
```

---

## 🛠️ Development & Deployment

### Run Locally:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### Build for Production:
```bash
npm run build
```
Generates an optimized bundle in `dist/`.

### Deploy to Vercel:
Push to GitHub or run:
```bash
npx vercel
```
Vite outputs directly to `dist`, requiring zero custom configuration.
