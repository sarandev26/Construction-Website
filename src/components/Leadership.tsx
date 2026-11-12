import React from 'react';
import { siteContent } from '../data/content';

export const Leadership: React.FC = () => {
  const content = siteContent.leadership;

  return (
    <section id="leadership" className="py-14 md:py-32 bg-cream text-ink px-5 sm:px-10 lg:px-14 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-10 md:mb-16">
          <div className="inline-block px-3.5 py-1 rounded-full border border-ink/20 bg-ink/5 text-ink text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
            Our Leadership
          </div>
          <h2 className="font-urbanist font-semibold text-ink text-[clamp(28px,7.5vw,36px)] md:text-[clamp(32px,4.5vw,56px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
            {content.heading}
          </h2>
        </div>

        {/* Stacked single column on mobile (16px gap), 3-col grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {content.members.map((member) => (
            <div
              key={member.id}
              className="w-full group bg-white rounded-28 overflow-hidden border border-ink/5 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Portrait Photo (4:5 ratio) */}
              <div className="relative aspect-[4/5] overflow-hidden bg-olive/10">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-olive/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card Bottom Meta */}
              <div className="p-5 sm:p-7 flex items-center justify-between">
                <div>
                  <h3 className="font-urbanist font-semibold text-lg sm:text-2xl text-ink group-hover:text-olive transition-colors leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-muted text-xs sm:text-sm mt-0.5 font-normal">
                    {member.role}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-cream text-ink/70 flex items-center justify-center transition-all duration-300 group-hover:bg-lime group-hover:text-olive flex-shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
