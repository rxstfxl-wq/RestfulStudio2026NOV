import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
const SVG_EXTS = new Set(['.svg']);
const PDF_EXTS = new Set(['.pdf']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov']);

function detectMediaType(fileName: string): 'image' | 'svg' | 'pdf' | 'video' | null {
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

function slugifyFolder(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project'
  );
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function collectMediaFilesRecursive(
  dirPath: string,
  urlPrefix: string,
  projectId: string,
  subfolderName?: string
) {
  const items: any[] = [];
  if (!fs.existsSync(dirPath)) return items;

  const entries = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => naturalSort(a.name, b.name));

  for (const entry of entries) {
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

function scanPublicProjectsMedia(rootDir: string) {
  const mediaRoot = path.join(rootDir, 'public', 'projects-media');
  if (!fs.existsSync(mediaRoot)) return [];

  const topEntries = fs
    .readdirSync(mediaRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .sort((a, b) => naturalSort(a.name, b.name));

  const scans: any[] = [];

  for (const folderEntry of topEntries) {
    const folderName = folderEntry.name;
    const folderPath = path.join(mediaRoot, folderName);
    const projectId = slugifyFolder(folderName);
    const baseUrl = `/projects-media/${folderName}`;

    let meta: any;
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

    const rootFiles: any[] = [];
    const subfolders: any[] = [];

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

  return scans;
}

function publicProjectsMediaPlugin(): Plugin {
  const virtualId = 'virtual:projects-media';
  const resolvedId = '\0' + virtualId;

  return {
    name: 'public-projects-media-scanner',
    resolveId(id) {
      if (id === virtualId) return resolvedId;
      return null;
    },
    load(id) {
      if (id === resolvedId) {
        const scans = scanPublicProjectsMedia(__dirname);
        return `export default ${JSON.stringify(scans)};`;
      }
      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), publicProjectsMediaPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
