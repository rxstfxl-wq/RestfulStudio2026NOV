import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import {
  buildProjectFromScan,
  FolderMetadataOverride,
  formatFileSize,
  RawFolderScanInput,
  slugifyFolder,
} from "./src/utils/folderParser";
import { MediaFileItem, Project } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "visibility.json");

interface VisibilityState {
  hiddenProjects: string[];
  hiddenSubProjects: string[];
  updatedAt: number;
}

function getVisibility(): VisibilityState {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      return {
        hiddenProjects: Array.isArray(parsed.hiddenProjects) ? parsed.hiddenProjects : [],
        hiddenSubProjects: Array.isArray(parsed.hiddenSubProjects) ? parsed.hiddenSubProjects : [],
        updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : 0,
      };
    }
  } catch (err) {
    console.error("Error reading visibility.json:", err);
  }
  return { hiddenProjects: [], hiddenSubProjects: [], updatedAt: 0 };
}

function saveVisibility(data: VisibilityState) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing visibility.json:", err);
  }
}

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const SVG_EXTS = new Set([".svg"]);
const PDF_EXTS = new Set([".pdf"]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov"]);

function detectMediaType(fileName: string): MediaFileItem["type"] | null {
  const ext = path.extname(fileName).toLowerCase();
  if (IMAGE_EXTS.has(ext)) return "image";
  if (SVG_EXTS.has(ext)) return "svg";
  if (PDF_EXTS.has(ext)) return "pdf";
  if (VIDEO_EXTS.has(ext)) return "video";
  return null;
}

function naturalSort(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
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
    .filter((e) => !e.name.startsWith("."))
    .sort((a, b) => naturalSort(a.name, b.name));

  for (const entry of sorted) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nested = collectMediaFilesRecursive(
        fullPath,
        `${urlPrefix}/${entry.name}`,
        projectId,
        subfolderName || entry.name
      );
      items.push(...nested);
    } else if (entry.isFile()) {
      const mediaType = detectMediaType(entry.name);
      if (!mediaType) continue;
      const stats = fs.statSync(fullPath);
      const dateIso = stats.mtime ? stats.mtime.toISOString().split("T")[0] : "2026-01-01";
      items.push({
        id: `${projectId}--${slugifyFolder(subfolderName || "root")}--${slugifyFolder(entry.name)}`,
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

function scanProjectsMediaDirectory(): Project[] {
  const mediaRoot = path.join(process.cwd(), "public", "projects-media");
  if (!fs.existsSync(mediaRoot)) {
    return [];
  }

  const topEntries = fs
    .readdirSync(mediaRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .sort((a, b) => naturalSort(a.name, b.name));

  const projects: Project[] = [];

  topEntries.forEach((folderEntry, idx) => {
    const folderName = folderEntry.name;
    const folderPath = path.join(mediaRoot, folderName);
    const projectId = slugifyFolder(folderName);
    const baseUrl = `/projects-media/${folderName}`;

    // Optional metadata file support
    let meta: FolderMetadataOverride | undefined;
    for (const metaFile of ["project.json", "meta.json"]) {
      const metaPath = path.join(folderPath, metaFile);
      if (fs.existsSync(metaPath)) {
        try {
          meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
          break;
        } catch (err) {
          console.warn(`Invalid metadata JSON in ${metaPath}:`, err);
        }
      }
    }

    const innerEntries = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((e) => !e.name.startsWith("."))
      .sort((a, b) => naturalSort(a.name, b.name));

    const rootFiles: MediaFileItem[] = [];
    const subfolders: RawFolderScanInput["subfolders"] = [];

    for (const inner of innerEntries) {
      const innerPath = path.join(folderPath, inner.name);
      if (inner.isFile()) {
        const mediaType = detectMediaType(inner.name);
        if (!mediaType) continue;
        const stats = fs.statSync(innerPath);
        const dateIso = stats.mtime ? stats.mtime.toISOString().split("T")[0] : "2026-01-01";
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
          subfolders.push({
            folderName: inner.name,
            files: sfFiles,
          });
        }
      }
    }

    const hasAnyMedia = rootFiles.length > 0 || subfolders.some((sf) => sf.files.length > 0);
    if (hasAnyMedia) {
      const project = buildProjectFromScan(
        {
          folderName,
          rootFiles,
          subfolders,
          meta,
        },
        projects.length
      );
      projects.push(project);
    }
  });

  return projects;
}

// Dynamic API endpoint returning all project folders inside public/projects-media
app.get("/api/projects", (req, res) => {
  try {
    const projects = scanProjectsMediaDirectory();
    res.setHeader("Cache-Control", "no-store");
    res.json({ projects, scannedAt: Date.now() });
  } catch (err) {
    console.error("Error scanning public/projects-media:", err);
    res.status(500).json({ error: "Failed to scan projects-media directory" });
  }
});

// REST API endpoint to load and sync visibility state across all users
app.get("/api/visibility", (req, res) => {
  res.json(getVisibility());
});

app.post("/api/visibility", (req, res) => {
  const { hiddenProjects, hiddenSubProjects, updatedAt } = req.body || {};
  const current = getVisibility();

  const incomingTs = typeof updatedAt === "number" ? updatedAt : Date.now();
  if (current.updatedAt > 0 && incomingTs < current.updatedAt) {
    return res.json(current);
  }

  const updated: VisibilityState = {
    hiddenProjects: Array.isArray(hiddenProjects) ? hiddenProjects : current.hiddenProjects,
    hiddenSubProjects: Array.isArray(hiddenSubProjects) ? hiddenSubProjects : current.hiddenSubProjects,
    updatedAt: incomingTs,
  };

  saveVisibility(updated);
  res.json(updated);
});

// Serve static assets from public media folders cleanly
const publicDir = path.join(process.cwd(), "public");
const publicProjectsMediaDir = path.join(process.cwd(), "public", "projects-media");
const aboutMediaDir = path.join(process.cwd(), "about-media");
const publicAboutMediaDir = path.join(process.cwd(), "public", "about-media");

app.use("/projects-media", express.static(publicProjectsMediaDir));
app.use("/about-media", express.static(publicAboutMediaDir));
app.use("/about-media", express.static(aboutMediaDir));
app.use("/assets", express.static(path.join(publicDir, "assets")));
app.use("/public", express.static(publicDir));

// Route wildcard interceptor for requests like /project/projects-media/... or /project/public/...
app.use((req, res, next) => {
  let url = req.url;
  try {
    url = decodeURIComponent(req.url);
  } catch (e) {
    url = req.url;
  }
  const cleanUrl = url.split("?")[0];
  const trySendFile = (baseDir: string, relPath: string) => {
    const candidate = path.join(baseDir, relPath);
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        res.sendFile(candidate);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };
  if (cleanUrl.includes("/projects-media/")) {
    const relativePath = cleanUrl.substring(cleanUrl.indexOf("/projects-media/"));
    if (trySendFile(publicDir, relativePath)) {
      return;
    }
  }
  if (cleanUrl.includes("/about-media/")) {
    const relativePath = cleanUrl.substring(cleanUrl.indexOf("/about-media/"));
    if (trySendFile(publicDir, relativePath) || trySendFile(process.cwd(), relativePath)) {
      return;
    }
  }
  next();
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const disableHmr = process.env.DISABLE_HMR === "true";
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ...(disableHmr ? { hmr: false } : {}),
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
