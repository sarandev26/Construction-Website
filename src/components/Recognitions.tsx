import React, { useEffect, useRef, useState } from 'react';
import { siteContent } from '../data/content';
import { Trophy, Star } from 'lucide-react';

export const Recognitions: React.FC = () => {
  const content = siteContent.recognitions;
  const awards = [...content.awards, ...content.awards, ...content.awards];
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="recognitions" className="py-14 md:py-28 bg-olive text-cream overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-14 mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-lime/30 bg-lime/10 text-lime text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
          <Trophy className="w-3.5 h-3.5 text-lime" />
          <span>Industry Accolades</span>
        </div>
        <h2 className="font-urbanist font-semibold text-cream text-[clamp(28px,7.5vw,36px)] md:text-[clamp(30px,4.5vw,52px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
          {content.heading}
        </h2>
      </div>

      {/* Infinite Award Pills Marquee: pill height 44px, font 15px on mobile, no overflow */}
      <div
        className="flex w-max animate-marquee items-center gap-4 sm:gap-6 py-2 sm:py-4"
        style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
      >
        {awards.map((award, idx) => (
          <div
            key={`${award}-${idx}`}
            className="h-[44px] sm:h-auto flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-8 py-2 sm:py-3.5 rounded-full bg-cream/10 border border-cream/20 text-cream font-urbanist font-medium text-[15px] sm:text-xl whitespace-nowrap hover:bg-lime hover:text-olive hover:border-lime transition-colors duration-300 shadow-md group cursor-default flex-shrink-0"
          >
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-lime text-olive flex items-center justify-center flex-shrink-0 group-hover:bg-olive group-hover:text-lime transition-colors">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            </span>
            <span className="whitespace-nowrap">{award}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
