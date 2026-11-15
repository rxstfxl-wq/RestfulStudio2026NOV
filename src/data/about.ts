import { ExperienceItem, AwardItem, ClientItem, ServiceItem } from '../types';

export interface EducationItem {
  year: string;
  degree: string;
  institution: string;
  highlights: string[];
}

export const AUSTIN_PROFILE = {
  name: 'AUSTIN FOUCHE',
  title: 'GRAPHIC DESIGNER & BRAND DESIGNER',
  subtitle: 'FOUNDER & CREATIVE DIRECTOR — RXSTFXL STUDIO',
  bioLines: [
    "I'm a multidisciplinary Brand & Graphic Designer specialising in brand identity, marketing, UX/UI and digital design.",
    'I work with businesses, established brands and creative teams to create distinctive visual identities, impactful campaigns and purposeful digital experiences across branding, advertising, editorial, web and print.',
    'Combining strategic thinking, contemporary design and a background in Software Development, I bridge creative direction with practical implementation.',
    'Through my independent creative practice, RXSTFXL, I offer freelance and contracted design services, while remaining open to studio and agency collaborations. I bring a flexible, considered approach to delivering professional, studio-quality creative work.',
    'Good design should look distinctive, communicate clearly and work effectively.',
    'Available for freelance, contract and full-time opportunities, locally and remotely.'
  ],
  location: 'Cape Town, South Africa',
  availability: 'Available for Freelance / Full Time / On-site / Hybrid / Remote',
  email: 'rxstfxl@gmail.com',
  phone: '+27 (0) 60 973 3782',
  instagram: '@rxstfxl.studio',
  instagramUrl: 'https://www.instagram.com/rxstfxl.studio/',
  linkedin: 'linkedin.com/in/austin-fouche-73aa0b326',
  website: 'rxstfxl.wixsite.com/rxstfxlstudio',
  behance: 'behance.net/rxstfxl1',
  behanceUrl: 'https://www.behance.net/rxstfxl1',
  corePhilosophy: [
    {
      title: 'Design as Architecture',
      content: 'We treat graphic layouts like physical space. Hierarchy, weight, tension, and structural grids determine how a user navigates and feels an identity.'
    },
    {
      title: 'Eradicate Visual Noise',
      content: 'Every element must earn its place on the grid. If a line, shape, or shadow does not clarify the message, it is eliminated.'
    },
    {
      title: 'Material Honesty',
      content: 'Whether digital pixels, heavy paper stock, embossed aluminum, or raw concrete signage—the medium should speak with authentic texture and tactile permanence.'
    },
    {
      title: 'Intentional Contrast',
      content: 'Monochrome density broken by single tactical moments of Signal Red creates unshakeable visual authority.'
    }
  ]
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    year: '2025 — PRESENT',
    role: 'SOLO GRAPHIC DESIGNER & BRAND DESIGNER',
    company: 'LAGOON BEACH HOTEL & SPA',
    location: 'Cape Town, South Africa',
    description: 'Sole in-house designer responsible for all creative output across the hotel and multiple hospitality brands. Developed complete visual identities, brand guidelines, and led rebranding initiatives across multiple business units. Designed marketing campaigns, menus, brochures, signage, window graphics, vehicle branding, UX/UI website assets, motion graphics, social campaigns, and print collateral while collaborating directly with management and external print suppliers.',
    tags: ['Brand Identity', 'Multi-Brand Management', 'UX/UI Design', 'Print & Large Format', 'Motion Graphics', 'Hospitality']
  },
  {
    year: '2022 — PRESENT',
    role: 'FOUNDER & CREATIVE DIRECTOR',
    company: 'RXSTFXL STUDIO',
    location: 'Cape Town / Global Remote',
    description: 'Directing brand strategy, architectural identity systems, packaging, editorial layout, and digital experiences for high-end international clients across hospitality, fashion, athletics, and technology.',
    tags: ['Creative Direction', 'Brand Systems', 'Editorial', 'Packaging', 'Digital Products']
  },
  {
    year: '2023 — 2024',
    role: 'GRAPHIC DESIGNER & PUBLICATION DESIGNER',
    company: 'THE Z-CREATIVE & ZORYN! MAGAZINE',
    location: 'Cape Town / Remote',
    description: 'Spearheaded editorial design, magazine layout, cover creation, and publication production. Developed brand identity systems and supported high-level creative direction for editorial releases.',
    tags: ['Editorial Design', 'Magazine Layout', 'Cover Design', 'Typography', 'Publication Production']
  },
  {
    year: '2023',
    role: 'GRAPHIC DESIGNER INTERN',
    company: 'TUTORLABS AU',
    location: 'Internship / Remote',
    description: 'Created logo designs, brand identity systems, website layouts, UX/UI interfaces, interactive Figma prototypes, and digital marketing collateral.',
    tags: ['Logo Design', 'Brand Identity', 'UX/UI', 'Figma Prototyping', 'Marketing Assets']
  },
  {
    year: '2023',
    role: 'GRAPHIC DESIGNER INTERN',
    company: 'BIG IMPROVEMENTS AU',
    location: 'Internship / Remote',
    description: 'Executed brand creation, website design, UI/UX layouts, digital assets, and responsive interface systems.',
    tags: ['Brand Creation', 'Website Design', 'UX/UI', 'Digital Assets', 'Responsive Design']
  }
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    year: '2024 — 2025',
    degree: 'HIGHER CERTIFICATE IN GRAPHIC DESIGN',
    institution: 'Red & Yellow: Creative School of Business',
    highlights: ['Branding', 'Editorial Design', 'Packaging', 'Typography', 'Creative Direction', 'UX/UI Design', 'Professional Practice', 'Marketing', 'Design Thinking']
  },
  {
    year: '2023 — 2024',
    degree: 'DIPLOMA IN SOFTWARE DEVELOPMENT',
    institution: 'CTU Training Solutions',
    highlights: ['Programming Fundamentals', 'HTML', 'CSS', 'JavaScript', 'Python', 'C#', 'Cloud Computing']
  },
  {
    year: '2022 — 2023',
    degree: 'HIGHER CERTIFICATE IN DESIGN THINKING',
    institution: 'Greenside Design Center (AIE/GDC)',
    highlights: ['Human-Centred Design', 'Visual Communication', 'Design Theory', 'UX/UI', 'Adobe Creative Suite', 'Typography']
  },
  {
    year: '2021',
    degree: 'NATIONAL SENIOR CERTIFICATE',
    institution: 'Teneo Education',
    highlights: ['Matric Graduate']
  }
];

