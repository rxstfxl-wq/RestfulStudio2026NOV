import scannedFolders from 'virtual:projects-media';
import { Project } from '../types';
import { buildProjectFromScan } from '../utils/folderParser';

// Sourced exclusively from folders inside public/projects-media (never hardcoded)
export const FALLBACK_PROJECTS: Project[] = scannedFolders.map((scan, index) =>
  buildProjectFromScan(scan, index)
);

export const PROJECTS: Project[] = FALLBACK_PROJECTS;
