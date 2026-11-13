import { Project } from '../types';
import { FALLBACK_PROJECTS } from './projects';

export type FileType = 'folder' | 'image' | 'svg' | 'pdf' | 'video';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size?: string;
  url?: string;
  description?: string;
  date?: string;
}

export interface FolderNode {
  id: string;
  number: string;
  name: string;
  label: string;
  description: string;
  itemCount: number;
  coverImage?: string;
  subfolders?: FolderNode[];
  files?: FileItem[];
  projectId?: string;
  typeLabel?: string;
  liveUrl?: string;
}

export function createProjectFolderNode(p: Project): FolderNode {
  const subfolders: FolderNode[] = (p.subfolders || []).map((sf, idx) => ({
    id: sf.id,
    number: String(idx + 1).padStart(2, '0'),
    name: sf.folderName,
    label: sf.title,
    description: `${sf.files.length} media assets in ${sf.folderName}`,
    itemCount: sf.files.length,
    coverImage: sf.coverImage,
    typeLabel: 'Subfolder',
    projectId: p.id,
    files: sf.files.map((f) => ({
      id: f.id,
      name: f.name,
      type: f.type,
      size: f.size,
      url: f.url,
      date: f.date,
    })),
  }));

  // Direct root files if the project has no subfolders, or root-level files alongside subfolders
  const rootFiles: FileItem[] = (p.files || [])
    .filter((f) => !f.subfolder || subfolders.length === 0)
    .map((f) => ({
      id: f.id,
      name: f.name,
      type: f.type,
      size: f.size,
      url: f.url,
      date: f.date,
    }));

  return {
    id: p.id,
    number: p.number,
    name: p.folderName,
    label: p.title,
    description: p.shortDescription || p.overview,
    itemCount: p.assetCount,
    coverImage: p.heroImage,
    subfolders,
    files: rootFiles,
    projectId: p.id,
    typeLabel: p.disciplineLabel,
    liveUrl: p.liveUrl,
  };
}

export function buildFileSystem(projects: Project[] = FALLBACK_PROJECTS): FolderNode[] {
  const allProjectNodes = projects.map(createProjectFolderNode);
  const professionalNodes = projects
    .filter((p) => p.category === 'professional')
    .map(createProjectFolderNode);
  const passionNodes = projects
    .filter((p) => p.category === 'passion')
    .map(createProjectFolderNode);

  return [
    {
      id: 'all_projects',
      number: '00',
      name: 'projects-media',
      label: 'All Project Folders',
      description: 'Live directory view of every project folder inside public/projects-media.',
      itemCount: allProjectNodes.length,
      coverImage: allProjectNodes[0]?.coverImage,
      subfolders: allProjectNodes,
    },
    {
      id: '01_professional',
      number: '01',
      name: 'Professional',
      label: 'Professional & Commercial',
      description: 'Commercial client identities, campaigns, and brand guidelines.',
      itemCount: professionalNodes.length,
      coverImage: professionalNodes[0]?.coverImage,
      subfolders: professionalNodes,
    },
    {
      id: '02_passion',
      number: '02',
      name: 'Passion',
      label: 'Experimental & Research',
      description: 'Concept brands, ateliers, and experimental visual studies.',
      itemCount: passionNodes.length,
      coverImage: passionNodes[0]?.coverImage,
      subfolders: passionNodes,
    },
  ];
}

export const ROOT_DIRECTORIES: FolderNode[] = buildFileSystem(FALLBACK_PROJECTS);
