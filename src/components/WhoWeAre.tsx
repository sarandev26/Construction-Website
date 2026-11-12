import React from 'react';
import { siteContent } from '../data/content';
import { ArrowUpRight } from 'lucide-react';

interface WhoWeAreProps {
  onOpenQuoteModal?: () => void;
}

export const WhoWeAre: React.FC<WhoWeAreProps> = ({ onOpenQuoteModal }) => {
  const content = siteContent.whoWeAre;

  return (
    <section id="about" className="py-14 md:py-32 bg-cream text-ink px-5 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Eyebrow and Heading */}
        <div className="max-w-3xl mb-10 md:mb-20">
          <div className="inline-block px-3.5 py-1 rounded-full border border-ink/20 bg-ink/5 text-ink text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
            {content.eyebrow}
          </div>
          <h2 className="font-urbanist font-semibold text-ink text-[clamp(28px,7.5vw,36px)] md:text-[clamp(32px,4.5vw,56px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
            {content.heading}
          </h2>
        </div>

        {/* Three Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {content.cards.map((card) => {
            if (card.type === 'olive') {
              // 01 What we do (Olive Card)
              return (
                <div
                  key={card.id}
                  onClick={onOpenQuoteModal}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenQuoteModal?.();
                    }
                  }}
                  className="group relative bg-olive text-cream rounded-28 p-6 sm:p-10 flex flex-col justify-between min-h-[360px] sm:min-h-[420px] transition-all duration-500 hover:-translate-y-1.5 shadow-card hover:shadow-card-hover cursor-pointer active:scale-[0.99]"
                >
                  <div>
                    <span className="font-urbanist font-semibold text-3xl sm:text-4xl text-lime/80 block mb-4 sm:mb-6">
                      {card.number}
                    </span>
                    <h3 className="font-urbanist font-semibold text-2xl sm:text-3xl text-cream mb-3 sm:mb-4">
                      {card.title}
                    </h3>
                    <p className="text-cream/75 text-[15px] sm:text-base leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-8 flex items-center justify-between border-t border-cream/10">
                    <span className="text-sm font-medium text-lime group-hover:text-white transition-colors">
                      {card.linkText}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-lime text-olive flex items-center justify-center transition-all duration-300 group-hover:rotate-45 group-hover:bg-white flex-shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            }

            if (card.type === 'lime') {
              // 02 Our impact (Lime Card with building image)
              return (
                <div
                  key={card.id}
                  onClick={onOpenQuoteModal}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenQuoteModal?.();
                    }
                  }}
                  className="group relative bg-lime text-olive rounded-28 p-6 sm:p-10 flex flex-col justify-between min-h-[360px] sm:min-h-[420px] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 shadow-card hover:shadow-card-hover cursor-pointer active:scale-[0.99]"
                >
                  {/* Subtle Background architectural visual overlay */}
                  <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full overflow-hidden opacity-30 mix-blend-multiply pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    {card.image && (
                      <img
                        src={card.image}
                        alt="Architectural Landmark"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="relative z-10">
                    <span className="font-urbanist font-semibold text-3xl sm:text-4xl text-olive/80 block mb-4 sm:mb-6">
                      {card.number}
                    </span>
                    <h3 className="font-urbanist font-semibold text-2xl sm:text-3xl text-olive mb-3 sm:mb-4">
                      {card.title}
                    </h3>
                    <p className="text-olive/80 text-[15px] sm:text-base leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-6 sm:pt-8 flex items-center justify-between border-t border-olive/15">
                    <span className="text-sm font-semibold text-olive">
                      {card.linkText}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-olive text-lime flex items-center justify-center transition-all duration-300 group-hover:rotate-45 shadow-sm flex-shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            }

            // 03 Core values (Photo Card with dark overlay)
            return (
              <div
                key={card.id}
                onClick={onOpenQuoteModal}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenQuoteModal?.();
                  }
                }}
                className="group relative rounded-28 overflow-hidden p-6 sm:p-10 flex flex-col justify-between min-h-[360px] sm:min-h-[420px] text-cream transition-all duration-500 hover:-translate-y-1.5 shadow-card hover:shadow-card-hover cursor-pointer active:scale-[0.99]"
              >
                {/* Background Photo */}
                <div className="absolute inset-0 z-0">
                  {card.image && (
                    <img
                      src={card.image}
                      alt="Construction Core Values"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-olive via-olive/70 to-olive/40" />
                </div>

                <div className="relative z-10">
                  <span className="font-urbanist font-semibold text-3xl sm:text-4xl text-lime block mb-4 sm:mb-6">
                    {card.number}
                  </span>
                  <h3 className="font-urbanist font-semibold text-2xl sm:text-3xl text-cream mb-3 sm:mb-4">
                    {card.title}
                  </h3>
                  <p className="text-cream/80 text-[15px] sm:text-base leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="relative z-10 pt-6 sm:pt-8 flex items-center justify-between border-t border-cream/20">
                  <span className="text-sm font-medium text-lime group-hover:text-white transition-colors">
                    {card.linkText}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-lime text-olive flex items-center justify-center transition-all duration-300 group-hover:rotate-45 flex-shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
