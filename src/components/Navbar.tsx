import React, { useState, useEffect, useRef } from 'react';
import { siteContent } from '../data/content';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';

interface NavbarProps {
  onOpenQuoteModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuoteModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Focus trap inside mobile menu
  useEffect(() => {
    if (!mobileMenuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }, [mobileMenuOpen]);

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.start();
    }
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        if (lenis) {
          lenis.scrollTo(element as HTMLElement, { offset: -30 });
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 80);
  };

  const handleMobileQuoteClick = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.start();
    }
    onOpenQuoteModal?.();
  };

  return (
    <>
      <header
        className="fixed top-3 md:top-6 left-0 right-0 z-50 flex justify-center px-3 md:px-4 pointer-events-none"
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-3 md:gap-6 px-3.5 md:px-6 h-14 md:h-auto py-2 md:py-3 rounded-full transition-all duration-300 max-w-6xl w-full border ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl shadow-nav border-black/10'
              : 'bg-white/90 backdrop-blur-md shadow-sm border-black/5'
          }`}
          aria-label="Main Navigation"
        >
          {/* Left: Brand Logo & Wordmark */}
          <a
            href="#hero"
            className="flex items-center gap-2 sm:gap-2.5 text-ink group focus:outline-none focus-visible:ring-2 focus-visible:ring-lime rounded-full flex-shrink-0 whitespace-nowrap min-h-[44px]"
            aria-label="Monolith Constructions - Return to top"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-lime flex items-center justify-center p-1 transition-transform group-hover:rotate-12 duration-300 shadow-sm flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-4 h-4 sm:w-5 sm:h-5 fill-none stroke-olive stroke-[6]">
                <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" className="fill-lime stroke-none" />
                <path d="M50 24 L68 35 V72 H32 V35 Z" fill="none" />
                <path d="M50 24 V72" />
                <path d="M38 48 H62" />
                <path d="M38 60 H62" />
                <path d="M26 72 H74" strokeWidth="8" />
              </svg>
            </div>
            <span className="font-urbanist font-semibold text-[clamp(15px,4.2vw,18px)] tracking-tight text-ink whitespace-nowrap">
              {siteContent.global.brandName}
            </span>
          </a>

          {/* Center Links (Desktop only) */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14.5px] font-medium text-ink/80 flex-shrink-0 whitespace-nowrap">
            {siteContent.nav.links.map((link) => (
              <li key={link.label} className="flex-shrink-0 whitespace-nowrap">
                <a
                  href={link.href}
                  className="hover:text-ink transition-colors duration-200 py-1 px-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-lime hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Phone & CTA Button (Desktop only) */}
          <div className="hidden lg:flex items-center gap-3 md:gap-4 flex-shrink-0 whitespace-nowrap">
            <a
              href={`tel:${siteContent.global.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-ink/75 hover:text-ink transition-colors whitespace-nowrap flex-shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-olive flex-shrink-0" />
              <span className="whitespace-nowrap">{siteContent.global.phoneDisplay}</span>
            </a>

            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="bg-lime text-olive font-medium text-[13.5px] px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-lime-hover transition-all duration-300 flex items-center gap-1.5 shadow-sm active:scale-95 group whitespace-nowrap flex-shrink-0 cursor-pointer min-h-[44px]"
            >
              <span className="whitespace-nowrap">Get a free quote</span>
              <span className="w-5 h-5 rounded-full bg-olive text-lime flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          </div>

          {/* Mobile Right: Quick Quote button + Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="bg-lime text-olive font-semibold text-xs px-3.5 py-2 rounded-full hover:bg-lime-hover active:scale-95 transition-all flex items-center gap-1 shadow-sm whitespace-nowrap min-h-[40px] cursor-pointer"
            >
              <span>Free quote</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-ink hover:bg-black/5 active:bg-black/10 transition-colors focus:outline-none flex-shrink-0 cursor-pointer min-h-[40px]"
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-[100] bg-[#1B1D0F] text-cream flex flex-col justify-between p-6 sm:p-10 pt-[max(20px,env(safe-area-inset-top,20px))] pb-[max(24px,env(safe-area-inset-bottom,24px))] transition-all duration-300 ease-out lg:hidden h-[100dvh] ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-3'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Top bar inside mobile overlay */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-lime flex items-center justify-center p-1">
              <svg viewBox="0 0 100 100" className="w-5 h-5 fill-none stroke-olive stroke-[6]">
                <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" className="fill-lime stroke-none" />
                <path d="M50 24 L68 35 V72 H32 V35 Z" fill="none" />
                <path d="M50 24 V72" />
                <path d="M26 72 H74" strokeWidth="8" />
              </svg>
            </div>
            <span className="font-urbanist font-semibold text-lg text-cream">
              {siteContent.global.brandName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="w-11 h-11 rounded-full bg-cream/10 text-cream hover:bg-cream/20 active:scale-95 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close mobile menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center Large Navigation Links */}
        <nav className="my-auto py-6">
          <ul className="flex flex-col gap-5 sm:gap-7">
            {siteContent.nav.links.map((link, idx) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleMobileNavClick(e, link.href)}
                  className="font-urbanist text-[28px] sm:text-[32px] font-semibold text-cream hover:text-lime active:text-lime transition-colors flex items-center justify-between group py-1.5 cursor-pointer"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono text-cream/40 group-hover:text-lime">
                    0{idx + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Contacts & Lime Pill CTA full width */}
        <div className="pt-5 border-t border-cream/10 flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-sm text-cream/70">
            <span className="text-xs uppercase font-mono tracking-wider text-lime">Direct Line</span>
            <a
              href={`tel:${siteContent.global.phone.replace(/\s+/g, '')}`}
              className="text-lg text-cream hover:text-lime font-medium flex items-center gap-2 py-1"
            >
              <Phone className="w-4 h-4 text-lime" />
              <span>{siteContent.global.phoneDisplay}</span>
            </a>
          </div>

          <button
            type="button"
            onClick={handleMobileQuoteClick}
            className="w-full bg-lime text-olive font-semibold text-base py-4 px-6 rounded-full hover:bg-lime-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-glow-lime cursor-pointer min-h-[48px]"
          >
            <span>Get a free quote</span>
            <span className="w-6 h-6 rounded-full bg-olive text-lime flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
