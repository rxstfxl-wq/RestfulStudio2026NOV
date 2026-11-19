import scannedFolders from 'virtual:projects-media';
import { Project } from '../types';
import { buildProjectsFromScans } from '../utils/folderParser';

// Sourced exclusively from folders inside public/projects-media (never hardcoded)
export const FALLBACK_PROJECTS: Project[] = buildProjectsFromScans(scannedFolders);

export const PROJECTS: Project[] = FALLBACK_PROJECTS;
