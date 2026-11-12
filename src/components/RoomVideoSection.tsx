import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { type PinnedVideoSectionConfig } from '../data/content';
import { ScrollVideoSection } from './ScrollVideoSection';

interface RoomVideoSectionProps {
  sectionConfig: PinnedVideoSectionConfig;
  onOpenQuoteModal?: () => void;
}

export const RoomVideoSection: React.FC<RoomVideoSectionProps> = ({ sectionConfig, onOpenQuoteModal }) => {
  return (
    <ScrollVideoSection
      sectionId={sectionConfig.id}
      sectionNumber={sectionConfig.sectionNumber}
      title={sectionConfig.roomName}
      pinHeight={sectionConfig.pinHeight}
      mobilePinHeight={sectionConfig.mobilePinHeight}
      frameCount={sectionConfig.frameCount}
      folderPath={sectionConfig.folder}
      focusPoint={sectionConfig.focusPoint}
      textAnchor={sectionConfig.textAnchor || 'bottom'}
    >
      {({ progress }) => {
        // 3 scroll stages with thresholds at 0-33%, 33-66%, 66-100%
        const activeStageIndex = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

        return (
          <div
            className="video-text-block md:absolute md:left-[6vw] md:bottom-[8vh] md:max-w-[520px] md:h-auto md:text-left pointer-events-auto"
            style={{ textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}
          >
            {/* Optional stats grid placed above the stage text on the last stage */}
            {sectionConfig.stats && activeStageIndex === 2 && (
              <div className="stats-grid mb-3.5 flex items-center justify-center md:justify-start gap-4 sm:gap-6 flex-wrap">
                {sectionConfig.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="flex flex-col items-center md:items-start">
                    <span className="font-urbanist font-bold text-lime text-xl sm:text-2xl">
                      {stat.prefix}{stat.value}{stat.suffix}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cream/70">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Stages Stack: fixed min-height so layout never jumps; all stages share bottom: 0 on mobile */}
            <div className="video-stage-box relative w-full min-h-[225px] sm:min-h-[240px] md:min-h-[220px] flex flex-col justify-end">
              {sectionConfig.stages.map((stage, idx) => {
                const isActive = activeStageIndex === idx;

                return (
                  <div
                    key={stage.eyebrow}
                    className={`video-stage-item transition-all duration-500 ease-out flex flex-col items-center md:items-start text-center md:text-left ${
                      isActive
                        ? 'opacity-100 translate-y-0 relative pointer-events-auto z-10'
                        : 'opacity-0 -translate-y-[10px] absolute inset-x-0 pointer-events-none z-0'
                    }`}
                  >
                    {/* Eyebrow: 12px uppercase, lime */}
                    <div className="inline-flex items-center justify-center md:justify-start gap-2 text-[12px] font-mono font-medium text-lime uppercase tracking-wider mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                      <span>{stage.eyebrow}</span>
                    </div>

                    {/* Headline: clamp(28px, 8vw, 38px) weight 600 on mobile, md:clamp(30px, 4vw, 48px) */}
                    <h2 className="font-urbanist font-semibold text-cream text-[clamp(28px,8vw,38px)] md:text-[clamp(30px,4vw,48px)] leading-[1.12] tracking-tight mb-2.5">
                      {stage.headline}
                    </h2>

                    {/* Body: 1 sentence, 15px, crisp */}
                    <p className="text-cream/90 text-[15px] sm:text-base leading-relaxed mb-4 font-normal max-w-lg mx-auto md:mx-0">
                      {stage.body}
                    </p>

                    {/* Stage 3 tags & CTA: Solid #1B1D0F pills with 1px border */}
                    {stage.tags && stage.tags.length > 0 && (
                      <div className="flex flex-col items-center md:items-start gap-3 pt-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                          {stage.tags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={onOpenQuoteModal}
                              className="video-tag-chip hover:border-lime hover:text-lime transition-all cursor-pointer active:scale-95"
                              title={`Inquire about ${tag}`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                        {isActive && onOpenQuoteModal && (
                          <button
                            type="button"
                            onClick={onOpenQuoteModal}
                            className="bg-lime text-olive font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-lime-hover active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-md cursor-pointer whitespace-nowrap min-h-[44px]"
                          >
                            <span>Inquire about this design</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </ScrollVideoSection>
  );
};
