import React, { useLayoutEffect, useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { frameLoader } from '../utils/frameLoader';
import { type FocusPoint, type TextAnchor } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollVideoSectionProps {
  sectionId: string;
  sectionNumber: number;
  title: string;
  pinHeight?: string;
  mobilePinHeight?: string;
  frameCount?: number;
  folderPath: string;
  focusPoint?: FocusPoint;
  textAnchor?: TextAnchor;
  children: (props: {
    progress: number;
    currentFrame: number;
    totalFrames: number;
    hasRealFrames: boolean;
    isMobile: boolean;
  }) => React.ReactNode;
}

export const ScrollVideoSection: React.FC<ScrollVideoSectionProps> = ({
  sectionId,
  sectionNumber,
  title,
  pinHeight = '350vh',
  mobilePinHeight = '450vh',
  folderPath,
  focusPoint,
  textAnchor = 'bottom',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileProgressBarRef = useRef<HTMLDivElement>(null);
  const desktopProgressBarRef = useRef<HTMLDivElement>(null);
  const desktopProgressTextRef = useRef<HTMLSpanElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    }
    return false;
  });

  const posterUrl = frameLoader.getPosterUrl(folderPath);
  const totalFrames = frameLoader.getFrameCount(sectionNumber);

  // Discrete stage progress to prevent continuous React re-renders during scroll
  const [stageProgress, setStageProgress] = useState<number>(0);

  // Cached draw metrics computed exclusively on resize (never during scroll)
  const cachedDrawRectRef = useRef<{
    pixelW: number;
    pixelH: number;
    dx: number;
    dy: number;
    dw: number;
    dh: number;
    isMob: boolean;
  } | null>(null);

  // Performance refs
  const currentFrameRef = useRef<number>(1);
  const renderedActualFrameRef = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const pendingTargetFrameRef = useRef<number>(1);
  const nextPosterPreloadedRef = useRef<boolean>(false);
  const nextCoarsePreloadedRef = useRef<boolean>(false);
  const lastStageIndexRef = useRef<number>(0);

  // Compute and cache draw rectangle on resize
  const updateCachedDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMob = window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    setIsMobile(isMob);

    // DPR capped at 1.5 on mobile and 2 on desktop
    const dpr = Math.min(window.devicePixelRatio || 1, isMob ? 1.5 : 2);
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    const pixelW = Math.round(width * dpr);
    const pixelH = Math.round(height * dpr);

    const sizeChanged = canvas.width !== pixelW || canvas.height !== pixelH;
    if (sizeChanged) {
      canvas.width = pixelW;
      canvas.height = pixelH;
    }

    // Video source aspect ratio: 1280x720 (desktop) or 960x540 (mobile), both 16:9
    const frameW = isMob ? 960 : 1280;
    const frameH = isMob ? 540 : 720;

    // Full-screen COVER logic for all screen sizes: fills 100% of viewport width and height with zero letterboxing / pillarboxing
    const scale = Math.max(width / frameW, height / frameH);
    const drawW = frameW * scale;
    const drawH = frameH * scale;

    const fx = focusPoint?.x ?? 0.5;
    const fy = focusPoint?.y ?? 0.5;

    const offsetX = (width - drawW) * fx;
    const offsetY = (height - drawH) * fy;

    cachedDrawRectRef.current = {
      pixelW,
      pixelH,
      dx: Math.round(offsetX * dpr),
      dy: Math.round(offsetY * dpr),
      dw: Math.round(drawW * dpr),
      dh: Math.round(drawH * dpr),
      isMob,
    };

    if (sizeChanged) {
      const frameResult = frameLoader.getNearestFrameWithIndex(sectionNumber, currentFrameRef.current);
      if (frameResult) {
        renderedActualFrameRef.current = frameResult.index;
        ctx.drawImage(frameResult.frame, Math.round(offsetX * dpr), Math.round(offsetY * dpr), Math.round(drawW * dpr), Math.round(drawH * dpr));
      }
    }
  }, [focusPoint, sectionNumber]);

  // Canvas frame draw routine: draws off-thread ImageBitmap without clearing or placeholders
  const drawFrameNow = useCallback(
    (targetFrame: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (!cachedDrawRectRef.current) {
        updateCachedDimensions();
      }
      const metrics = cachedDrawRectRef.current;
      if (!metrics) return;

      const frameResult = frameLoader.getNearestFrameWithIndex(sectionNumber, targetFrame);

      if (frameResult) {
        renderedActualFrameRef.current = frameResult.index;
        const bitmap = frameResult.frame;

        // Draw off-thread decoded ImageBitmap directly to canvas in one blit covering full screen
        ctx.drawImage(bitmap, metrics.dx, metrics.dy, metrics.dw, metrics.dh);
      } else {
        // Fallback chain: do not clear the canvas to blank!
        // Keep the last rendered frame, or if none, the poster behind the canvas is already visible.
      }
    },
    [sectionNumber, updateCachedDimensions]
  );

  // High-performance rAF-throttled draw scheduler for scrolling
  const scheduleDraw = useCallback(
    (targetFrame: number) => {
      pendingTargetFrameRef.current = targetFrame;
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        drawFrameNow(pendingTargetFrameRef.current);
      });
    },
    [drawFrameNow]
  );

  // Register section with frameLoader and subscribe to frame arrival
  useEffect(() => {
    let mounted = true;

    frameLoader.registerSection(sectionNumber, folderPath, totalFrames);

    const unsubscribe = frameLoader.subscribe(sectionNumber, () => {
      if (!mounted) return;
      drawFrameNow(currentFrameRef.current);
    });

    // If frames are already ready, draw immediately
    drawFrameNow(currentFrameRef.current);

    return () => {
      mounted = false;
      unsubscribe();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [sectionNumber, folderPath, totalFrames, drawFrameNow]);

  // Window resize handler: recompute dimensions & redraw
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateCachedDimensions();
        scheduleDraw(currentFrameRef.current);
        ScrollTrigger.refresh();
      }, 100);
    };

    updateCachedDimensions();
    scheduleDraw(1);

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCachedDimensions, scheduleDraw]);

  // GSAP ScrollTrigger Setup
  useLayoutEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = frameLoader.getFrameCount(sectionNumber);

    const ctx = gsap.context(() => {
      // 1. Proximity loader: start loading section when within ~2 screens of viewport
      ScrollTrigger.create({
        trigger: container,
        start: 'top bottom+=1200px',
        onEnter: () => {
          frameLoader.loadSection(sectionNumber);
        },
        onEnterBack: () => {
          frameLoader.loadSection(sectionNumber);
        },
      });

      // 2. Main Pinning & Scrubbing Trigger
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        pin: sticky,
        pinSpacing: true,
        scrub: prefersReducedMotion ? false : 0.05,
        anticipatePin: 1,
        onEnter: () => {
          frameLoader.loadSection(sectionNumber);
        },
        onEnterBack: () => {
          frameLoader.loadSection(sectionNumber);
        },
        onUpdate: (self) => {
          frameLoader.loadSection(sectionNumber);
          const currentProgress = self.progress;
          progressRef.current = currentProgress;

          // Direct DOM style updates for progress bars (zero React re-renders)
          if (mobileProgressBarRef.current) {
            mobileProgressBarRef.current.style.width = `${currentProgress * 100}%`;
          }
          if (desktopProgressBarRef.current) {
            desktopProgressBarRef.current.style.height = `${currentProgress * 100}%`;
          }
          if (desktopProgressTextRef.current) {
            desktopProgressTextRef.current.textContent = `${Math.round(currentProgress * 100)}%`;
          }

          // Preload next section poster at ~40% scroll
          if (currentProgress >= 0.4 && !nextPosterPreloadedRef.current) {
            nextPosterPreloadedRef.current = true;
            frameLoader.preloadPoster(sectionNumber + 1);
          }

          // Preload next section coarse pass at 50% scroll
          if (currentProgress >= 0.5 && !nextCoarsePreloadedRef.current) {
            nextCoarsePreloadedRef.current = true;
            frameLoader.preloadNextCoarse(sectionNumber + 1);
          }

          // Fast scroll velocity detection
          const velocity = Math.abs(self.getVelocity());
          if (velocity > 1500) {
            frameLoader.notifyScrollActivity(true);
          }

          // Discrete stage updates to avoid re-rendering entire React tree on every scroll frame
          // Hero uses 4 stages (0.25 steps), Room sections use 3 stages (0.33 steps)
          const numStages = sectionNumber === 1 ? 4 : 3;
          const stageIndex = Math.min(numStages - 1, Math.floor(currentProgress * numStages));
          if (stageIndex !== lastStageIndexRef.current) {
            lastStageIndexRef.current = stageIndex;
            setStageProgress(currentProgress);
          }

          // Linear frame mapping from progress
          let effectiveProgress: number;
          if (currentProgress <= 0.02) {
            effectiveProgress = 0;
          } else if (currentProgress >= 0.98) {
            effectiveProgress = 1;
          } else {
            effectiveProgress = (currentProgress - 0.02) / (0.98 - 0.02);
          }

          const targetFrame = Math.min(
            count,
            Math.max(1, 1 + Math.round(effectiveProgress * (count - 1)))
          );

          if (targetFrame !== currentFrameRef.current || renderedActualFrameRef.current === 0) {
            currentFrameRef.current = targetFrame;
            frameLoader.prioritizeFrame(sectionNumber, targetFrame);
            scheduleDraw(targetFrame);
          }
        },
      });
    }, container);

    return () => {
      ctx.revert();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [sectionNumber, scheduleDraw]);

  return (
    <section
      id={sectionId}
      ref={containerRef}
      data-text-anchor={textAnchor}
      className="relative w-full bg-[#1B1D0F] text-cream select-none box-border"
      style={{ height: isMobile ? mobilePinHeight : pinHeight }}
      aria-label={title}
    >
      {/* Pinned Viewport - 100svh for mobile address bar resilience */}
      <div
        ref={stickyRef}
        className="w-full h-[100svh] min-h-[100dvh] overflow-hidden bg-[#1B1D0F] relative"
        style={{ willChange: 'transform' }}
      >
        {/* Real Poster Image Fallback Layer: exactly matches canvas cover logic */}
        <img
          src={posterUrl}
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full pointer-events-none block"
          style={{
            objectFit: 'cover',
            objectPosition: `${(focusPoint?.x ?? 0.5) * 100}% ${(focusPoint?.y ?? 0.5) * 100}%`,
            backgroundColor: '#1B1D0F',
          }}
        />

        {/* Full-Screen Video Canvas: receives ImageBitmap frames */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none z-10"
          style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
        />

        {/* Subtle mobile contrast tint (GPU composited) */}
        <div className="md:hidden absolute inset-0 bg-black/15 pointer-events-none z-10" />

        {/* Content Layer (Over canvas) */}
        <div data-text-anchor={textAnchor} className="video-text-container z-20">
          {children({
            progress: stageProgress,
            currentFrame: currentFrameRef.current,
            totalFrames,
            hasRealFrames: true,
            isMobile,
          })}
        </div>

        {/* Mobile Bottom Thin Horizontal Lime Progress Indicator */}
        <div className="md:hidden absolute bottom-[max(14px,env(safe-area-inset-bottom,14px))] left-5 right-5 z-30 pointer-events-none">
          <div className="w-full h-[2px] bg-cream/15 rounded-full overflow-hidden">
            <div
              ref={mobileProgressBarRef}
              className="h-full bg-lime"
              style={{ width: '0%' }}
            />
          </div>
          {sectionNumber === 1 && (
            <div className="text-[11px] font-mono text-lime/90 text-center pt-1.5 animate-pulse">
              Swipe up to explore ↑
            </div>
          )}
        </div>

        {/* Desktop Thin vertical lime progress line on right edge */}
        <div
          className="hidden md:flex flex-col items-center gap-2 absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-[10px] font-mono tracking-widest text-cream/40">
            0{sectionNumber}
          </span>
          <div className="w-[2px] h-32 bg-cream/15 rounded-full overflow-hidden relative">
            <div
              ref={desktopProgressBarRef}
              className="w-full bg-lime rounded-full"
              style={{ height: '0%' }}
            />
          </div>
          <span ref={desktopProgressTextRef} className="text-[11px] font-mono font-medium text-lime">
            0%
          </span>
        </div>
      </div>
    </section>
  );
};
