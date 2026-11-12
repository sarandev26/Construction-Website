// src/data/content.ts
// Central single source of truth for all content, copy, and scroll-video configuration.

export interface NavItem {
  label: string;
  href: string;
}

export interface VideoStage {
  eyebrow?: string;
  headline: string;
  sub: string;
  cta?: string;
  tags?: string[];
}

export interface RoomStage {
  eyebrow: string;
  headline: string;
  body: string;
  tags?: string[];
}

export type TextAnchor = 'center' | 'bottom';

export interface FocusPoint {
  x: number;
  y: number;
}

export interface PinnedVideoSectionConfig {
  id: string;
  sectionNumber: number;
  roomName: string;
  folder: string;
  frameCount: number;
  pinHeight: string;
  mobilePinHeight: string;
  focusPoint?: FocusPoint;
  textAnchor: TextAnchor;
  stages: [RoomStage, RoomStage, RoomStage];
  stats?: { value: number | string; label: string; prefix?: string; suffix?: string }[];
}

export interface PromiseCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  features: string[];
  image: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  location: string;
  type: string;
  area: string;
  image: string;
}

export interface DifferencePoint {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
}

export interface LeaderItem {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface JournalItem {
  id: string;
  title: string;
  tag: string;
  date: string;
  readTime: string;
  image: string;
}

// Single source of truth for the company brand name across the entire site
export const COMPANY_NAME = "Monolith Constructions";

// Global uniform pinning constants so every section scrolls at identical speeds
export const PIN_HEIGHT_DESKTOP = "350vh";
export const PIN_HEIGHT_MOBILE = "450vh";
export const TOTAL_FRAMES = 96;

export const siteContent = {
  global: {
    brandName: COMPANY_NAME,
    tagline: "A new standard of excellence.",
    phone: "+91 98765 43210",
    phoneDisplay: "+91 98765 43210",
    email: "hello@monolithconstructions.in",
    address: "42, Residency Road, Coimbatore, Tamil Nadu - 641018",
    ctaQuote: "Get a free quote",
    ctaStart: "Start your project",
  },

  nav: {
    links: [
      { label: "Home", href: "#hero" },
      { label: "Spaces", href: "#living-room" },
      { label: "Services", href: "#services" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ] as NavItem[],
  },

  heroIntro: {
    headline: "A new standard of excellence.",
    sub: "Premium homes and commercial spaces, crafted with 20 years of trust.",
    primaryCta: "View all services",
    secondaryCta: "Watch",
  },

  // Pinned Section 1: Hero (Blueprint to house)
  videoSection1: {
    sectionId: "section1",
    title: "Blueprint to house",
    eyebrowChapter: "Chapter 01",
    pinHeight: PIN_HEIGHT_DESKTOP,
    mobilePinHeight: PIN_HEIGHT_MOBILE,
    frameCount: TOTAL_FRAMES,
    folderPath: "/frames/section1",
    textAnchor: "center" as TextAnchor,
    stages: [
      {
        eyebrow: "Chapter 01 · Vision",
        headline: "Every great build starts as a single line.",
        sub: "Before the first brick, there is a plan. We begin with your idea and draw it into reality.",
      },
      {
        eyebrow: "Chapter 01 · Design",
        headline: "We draw it with precision.",
        sub: "Detailed architectural planning, structural engineering, and 3D visualisation, finalised before work begins.",
      },
      {
        eyebrow: "Chapter 01 · Build",
        headline: "We build it to last.",
        sub: "Premium materials, certified craftsmen, and daily site supervision for flawless execution.",
      },
      {
        eyebrow: "Chapter 01 · Handover",
        headline: "Your home, delivered.",
        sub: "On time. On budget. Built with Monolith Constructions.",
        cta: "Get a free quote",
      },
    ] as VideoStage[],
  },

  // Pinned Sections 2 to 6 (Living hall, Kitchen, Bedroom, Bathroom, Backyard)
  pinnedSections: [
    {
      id: "living-room",
      sectionNumber: 2,
      roomName: "Living hall",
      folder: "/frames/living-room",
      frameCount: TOTAL_FRAMES,
      pinHeight: PIN_HEIGHT_DESKTOP,
      mobilePinHeight: PIN_HEIGHT_MOBILE,
      textAnchor: "bottom" as TextAnchor,
      stages: [
        {
          eyebrow: "Living hall · 01 Layout & light",
          headline: "The anchor of the home",
          body: "A 24-foot double-height void connects the ground level to the mezzanine, drawing southern daylight deep into the plan.",
        },
        {
          eyebrow: "Living hall · 02 Craft & finish",
          headline: "Raw concrete meets warm teak",
          body: "Board-formed concrete feature wall balanced by hand-planed Indian teak rafters and continuous terrazzo flooring.",
        },
        {
          eyebrow: "Living hall · 03 The finished room",
          headline: "Quiet grandeur for everyday living",
          body: "Integrated acoustic plaster ceilings absorb echo, keeping a vast open volume feeling intimate and calm.",
          tags: ["24 ft ceiling void", "Hand-planed teak", "Continuous terrazzo"],
        },
      ],
    },
    {
      id: "kitchen",
      sectionNumber: 3,
      roomName: "Modular kitchen",
      folder: "/frames/kitchen",
      frameCount: TOTAL_FRAMES,
      pinHeight: PIN_HEIGHT_DESKTOP,
      mobilePinHeight: PIN_HEIGHT_MOBILE,
      textAnchor: "bottom" as TextAnchor,
      stages: [
        {
          eyebrow: "Kitchen · 01 Work triangle",
          headline: "Engineered around movement",
          body: "A wide preparation island anchors the space, keeping prep, cooking and washing within two effortless steps.",
        },
        {
          eyebrow: "Kitchen · 02 Surfaces & joinery",
          headline: "Fluted glass and honed granite",
          body: "Full-height fluted glass cabinets with warm backlighting, paired with 20mm leathered Black Pearl granite counters.",
        },
        {
          eyebrow: "Kitchen · 03 The finished kitchen",
          headline: "A kitchen made for hosting",
          body: "Concealed appliance garages and push-to-open Blum hardware keep the counters clear even when entertaining twenty.",
          tags: ["Leathered granite", "Blum motion hardware", "Concealed spice kitchen"],
        },
      ],
    },
    {
      id: "bedroom",
      sectionNumber: 4,
      roomName: "Master bedroom",
      folder: "/frames/bedroom",
      frameCount: TOTAL_FRAMES,
      pinHeight: PIN_HEIGHT_DESKTOP,
      mobilePinHeight: PIN_HEIGHT_MOBILE,
      textAnchor: "bottom" as TextAnchor,
      stages: [
        {
          eyebrow: "Master suite · 01 Sanctuary",
          headline: "A quiet wing apart from the house",
          body: "Positioned on the northeast corner to catch gentle morning light while staying shaded through hot afternoons.",
        },
        {
          eyebrow: "Master suite · 02 Texture & tone",
          headline: "Linen, ribbed timber, soft shadows",
          body: "Custom ribbed white-ash headboard wall with integrated brass reading lights and concealed perimeter cove glow.",
        },
        {
          eyebrow: "Master suite · 03 The finished suite",
          headline: "Rest, restored",
          body: "Motorized blackout shades recess into the ceiling pocket, turning the suite dark and whisper-quiet at a touch.",
          tags: ["Northeast morning light", "Ribbed white ash", "Integrated walk-in wardrobe"],
        },
      ],
    },
    {
      id: "bathroom",
      sectionNumber: 5,
      roomName: "Spa bathroom",
      folder: "/frames/bathroom",
      frameCount: TOTAL_FRAMES,
      pinHeight: PIN_HEIGHT_DESKTOP,
      mobilePinHeight: PIN_HEIGHT_MOBILE,
      textAnchor: "bottom" as TextAnchor,
      stages: [
        {
          eyebrow: "En-suite · 01 Flow & privacy",
          headline: "A wet room inspired by Japanese onsens",
          body: "Frameless fluted glass separates the dry vanity from the sunken soaking zone without breaking visual depth.",
        },
        {
          eyebrow: "En-suite · 02 Materials",
          headline: "Honed limestone and brushed brass",
          body: "Large-format Kota limestone slabs laid with hairline joints, complemented by wall-mounted brushed brass mixers.",
        },
        {
          eyebrow: "En-suite · 03 The finished bath",
          headline: "Your morning ritual, elevated",
          body: "Rain shower recessed flush into the ceiling with thermostatic memory and an open skylight overhead.",
          tags: ["Sunken soaking tub", "Brushed brass tapware", "Kota stone slabs"],
        },
      ],
    },
    {
      id: "backyard",
      sectionNumber: 6,
      roomName: "Private backyard",
      folder: "/frames/backyard",
      frameCount: TOTAL_FRAMES,
      pinHeight: PIN_HEIGHT_DESKTOP,
      mobilePinHeight: PIN_HEIGHT_MOBILE,
      textAnchor: "bottom" as TextAnchor,
      stages: [
        {
          eyebrow: "Landscape · 01 Indoor-outdoor blur",
          headline: "The garden brought into the room",
          body: "Floor-to-ceiling sliding glass panels glide into hidden wall pockets, uniting the living hall with the garden.",
        },
        {
          eyebrow: "Landscape · 02 Hardscape & greens",
          headline: "Basalt pavers, native flora, running water",
          body: "Chiseled basalt stone walkways wind through frangipani and bird-of-paradise, bordered by a quiet water rill.",
        },
        {
          eyebrow: "Landscape · 03 The finished sanctuary",
          headline: "Evenings under the canopy",
          body: "Concealed 2700K tree up-lights and low step-lights turn the backyard into an outdoor living room after dusk.",
          tags: ["Pocket sliding glass", "Chiseled basalt pavers", "Architectural night lighting"],
        },
      ],
    },
  ] as PinnedVideoSectionConfig[],

  // Section 8: Our Promise
  ourPromise: {
    eyebrow: "Our promise",
    heading: "Built to last. Backed in writing.",
    cards: [
      {
        id: "warranty",
        icon: "ShieldCheck",
        title: "10-year structural warranty",
        description: "Every foundation, column, beam, and slab covered for a full decade from handover day.",
      },
      {
        id: "fixed-cost",
        icon: "CalendarCheck",
        title: "Fixed-cost contracts",
        description: "The price we quote is the price you pay. Zero hidden extras, zero surprise escalations mid-build.",
      },
      {
        id: "progress",
        icon: "Eye",
        title: "Progress you can see",
        description: "Weekly photo and video updates through your private client portal, plus live site-camera access.",
      },
      {
        id: "certified",
        icon: "Award",
        title: "Certified materials only",
        description: "Tata Tiscon steel, Ultratech cement, Saint-Gobain glass. Every batch accompanied by test certificates.",
      },
    ] as PromiseCard[],
    bannerText: "Ready to start your story? Schedule a private 45-minute architectural consultation with our principal team.",
    bannerCta: "Start your project",
  },

  whoWeAre: {
    eyebrow: "Who we are",
    heading: "We build landmark homes and spaces people are proud of.",
    cards: [
      {
        id: "what-we-do",
        number: "01",
        title: "What we do",
        description: "We maintain this by ensuring transparency and professional conduct in every aspect of every build.",
        linkText: "Our solutions",
        type: "olive",
      },
      {
        id: "our-impact",
        number: "02",
        title: "Our impact",
        description: "We work with homeowners, investors, and developers to create landmarks that make an impact.",
        linkText: "See projects",
        type: "lime",
        image: "/images/about-house.webp",
      },
      {
        id: "the-craft",
        number: "03",
        title: "The craft",
        description: "Every detail matters, from foundations to finishes. We craft homes meant to last generations.",
        linkText: "Discover more",
        type: "photo",
        image: "/images/about-building.webp",
      },
    ],
  },

  servicesMarquee: [
    { title: "Turnkey Residential Construction", image: "/images/marquee-1.webp" },
    { title: "Luxury Villa Architecture", image: "/images/marquee-2.webp" },
    { title: "Commercial Landmarks", image: "/images/services-2.webp" },
    { title: "Sustainable Green Buildings", image: "/images/services-6.webp" },
    { title: "Interior Architecture & Millwork", image: "/images/services-4.webp" },
    { title: "Heritage Restorations", image: "/images/about-building.webp" },
    { title: "Landscape & Hardscape Engineering", image: "/images/services-3.webp" },
  ],

  services: {
    eyebrow: "Our services",
    heading: "End-to-end expertise for every scale.",
    items: [
      {
        id: "s1",
        number: "01",
        title: "Turnkey home construction",
        description: "Complete design-and-build service for custom homes, from site survey to final handover.",
        features: ["Custom architectural plans", "Soil & structural engineering", "Premium civil & MEP work"],
        image: "/images/services-1.webp",
      },
      {
        id: "s2",
        number: "02",
        title: "Commercial buildings",
        description: "High-spec commercial spaces, offices, and retail complexes built to strict safety standards.",
        features: ["Grade-A office towers", "Multi-tenant retail complexes", "LEED compliance planning"],
        image: "/images/services-2.webp",
      },
      {
        id: "s3",
        number: "03",
        title: "Luxury custom villas",
        description: "One-of-a-kind residences with double-height spaces, swimming pools, and landscaped courtyards.",
        features: ["Private courtyards & decks", "Infinity pools & waterscapes", "Double-height living voids"],
        image: "/images/services-3.webp",
      },
      {
        id: "s4",
        number: "04",
        title: "Interior architecture and fit-out",
        description: "Bespoke millwork, modular kitchens, acoustic plaster ceilings, and curated finishes.",
        features: ["German modular hardware", "Acoustic plaster ceilings", "Bespoke hardwood joinery"],
        image: "/images/services-4.webp",
      },
      {
        id: "s5",
        number: "05",
        title: "Renovation and expansion",
        description: "Structural retrofits, additional floors, and complete modern redesigns of existing properties.",
        features: ["RCC column retrofitting", "Floor-plan reconfiguration", "Facade modernisations"],
        image: "/images/services-5.webp",
      },
      {
        id: "s6",
        number: "06",
        title: "Sustainable construction",
        description: "Solar integration, rainwater harvesting, passive cooling, and green-certified materials.",
        features: ["Rooftop solar arrays", "Groundwater recharge wells", "Low-carbon fly-ash cement"],
        image: "/images/services-6.webp",
      },
    ] as ServiceItem[],
  },

  featuredProjects: {
    eyebrow: "Featured work",
    heading: "Homes and spaces we've brought to life.",
    buttonText: "View all projects",
    items: [
      {
        id: "p1",
        name: "The Glass Villa",
        location: "Coimbatore",
        type: "Residential",
        area: "6,500 sq ft",
        image: "/images/projects-1.webp",
      },
      {
        id: "p2",
        name: "Zenith Heights",
        location: "Bengaluru",
        type: "Commercial",
        area: "45,000 sq ft",
        image: "/images/projects-2.webp",
      },
      {
        id: "p3",
        name: "The Courtyard House",
        location: "Chennai",
        type: "Residential",
        area: "8,200 sq ft",
        image: "/images/projects-3.webp",
      },
      {
        id: "p4",
        name: "Aura Corporate Park",
        location: "Kochi",
        type: "Office",
        area: "78,000 sq ft",
        image: "/images/projects-4.webp",
      },
      {
        id: "p5",
        name: "The Perch",
        location: "Ooty",
        type: "Weekend home",
        area: "4,800 sq ft",
        image: "/images/projects-5.webp",
      },
      {
        id: "p6",
        name: "Nova Retail Square",
        location: "Hyderabad",
        type: "Retail",
        area: "52,000 sq ft",
        image: "/images/projects-6.webp",
      },
    ] as ProjectItem[],
  },

  whatMakesUsDifferent: {
    eyebrow: "Why Monolith",
    heading: "What makes us different.",
    collageImage: "/images/team-collage.webp",
    points: [
      {
        id: "p1",
        number: "01",
        title: "Corporate responsibility",
        description: "Ethical practices and sustainable building at every site.",
        iconName: "ShieldCheck",
      },
      {
        id: "p2",
        number: "02",
        title: "Expert craftsmanship",
        description: "In-house engineers and skilled teams with decades of experience.",
        iconName: "Award",
      },
      {
        id: "p3",
        number: "03",
        title: "Security and compliance",
        description: "Full legal, safety, and regulatory compliance on every project.",
        iconName: "FileCheck",
      },
      {
        id: "p4",
        number: "04",
        title: "Transparent pricing",
        description: "Fixed-cost contracts with no hidden charges.",
        iconName: "Coins",
      },
      {
        id: "p5",
        number: "05",
        title: "On-time delivery",
        description: "Milestone-based schedules and real-time progress updates.",
        iconName: "Clock",
      },
      {
        id: "p6",
        number: "06",
        title: "Customer-first process",
        description: "A dedicated manager and a 10-year structural warranty.",
        iconName: "Sparkles",
      },
    ] as DifferencePoint[],
  },

  leadership: {
    heading: "Meet the people behind the build.",
    members: [
      {
        id: "meera",
        name: "Meera Raghavan",
        role: "Founder and managing director",
        image: "/images/leader-1.webp",
      },
      {
        id: "arvind",
        name: "Arvind Menon",
        role: "Chief engineer",
        image: "/images/leader-2.webp",
      },
      {
        id: "karthik",
        name: "Karthik Subramanian",
        role: "Head of design and planning",
        image: "/images/leader-3.webp",
      },
    ] as LeaderItem[],
  },

  recognitions: {
    heading: "Recognitions we've earned.",
    awards: [
      "Excellence in residential design 2025",
      "Best sustainable builder 2024",
      "Top construction firm, South India",
      "Quality and safety champion 2024",
      "Customer satisfaction award 2025",
    ],
  },

  testimonials: {
    heading: "Happy clients, in their words.",
    familyImage: "/images/testimonial-family.webp",
    items: [
      {
        id: "t1",
        quote: "Monolith Constructions delivered our dream villa two weeks early, and the finish was beyond what we imagined.",
        author: "Priya and Rahul",
        role: "Homeowners",
      },
      {
        id: "t2",
        quote: "Transparent pricing and daily updates. We never had to chase them for anything.",
        author: "Mohan Das",
        role: "Business owner",
      },
      {
        id: "t3",
        quote: "From the first sketch to the final handover, the team was professional, honest, and precise.",
        author: "Anita Krishnan",
        role: "Investor",
      },
    ] as TestimonialItem[],
  },

  journal: {
    heading: "Discover inspiration and trends.",
    items: [
      {
        id: "j1",
        title: "How to choose the right materials for a 50-year home",
        tag: "Guide",
        date: "Nov 2026",
        readTime: "5 min read",
        image: "/images/journal-1.webp",
      },
      {
        id: "j2",
        title: "Modern villa design trends for 2026",
        tag: "Trends",
        date: "Oct 2026",
        readTime: "4 min read",
        image: "/images/journal-2.webp",
      },
      {
        id: "j3",
        title: "What to expect at each stage of your construction journey",
        tag: "Process",
        date: "Sep 2026",
        readTime: "7 min read",
        image: "/images/journal-3.webp",
      },
    ] as JournalItem[],
  },

  finalCta: {
    headline: "Your dream home awaits.",
    subtext: "Tell us about your plot and your vision. Get a detailed estimate within 48 hours.",
    buttonText: "Get a free quote",
    bgImage: "/images/cta-bg.webp",
  },

  footer: {
    headline: "Your dream home awaits.",
    cta: "Start your project",
    brandWordmark: "Monolith Constructions",
    company: {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Leadership", href: "#leadership" },
        { label: "Careers", href: "#contact" },
        { label: "Awards", href: "#recognitions" },
      ],
    },
    services: {
      title: "Services",
      links: [
        { label: "Residential", href: "#services" },
        { label: "Commercial", href: "#services" },
        { label: "Renovation", href: "#services" },
        { label: "Interiors", href: "#services" },
      ],
    },
    contact: {
      title: "Contact",
      address: "42, Residency Road, Coimbatore, Tamil Nadu",
      phone: "+91 98765 43210",
      email: "hello@monolithconstructions.in",
    },
    copyright: "© 2026 Monolith Constructions. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
};
