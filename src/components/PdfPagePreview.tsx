import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { FileText } from 'lucide-react';
import { encodeAssetUrl } from '../utils/imageUtils';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface RenderedPdfResult {
  objectUrl: string;
  numPages: number;
}

const renderedPdfCache = new Map<string, Promise<RenderedPdfResult>>();
const pdfNumPagesCache = new Map<string, number>();

let activeWorkers = 0;
const MAX_CONCURRENT_RENDERS = 3;
const renderQueue: Array<() => void> = [];

function runQueued<T>(task: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = () => {
      activeWorkers += 1;
      task()
        .then(resolve, reject)
        .finally(() => {
          activeWorkers -= 1;
          const next = renderQueue.shift();
          if (next) next();
        });
    };

    if (activeWorkers < MAX_CONCURRENT_RENDERS) {
      start();
    } else {
      renderQueue.push(start);
    }
  });
}

async function renderPdfPageToObjectUrl(
  rawUrl: string,
  pageNumber: number,
  targetWidth: number
): Promise<RenderedPdfResult> {
  const requestUrl = encodeAssetUrl(rawUrl);
  const loadingTask = pdfjsLib.getDocument({
    url: requestUrl,
    disableAutoFetch: true,
    disableStream: false,
  });

  const pdf = await loadingTask.promise;
  try {
    const numPages = pdf.numPages || 1;
    pdfNumPagesCache.set(requestUrl, numPages);
    const safePage = Math.max(1, Math.min(pageNumber, numPages));
    const page = await pdf.getPage(safePage);

    try {
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(3.5, Math.max(0.4, targetWidth / Math.max(1, baseViewport.width)));
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      const context = canvas.getContext('2d', { alpha: false });
      if (!context) {
        throw new Error('Could not initialize 2D canvas context');
      }

      context.fillStyle = '#FFFFFF';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
        background: '#FFFFFF',
      }).promise;

      const objectUrl = await new Promise<string>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              resolve(canvas.toDataURL('image/jpeg', 0.92));
            }
          },
          'image/webp',
          0.92
        );
      });

      canvas.width = 0;
      canvas.height = 0;
      return { objectUrl, numPages };
    } finally {
      page.cleanup();
    }
  } finally {
    await loadingTask.destroy();
  }
}

function getCachedPdfPreview(
  rawUrl: string,
  pageNumber: number,
  targetWidth: number
): Promise<RenderedPdfResult> {
  const normalizedUrl = encodeAssetUrl(rawUrl);
  const key = `${normalizedUrl}::p=${pageNumber}::w=${targetWidth}`;
  const existing = renderedPdfCache.get(key);
  if (existing) return existing;

  const promise = runQueued(() =>
    renderPdfPageToObjectUrl(normalizedUrl, pageNumber, targetWidth)
  ).catch((err) => {
    renderedPdfCache.delete(key);
    throw err;
  });

  renderedPdfCache.set(key, promise);
  return promise;
}

export function prefetchPdfPage(rawUrl: string, pageNumber: number, targetWidth = 2200): void {
  if (!rawUrl || pageNumber < 1) return;
  getCachedPdfPreview(rawUrl, pageNumber, targetWidth).catch(() => {});
}

interface PdfPagePreviewProps {
  src: string;
  alt: string;
  pageNumber?: number;
  className?: string;
  targetWidth?: number;
  eager?: boolean;
  onDocumentLoad?: (numPages: number) => void;
}

export const PdfPagePreview: React.FC<PdfPagePreviewProps> = ({
  src,
  alt,
  pageNumber = 1,
  className = 'w-full h-full object-cover',
  targetWidth = 720,
  eager = false,
  onDocumentLoad,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState<boolean>(eager);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const onDocumentLoadRef = useRef(onDocumentLoad);
  onDocumentLoadRef.current = onDocumentLoad;

  useEffect(() => {
    const normalized = encodeAssetUrl(src);
    const cachedCount = pdfNumPagesCache.get(normalized);
    if (cachedCount && onDocumentLoadRef.current) {
      onDocumentLoadRef.current(cachedCount);
    }
  }, [src]);

  useEffect(() => {
    setHasError(false);
    setPreviewUrl(null);
    if (eager) {
      setShouldLoad(true);
      return;
    }

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '320px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, pageNumber, eager]);

  useEffect(() => {
    if (!shouldLoad || !src) return;
    let cancelled = false;

    getCachedPdfPreview(src, pageNumber, targetWidth)
      .then((result) => {
        if (!cancelled) {
          setPreviewUrl(result.objectUrl);
          setHasError(false);
          if (onDocumentLoadRef.current) {
            onDocumentLoadRef.current(result.numPages);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shouldLoad, src, pageNumber, targetWidth]);

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 p-4 text-center gap-2"
      >
        <FileText className="w-8 h-8 text-[#D72626]" />
        <span className="font-mono text-[11px] uppercase tracking-wider truncate max-w-full">
          {alt}
        </span>
      </div>
    );
  }

  if (!previewUrl) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/70 animate-pulse text-zinc-500 gap-2 p-4"
      >
        <FileText className="w-6 h-6 text-zinc-600" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Rendering Page {pageNumber}...
        </span>
      </div>
    );
  }

  return (
    <img
      src={previewUrl}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
};
