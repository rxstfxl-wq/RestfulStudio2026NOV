import { DisciplineCategory, MediaFileItem, Project, ProjectMockup, ProjectSubfolder } from '../types';

const UPPERCASE_TOKENS = new Set([
  'LBH',
  'RXSTFXL',
  'UI',
  'UX',
  'SVG',
  'PDF',
  'ID',
  '3D',
  'AI',
  'PR',
  'CPT',
  'SA',
  'TV',
  'NFC',
  'QR',
]);

export function slugifyFolder(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}

export function extractLeadingNumber(folderName: string): { num: string | null; rest: string } {
  const match = folderName.trim().match(/^(\d{1,2}[a-zA-Z]?)[-_.\s]+(.+)$/);
  if (match) {
    return { num: match[1].toUpperCase(), rest: match[2] };
  }
  return { num: null, rest: folderName.trim() };
}

export function formatFolderTitle(rawName: string): string {
  const { rest } = extractLeadingNumber(rawName);
  const spaced = rest
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!spaced) return rawName;

  return spaced
    .split(' ')
    .map((word) => {
      const upper = word.toUpperCase();
      if (UPPERCASE_TOKENS.has(upper)) {
        return upper;
      }
      if (/^\d+$/.test(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function inferDisciplinesFromName(
  folderName: string,
  subfolderNames: string[] = [],
  fileNames: string[] = []
): DisciplineCategory[] {
  const combined = `${folderName} ${subfolderNames.join(' ')} ${fileNames.slice(0, 6).join(' ')}`.toLowerCase();
  const matched = new Set<DisciplineCategory>();

  if (/(brand|logo|identity|rebirth|mark)/.test(combined)) matched.add('branding');
  if (/(ad|ads|print|poster|flyer|menu|tabletalk|banner|mag|magazine)/.test(combined)) matched.add('print');
  if (/(guide|manual|editorial|book|monograph|magazine|behance|spread)/.test(combined)) matched.add('editorial');
  if (/(web|app|digital|ui|ux|widget|google ads)/.test(combined)) matched.add('digital');
  if (/(pack|cup|bottle|box)/.test(combined)) matched.add('packaging');
  if (/(sign|wayfinding|hotel|room)/.test(combined)) matched.add('signage');
  if (/(experiment|concept|passion|atelier|ideation)/.test(combined)) matched.add('experimental');

  if (matched.size === 0) {
    matched.add('branding');
    matched.add('editorial');
  }

  return Array.from(matched);
}

export function inferCategoryFromName(folderName: string): 'professional' | 'passion' {
  const lower = folderName.toLowerCase();
  if (/(^|[-_\s])(passion|experimental|concept|personal|rebirth|atelier|ateliers|art)([-_\s]|$)/.test(lower)) {
    return 'passion';
  }
  return 'professional';
}

export function inferYearFromFiles(folderName: string, files: MediaFileItem[]): string {
  const combined = `${folderName} ${files.map((f) => f.name).join(' ')}`;
  const match = combined.match(/\b(202[4-9])\b/);
  if (match) return match[1];
  return '2026';
}

export interface FolderMetadataOverride {
  title?: string;
  number?: string;
  category?: 'professional' | 'passion';
  disciplines?: DisciplineCategory[];
  disciplineLabel?: string;
  year?: string;
  client?: string;
  location?: string;
  shortDescription?: string;
  overview?: string;
  challenge?: string;
  strategy?: string;
  solution?: string;
  liveUrl?: string;
  liveUrlLabel?: string;
  featured?: boolean;
  colorPalette?: Project['colorPalette'];
  typographyUsed?: Project['typographyUsed'];
}

const DEFAULT_FOLDER_LINKS: Record<string, { label: string; url: string }> = {
  'canary-e-card': {
    label: 'Canary Website',
    url: 'https://ecanary.lovable.app',
  },
  'rebirth-ateliers': {
    label: 'Rebirth Ateliers Website',
    url: 'https://rebirth-ateliers-4nyw.vercel.app/',
  },
};

const DEFAULT_FOLDER_COVERS: Record<string, string> = {
  seabreeze: '/projects-media/Seabreeze/Seabreeze Logo/Asset 4.png',
};

export interface RawFolderScanInput {
  folderName: string;
  rootFiles: MediaFileItem[];
  subfolders: {
    folderName: string;
    files: MediaFileItem[];
  }[];
  meta?: FolderMetadataOverride;
}

export function buildProjectFromScan(input: RawFolderScanInput, index: number): Project {
  const { folderName, rootFiles, subfolders, meta } = input;
  const { num } = extractLeadingNumber(folderName);
  const formattedIndex = String(index + 1).padStart(2, '0');
  const number = meta?.number || num || formattedIndex;
  const id = slugifyFolder(folderName);
  const title = meta?.title || formatFolderTitle(folderName);

  const rootMediaRank = (f: MediaFileItem): number => {
    if (f.type === 'image') return 0;
    if (f.type === 'video') return 1;
    if (f.type === 'svg') return 2;
    if (f.type === 'pdf') return 3;
    return 4;
  };
  const orderedRootFiles = [...rootFiles].sort((a, b) => rootMediaRank(a) - rootMediaRank(b));

  const allFiles: MediaFileItem[] = [
    ...orderedRootFiles,
    ...subfolders.flatMap((sf) => sf.files),
  ];

  const subfolderNames = subfolders.map((s) => s.folderName);
  const disciplines = meta?.disciplines && meta.disciplines.length > 0
    ? meta.disciplines
    : inferDisciplinesFromName(folderName, subfolderNames, allFiles.map((f) => f.name));

  const category = meta?.category || inferCategoryFromName(folderName);

  const isPlayableOrVisual = (f: MediaFileItem) =>
    f.type === 'image' || f.type === 'svg' || f.type === 'video' || f.type === 'pdf';

  const visualFiles = allFiles.filter(isPlayableOrVisual);
  const preferredCoverUrl = DEFAULT_FOLDER_COVERS[id]
    ? allFiles.find((f) => f.url === DEFAULT_FOLDER_COVERS[id])?.url
    : undefined;
  const rootRasterFirst = orderedRootFiles.find((f) => f.type === 'image');
  const rootPdfFirst = orderedRootFiles.find((f) => f.type === 'pdf');
  const anyRasterFirst = allFiles.find((f) => f.type === 'image');
  const anyPdfFirst = allFiles.find((f) => f.type === 'pdf');
  const anySvgFirst = allFiles.find((f) => f.type === 'svg');
  const heroImage =
    preferredCoverUrl ||
    rootRasterFirst?.url ||
    rootPdfFirst?.url ||
    anyRasterFirst?.url ||
    anyPdfFirst?.url ||
    anySvgFirst?.url ||
    visualFiles[0]?.url ||
    '';

  const year = meta?.year || inferYearFromFiles(folderName, allFiles);
  const disciplineLabel =
    meta?.disciplineLabel ||
    disciplines.map((d) => d.toUpperCase()).join(' / ');

  const parsedSubfolders: ProjectSubfolder[] = subfolders
    .filter((sf) => sf.files.length > 0)
    .map((sf) => {
      const sfVisualFiles = sf.files.filter(isPlayableOrVisual);
      const sfMediaUrls = sfVisualFiles.map((f) => f.url);
      const sfCover =
        sf.files.find((f) => f.type === 'image')?.url ||
        sf.files.find((f) => f.type === 'pdf')?.url ||
        sf.files.find((f) => f.type === 'svg')?.url ||
        sfMediaUrls[0] ||
        heroImage;
      return {
        id: `${id}--${slugifyFolder(sf.folderName)}`,
        folderName: sf.folderName,
        title: formatFolderTitle(sf.folderName),
        coverImage: sfCover,
        files: sf.files,
        images: sfMediaUrls,
      };
    });

  const mockups: ProjectMockup[] = [];

  if (orderedRootFiles.some(isPlayableOrVisual)) {
    const rootMediaUrls = orderedRootFiles.filter(isPlayableOrVisual).map((f) => f.url);
    mockups.push({
      title: `${title} Overview`,
      image: rootMediaUrls[0],
      type: 'full',
      caption: `${rootMediaUrls.length} primary files in ${folderName}`,
      description: `Primary project media uploaded directly inside ${folderName}.`,
      galleryImages: rootMediaUrls,
    });
  }

  if (parsedSubfolders.length > 0) {
    parsedSubfolders.forEach((sf, sIdx) => {
      if (sf.images.length > 0) {
        mockups.push({
          title: sf.title,
          image: sf.coverImage,
          type: sIdx === 0 && mockups.length === 0 ? 'full' : 'grid',
          caption: `${sf.images.length} assets in ${sf.folderName}`,
          description: `Sub-library from folder ${folderName}/${sf.folderName}.`,
          galleryImages: sf.images,
        });
      }
    });
  }

  const secondaryImages = visualFiles
    .map((f) => f.url)
    .filter((url) => url !== heroImage);

  const subfolderSummary =
    parsedSubfolders.length > 0
      ? ` including ${parsedSubfolders.length} ${parsedSubfolders.length === 1 ? 'sub-library' : 'sub-libraries'}`
      : '';

  const defaultSummary = `Curated project archive featuring ${allFiles.length} ${allFiles.length === 1 ? 'asset' : 'assets'}${subfolderSummary} loaded from ${folderName}.`;

  return {
    id,
    folderName,
    number,
    title,
    category,
    disciplines,
    disciplineLabel,
    year,
    client: meta?.client || title,
    location: meta?.location || 'Cape Town, South Africa',
    heroImage,
    secondaryImages,
    shortDescription: meta?.shortDescription || defaultSummary,
    overview: meta?.overview || defaultSummary,
    challenge:
      meta?.challenge ||
      `Organizing and presenting the complete ${title} design system, visual explorations, and production assets in a unified archive.`,
    strategy:
      meta?.strategy ||
      `Structure every deliverable inside ${folderName} with clear visual hierarchy across editorial and archival file views.`,
    solution:
      meta?.solution ||
      `Delivered ${allFiles.length} high-resolution media assets ready for case-study inspection and production review.`,
    typographyUsed: meta?.typographyUsed || {
      primary: 'Bebas Neue',
      secondary: 'Manrope / Space Mono',
      notes: `Auto-indexed from public/projects-media/${folderName}.`,
    },
    colorPalette: meta?.colorPalette || [
      { name: 'Obsidian Canvas', hex: '#080808', role: 'CORE BASE', rgb: 'RGB(8, 8, 8)' },
      { name: 'Archival Paper', hex: '#EAE6D4', role: 'SURFACE CANVAS', rgb: 'RGB(234, 230, 212)' },
      { name: 'Signal Red', hex: '#D72626', role: 'ACCENT SIGNAL', rgb: 'RGB(215, 38, 38)' },
    ],
    mockups,
    subfolders: parsedSubfolders,
    files: allFiles,
    assetCount: allFiles.length,
    results: [
      `${allFiles.length} studio assets indexed directly from ${folderName}.`,
      parsedSubfolders.length > 0
        ? `${parsedSubfolders.length} organized sub-galleries preserved.`
        : 'Unified high-resolution gallery available in Editorial and Explorer views.',
    ],
    featured: meta?.featured ?? index < 3,
    galleryTitle: `${title} Media Archive`,
    liveUrl: meta?.liveUrl || DEFAULT_FOLDER_LINKS[id]?.url,
    liveUrlLabel: meta?.liveUrlLabel || DEFAULT_FOLDER_LINKS[id]?.label,
  };
}
