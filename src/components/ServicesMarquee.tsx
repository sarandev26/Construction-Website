import React, { useEffect, useRef, useState } from 'react';
import { siteContent } from '../data/content';

export const ServicesMarquee: React.FC = () => {
  const marqueeItems = siteContent.servicesMarquee;
  const loopItems = [...marqueeItems, ...marqueeItems, ...marqueeItems];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
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
    <div
      ref={containerRef}
      className="py-6 sm:py-10 bg-olive text-cream overflow-hidden border-y border-cream/10 select-none w-full max-w-full"
    >
      <div
        className="flex w-max animate-marquee items-center gap-4 sm:gap-6"
        style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
      >
        {loopItems.map((item, idx) => (
          <React.Fragment key={`${item.title}-${idx}`}>
            {/* Pill Chip: mobile height 44px, font 15px, no overflow */}
            <div className="h-[44px] sm:h-auto flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-cream/10 border border-cream/15 text-cream font-urbanist font-medium text-[15px] sm:text-xl whitespace-nowrap hover:bg-lime hover:text-olive hover:border-lime transition-colors duration-300 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-lime flex-shrink-0" />
              <span className="whitespace-nowrap">{item.title}</span>
            </div>

            {/* Alternating Small Rounded Architectural Image */}
            <div className="w-12 h-8 sm:w-16 sm:h-12 rounded-full overflow-hidden border border-cream/20 flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
