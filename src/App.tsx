import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Global UI components
import { SplashScreen } from './components/SplashScreen';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Navbar } from './components/Navbar';

// Video Sections (Pinned frame-sequence player sections)
import { VideoSection1 } from './components/VideoSection1';
import { RoomVideoSection } from './components/RoomVideoSection';

// Code-split standard sections below the video sections
const OurPromise = lazy(() => import('./components/OurPromise').then((m) => ({ default: m.OurPromise })));
const WhoWeAre = lazy(() => import('./components/WhoWeAre').then((m) => ({ default: m.WhoWeAre })));
const ServicesMarquee = lazy(() => import('./components/ServicesMarquee').then((m) => ({ default: m.ServicesMarquee })));
const Services = lazy(() => import('./components/Services').then((m) => ({ default: m.Services })));
const FeaturedProjects = lazy(() => import('./components/FeaturedProjects').then((m) => ({ default: m.FeaturedProjects })));
const WhatMakesUsDifferent = lazy(() => import('./components/WhatMakesUsDifferent').then((m) => ({ default: m.WhatMakesUsDifferent })));
const Leadership = lazy(() => import('./components/Leadership').then((m) => ({ default: m.Leadership })));
const Recognitions = lazy(() => import('./components/Recognitions').then((m) => ({ default: m.Recognitions })));
const Testimonials = lazy(() => import('./components/Testimonials').then((m) => ({ default: m.Testimonials })));
const Journal = lazy(() => import('./components/Journal').then((m) => ({ default: m.Journal })));
const FinalCta = lazy(() => import('./components/FinalCta').then((m) => ({ default: m.FinalCta })));
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })));
const QuoteModal = lazy(() => import('./components/QuoteModal').then((m) => ({ default: m.QuoteModal })));
const VideoModal = lazy(() => import('./components/VideoModal').then((m) => ({ default: m.VideoModal })));

import { siteContent } from './data/content';
import { frameLoader } from './utils/frameLoader';

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') {
  (window as any).ScrollTrigger = ScrollTrigger;
}
ScrollTrigger.config({ ignoreMobileResize: true });

export function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Splash screen completion state: ALWAYS false on load/refresh (Splash plays every time)
  const [isSplashComplete, setIsSplashComplete] = useState<boolean>(false);

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize smooth Lenis scrolling (ONE smoother: lerp 0.09, wheelMultiplier 0.8, native touch scrolling)
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.8,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    // If splash is currently active, halt wheel scrolling
    if (!isSplashComplete) {
      lenis.stop();
    }

    lenis.on('scroll', ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after fonts load and on resize
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // Smooth anchor link click interceptor
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin === window.location.origin) {
        e.preventDefault();
        const element = document.querySelector(anchor.hash);
        if (element) {
          lenis.scrollTo(element as HTMLElement, { offset: -30 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleSplashComplete = useCallback(() => {
    setIsSplashComplete(true);
    lenisRef.current?.start();
    frameLoader.notifySplashComplete();
    frameLoader.loadSection(2);
    frameLoader.preloadNextCoarse(3);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  const openVideoModal = (src?: string) => setSelectedVideo(src || '/videos/Backyard.mp4');
  const closeVideoModal = () => setSelectedVideo(null);

  return (
    <div className="relative min-h-screen bg-white text-ink selection:bg-lime selection:text-olive">
      {/* Dark Olive Solid Villa Construction Splash Screen */}
      <SplashScreen onComplete={handleSplashComplete} />

      {/* Scroll Progress Bar at very top */}
      <ScrollProgressBar />

      {/* Floating Centered Pill Navbar */}
      <Navbar onOpenQuoteModal={openQuoteModal} />

      {/* Main Page Flow */}
      <main className="w-full overflow-hidden">
        {/* SECTION 1: Blueprint to House Hero (Pinned ~700vh) */}
        <VideoSection1
          onOpenQuoteModal={openQuoteModal}
          onOpenVideoModal={openVideoModal}
          isSplashComplete={isSplashComplete}
        />

        {/* SECTIONS 2 to 7: Distinct Pinned Frame-Sequence Sections (Living hall, Modular kitchen, Master bedroom, Spa bathroom, Private backyard, Build process) */}
        {siteContent.pinnedSections.map((section) => (
          <RoomVideoSection
            key={section.id}
            sectionConfig={section}
            onOpenQuoteModal={openQuoteModal}
          />
        ))}

        {/* SECTION 8: Our Promise */}
        <Suspense fallback={<div className="min-h-[500px] bg-cream" />}>
          <OurPromise onOpenQuoteModal={openQuoteModal} />
        </Suspense>

        {/* SECTION 9: Who We Are */}
        <Suspense fallback={<div className="min-h-[600px] bg-white" />}>
          <WhoWeAre onOpenQuoteModal={openQuoteModal} />
        </Suspense>

        {/* SECTION 10: Services Marquee */}
        <Suspense fallback={<div className="min-h-[100px] bg-olive" />}>
          <ServicesMarquee />
        </Suspense>

        {/* SECTION 11: Our Services */}
        <Suspense fallback={<div className="min-h-[700px] bg-cream" />}>
          <Services onOpenQuoteModal={openQuoteModal} />
        </Suspense>

        {/* SECTION 12: Featured Projects */}
        <Suspense fallback={<div className="min-h-[800px] bg-olive" />}>
          <FeaturedProjects onOpenQuoteModal={openQuoteModal} />
        </Suspense>

        {/* SECTION 13: What Makes Us Different */}
        <Suspense fallback={<div className="min-h-[600px] bg-cream" />}>
          <WhatMakesUsDifferent />
        </Suspense>

        {/* SECTION 14: Our Leadership */}
        <Suspense fallback={<div className="min-h-[600px] bg-white" />}>
          <Leadership />
        </Suspense>

        {/* SECTION 15: Recognitions Marquee */}
        <Suspense fallback={<div className="min-h-[300px] bg-olive" />}>
          <Recognitions />
        </Suspense>

        {/* SECTION 16: Testimonials */}
        <Suspense fallback={<div className="min-h-[600px] bg-cream" />}>
          <Testimonials />
        </Suspense>

        {/* SECTION 17: Journal */}
        <Suspense fallback={<div className="min-h-[600px] bg-white" />}>
          <Journal onOpenQuoteModal={openQuoteModal} />
        </Suspense>

        {/* SECTION 18: Final CTA + Contact Form */}
        <Suspense fallback={<div className="min-h-[700px] bg-olive" />}>
          <FinalCta onOpenQuoteModal={openQuoteModal} />
        </Suspense>
      </main>

      {/* Footer */}
      <Suspense fallback={<div className="min-h-[400px] bg-olive" />}>
        <Footer onOpenQuoteModal={openQuoteModal} />
      </Suspense>

      {/* Interactive Free Quote Modal */}
      {isQuoteModalOpen && (
        <Suspense fallback={null}>
          <QuoteModal isOpen={isQuoteModalOpen} onClose={closeQuoteModal} />
        </Suspense>
      )}

      {/* 4K Ultra HD Video Showcase Modal */}
      {selectedVideo && (
        <Suspense fallback={null}>
          <VideoModal
            isOpen={!!selectedVideo}
            onClose={closeVideoModal}
            initialVideo={selectedVideo || '/videos/Backyard.mp4'}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
