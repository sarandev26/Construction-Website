// src/utils/frameLoader.ts
// High-performance concurrency-limited frame loader with createImageBitmap,
// 2-pass progressive loading (coarse scrub pass + fine fill), priority distance sorting,
// 2-section memory budget with bitmap closing, and fast-scroll throttling.

export interface NearestFrameResult {
  frame: ImageBitmap;
  index: number;
}

export interface SectionManifest {
  count: number;
  width: number;
  height: number;
}

interface SectionCache {
  sectionNumber: number;
  folderPath: string; // e.g. "/frames/section1" or "/frames/living-room"
  subFolder: 'desktop' | 'mobile';
  frameCount: number;
  frames: (ImageBitmap | null)[];
  loadedSet: Set<number>;
  queue: number[];
  inFlight: Set<number>;
  isCoarseLoaded: boolean;
  coarseResolvers: (() => void)[];
  onFrameLoaded?: (index: number) => void;
  lastTargetIndex: number;
  lastAccessTime: number;
  isStarted: boolean;
  isInMemory: boolean;
  posterLoaded: boolean;
  posterUrl: string;
}

class ProgressiveFrameLoader {
  private cache = new Map<number, SectionCache>();
  private readonly maxConcurrent = 6;
  private totalInFlight = 0;
  private isFastScrolling = false;
  private scrollIdleTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly memoryBudgetLimit = 2; // at most 2 sections in memory simultaneously
  private isMobileMode: boolean;
  private subscribers = new Map<number, Set<(frameIndex: number) => void>>();

  constructor() {
    this.isMobileMode = this.detectMobileMode();
    if (typeof window !== 'undefined') {
      const updateMobile = () => {
        const next = this.detectMobileMode();
        if (next !== this.isMobileMode) {
          this.isMobileMode = next;
          // Subfolder preference update handled per section
        }
      };
      window.addEventListener('resize', updateMobile, { passive: true });
    }
  }

  private detectMobileMode(): boolean {
    if (typeof window === 'undefined') return false;
    const narrow = window.innerWidth < 768;
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return narrow || coarse;
  }

  public isMobile(): boolean {
    return this.isMobileMode;
  }

  public getSubfolder(): 'desktop' | 'mobile' {
    return this.isMobileMode ? 'mobile' : 'desktop';
  }

  public getPosterUrl(folderPath: string): string {
    const clean = folderPath.replace(/\/$/, '');
    return `${clean}/poster.webp`;
  }

  public subscribe(sectionNumber: number, callback: (frameIndex: number) => void): () => void {
    if (!this.subscribers.has(sectionNumber)) {
      this.subscribers.set(sectionNumber, new Set());
    }
    const set = this.subscribers.get(sectionNumber)!;
    set.add(callback);

    // If frames are already loaded, notify the subscriber on next microtask
    if (this.getLoadedCount(sectionNumber) > 0) {
      queueMicrotask(() => {
        if (set.has(callback)) {
          callback(1);
        }
      });
    }

    return () => {
      set.delete(callback);
    };
  }

  private notifySubscribers(sectionNumber: number, index: number) {
    const set = this.subscribers.get(sectionNumber);
    if (set && set.size > 0) {
      set.forEach((cb) => {
        try {
          cb(index);
        } catch (e) {
          console.error('Frame callback error:', e);
        }
      });
    }
  }

  public notifySplashComplete() {
    this.cache.forEach((sec, num) => {
      if (sec.loadedSet.size > 0) {
        this.notifySubscribers(num, 1);
      }
    });
  }

