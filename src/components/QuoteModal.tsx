import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'Residential Villa',
    budget: '₹1 Cr - ₹3 Cr',
    plotLocation: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-olive text-cream rounded-32 p-5 sm:p-10 border border-cream/15 shadow-2xl overflow-y-auto max-h-[90dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-cream/10 text-cream flex items-center justify-center hover:bg-cream/20 active:scale-90 transition-all cursor-pointer z-30 pointer-events-auto"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-lime text-olive flex items-center justify-center mb-5 shadow-glow-lime">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3
              id="modal-title"
              className="font-urbanist font-semibold text-2xl sm:text-3xl text-cream mb-2"
            >
              Consultation Scheduled
            </h3>
            <p className="text-cream/80 text-[15px] sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
              Thank you, {formData.name}. Our principal engineer will review your project requirements and connect via {formData.phone} within 24–48 hours with a customized feasibility breakdown.
            </p>
            <div className="p-3.5 rounded-20 bg-cream/5 border border-cream/10 text-xs font-mono text-lime mb-8">
              REFERENCE TICKET: #MC-{Math.floor(100000 + Math.random() * 900000)}
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-lime text-olive font-semibold px-8 py-3.5 rounded-full hover:bg-lime-hover transition-colors min-h-[44px] cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 pr-10">
              <div className="inline-block px-3 py-1 rounded-full border border-lime/30 bg-lime/10 text-lime text-xs font-mono uppercase tracking-wider mb-2">
                Complimentary Estimate
              </div>
              <h3
                id="modal-title"
                className="font-urbanist font-semibold text-xl sm:text-3xl text-cream leading-tight"
              >
                Start Your Construction Journey
              </h3>
              <p className="text-cream/70 text-sm mt-1">
                Tell us about your plot and design ambitions. Receive a detailed cost & timeline estimate within 48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Arun Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-20 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 focus:outline-none focus:border-lime transition-colors text-[16px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 px-4 rounded-20 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 focus:outline-none focus:border-lime transition-colors text-[16px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1">
                    Project Category
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full h-12 px-4 rounded-20 bg-[#252816] border border-cream/20 text-cream focus:outline-none focus:border-lime transition-colors text-[16px]"
                  >
                    <option value="Residential Villa">Custom Luxury Villa</option>
                    <option value="Commercial Complex">Commercial / Office Complex</option>
                    <option value="Apartments Community">Apartments Community</option>
                    <option value="Renovation">Renovation & Remodel</option>
                    <option value="Interiors">Interior Fit-out</option>
                    <option value="Turnkey">Turnkey Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1">
                    Estimated Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full h-12 px-4 rounded-20 bg-[#252816] border border-cream/20 text-cream focus:outline-none focus:border-lime transition-colors text-[16px]"
                  >
                    <option value="₹75L - ₹1.5 Cr">₹75 Lakhs - ₹1.5 Crore</option>
                    <option value="₹1.5 Cr - ₹3 Cr">₹1.5 Crore - ₹3 Crore</option>
                    <option value="₹3 Cr - ₹7 Cr">₹3 Crore - ₹7 Crore</option>
                    <option value="₹7 Cr+">₹7 Crore +</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1">
                  Plot Location & City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Race Course, Coimbatore or OMR, Chennai"
                  value={formData.plotLocation}
                  onChange={(e) => setFormData({ ...formData, plotLocation: e.target.value })}
                  className="w-full h-12 px-4 rounded-20 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 focus:outline-none focus:border-lime transition-colors text-[16px]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1">
                  Design Vision / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your architectural preferences, timelines, or plot area..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-4 rounded-20 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 focus:outline-none focus:border-lime transition-colors text-[16px] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-lime text-olive font-semibold text-base py-3 px-6 rounded-full hover:bg-lime-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-glow-lime mt-4 min-h-[48px] cursor-pointer"
              >
                <span>Submit Estimate Request</span>
                <span className="w-6 h-6 rounded-full bg-olive text-lime flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>

              <p className="text-center text-[11px] text-cream/50 mt-2">
                Confidentiality guaranteed. We respect your privacy and never share information.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
