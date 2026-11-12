import React from 'react';
import { ShieldCheck, CalendarCheck, Eye, Award, ArrowUpRight } from 'lucide-react';
import { siteContent } from '../data/content';

interface OurPromiseProps {
  onOpenQuoteModal: () => void;
}

export const OurPromise: React.FC<OurPromiseProps> = ({ onOpenQuoteModal }) => {
  const content = siteContent.ourPromise;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-olive" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-6 h-6 text-olive" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-olive" />;
      case 'Award':
      default:
        return <Award className="w-6 h-6 text-olive" />;
    }
  };

  return (
    <section id="promise" className="bg-cream py-14 md:py-32 px-5 sm:px-6 lg:px-8 border-b border-black/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 bg-white/60 text-xs font-semibold text-olive uppercase tracking-wider mb-3 md:mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            {content.eyebrow}
          </div>
          <h2 className="font-urbanist font-semibold text-ink text-[clamp(28px,7.5vw,36px)] md:text-[clamp(32px,4.5vw,56px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
            {content.heading}
          </h2>
        </div>

        {/* 4 Cards Grid: 1 col below 390px, 2x2 grid at 390px and above, 4 cols on desktop */}
        <div className="grid grid-cols-1 min-[390px]:grid-cols-2 lg:grid-cols-4 gap-4 min-[390px]:gap-6 mb-8 md:mb-12">
          {content.cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className="bg-white rounded-28 p-5 min-[390px]:p-6 sm:p-8 border border-black/5 shadow-sm hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Icon with lime accent background */}
                <div className="w-12 h-12 min-[390px]:w-14 min-[390px]:h-14 rounded-24 bg-lime/30 group-hover:bg-lime flex items-center justify-center mb-4 min-[390px]:mb-6 transition-colors duration-300 shadow-sm flex-shrink-0">
                  {getIcon(card.icon)}
                </div>
                <h3 className="font-urbanist font-semibold text-ink text-lg sm:text-xl mb-2 sm:mb-3 leading-snug">
                  {card.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Card Bottom Accent Line */}
              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-muted/60">
                  0{idx + 1}
                </span>
                <span className="w-2 h-2 rounded-full bg-lime group-hover:scale-125 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Full-width Dark Olive Banner Card */}
        <div className="bg-olive text-cream rounded-28 p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 border border-cream/10">
          {/* Subtle architectural grid pattern background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: 'linear-gradient(#E3F25B 1px, transparent 1px), linear-gradient(90deg, #E3F25B 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          <div className="relative z-10 max-w-2xl text-center lg:text-left w-full">
            <span className="inline-block px-3 py-1 rounded-full bg-cream/10 text-lime text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3">
              Guaranteed Delivery
            </span>
            <p className="font-urbanist font-medium text-base sm:text-xl md:text-2xl text-cream/95 leading-snug">
              {content.bannerText}
            </p>
          </div>

          <div className="relative z-10 w-full sm:w-auto flex-shrink-0">
            {/* Banner CTA is full width on mobile */}
            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto bg-lime text-olive font-semibold text-base px-8 py-4 rounded-full hover:bg-lime-hover transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg active:scale-95 group cursor-pointer min-h-[48px]"
            >
              <span>{content.bannerCta}</span>
              <span className="w-7 h-7 rounded-full bg-olive text-lime flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