  public registerSection(
    sectionNumber: number,
    folderPath: string,
    _defaultCount: number,
    onFrameLoaded?: (index: number) => void
  ) {
    const subFolder = this.getSubfolder();
    // Default count: mobile manifest is 48, desktop manifest is 96
    const count = subFolder === 'mobile' ? 48 : 96;

    let sec = this.cache.get(sectionNumber);
    if (!sec) {
      sec = {
        sectionNumber,
        folderPath: folderPath.replace(/\/$/, ''),
        subFolder,
        frameCount: count,
        frames: new Array(count + 1).fill(null),
        loadedSet: new Set<number>(),
        queue: [],
        inFlight: new Set<number>(),
        isCoarseLoaded: false,
        coarseResolvers: [],
        onFrameLoaded,
        lastTargetIndex: 1,
        lastAccessTime: Date.now(),
        isStarted: false,
        isInMemory: true,
        posterLoaded: false,
        posterUrl: this.getPosterUrl(folderPath),
      };
      this.cache.set(sectionNumber, sec);
    } else {
      if (onFrameLoaded) {
        sec.onFrameLoaded = onFrameLoaded;
      }
      sec.folderPath = folderPath.replace(/\/$/, '');
      sec.posterUrl = this.getPosterUrl(folderPath);
      if (sec.loadedSet.size > 0 && onFrameLoaded) {
        setTimeout(() => onFrameLoaded(1), 0);
      }
    }
  }

