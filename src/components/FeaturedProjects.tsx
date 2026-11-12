import React, { useState } from 'react';
import { siteContent } from '../data/content';
import { ArrowUpRight, MapPin } from 'lucide-react';

interface FeaturedProjectsProps {
  onOpenQuoteModal?: () => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ onOpenQuoteModal }) => {
  const content = siteContent.featuredProjects;
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Residential', 'Commercial', 'Apartments'];

  const filteredProjects = content.items.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Residential') return item.type.toLowerCase().includes('villa') || item.type.toLowerCase().includes('home');
    if (filter === 'Commercial') return item.type.toLowerCase().includes('commercial') || item.type.toLowerCase().includes('retail');
    if (filter === 'Apartments') return item.type.toLowerCase().includes('apartments');
    return true;
  });

  return (
    <section id="projects" className="py-14 md:py-32 bg-cream text-ink px-5 sm:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 md:gap-6">
          <div>
            <div className="inline-block px-3.5 py-1 rounded-full border border-ink/20 bg-ink/5 text-ink text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
              Portfolio
            </div>
            <h2 className="font-urbanist font-semibold text-ink text-[clamp(28px,7.5vw,36px)] md:text-[clamp(32px,4.5vw,56px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading">
              {content.heading}
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 min-h-[44px] cursor-pointer ${
                  filter === cat
                    ? 'bg-olive text-cream shadow-sm'
                    : 'bg-white/80 text-ink/70 hover:bg-white border border-ink/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Projects Responsive Grid: 1 col < 640px, 2 cols 640-767px, 3 cols lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-16">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={onOpenQuoteModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenQuoteModal?.();
                }
              }}
              className="group relative rounded-28 overflow-hidden bg-olive text-cream shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 cursor-pointer active:scale-[0.99] flex flex-col justify-between"
            >
              {/* Card Image: 4/3 on mobile/tablet, 4/5 on desktop */}
              <div className="relative aspect-[4/3] md:aspect-[4/5] overflow-hidden bg-olive">
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Gradient Overlay for desktop overlay mode */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-olive/95 via-olive/40 to-transparent transition-opacity duration-300 group-hover:via-olive/60" />

                {/* Top Meta Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3.5 py-1 rounded-full bg-olive text-lime text-xs font-medium border border-lime/30">
                    {project.type}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-olive text-cream/90 text-xs font-mono border border-cream/20">
                    {project.area}
                  </span>
                </div>
              </div>

              {/* Bottom Caption: permanently visible below image on mobile/touch, overlay on desktop */}
              <div className="p-5 sm:p-6 md:absolute md:bottom-0 md:inset-x-0 md:p-7 z-10 flex flex-col justify-end bg-olive md:bg-transparent">
                <div className="flex items-center gap-1.5 text-xs text-cream/70 mb-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-lime flex-shrink-0" />
                  <span>{project.location}</span>
                </div>

                <h3 className="font-urbanist font-semibold text-xl sm:text-2xl md:text-3xl text-cream mb-3 group-hover:text-lime transition-colors leading-snug">
                  {project.name}
                </h3>

                <div className="flex items-center justify-between pt-3 border-t border-cream/20">
                  <span className="text-xs font-medium text-cream/70 group-hover:text-cream transition-colors">
                    Explore case study
                  </span>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-lime text-olive flex items-center justify-center transition-all duration-300 group-hover:rotate-45 shadow-sm">
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="flex justify-center">
          <button
            onClick={onOpenQuoteModal}
            className="w-full sm:w-auto bg-olive text-cream font-medium text-sm sm:text-base px-8 py-4 rounded-full hover:bg-olive/90 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md active:scale-95 group min-h-[44px] cursor-pointer"
          >
            <span>{content.buttonText}</span>
            <span className="w-6 h-6 rounded-full bg-lime text-olive flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
