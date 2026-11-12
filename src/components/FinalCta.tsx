import React, { useState } from 'react';
import { siteContent } from '../data/content';
import { ArrowUpRight, CheckCircle2, Send, Phone, Mail, MapPin } from 'lucide-react';

interface FinalCtaProps {
  onOpenQuoteModal?: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenQuoteModal }) => {
  const content = siteContent.finalCta;
  const global = siteContent.global;

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    projectType: 'Residential Villa',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.phone) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-14 md:py-32 bg-olive text-cream overflow-hidden">
      {/* Background Faint Building Photography with Fog */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src={content.bgImage}
          alt="Architectural Skyline Silhouette"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-olive via-olive/90 to-olive/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Headline, Subtext, Contact Info & CTA Button */}
          <div className="lg:col-span-6">
            <div className="inline-block px-3.5 py-1 rounded-full border border-lime/30 bg-lime/10 text-lime text-xs font-mono uppercase tracking-wider mb-3 md:mb-4">
              Direct Consultation
            </div>

            <h2 className="font-urbanist font-semibold text-cream text-[clamp(28px,7.5vw,36px)] md:text-[clamp(36px,5vw,64px)] leading-[1.1] md:leading-tight-h2 tracking-tight-heading mb-4 md:mb-6">
              {content.headline}
            </h2>

            <p className="text-cream/80 text-[15px] sm:text-xl font-normal leading-relaxed mb-6 md:mb-8 max-w-lg">
              {content.subtext}
            </p>

            {/* Direct Contacts List */}
            <div className="space-y-3 sm:space-y-4 mb-6 md:mb-8">
              <a
                href={`tel:${global.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 text-cream/90 hover:text-lime transition-colors group min-h-[44px]"
              >
                <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center group-hover:bg-lime group-hover:text-olive transition-colors flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-medium text-base">{global.phoneDisplay}</span>
              </a>

              <a
                href={`mailto:${global.email}`}
                className="flex items-center gap-3 text-cream/90 hover:text-lime transition-colors group min-h-[44px]"
              >
                <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center group-hover:bg-lime group-hover:text-olive transition-colors flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium text-base">{global.email}</span>
              </a>

              <div className="flex items-center gap-3 text-cream/80 min-h-[44px]">
                <div className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-lime" />
                </div>
                <span className="text-sm">{global.address}</span>
              </div>
            </div>

            <button
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto bg-lime text-olive font-semibold text-base px-8 py-4 rounded-full hover:bg-lime-hover transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-glow-lime group min-h-[48px] cursor-pointer"
            >
              <span>{content.buttonText}</span>
              <span className="w-6 h-6 rounded-full bg-olive text-lime flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

          {/* Right Column: Contact Form (Single column, 16px text, 48px height inputs) */}
          <div className="lg:col-span-6">
            <div className="bg-[#232615] border border-cream/15 rounded-32 p-6 sm:p-10 shadow-2xl">
              <div className="mb-6">
                <h3 className="font-urbanist font-semibold text-xl sm:text-2xl text-cream mb-1">
                  Request an Estimate
                </h3>
                <p className="text-cream/70 text-sm">
                  Fill in your details and an engineer will connect within 48 hours.
                </p>
              </div>

              {submitted ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-lime text-olive flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-urbanist font-semibold text-2xl text-cream mb-2">
                    Message Received
                  </h4>
                  <p className="text-cream/75 text-sm max-w-sm mb-6 leading-relaxed">
                    Thank you, {formState.name}. Our project consultation team has received your enquiry and will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono uppercase tracking-wider text-lime underline min-h-[44px] cursor-pointer"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arun Kumar"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full h-12 px-4 rounded-20 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 focus:outline-none focus:border-lime transition-colors text-[16px]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-20 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 focus:outline-none focus:border-lime transition-colors text-[16px]"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1.5">
                      Project Type
                    </label>
                    <select
                      value={formState.projectType}
                      onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                      className="w-full h-12 px-4 rounded-20 bg-[#252816] border border-cream/20 text-cream focus:outline-none focus:border-lime transition-colors text-[16px]"
                    >
                      <option value="Residential Villa">Residential Villa / Independent House</option>
                      <option value="Commercial Development">Commercial / Office Complex</option>
                      <option value="Apartments Community">Apartment / Community Living</option>
                      <option value="Renovation & Remodel">Renovation & Remodelling</option>
                      <option value="Interior Fit-out">Interior Design & Fit-out</option>
                      <option value="Turnkey Construction">Turnkey Project Management</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-cream/70 mb-1.5">
                      Project Vision / Location & Plot Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your plot location, approximate square footage, or timeline..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full p-4 rounded-20 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 focus:outline-none focus:border-lime transition-colors text-[16px] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full h-12 bg-lime text-olive font-semibold text-[16px] px-6 rounded-full hover:bg-lime-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm mt-4 min-h-[48px] cursor-pointer"
                  >
                    <span>Send enquiry</span>
                    <Send className="w-4 h-4 text-olive" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