  // Preload a section's poster image
  public preloadPoster(sectionNumber: number): Promise<boolean> {
    const sec = this.cache.get(sectionNumber);
    if (!sec) return Promise.resolve(false);
    if (sec.posterLoaded) return Promise.resolve(true);

    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        sec.posterLoaded = true;
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = sec.posterUrl;
    });
  }

  // Memory budget manager: keep at most 2 sections in memory
  private enforceMemoryBudget(currentSectionNumber: number) {
    const inMemorySections = Array.from(this.cache.values())
      .filter((s) => s.isInMemory && s.loadedSet.size > 0 && s.sectionNumber !== currentSectionNumber)
      .sort((a, b) => a.lastAccessTime - b.lastAccessTime); // oldest first

    // If we have >= memoryBudgetLimit sections loaded other than current
    while (inMemorySections.length >= this.memoryBudgetLimit) {
      const victim = inMemorySections.shift();
      if (!victim) break;

      // Close all ImageBitmaps to immediately free GPU memory
      for (let i = 0; i < victim.frames.length; i++) {
        const bm = victim.frames[i];
        if (bm) {
          try {
            bm.close();
          } catch {}
          victim.frames[i] = null;
        }
      }
      victim.loadedSet.clear();
      victim.queue = [];
      victim.isCoarseLoaded = false;
      victim.isInMemory = false;
      victim.isStarted = false;
    }
  }

  // Start section loading: Pass 1 (coarse) then Pass 2 (fine)
  public loadSection(sectionNumber: number) {
    const sec = this.cache.get(sectionNumber);
    if (!sec) return;

    sec.lastAccessTime = Date.now();
    this.enforceMemoryBudget(sectionNumber);
    sec.isInMemory = true;

    if (sec.isStarted && sec.loadedSet.size > 0) return;
    sec.isStarted = true;

    // Pass 1: Coarse set (every 6th frame: 1, 7, 13, 19, ... and last frame)
    const coarse: number[] = [];
    for (let i = 1; i <= sec.frameCount; i += 6) {
      coarse.push(i);
    }
    if (!coarse.includes(sec.frameCount)) {
      coarse.push(sec.frameCount);
    }

    // Pass 2: Fine set (all other frames)
    const coarseSet = new Set(coarse);
    const fine: number[] = [];
    for (let i = 1; i <= sec.frameCount; i++) {
      if (!coarseSet.has(i)) {
        fine.push(i);
      }
    }

    // Sort fine by distance from initial target
    const target = sec.lastTargetIndex || 1;
    fine.sort((a, b) => Math.abs(a - target) - Math.abs(b - target));

    sec.queue = [...coarse, ...fine];
    this.pumpQueue();
  }

  // Preload next section's coarse pass only
  public preloadNextCoarse(nextSectionNumber: number) {
    const sec = this.cache.get(nextSectionNumber);
    if (!sec) return;
    if (sec.isStarted && sec.loadedSet.size > 0) return;

    sec.lastAccessTime = Date.now();
    this.enforceMemoryBudget(nextSectionNumber);
    sec.isInMemory = true;
    sec.isStarted = true;

    // Load coarse pass only
    const coarse: number[] = [];
    for (let i = 1; i <= sec.frameCount; i += 6) {
      coarse.push(i);
    }
    if (!coarse.includes(sec.frameCount)) {
      coarse.push(sec.frameCount);
    }
    sec.queue = coarse;
    this.pumpQueue();
  }

  // Preload all sections coarse passes in background after splash
  public preloadAllCoarse() {
    for (let s = 1; s <= 6; s++) {
      this.preloadNextCoarse(s);
    }
  }

  // Prioritize frames near the target index during scroll/scrub
  public prioritizeFrame(sectionNumber: number, targetIndex: number) {
    const sec = this.cache.get(sectionNumber);
    if (!sec) return;

    if (sec.lastTargetIndex === targetIndex && sec.isStarted && sec.loadedSet.size > 0) return;
    sec.lastAccessTime = Date.now();
    sec.lastTargetIndex = targetIndex;

    if (!sec.isStarted || !sec.isInMemory || sec.loadedSet.size === 0) {
      this.loadSection(sectionNumber);
      return;
    }

    // Sort pending queue by distance to current target index
    sec.queue.sort((a, b) => Math.abs(a - targetIndex) - Math.abs(b - targetIndex));
    this.pumpQueue();
  }

  // Notify of fast scrolling: pauses non-immediate background loading
  public notifyScrollActivity(isFast: boolean) {
    this.isFastScrolling = isFast;

    if (this.scrollIdleTimer) {
      clearTimeout(this.scrollIdleTimer);
      this.scrollIdleTimer = null;
    }

    if (isFast) {
      // Resume on idle
      const onIdle = () => {
        this.isFastScrolling = false;
        this.pumpQueue();
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        this.scrollIdleTimer = setTimeout(() => {
          (window as any).requestIdleCallback(onIdle, { timeout: 300 });
        }, 150);
      } else {
        this.scrollIdleTimer = setTimeout(onIdle, 150);
      }
    } else {
      this.pumpQueue();
    }
  }

  // Queue pump with concurrency limit of 6
  private pumpQueue() {
    if (this.totalInFlight >= this.maxConcurrent) return;

    // Find section with highest priority (most recently accessed)
    const activeSections = Array.from(this.cache.values())
      .filter((s) => s.isInMemory && s.queue.length > 0)
      .sort((a, b) => b.lastAccessTime - a.lastAccessTime);

    for (const sec of activeSections) {
      while (this.totalInFlight < this.maxConcurrent && sec.queue.length > 0) {
        // If actively fast scrolling, only load frames within distance 2 of target
        if (this.isFastScrolling) {
          const nearIdx = sec.queue.findIndex(
            (idx) => Math.abs(idx - sec.lastTargetIndex) <= 2
          );
          if (nearIdx === -1) {
            // No critical near-frame found; wait for idle
            break;
          }
          const nextIndex = sec.queue.splice(nearIdx, 1)[0];
          this.dispatchFetch(sec, nextIndex);
        } else {
          const nextIndex = sec.queue.shift();
          if (nextIndex !== undefined) {
            this.dispatchFetch(sec, nextIndex);
          }
        }
      }
      if (this.totalInFlight >= this.maxConcurrent) break;
    }
  }

  private dispatchFetch(sec: SectionCache, index: number) {
    if (sec.loadedSet.has(index) || sec.inFlight.has(index)) {
      return;
    }

    sec.inFlight.add(index);
    this.totalInFlight++;

    const padded = String(index).padStart(4, '0');
    const url = `${sec.folderPath}/${sec.subFolder}/frame_${padded}.webp`;

    this.fetchBitmap(url)
      .then((bitmap) => {
        sec.inFlight.delete(index);
        this.totalInFlight--;

        if (bitmap && sec.isInMemory) {
          sec.frames[index] = bitmap;
          sec.loadedSet.add(index);
          sec.onFrameLoaded?.(index);
          this.notifySubscribers(sec.sectionNumber, index);

          // Check if coarse pass is complete (frame 1 and every 6th frame loaded)
          if (!sec.isCoarseLoaded) {
            let allCoarseLoaded = true;
            for (let c = 1; c <= sec.frameCount; c += 6) {
              if (!sec.loadedSet.has(c)) {
                allCoarseLoaded = false;
                break;
              }
            }
            if (allCoarseLoaded && sec.loadedSet.has(sec.frameCount)) {
              sec.isCoarseLoaded = true;
              sec.coarseResolvers.forEach((res) => res());
              sec.coarseResolvers = [];
            }
          }
        }
        this.pumpQueue();
      })
      .catch(() => {
        sec.inFlight.delete(index);
        this.totalInFlight--;
        this.pumpQueue();
      });
  }

  // Fetch + createImageBitmap: decodes off the main thread into GPU bitmap
  private async fetchBitmap(url: string): Promise<ImageBitmap | null> {
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) return null;
      const blob = await res.blob();
      if (typeof createImageBitmap === 'function') {
        return await createImageBitmap(blob);
      }
      // Fallback for environments lacking createImageBitmap
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img as any);
        img.onerror = () => resolve(null);
        img.src = URL.createObjectURL(blob);
      });
    } catch {
      return null;
    }
  }

  // Splash Screen Gating: waits for fonts, hero coarse pass, hero poster, and section 2 poster
  public waitForHeroGating(): Promise<void> {
    const p1 = this.preloadPoster(1);
    const p2 = this.preloadPoster(2);

    // Ensure hero section is loading
    this.loadSection(1);

    const coarsePromise = new Promise<void>((resolve) => {
      const sec1 = this.cache.get(1);
      if (!sec1 || sec1.isCoarseLoaded) {
        resolve();
        return;
      }
      sec1.coarseResolvers.push(resolve);
      // Hard timeout fallback at 3.5s so splash never hangs
      setTimeout(resolve, 3500);
    });

    return Promise.all([p1, p2, coarsePromise]).then(() => {});
  }

  // Nearest frame lookup
  public getNearestFrameWithIndex(
    sectionNumber: number,
    targetIndex: number
  ): NearestFrameResult | null {
    const sec = this.cache.get(sectionNumber);
    if (!sec || sec.loadedSet.size === 0) return null;

    if (sec.frames[targetIndex]) {
      return { frame: sec.frames[targetIndex]!, index: targetIndex };
    }

    let offset = 1;
    const maxOffset = sec.frameCount;
    while (offset < maxOffset) {
      const lower = targetIndex - offset;
      if (lower >= 1 && sec.frames[lower]) {
        return { frame: sec.frames[lower]!, index: lower };
      }
      const upper = targetIndex + offset;
      if (upper <= sec.frameCount && sec.frames[upper]) {
        return { frame: sec.frames[upper]!, index: upper };
      }
      offset++;
    }

    return null;
  }

  public getNearestFrame(sectionNumber: number, targetIndex: number): ImageBitmap | null {
    const res = this.getNearestFrameWithIndex(sectionNumber, targetIndex);
    return res ? res.frame : null;
  }

  public getLoadedCount(sectionNumber: number): number {
    return this.cache.get(sectionNumber)?.loadedSet.size || 0;
  }

  public isFrameLoaded(sectionNumber: number, index: number): boolean {
    return this.cache.get(sectionNumber)?.loadedSet.has(index) || false;
  }

  public getFrameCount(sectionNumber: number): number {
    return this.cache.get(sectionNumber)?.frameCount || (this.isMobileMode ? 48 : 96);
  }
}

export const frameLoader = new ProgressiveFrameLoader();
if (typeof window !== 'undefined') {
  (window as any).__frameLoader = frameLoader;
}
