import React from 'react';
import { siteContent } from '../data/content';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenQuoteModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuoteModal }) => {
  const content = siteContent.footer;
  const global = siteContent.global;

  return (
    <footer className="w-full bg-olive text-cream pt-14 md:pt-28 pb-[max(24px,env(safe-area-inset-bottom,24px))] px-5 sm:px-10 lg:px-14 border-t border-cream/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Headline & CTA Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-10 md:pb-20 border-b border-cream/10 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-lime mb-2.5 sm:mb-3 block">
              Architectural Craftsmanship
            </span>
            <h2 className="font-urbanist font-semibold text-cream text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5.5vw,68px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
              {content.headline}
            </h2>
          </div>

          <button
            onClick={onOpenQuoteModal}
            className="w-full sm:w-auto bg-lime text-olive font-medium text-base sm:text-lg px-8 py-4 rounded-full hover:bg-lime-hover transition-all duration-300 inline-flex items-center justify-center gap-2.5 shadow-glow-lime self-start sm:self-auto group min-h-[48px] cursor-pointer"
          >
            <span>{content.cta}</span>
            <span className="w-7 h-7 rounded-full bg-olive text-lime flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </button>
        </div>

        {/* Navigation & Contact Columns: Company and Services side by side on mobile, Contact below */}
        <div className="py-10 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {/* Brand Intro Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
              <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center p-1 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-5 h-5 fill-none stroke-olive stroke-[6]">
                  <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" className="fill-lime stroke-none" />
                  <path d="M50 24 L68 35 V72 H32 V35 Z" fill="none" />
                  <path d="M50 24 V72" />
                  <path d="M26 72 H74" strokeWidth="8" />
                </svg>
              </div>
              <span className="font-urbanist font-semibold text-xl text-cream tracking-tight">
                {global.brandName}
              </span>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed mb-5">
              Engineering architectural landmarks and custom luxury residences across South India for two decades.
            </p>
          </div>

          {/* Company and Services side by side on mobile */}
          <div className="grid grid-cols-2 gap-6 md:contents">
            {/* Company Column */}
            <div>
              <h4 className="font-urbanist font-semibold text-base sm:text-lg text-cream mb-3.5 sm:mb-5">
                {content.company.title}
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {content.company.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-cream/75 hover:text-lime transition-colors text-sm py-0.5 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="font-urbanist font-semibold text-base sm:text-lg text-cream mb-3.5 sm:mb-5">
                {content.services.title}
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {content.services.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-cream/75 hover:text-lime transition-colors text-sm py-0.5 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="font-urbanist font-semibold text-base sm:text-lg text-cream mb-3.5 sm:mb-5">
              {content.contact.title}
            </h4>
            <div className="space-y-2.5 sm:space-y-3 text-sm text-cream/75">
              <p className="leading-relaxed">
                {content.contact.address}
              </p>
              <p>
                <a
                  href={`tel:${content.contact.phone.replace(/\s+/g, '')}`}
                  className="hover:text-lime transition-colors font-medium text-cream py-0.5 inline-block"
                >
                  {content.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${content.contact.email}`}
                  className="hover:text-lime transition-colors py-0.5 inline-block"
                >
                  {content.contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Giant Faded Wordmark: scaled to fit width without overflow */}
        <div className="w-full overflow-hidden select-none pointer-events-none py-6 sm:py-10 text-center">
          <span className="font-urbanist font-extrabold text-[clamp(24px,7.8vw,120px)] leading-none tracking-tighter text-cream/[0.05] whitespace-nowrap block">
            {content.brandWordmark}
          </span>
        </div>

        {/* Bottom Bar: Stacked and centered on mobile, row on desktop */}
        <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:justify-between pt-6 sm:pt-8 border-t border-cream/10 gap-3 sm:gap-4 text-xs text-cream/60">
          <p>{content.copyright}</p>
          <div className="flex items-center gap-6">
            {content.legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-cream transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
