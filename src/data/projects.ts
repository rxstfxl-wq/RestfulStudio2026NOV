import { MediaFileItem, Project } from '../types';
import { buildProjectFromScan, slugifyFolder } from '../utils/folderParser';

function makeMedia(
  projectId: string,
  folderPath: string,
  fileName: string,
  subfolder?: string
): MediaFileItem {
  const lower = fileName.toLowerCase();
  const type: MediaFileItem['type'] = lower.endsWith('.svg')
    ? 'svg'
    : lower.endsWith('.pdf')
      ? 'pdf'
      : lower.endsWith('.mp4') || lower.endsWith('.webm')
        ? 'video'
        : 'image';

  return {
    id: `${projectId}--${slugifyFolder(subfolder || 'root')}--${slugifyFolder(fileName)}`,
    name: fileName,
    url: `${folderPath}/${fileName}`,
    type,
    sizeBytes: 0,
    size: 'Studio Asset',
    date: '2026-06-01',
    subfolder,
  };
}

const SEABREEZE_EARLY_FILES = Array.from({ length: 16 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return makeMedia(
    'seabreeze',
    '/projects-media/Seabreeze/Seabreeze Early',
    `Seabreeze - Brand Guide (Manual) 2026 - June 2026_Page_${num}.png`,
    'Seabreeze Early'
  );
});

const SEABREEZE_IDEATION_FILES = [
  '01a Seabreeze Color Palette.png',
  '01b Seabreeze Typeface.png',
  '02a Seabreeze Logo Ideation 1 and 2.png',
  '02b Seabreeze Logo Ideation 3 and 4.png',
  '03 Free Three Cup PSD Mockups.jpg',
  '04 Cup Coffee with Menu Mockup-02.jpg',
].map((name) =>
  makeMedia(
    'seabreeze',
    '/projects-media/Seabreeze/Seabreeze earlier logo ideation',
    name,
    'Seabreeze earlier logo ideation'
  )
);

const REBIRTH_ROOT_FILES = [
  '0 behance Rebirth intro.png',
  '1 behance Rebirth logos.png',
  '2 behance Rebirth colors 1a.png',
  '3 behance Rebirth Type.png',
  '4 behance Rebirth Showcase.png',
  'Rebirth Atelier ad 2.png',
  'Rebirth Atelier ad 3 logo 3.png',
  'brand-01 Rebirth Atelier ad 3 logo 1.png',
  'brand-02 Rebirth Atelier ad 3 logo 2.png',
  'product-01 Black Ribbed Beanie with White Logo.png',
  'product-02 Rebirth 01 - Button Up Two Tone.jpg',
  'product-03 Rebirth 01 - Hoodie Rebirth and Sweatpants.jpg',
  'product-05 Black Carrier Bag - Rebirth.jpg',
  'product-06 White Carrier Bag - Rebirth.jpg',
].map((name) =>
  makeMedia('rebirth-ateliers', '/projects-media/Rebirth Ateliers', name)
);

const REBIRTH_CAROUSEL_FILES = [
  'RA01 - Carousel01 - Slide 01.mp4',
  'RA01 - Carousel01 - Slide 02.mp4',
  'RA01 - Carousel01 - Slide 03.jpg',
  'RA01 - Carousel01 - Slide 04.jpg',
  'RA01 - Carousel01 - Slide 05.mp4',
].map((name) =>
  makeMedia(
    'rebirth-ateliers',
    '/projects-media/Rebirth Ateliers/RebirthAteliers-Carousel-01',
    name,
    'RebirthAteliers-Carousel-01'
  )
);

const REBIRTH_VIDEO_FILES = [
  '02-Rebirth Ad  01 No its a rebrand A3.mp4',
].map((name) =>
  makeMedia(
    'rebirth-ateliers',
    '/projects-media/Rebirth Ateliers/RebirthAteliers-Videos',
    name,
    'RebirthAteliers-Videos'
  )
);

