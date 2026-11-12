import React from 'react';
import { siteContent } from '../data/content';
import { ArrowUpRight } from 'lucide-react';

interface ServicesProps {
  onOpenQuoteModal?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenQuoteModal }) => {
  const content = siteContent.services;

  return (
    <section id="services" className="py-14 md:py-32 bg-white text-ink px-5 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 md:gap-6">
          <div className="max-w-2xl">
            <div className="inline-block px-3.5 py-1 rounded-full border border-ink/20 bg-ink/5 text-ink text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
              Our Capabilities
            </div>
            <h2 className="font-urbanist font-semibold text-ink text-[clamp(28px,7.5vw,36px)] md:text-[clamp(32px,4.5vw,56px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
              {content.heading}
            </h2>
          </div>
          <p className="text-muted text-[15px] sm:text-lg max-w-md">
            From single bespoke residences to multi-acre commercial developments, we engineer every milestone with certified precision.
          </p>
        </div>

        {/* 6 Services Grid: 1 col under 640px, 2 cols 640-767px, 3 cols lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {content.items.map((item) => (
            <div
              key={item.id}
              onClick={onOpenQuoteModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenQuoteModal?.();
                }
              }}
              className="group bg-cream rounded-28 overflow-hidden p-5 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-card hover:shadow-card-hover border border-ink/5 cursor-pointer active:scale-[0.99]"
            >
              <div>
                {/* Image Container: 4/3 on mobile/tablet, 16/10 on desktop */}
                <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-24 overflow-hidden mb-5 sm:mb-6 bg-olive/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-olive border border-cream/20 text-cream text-xs font-mono">
                    {item.number}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-urbanist font-semibold text-xl sm:text-2xl text-ink mb-2 group-hover:text-olive transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Description: fully visible, no truncation */}
                <p className="text-muted text-[15px] sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Corner Arrow */}
              <div className="pt-5 mt-4 border-t border-ink/10 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-muted group-hover:text-ink transition-colors font-medium">
                  Request consultation
                </span>
                <div className="w-10 h-10 rounded-full bg-lime text-olive flex items-center justify-center transition-all duration-300 group-hover:rotate-45 shadow-sm flex-shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
