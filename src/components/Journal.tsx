import React from 'react';
import { siteContent } from '../data/content';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';

interface JournalProps {
  onOpenQuoteModal?: () => void;
}

export const Journal: React.FC<JournalProps> = ({ onOpenQuoteModal }) => {
  const content = siteContent.journal;

  return (
    <section className="py-14 md:py-32 bg-cream text-ink px-5 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 md:gap-6">
          <div className="max-w-2xl">
            <div className="inline-block px-3.5 py-1 rounded-full border border-ink/20 bg-ink/5 text-ink text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
              Journal & Insights
            </div>
            <h2 className="font-urbanist font-semibold text-ink text-[clamp(28px,7.5vw,36px)] md:text-[clamp(32px,4.5vw,56px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
              {content.heading}
            </h2>
          </div>
          <p className="text-muted text-[15px] sm:text-lg max-w-md">
            Architectural perspectives, structural engineering guides, and modern luxury design trends from our senior studio team.
          </p>
        </div>

        {/* 3 Journal Cards Grid: 1 col on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {content.items.map((post) => (
            <article
              key={post.id}
              onClick={onOpenQuoteModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenQuoteModal?.();
                }
              }}
              className="group bg-white rounded-28 overflow-hidden p-5 sm:p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-card hover:shadow-card-hover border border-ink/5 cursor-pointer active:scale-[0.99]"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] rounded-24 overflow-hidden mb-5 sm:mb-6 bg-olive/10">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-olive border border-lime/30 text-lime text-xs font-medium">
                    {post.tag}
                  </div>
                </div>

                {/* Date & Read time */}
                <div className="flex items-center gap-4 text-xs text-muted mb-2.5 sm:mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted/70 flex-shrink-0" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted/70 flex-shrink-0" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-urbanist font-semibold text-xl sm:text-2xl text-ink leading-snug group-hover:text-olive transition-colors mb-4">
                  {post.title}
                </h3>
              </div>

              {/* Bottom Read Article Link */}
              <div className="pt-4 sm:pt-6 border-t border-ink/10 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-muted group-hover:text-ink transition-colors font-medium">
                  Read article & consult
                </span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-lime text-olive flex items-center justify-center transition-all duration-300 group-hover:rotate-45 shadow-sm flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
