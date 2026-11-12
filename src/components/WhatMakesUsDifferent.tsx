import React from 'react';
import { siteContent } from '../data/content';
import {
  ShieldCheck,
  Award,
  FileCheck,
  Coins,
  Clock,
  Sparkles,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  Award,
  FileCheck,
  Coins,
  Clock,
  Sparkles,
};

export const WhatMakesUsDifferent: React.FC = () => {
  const content = siteContent.whatMakesUsDifferent;

  return (
    <section className="py-14 md:py-32 bg-white text-ink px-5 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Eyebrow & Header */}
        <div className="max-w-3xl mb-10 md:mb-16">
          <div className="inline-block px-3.5 py-1 rounded-full border border-ink/20 bg-ink/5 text-ink text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
            {content.eyebrow}
          </div>
          <h2 className="font-urbanist font-semibold text-ink text-[clamp(28px,7.5vw,36px)] md:text-[clamp(32px,4.5vw,56px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
            {content.heading}
          </h2>
        </div>

        {/* Layout: Top Collage Image on mobile + Bottom Points in single column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Top/Left: Team Collage Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-32 overflow-hidden aspect-[4/5] bg-cream shadow-xl">
              <img
                src={content.collageImage}
                alt="Monolith Constructions Engineers and Architects"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-olive/80 via-transparent to-transparent" />

              {/* Floating Pill on Image */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-3.5 sm:p-4 rounded-24 bg-white shadow-lg border border-black/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-olive" />
                </div>
                <div>
                  <h4 className="font-urbanist font-semibold text-ink text-sm sm:text-base leading-tight">
                    20+ Years Track Record
                  </h4>
                  <p className="text-muted text-xs">
                    ISO 9001 certified site safety & quality controls
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom/Right: Six Points in single column on mobile, 2x3 on sm/lg */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {content.points.map((pt) => {
              const Icon = iconMap[pt.iconName] || ShieldCheck;

              return (
                <div
                  key={pt.id}
                  className="p-5 sm:p-7 rounded-28 bg-cream border border-ink/5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-card group"
                >
                  <div>
                    {/* Lime Icon Circle */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-lime text-olive flex items-center justify-center mb-4 sm:mb-5 transition-transform group-hover:scale-110 shadow-sm flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <span className="text-xs font-mono text-muted mb-1 block">
                      {pt.number}
                    </span>

                    <h3 className="font-urbanist font-semibold text-xl sm:text-2xl text-ink mb-1.5 sm:mb-2 leading-snug">
                      {pt.title}
                    </h3>

                    <p className="text-muted text-[15px] sm:text-base leading-relaxed">
                      {pt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