export const SKILLS_LIST = {
  adobe: [
    'Photoshop',
    'Illustrator',
    'InDesign',
    'After Effects',
    'Adobe XD'
  ],
  designTools: [
    'Figma',
    'Blender',
    'Canva'
  ],
  webDev: [
    'HTML & CSS',
    'JavaScript',
    'Python',
    'C#',
    'Visual Studio Code',
    'Wix / WordPress / Webflow',
    'Profitroom CMS'
  ],
  fundamentals: [
    'Design Thinking',
    'Visual Communication',
    'Brand Strategy',
    'Typography',
    'Layout & Grid Systems',
    'Colour Theory',
    'Visual Hierarchy',
    'Composition',
    'Accessibility',
    'Responsive Design',
    'Human-Centred Design'
  ]
};

export const EXPERTISE_CATEGORIES = [
  {
    category: 'BRAND DESIGN',
    items: ['Brand Identity Design', 'Brand Development', 'Rebranding', 'Logo Design', 'Brand Naming', 'Brand Guidelines', 'Creative Strategy', 'Visual Identity Systems', 'Packaging Design']
  },
  {
    category: 'DIGITAL DESIGN',
    items: ['UX/UI Design', 'Website Design', 'Landing Page Design', 'Responsive Design', 'User Research', 'User Testing', 'Email Marketing Design', 'Social Media Campaigns', 'Digital Advertising']
  },
  {
    category: 'GRAPHIC DESIGN',
    items: ['Marketing Campaign Design', 'Editorial & Publication Design', 'Print Design', 'Typography', 'Layout & Composition', 'Menu Design', 'Brochure Design', 'Flyer & Poster Design', 'Signage Systems & Wayfinding', 'Vehicle Branding', 'Window Graphics']
  },
  {
    category: 'MOTION & MULTIMEDIA',
    items: ['Motion Graphics', 'Animation', 'Video Editing', 'Visual Effects (VFX)', '3D Modelling', 'Multimedia Design']
  },
  {
    category: 'PRODUCTION',
    items: ['Print-Ready Artwork', 'Print Proofing', 'Colour Management', 'Printer Liaison', 'Asset Preparation', 'Quality Assurance']
  },
  {
    category: 'CREATIVE LEADERSHIP',
    items: ['Creative Direction', 'Multi-Brand Management', 'Stakeholder Presentations', 'Cross-Functional Collaboration', 'Mentoring & Knowledge Sharing', 'Creative Problem Solving']
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Brand Identity Systems',
    disciplines: ['Naming', 'Visual Identity', 'Brand Guidelines', 'Logo Systems', 'Design Tokens'],
    description: 'Comprehensive, scalable visual identities engineered for timeless authority across digital and physical touchpoints.'
  },
  {
    id: 's2',
    title: 'Editorial & Print Design',
    disciplines: ['Monographs', 'Type Specimens', 'Lookbooks', 'Packaging', 'Environmental Signage'],
    description: 'Tactile print production focusing on heavy paper stock, foil stamping, custom binding, and Swiss editorial typography.'
  },
  {
    id: 's3',
    title: 'Digital Experience & Web',
    disciplines: ['UX/UI Design', 'Custom E-Commerce', 'Interactive Prototyping', 'Design Systems'],
    description: 'High-performance interactive web portals and product interfaces that merge brutalist aesthetics with effortless usability.'
  },
  {
    id: 's4',
    title: 'Creative Direction & Photography',
    disciplines: ['Campaign Direction', 'Set Design', 'Fashion Lookbooks', '3D Mockups'],
    description: 'Comprehensive visual storytelling, campaign production, art direction, and high-impact photographic direction.'
  }
];

