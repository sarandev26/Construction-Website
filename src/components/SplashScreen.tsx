import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { COMPANY_NAME, siteContent } from '../data/content';
import { frameLoader } from '../utils/frameLoader';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const groundLineRef = useRef<SVGGElement>(null);
  const foundationRef = useRef<SVGGElement>(null);
  const floorSlabRef = useRef<SVGGElement>(null);
  const roofSlabRef = useRef<SVGGElement>(null);
  const sideWingRef = useRef<SVGGElement>(null);
  const timberPanelRef = useRef<SVGGElement>(null);
  const doorRef = useRef<SVGGElement>(null);
  const stepsRef = useRef<SVGGElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const limeBarRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    // Remove static HTML first paint layer once React has taken over
    const initEl = document.getElementById('initial-splash');
    if (initEl) {
      initEl.remove();
    }

    // Lock scrolling while splash is active
    document.body.style.overflow = 'hidden';

    let isCancelled = false;
    let animId: number;
    let pulseTween: gsap.core.Tween | null = null;
    let isExiting = false;
    let animCompleteTime = 0;
    const startTime = performance.now();
    const hardCapTime = 6000;
    let targetProgress = 0;
    let currentDisplayed = 0;
    let heroGatingReady = false;

    // Start gating loader: hero poster, hero coarse pass (Pass 1), and section 2 poster
    frameLoader.registerSection(1, siteContent.videoSection1.folderPath, siteContent.videoSection1.frameCount);
    if (siteContent.pinnedSections.length > 0) {
      frameLoader.registerSection(2, siteContent.pinnedSections[0].folder, siteContent.pinnedSections[0].frameCount);
    }
    frameLoader.waitForHeroGating().then(() => {
      heroGatingReady = true;
    });

    // ==========================================
    // Exit Handler
    // ==========================================
    const triggerExit = () => {
      if (isExiting) return;
      isExiting = true;

      if (pulseTween) pulseTween.kill();
      gsap.set('.win-glow', { opacity: 0.9, visibility: 'visible' });

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            setIsGone(true);
            document.body.style.overflow = '';
            onCompleteRef.current?.();
          },
        });
        return;
      }

      const exitTl = gsap.timeline({
        onComplete: () => {
          setIsGone(true);
          document.body.style.overflow = '';
          onCompleteRef.current?.();
        },
      });

      // Counter fades out (0.3s)
      exitTl.to(counterRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' });

      // Entire splash slides up off screen (translateY: -100%, 1.0s, power4.inOut)
      exitTl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 1.0,
          ease: 'power4.inOut',
        },
        '-=0.1'
      );
    };

    // ==========================================
    // Start Gate: Wait for fonts before revealing or animating anything
    // ==========================================
    const fontPromises: Promise<unknown>[] = [];
    if (typeof document !== 'undefined' && 'fonts' in document) {
      fontPromises.push(document.fonts.load('600 40px Urbanist'));
      fontPromises.push(document.fonts.load('400 16px Inter'));
      fontPromises.push(document.fonts.ready);
    }

    Promise.all(fontPromises)
      .catch(() => {})
      .then(() => {
        if (isCancelled || timelineRef.current) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Create GSAP context inside container to ensure clean scoping
        const ctx = gsap.context(() => {
          // Unhide visibility now that fonts are loaded, while keeping values at 0 for animation
          gsap.set(
            [
              groundLineRef.current,
              foundationRef.current,
              floorSlabRef.current,
              roofSlabRef.current,
              sideWingRef.current,
              timberPanelRef.current,
              doorRef.current,
              stepsRef.current,
              wordmarkRef.current,
              taglineRef.current,
              counterRef.current,
            ],
            { visibility: 'visible' }
          );
          gsap.set('.v-gf-wall, .v-uf-wall, .v-win-glass, .v-tree, .win-glow, .splash-part', {
            visibility: 'visible',
          });

          // Master Construction Timeline (3.4s)
          const tl = gsap.timeline({
            defaults: { ease: 'power2.out' },
            onComplete: () => {
              animCompleteTime = performance.now();
            },
          });
          timelineRef.current = tl;

          if (!prefersReducedMotion) {
            // 1. 0.0 - 0.4s: Ground line draws from center outward
            if (groundLineRef.current) {
              tl.fromTo(
                groundLineRef.current,
                { scaleX: 0, transformOrigin: 'center center', opacity: 1 },
                { scaleX: 1, duration: 0.4, ease: 'power2.out' },
                0
              );
            }

            // 2. 0.3 - 0.8s: Foundation slab grows in (scaleY from bottom)
            if (foundationRef.current) {
              tl.fromTo(
                foundationRef.current,
                { scaleY: 0, transformOrigin: 'center bottom', opacity: 1 },
                { scaleY: 1, duration: 0.5, ease: 'power2.out' },
                0.3
              );
            }

            // 3. 0.7 - 1.3s: Ground-floor walls rise from foundation, then floor slab slides in
            tl.fromTo(
              '.v-gf-wall',
              { scaleY: 0, transformOrigin: 'center bottom', opacity: 1 },
              { scaleY: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
              0.7
            );
            if (floorSlabRef.current) {
              tl.fromTo(
                floorSlabRef.current,
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
                1.0
              );
            }

            // 4. 1.2 - 1.8s: Upper-floor walls rise, then roof slab slides in
            tl.fromTo(
              '.v-uf-wall',
              { scaleY: 0, transformOrigin: 'center bottom', opacity: 1 },
              { scaleY: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
              1.2
            );
            if (roofSlabRef.current) {
              tl.fromTo(
                roofSlabRef.current,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
                1.5
              );
            }

            // 5. 1.7 - 2.2s: Side wing builds up, timber panel wipes in from left
            if (sideWingRef.current) {
              tl.fromTo(
                sideWingRef.current,
                { scaleY: 0, transformOrigin: 'center bottom', opacity: 1 },
                { scaleY: 1, duration: 0.45, ease: 'power2.out' },
                1.7
              );
            }
            if (timberPanelRef.current) {
              tl.fromTo(
                timberPanelRef.current,
                { scaleX: 0, transformOrigin: 'left center', opacity: 1 },
                { scaleX: 1, duration: 0.45, ease: 'power2.out' },
                1.9
              );
            }

            // 6. 2.1 - 2.7s: Window glass panels fade in, then door and steps
            tl.fromTo(
              '.v-win-glass',
              { opacity: 0 },
              { opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
              2.1
            );
            if (doorRef.current && stepsRef.current) {
              tl.fromTo(
                [doorRef.current, stepsRef.current],
                { opacity: 0, y: 6 },
                { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
                2.45
              );
            }

            // 7. 2.6 - 3.1s: Trees grow in (scale from base)
            tl.fromTo(
              '.v-tree',
              { scale: 0, transformOrigin: 'center bottom', opacity: 1 },
              { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)' },
              2.6
            );

            // 8. 3.0 - 3.4s: Windows switch on with lime light & soft inner glow
            tl.fromTo(
              '.win-glow',
              { opacity: 0 },
              { opacity: 0.9, duration: 0.35, stagger: 0.05, ease: 'power2.out' },
              3.0
            );

            // Parallel: Wordmark and tagline reveal in final font and final size
            if (wordmarkRef.current) {
              tl.fromTo(
                wordmarkRef.current,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                1.4
              );
            }
            if (taglineRef.current) {
              tl.fromTo(
                taglineRef.current,
                { opacity: 0, y: 12 },
                { opacity: 0.65, y: 0, duration: 0.6, ease: 'power2.out' },
                1.6
              );
            }
            if (counterRef.current) {
              tl.fromTo(
                counterRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' },
                1.6
              );
            }
          } else {
            // Reduced motion: instantaneous static display
            animCompleteTime = performance.now();
            gsap.set(
              [
                groundLineRef.current,
                foundationRef.current,
                floorSlabRef.current,
                roofSlabRef.current,
                sideWingRef.current,
                timberPanelRef.current,
                doorRef.current,
                stepsRef.current,
                wordmarkRef.current,
                taglineRef.current,
                counterRef.current,
              ],
              { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, x: 0, y: 0, visibility: 'visible' }
            );
            gsap.set('.v-gf-wall, .v-uf-wall, .v-win-glass, .v-tree', {
              opacity: 1,
              scale: 1,
              scaleY: 1,
              visibility: 'visible',
            });
            gsap.set('.win-glow', { opacity: 0.9, visibility: 'visible' });
          }
        }, containerRef);

        ctxRef.current = ctx;

        // Tab Visibility Handler
        const handleVisibilityChange = () => {
          if (!document.hidden && !isExiting && timelineRef.current) {
            if (timelineRef.current.progress() < 1) {
              timelineRef.current.progress(1);
              animCompleteTime = performance.now();
            }
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // ==========================================
        // Asset Loading Tick Loop & Strict Gating
        // ==========================================
        const updateLoading = () => {
          if (isCancelled) return;
          const now = performance.now();
          const elapsed = now - startTime;

          // Progressive gating: timeline progress + hero gating completion
          const timelineProg = timelineRef.current ? timelineRef.current.progress() * 85 : 0;
          const gatingBonus = heroGatingReady ? 15 : 0;
          const realWeighted = Math.min(100, timelineProg + gatingBonus);

          if (elapsed >= hardCapTime || (timelineRef.current && timelineRef.current.progress() >= 1 && heroGatingReady)) {
            targetProgress = 100;
            if (timelineRef.current && timelineRef.current.progress() < 1) {
              timelineRef.current.progress(1);
              animCompleteTime = now;
            } else if (animCompleteTime === 0) {
              animCompleteTime = now;
            }
          } else {
            targetProgress = Math.max(targetProgress, realWeighted);
          }

          const lerpSpeed = targetProgress >= 100 ? 0.15 : 0.08;
          currentDisplayed += (targetProgress - currentDisplayed) * lerpSpeed;
          if (currentDisplayed > 99.4 && targetProgress >= 100) {
            currentDisplayed = 100;
          }

          setDisplayProgress(Math.min(100, Math.max(0, Math.round(currentDisplayed))));

          const isTimelineFinished = timelineRef.current ? timelineRef.current.progress() === 1 : false;
          const isLoadingComplete = currentDisplayed >= 99.5 || elapsed >= hardCapTime;
          const hasHeldFor800ms = animCompleteTime > 0 && now - animCompleteTime >= 800;

          if (isTimelineFinished && !isLoadingComplete && !pulseTween) {
            pulseTween = gsap.to('.win-glow', {
              opacity: 0.75,
              duration: 0.8,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            });
          }

          if (isTimelineFinished && isLoadingComplete && hasHeldFor800ms && !isExiting) {
            triggerExit();
          } else if (!isExiting) {
            animId = requestAnimationFrame(updateLoading);
          }
        };

        animId = requestAnimationFrame(updateLoading);
      });

    return () => {
      isCancelled = true;
      if (animId) cancelAnimationFrame(animId);
      if (ctxRef.current) ctxRef.current.revert();
      if (timelineRef.current) timelineRef.current.kill();
      if (pulseTween) pulseTween.kill();
      document.body.style.overflow = '';
    };
  }, []);

  if (isGone) return null;

  return (
    <div
      ref={containerRef}
      id="splash-screen"
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] bg-[#1B1D0F] text-[#F2EFE6] select-none flex flex-col justify-between p-4 sm:p-8 pt-[max(16px,env(safe-area-inset-top,16px))] pb-[max(20px,env(safe-area-inset-bottom,20px))] overflow-hidden pointer-events-auto h-[100dvh]"
      style={{ willChange: 'transform' }}
    >
      <span className="sr-only">Loading {COMPANY_NAME}</span>

      {/* Top spacer */}
      <div className="relative z-10 h-4 sm:h-8" />

      {/* Centerpiece: Solid Villa SVG + Wordmark & Tagline */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto px-4 max-w-full">
        {/* Solid Villa SVG */}
        <div className="w-[84vw] md:w-[min(64vw,600px)] aspect-[800/420] relative flex items-center justify-center">
          <svg
            viewBox="0 0 800 420"
            className="w-full h-full overflow-visible"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="win-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Ground Line */}
            <g ref={groundLineRef} className="splash-part">
              <line
                x1="80"
                y1="350"
                x2="720"
                y2="350"
                stroke="#8A8A80"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* 2. Foundation Slab */}
            <g ref={foundationRef} className="splash-part">
              <rect x="180" y="340" width="460" height="10" rx="1" fill="#2E3120" />
            </g>

            {/* 3. Ground Floor Main Volume */}
            <g className="v-gf-wall">
              <rect x="210" y="228" width="310" height="112" fill="#F2EFE6" />
              <rect x="210" y="336" width="310" height="4" fill="#2E3120" />
              <rect x="420" y="228" width="90" height="112" fill="#2E3120" />
            </g>

            {/* 4. First-Floor Intermediate Slab */}
            <g ref={floorSlabRef} className="splash-part">
              <rect x="190" y="216" width="345" height="12" rx="1" fill="#2E3120" />
            </g>

            {/* 5. Upper Floor Main Volume */}
            <g className="v-uf-wall">
              <rect x="210" y="106" width="310" height="110" fill="#F2EFE6" />
              <rect x="210" y="106" width="35" height="110" fill="#2E3120" />
            </g>

            {/* 6. Upper Floor Roof Slab with Overhang */}
            <g ref={roofSlabRef} className="splash-part">
              <rect x="180" y="92" width="360" height="14" rx="1" fill="#2E3120" />
              <rect x="200" y="86" width="320" height="6" fill="#1B1D0F" opacity="0.5" />
            </g>

            {/* 7. Side Wing (Single Storey) */}
            <g ref={sideWingRef} className="splash-part">
              <rect x="520" y="234" width="120" height="106" fill="#F2EFE6" />
              <rect x="515" y="224" width="130" height="10" rx="1" fill="#2E3120" />
            </g>

            {/* 8. Timber Clad Accent Panel */}
            <g ref={timberPanelRef} className="splash-part">
              <rect x="430" y="116" width="80" height="100" rx="1" fill="#B07A4A" />
              <line x1="442" y1="116" x2="442" y2="216" stroke="#8C5D33" strokeWidth="1.5" />
              <line x1="454" y1="116" x2="454" y2="216" stroke="#8C5D33" strokeWidth="1.5" />
              <line x1="466" y1="116" x2="466" y2="216" stroke="#8C5D33" strokeWidth="1.5" />
              <line x1="478" y1="116" x2="478" y2="216" stroke="#8C5D33" strokeWidth="1.5" />
              <line x1="490" y1="116" x2="490" y2="216" stroke="#8C5D33" strokeWidth="1.5" />
              <line x1="502" y1="116" x2="502" y2="216" stroke="#8C5D33" strokeWidth="1.5" />
            </g>

            {/* 9. Windows, Glazed Entrance Door & Steps */}
            <g>
              <g ref={stepsRef} className="splash-part">
                <rect x="425" y="334" width="60" height="2" fill="#8A8A80" />
                <rect x="420" y="336" width="70" height="2" fill="#8A8A80" />
                <rect x="415" y="338" width="80" height="2" fill="#8A8A80" />
              </g>

              <g ref={doorRef} className="splash-part">
                <rect x="435" y="240" width="50" height="96" fill="#11130A" rx="1" />
                <rect x="435" y="240" width="50" height="96" fill="none" stroke="#2E3120" strokeWidth="2" />
                <line x1="475" y1="280" x2="475" y2="300" stroke="#8A8A80" strokeWidth="2" />
              </g>

              <g className="v-win-glass">
                <rect x="235" y="246" width="78" height="74" fill="#11130A" rx="1" />
                <rect x="235" y="246" width="78" height="74" fill="none" stroke="#2E3120" strokeWidth="2" />
                <line x1="274" y1="246" x2="274" y2="320" stroke="#2E3120" strokeWidth="1.5" />
              </g>

              <g className="v-win-glass">
                <rect x="330" y="246" width="75" height="74" fill="#11130A" rx="1" />
                <rect x="330" y="246" width="75" height="74" fill="none" stroke="#2E3120" strokeWidth="2" />
                <line x1="367" y1="246" x2="367" y2="320" stroke="#2E3120" strokeWidth="1.5" />
              </g>

              <g className="v-win-glass">
                <rect x="245" y="124" width="85" height="74" fill="#11130A" rx="1" />
                <rect x="245" y="124" width="85" height="74" fill="none" stroke="#2E3120" strokeWidth="2" />
                <line x1="287" y1="124" x2="287" y2="198" stroke="#2E3120" strokeWidth="1.5" />
              </g>

              <g className="v-win-glass">
                <rect x="345" y="124" width="70" height="74" fill="#11130A" rx="1" />
                <rect x="345" y="124" width="70" height="74" fill="none" stroke="#2E3120" strokeWidth="2" />
                <line x1="380" y1="124" x2="380" y2="198" stroke="#2E3120" strokeWidth="1.5" />
              </g>

              <g className="v-win-glass">
                <rect x="545" y="254" width="70" height="50" fill="#11130A" rx="1" />
                <rect x="545" y="254" width="70" height="50" fill="none" stroke="#2E3120" strokeWidth="2" />
                <line x1="580" y1="254" x2="580" y2="304" stroke="#2E3120" strokeWidth="1.5" />
              </g>
            </g>

            {/* 10. Window Glow Overlays */}
            <g filter="url(#win-soft-glow)">
              <rect className="win-glow" x="237" y="248" width="74" height="70" fill="#E3F25B" opacity="0" rx="1" />
              <rect className="win-glow" x="332" y="248" width="71" height="70" fill="#E3F25B" opacity="0" rx="1" />
              <rect className="win-glow" x="247" y="126" width="81" height="70" fill="#E3F25B" opacity="0" rx="1" />
              <rect className="win-glow" x="347" y="126" width="66" height="70" fill="#E3F25B" opacity="0" rx="1" />
              <rect className="win-glow" x="437" y="242" width="46" height="40" fill="#E3F25B" opacity="0" rx="1" />
              <rect className="win-glow" x="547" y="256" width="66" height="46" fill="#E3F25B" opacity="0" rx="1" />
            </g>

            {/* 11. Minimalist Landscaping Trees */}
            <g className="v-tree">
              <line x1="135" y1="350" x2="135" y2="280" stroke="#8A8A80" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="135" cy="265" r="28" fill="#2E3120" />
              <circle cx="130" cy="260" r="18" fill="#3C4228" opacity="0.8" />
            </g>
            <g className="v-tree">
              <line x1="680" y1="350" x2="680" y2="270" stroke="#8A8A80" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="680" cy="250" r="32" fill="#2E3120" />
              <circle cx="675" cy="245" r="22" fill="#3C4228" opacity="0.8" />
            </g>
          </svg>
        </div>

        {/* Space-reserved Wordmark Container: Height reserved in layout so nothing moves */}
        <div className="min-h-[72px] sm:min-h-[88px] flex flex-col items-center justify-center mt-4 sm:mt-6">
          <div
            ref={wordmarkRef}
            className="splash-part flex items-center justify-center gap-2.5 sm:gap-3 whitespace-nowrap"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#F2EFE6] stroke-[5]">
                <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" stroke="#F2EFE6" strokeWidth="5" fill="none" />
                <path d="M50 24 L68 35 V72 H32 V35 Z" stroke="#F2EFE6" strokeWidth="5" fill="none" />
                <path d="M50 24 V72" stroke="#F2EFE6" strokeWidth="5" />
                <path d="M38 48 H62" stroke="#F2EFE6" strokeWidth="5" />
                <path d="M38 60 H62" stroke="#F2EFE6" strokeWidth="5" />
                <path d="M26 72 H74" stroke="#F2EFE6" strokeWidth="6" />
              </svg>
            </div>

            <span
              className="font-urbanist font-semibold text-[#F2EFE6] tracking-[-0.01em] whitespace-nowrap text-[clamp(17px,4.8vw,42px)]"
            >
              {COMPANY_NAME}
            </span>
          </div>

          <p
            ref={taglineRef}
            className="splash-part font-sans font-normal text-[#F2EFE6]/65 text-[clamp(12px,3.2vw,16px)] text-center mt-1.5 whitespace-nowrap"
          >
            Premium homes, built from blueprint to keys.
          </p>
        </div>
      </div>

      {/* Bottom Area: Counter */}
      <div className="relative z-10 flex items-end justify-between px-2 sm:px-4 mb-3">
        <div
          ref={counterRef}
          className="splash-part font-urbanist font-medium text-[14px] text-[#F2EFE6] tabular-nums tracking-wider"
        >
          {String(displayProgress).padStart(3, '0')}%
        </div>
        <div />
      </div>

      {/* Bottom edge: 3px lime progress bar across full width (Always visible during loading) */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden">
        <div
          ref={limeBarRef}
          className="h-full bg-[#E3F25B] transition-all duration-100 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};
