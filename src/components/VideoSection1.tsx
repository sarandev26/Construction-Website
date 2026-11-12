import React from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { siteContent } from '../data/content';
import { ScrollVideoSection } from './ScrollVideoSection';

interface VideoSection1Props {
  onOpenQuoteModal?: () => void;
  onOpenVideoModal?: (src?: string) => void;
  isSplashComplete?: boolean;
}

export const VideoSection1: React.FC<VideoSection1Props> = ({
  onOpenQuoteModal,
  onOpenVideoModal,
  isSplashComplete = false,
}) => {
  const content = siteContent.videoSection1;
  const hero = siteContent.heroIntro;

  return (
    <ScrollVideoSection
      sectionId="hero"
      sectionNumber={1}
      title={content.title}
      pinHeight={content.pinHeight}
      mobilePinHeight={content.mobilePinHeight}
      frameCount={content.frameCount}
      folderPath={content.folderPath}
      textAnchor={content.textAnchor || 'center'}
    >
      {({ progress }) => {
        // Four stage thresholds at 25% steps:
        // Stage 0 (0.00 - 0.25): Hero Intro
        // Stage 1 (0.25 - 0.50): Chapter 01 · Vision
        // Stage 2 (0.50 - 0.75): Chapter 01 · Design & Build
        // Stage 3 (0.75 - 1.00): Chapter 01 · Handover & CTA
        const activeStage = progress < 0.25 ? 0 : progress < 0.50 ? 1 : progress < 0.75 ? 2 : 3;

        return (
          <div
            className="video-text-block md:absolute md:left-[6vw] md:bottom-[8vh] md:max-w-[520px] md:h-auto md:text-left pointer-events-auto"
            style={{ textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}
          >
            {/* Stages Stack with fixed min-height so nothing jumps */}
            <div className="relative min-h-[220px] sm:min-h-[240px] md:min-h-[240px] flex flex-col justify-center md:justify-end">
              {/* 1. Stage 0: Hero Intro - Only starts after splash exit */}
              <div
                className={`transition-all duration-700 ease-out ${
                  activeStage === 0 && isSplashComplete
                    ? 'opacity-100 translate-y-0 relative pointer-events-auto'
                    : 'opacity-0 translate-y-4 absolute inset-x-0 pointer-events-none'
                }`}
              >
                {/* H1 clamped headline */}
                <h1 className="font-urbanist font-semibold text-cream text-[clamp(28px,8vw,38px)] md:text-[clamp(30px,4vw,48px)] leading-[1.12] tracking-tight mb-2.5">
                  {hero.headline}
                </h1>

                {/* Subtitle */}
                <p className="text-cream/90 text-[15px] sm:text-base font-normal leading-relaxed mb-4 md:mb-6 max-w-lg mx-auto md:mx-0">
                  {hero.sub}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2.5 sm:gap-3.5 pt-1">
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector('#services');
                      if (element) {
                        const lenis = (window as any).__lenis;
                        if (lenis) {
                          lenis.scrollTo(element as HTMLElement, { offset: -30 });
                        } else {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    className="w-full sm:w-auto bg-lime text-olive font-semibold text-sm md:text-base px-6 py-3 rounded-full hover:bg-lime-hover transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 group cursor-pointer whitespace-nowrap min-h-[44px]"
                  >
                    <span>{hero.primaryCta}</span>
                    <span className="w-5 h-5 rounded-full bg-olive text-lime flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0">
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onOpenVideoModal?.('/videos/Hero.mp4')}
                    className="w-full sm:w-auto bg-white/10 text-cream border border-cream/25 font-semibold text-sm md:text-base px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 whitespace-nowrap min-h-[44px]"
                  >
                    <Play className="w-3.5 h-3.5 text-lime fill-lime flex-shrink-0" />
                    <span>{hero.secondaryCta}</span>
                  </button>
                </div>
              </div>

              {/* 2. Stage 1: Chapter 01 · Vision */}
              <div
                className={`transition-all duration-500 ease-out ${
                  activeStage === 1
                    ? 'opacity-100 translate-y-0 relative pointer-events-auto'
                    : 'opacity-0 -translate-y-[10px] absolute inset-x-0 pointer-events-none'
                }`}
              >
                <div className="inline-flex items-center justify-center md:justify-start gap-2 text-[12px] font-mono font-medium text-lime uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                  <span>{content.stages[0]?.eyebrow || 'Chapter 01 · Vision'}</span>
                </div>

                <h2 className="font-urbanist font-semibold text-cream text-[clamp(28px,8vw,38px)] md:text-[clamp(30px,4vw,48px)] leading-[1.12] tracking-tight mb-2.5">
                  {content.stages[0]?.headline}
                </h2>

                <p className="text-cream/90 text-[15px] sm:text-base font-normal leading-relaxed mb-4 font-normal max-w-lg mx-auto md:mx-0">
                  {content.stages[0]?.sub}
                </p>
              </div>

              {/* 3. Stage 2: Chapter 01 · Design & Build */}
              <div
                className={`transition-all duration-500 ease-out ${
                  activeStage === 2
                    ? 'opacity-100 translate-y-0 relative pointer-events-auto'
                    : 'opacity-0 -translate-y-[10px] absolute inset-x-0 pointer-events-none'
                }`}
              >
                <div className="inline-flex items-center justify-center md:justify-start gap-2 text-[12px] font-mono font-medium text-lime uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                  <span>{content.stages[1]?.eyebrow || 'Chapter 01 · Design'}</span>
                </div>

                <h2 className="font-urbanist font-semibold text-cream text-[clamp(28px,8vw,38px)] md:text-[clamp(30px,4vw,48px)] leading-[1.12] tracking-tight mb-2.5">
                  {content.stages[1]?.headline}
                </h2>

                <p className="text-cream/90 text-[15px] sm:text-base font-normal leading-relaxed mb-4 font-normal max-w-lg mx-auto md:mx-0">
                  {content.stages[1]?.sub}
                </p>
              </div>

              {/* 4. Stage 3: Chapter 01 · Handover & CTA */}
              <div
                className={`transition-all duration-500 ease-out ${
                  activeStage === 3
                    ? 'opacity-100 translate-y-0 relative pointer-events-auto'
                    : 'opacity-0 -translate-y-[10px] absolute inset-x-0 pointer-events-none'
                }`}
              >
                <div className="inline-flex items-center justify-center md:justify-start gap-2 text-[12px] font-mono font-medium text-lime uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                  <span>{content.stages[3]?.eyebrow || 'Chapter 01 · Handover'}</span>
                </div>

                <h2 className="font-urbanist font-semibold text-cream text-[clamp(28px,8vw,38px)] md:text-[clamp(30px,4vw,48px)] leading-[1.12] tracking-tight mb-2.5">
                  {content.stages[3]?.headline}
                </h2>

                <p className="text-cream/90 text-[15px] sm:text-base font-normal leading-relaxed mb-4 md:mb-6 max-w-lg mx-auto md:mx-0">
                  {content.stages[3]?.sub}
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenQuoteModal}
                    className="w-full sm:w-auto bg-lime text-olive font-semibold text-sm md:text-base px-7 py-3 rounded-full hover:bg-lime-hover transition-all duration-300 inline-flex items-center justify-center gap-2.5 shadow-md active:scale-95 group cursor-pointer whitespace-nowrap min-h-[44px]"
                  >
                    <span>{content.stages[3]?.cta || 'Get a free quote'}</span>
                    <span className="w-5 h-5 rounded-full bg-olive text-lime flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0">
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </ScrollVideoSection>
  );
};