export const AWARDS: AwardItem[] = [
  { year: '2025', title: 'Site of the Day & Developer Award', organization: 'Awwwards', project: 'LBH Active Rebranding' },
  { year: '2025', title: 'Best Packaging Gold', organization: 'African Design Index', project: 'Seabreeze Cafe Roastery' },
  { year: '2024', title: 'Pentawards Gold Trophy', organization: 'Pentawards International', project: 'Au Bleu Parfumerie' },
  { year: '2024', title: 'Top 10 Hospitality Identity', organization: 'Wallpaper* Magazine', project: 'La Mizu Hotel & Spa' },
  { year: '2023', title: 'Typographic Excellence Award', organization: 'Type Directors Club NYC', project: 'RXSTFXL Type Specimen' }
];

export const CLIENTS: ClientItem[] = [
  { name: 'Lagoon Beach Hotel & Spa', industry: 'Luxury Hospitality & Wellness', year: '2025' },
  { name: 'LBH Active Performance', industry: 'Athletic Apparel & Labs', year: '2025' },
  { name: 'Seabreeze Roasters', industry: 'Artisanal Coffee & Hospitality', year: '2025' },
  { name: 'The Z-Creative & ZORYN!', industry: 'Fashion & Cultural Publication', year: '2024' },
  { name: 'TutorLabs AU & Big Improvements', industry: 'EdTech & Digital Platforms', year: '2023' }
];

