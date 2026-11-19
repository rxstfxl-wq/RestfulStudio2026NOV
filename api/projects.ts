import fs from 'fs';
import path from 'path';
import {
  buildProjectsFromScans,
  FolderMetadataOverride,
  formatFileSize,
  RawFolderScanInput,
  slugifyFolder,
} from '../src/utils/folderParser';
import { MediaFileItem, Project } from '../src/types';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
const SVG_EXTS = new Set(['.svg']);
const PDF_EXTS = new Set(['.pdf']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov']);

function detectMediaType(fileName: string): MediaFileItem['type'] | null {
  const ext = path.extname(fileName).toLowerCase();
  if (IMAGE_EXTS.has(ext)) return 'image';
  if (SVG_EXTS.has(ext)) return 'svg';
  if (PDF_EXTS.has(ext)) return 'pdf';
  if (VIDEO_EXTS.has(ext)) return 'video';
  return null;
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function collectMediaFilesRecursive(
  dirPath: string,
  urlPrefix: string,
  projectId: string,
  subfolderName?: string
): MediaFileItem[] {
  const items: MediaFileItem[] = [];
  if (!fs.existsSync(dirPath)) return items;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const sorted = entries
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => naturalSort(a.name, b.name));

  for (const entry of sorted) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      items.push(
        ...collectMediaFilesRecursive(
          fullPath,
          `${urlPrefix}/${entry.name}`,
          projectId,
          subfolderName || entry.name
        )
      );
    } else if (entry.isFile()) {
      const mediaType = detectMediaType(entry.name);
      if (!mediaType) continue;
      const stats = fs.statSync(fullPath);
      const dateIso = stats.mtime ? stats.mtime.toISOString().split('T')[0] : '2026-01-01';
      items.push({
        id: `${projectId}--${slugifyFolder(subfolderName || 'root')}--${slugifyFolder(entry.name)}`,
        name: entry.name,
        url: `${urlPrefix}/${entry.name}`,
        type: mediaType,
        sizeBytes: stats.size,
        size: formatFileSize(stats.size),
        date: dateIso,
        subfolder: subfolderName,
      });
    }
  }
  return items;
}

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const mediaRoot = path.join(process.cwd(), 'public', 'projects-media');
    if (!fs.existsSync(mediaRoot)) {
      return res.status(200).json({ projects: [], scannedAt: Date.now() });
    }

    const topEntries = fs
      .readdirSync(mediaRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .sort((a, b) => naturalSort(a.name, b.name));

    const scans: RawFolderScanInput[] = [];

    for (const folderEntry of topEntries) {
      const folderName = folderEntry.name;
      const folderPath = path.join(mediaRoot, folderName);
      const projectId = slugifyFolder(folderName);
      const baseUrl = `/projects-media/${folderName}`;

      let meta: FolderMetadataOverride | undefined;
      for (const metaFile of ['project.json', 'meta.json']) {
        const metaPath = path.join(folderPath, metaFile);
        if (fs.existsSync(metaPath)) {
          try {
            meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            break;
          } catch {}
        }
      }

      const innerEntries = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((e) => !e.name.startsWith('.'))
        .sort((a, b) => naturalSort(a.name, b.name));

      const rootFiles: MediaFileItem[] = [];
      const subfolders: RawFolderScanInput['subfolders'] = [];

      for (const inner of innerEntries) {
        const innerPath = path.join(folderPath, inner.name);
        if (inner.isFile()) {
          const mediaType = detectMediaType(inner.name);
          if (!mediaType) continue;
          const stats = fs.statSync(innerPath);
          const dateIso = stats.mtime ? stats.mtime.toISOString().split('T')[0] : '2026-01-01';
          rootFiles.push({
            id: `${projectId}--root--${slugifyFolder(inner.name)}`,
            name: inner.name,
            url: `${baseUrl}/${inner.name}`,
            type: mediaType,
            sizeBytes: stats.size,
            size: formatFileSize(stats.size),
            date: dateIso,
          });
        } else if (inner.isDirectory()) {
          const sfFiles = collectMediaFilesRecursive(
            innerPath,
            `${baseUrl}/${inner.name}`,
            projectId,
            inner.name
          );
          if (sfFiles.length > 0) {
            subfolders.push({ folderName: inner.name, files: sfFiles });
          }
        }
      }

      if (rootFiles.length > 0 || subfolders.some((sf) => sf.files.length > 0)) {
        scans.push({ folderName, rootFiles, subfolders, meta });
      }
    }

    const projects: Project[] = buildProjectsFromScans(scans);
    return res.status(200).json({ projects, scannedAt: Date.now() });
  } catch (err) {
    console.error('Error scanning projects-media:', err);
    return res.status(500).json({ error: 'Failed to scan projects-media directory' });
  }
}
