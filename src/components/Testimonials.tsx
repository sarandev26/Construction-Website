import React from 'react';
import { siteContent } from '../data/content';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const content = siteContent.testimonials;

  return (
    <section className="py-14 md:py-32 bg-white text-ink px-5 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-10 md:mb-16">
          <div className="inline-block px-3.5 py-1 rounded-full border border-ink/20 bg-ink/5 text-ink text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
            Client Stories
          </div>
          <h2 className="font-urbanist font-semibold text-ink text-[clamp(28px,7.5vw,36px)] md:text-[clamp(32px,4.5vw,56px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
            {content.heading}
          </h2>
        </div>

        {/* Layout: Photo on top on mobile, Right on desktop; 3 Stacked Quotes below on mobile, Left on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Photo: Order 1 on mobile, Order 2 on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative">
            <div className="relative rounded-32 overflow-hidden aspect-[4/5] bg-olive/10 shadow-2xl">
              <img
                src={content.familyImage}
                alt="Priya and Rahul at their new home delivered by Monolith Constructions"
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-olive/80 via-transparent to-transparent" />

              {/* Floating Testimonial Tag */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-4 sm:p-5 rounded-24 bg-white shadow-lg border border-black/5">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {'★'.repeat(5)}
                </div>
                <p className="font-urbanist font-semibold text-ink text-sm sm:text-base leading-tight">
                  Delivered 2 weeks ahead of schedule
                </p>
                <p className="text-muted text-xs">
                  The Aurum Residence · Coimbatore
                </p>
              </div>
            </div>
          </div>

          {/* 3 Stacked Quotes: Order 2 on mobile, Order 1 on desktop */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-6">
            {content.items.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 sm:p-8 rounded-28 bg-cream border border-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card relative overflow-hidden group"
              >
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-lime/80 mb-2 sm:mb-3" />

                <blockquote className="font-urbanist font-medium text-[15px] sm:text-xl text-ink leading-relaxed mb-3 sm:mb-4">
                  "{item.quote}"
                </blockquote>

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-ink/10">
                  <div>
                    <span className="font-urbanist font-semibold text-sm sm:text-base text-ink block">
                      {item.author}
                    </span>
                    <span className="text-muted text-xs font-mono uppercase tracking-wider">
                      {item.role}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-muted/60">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
