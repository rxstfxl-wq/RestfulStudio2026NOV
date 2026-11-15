export type PortfolioCategory = 'all' | 'professional' | 'passion';

export type DisciplineCategory =
  | 'branding'
  | 'print'
  | 'digital'
  | 'packaging'
  | 'signage'
  | 'editorial'
  | 'experimental'
  | 'direction';

export interface MediaFileItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'svg' | 'pdf' | 'video';
  sizeBytes: number;
  size: string;
  date: string;
  subfolder?: string;
}

export interface ProjectSubfolder {
  id: string;
  folderName: string;
  title: string;
  coverImage: string;
  files: MediaFileItem[];
  images: string[];
}

export interface ProjectMockup {
  title: string;
  image: string;
  caption?: string;
  type?: 'full' | 'grid' | 'portrait';
  description?: string;
  galleryImages?: string[];
}

export interface Project {
  id: string;
  folderName: string;
  number: string;
  title: string;
  category: 'professional' | 'passion';
  disciplines: DisciplineCategory[];
  disciplineLabel: string;
  year: string;
  client: string;
  location: string;
  heroImage: string;
  secondaryImages: string[];
  shortDescription: string;
  overview: string;
  challenge: string;
  strategy: string;
  solution: string;
  typographyUsed: {
    primary: string;
    secondary: string;
    notes?: string;
  };
  colorPalette: {
    name: string;
    hex: string;
    role?: string;
    rgb?: string;
    usage?: string;
  }[];
  mockups: ProjectMockup[];
  subfolders: ProjectSubfolder[];
  files: MediaFileItem[];
  assetCount: number;
  results: string[];
  featured: boolean;
  galleryTitle?: string;
  liveUrl?: string;
  liveUrlLabel?: string;
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
}

export interface AwardItem {
  year: string;
  title: string;
  organization: string;
  project: string;
}

export interface ClientItem {
  name: string;
  industry: string;
  year: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  disciplines: string[];
  description: string;
}
