import React, { useEffect, useState } from 'react';
import { X, Play, Film } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVideo?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  initialVideo = '/videos/Backyard.mp4',
}) => {
  const [currentVideo, setCurrentVideo] = useState(initialVideo);

  useEffect(() => {
    if (initialVideo) {
      setCurrentVideo(initialVideo);
    }
  }, [initialVideo]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const playlist = [
    { title: 'Hero Architectural Showcase', src: '/videos/Hero.mp4', tag: 'Showcase' },
    { title: 'Living Hall', src: '/videos/Hall.mp4', tag: 'Interior' },
    { title: 'Modular Kitchen', src: '/videos/Kitchen.mp4', tag: 'Interior' },
    { title: 'Master Bedroom Suite', src: '/videos/Bedroom.mp4', tag: 'Interior' },
    { title: 'Spa Luxury Bathroom', src: '/videos/Bathroom.mp4', tag: 'Interior' },
    { title: 'Villa Backyard & Living', src: '/videos/Backyard.mp4', tag: 'Architecture' },
  ];

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Architectural Video Showcase"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-olive rounded-32 border border-cream/15 overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-cream/10 bg-olive-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center text-olive flex-shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-urbanist font-semibold text-base sm:text-lg text-cream leading-tight">
                Architectural Video Showcase
              </h3>
              <p className="text-xs text-cream/60">
                Monolith Constructions · 4K Ultra HD Walkthroughs
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-cream/10 hover:bg-cream/20 active:scale-90 text-cream flex items-center justify-center transition-all cursor-pointer flex-shrink-0 z-30"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <video
            key={currentVideo}
            src={currentVideo}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Playlist Selector */}
        <div className="p-3.5 sm:p-6 bg-olive-card border-t border-cream/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono uppercase tracking-widest text-lime hidden sm:inline">
            Select Walkthrough
          </span>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {playlist.map((item) => {
              const isActive = currentVideo === item.src;
              return (
                <button
                  key={item.src}
                  onClick={() => setCurrentVideo(item.src)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 min-h-[44px] cursor-pointer ${
                    isActive
                      ? 'bg-lime text-olive shadow-sm font-semibold'
                      : 'bg-cream/10 text-cream/80 hover:bg-cream/20 border border-cream/10'
                  }`}
                >
                  <Play className={`w-3 h-3 ${isActive ? 'fill-olive text-olive' : 'fill-cream text-cream'}`} />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