const LBH_ADS_FILES = [
  '01 2026 January Valentines Offer - Tabletalk 10 x 4 - 100mm x 128mm B.png',
  '01 2026 January Valentines Offer - Tabletalk 10 x 4 - 100mm x 128mm C_.jpg',
  '02C Google Ads - Collabs - CHOC Fdn Flipflop Day 2026 A-1.jpg',
  '02C Google Ads - Collabs - CHOC Fdn Flipflop Day 2026 A.jpg',
  '05 LBH-2026 - Meetings Mag - June - Aug - Banner - 300w x 600h px.jpg',
  '05 LBH-2026 - Meetings Mag - June - Aug - Banner - 300w x 600h px.png',
  '20p Coastal Weekend Nov2025 Google Ads.jpg',
  'Artboard 1.jpg',
  'Au Bleu 03 March 2026 - Easter Lunch 2026 - Menu Inserts.jpg',
  'Au Bleu 05 May 2026 - Mothers Day Buffet 2026 - Menu Inserts P.2 copy 2.jpg',
  'Celebrations 2026 - Google Ads A2.jpg',
  'Celebrations 2026 - Google Ads B2.jpg',
  'Coming Soon - Refurb Flyer A5.jpg',
  'Contreberg Wine.jpg',
  'Golden Mondays - Google Ads.jpg',
  'Golden Mondays A3.jpg',
  'Golden Mondays Screen.jpg',
  'LBH Refurb Disclaimer 1 2026 - Google Ads copy.jpg',
  'Madiba Day Relate - June 2026 1A.jpg',
  'Madiba Day Relate - June 2026 1C.jpg',
  'Mambo Italiano Quiz Night - 2026 - Photo Mockup F.png',
  'Mambo Italiano Quiz Night - 2026 - Photo Mockup G.jpg',
  'Mambo Italiano Quiz Night - 2026 E.jpg',
  'Mambo Italiano Quiz Night - 2026 F.jpg',
  'Meetings Mag A4 Half-Hor - w 5mm Bleed - A3.png',
  'Odyssey Autumn Print v2 alt 2.jpg',
  'Odyssey Oct 2025 - 10 x 12 cm - Digital.png',
  'Restaurant Week Posters.jpg',
  'Room 254 - April 2026 - Room And View - Landscape - Navy Bed Throw.png',
  'Tabletalk 2025 Nov Combined 100h x 128w mm.jpg',
  'Tourism Update - Business Travel v2 NB.jpg',
  'Tourism Update - Western Cape - June July 2026 - V1 copy 4.png',
  'Valentines February 2026 - Accommodation Offer - Google Ads.jpg',
  'Valentines Widget Rooms B.jpg',
].map((name) =>
  makeMedia('lbh-official-ads-05', '/projects-media/lbh-official-ads-05', name)
);

const LOGOS_FILES = [
  'briefly logo black.svg',
  'canary logo blk 2026 final Aug 2026.svg',
  'rebirth logo.svg',
].map((name) => makeMedia('logos', '/projects-media/logos', name));

export const FALLBACK_PROJECTS: Project[] = [
  buildProjectFromScan(
    {
      folderName: 'Rebirth Ateliers',
      rootFiles: REBIRTH_ROOT_FILES,
      subfolders: [
        { folderName: 'RebirthAteliers-Carousel-01', files: REBIRTH_CAROUSEL_FILES },
        { folderName: 'RebirthAteliers-Videos', files: REBIRTH_VIDEO_FILES },
      ],
    },
    0
  ),
  buildProjectFromScan(
    {
      folderName: 'lbh-official-ads-05',
      rootFiles: LBH_ADS_FILES,
      subfolders: [],
    },
    1
  ),
  buildProjectFromScan(
    {
      folderName: 'logos',
      rootFiles: LOGOS_FILES,
      subfolders: [],
    },
    2
  ),
  buildProjectFromScan(
    {
      folderName: 'Seabreeze',
      rootFiles: [],
      subfolders: [
        { folderName: 'Seabreeze earlier logo ideation', files: SEABREEZE_IDEATION_FILES },
        { folderName: 'Seabreeze Early', files: SEABREEZE_EARLY_FILES },
      ],
    },
    3
  ),
];

export const PROJECTS: Project[] = FALLBACK_PROJECTS;
