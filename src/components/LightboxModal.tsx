import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Download, FileText } from 'lucide-react';
import { encodeAssetUrl, fixImageUrl, isPdfUrl, isSvgUrl, isVideoUrl } from '../utils/imageUtils';
import { PdfPagePreview, prefetchPdfPage } from './PdfPagePreview';

interface LightboxModalProps {
  imageUrl: string | null;
  title: string;
  images?: string[];
  initialIndex?: number;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  imageUrl,
  title,
  images,
  initialIndex = 0,
  onClose
}) => {
  const gallery = images && images.length > 0 ? images : imageUrl ? [imageUrl] : [];
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [pdfNumPages, setPdfNumPages] = useState<number>(1);

  useEffect(() => {
    if (!imageUrl) return;
    if (images && images.length > 0) {
      const idx = initialIndex >= 0 && initialIndex < images.length ? initialIndex : images.indexOf(imageUrl);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else {
      setCurrentIndex(0);
    }
  }, [imageUrl, images, initialIndex]);

  const activeUrl = gallery[currentIndex] || imageUrl || '';
  const isSvg = isSvgUrl(activeUrl);
  const isVideo = isVideoUrl(activeUrl);
  const isPdf = isPdfUrl(activeUrl);
  const activeFileName = decodeURIComponent((activeUrl.split('/').pop() || title));
  const safePdfUrl = isPdf ? encodeAssetUrl(activeUrl) : '';

  // Reset PDF page state when active gallery item changes
  useEffect(() => {
    setPdfPage(1);
    setPdfNumPages(1);
  }, [activeUrl]);

  // Prefetch next page of multi-page PDF for snappy reading
  useEffect(() => {
    if (imageUrl && isPdf && pdfNumPages > 1 && pdfPage < pdfNumPages) {
      prefetchPdfPage(activeUrl, pdfPage + 1, 2200);
    }
  }, [imageUrl, isPdf, activeUrl, pdfPage, pdfNumPages]);

  useEffect(() => {
    if (!imageUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'PageDown' || (e.key === 'ArrowDown' && isPdf && pdfNumPages > 1)) {
        if (isPdf && pdfNumPages > 1) {
          e.preventDefault();
          setPdfPage((p) => Math.min(pdfNumPages, p + 1));
        }
      } else if (e.key === 'PageUp' || (e.key === 'ArrowUp' && isPdf && pdfNumPages > 1)) {
        if (isPdf && pdfNumPages > 1) {
          e.preventDefault();
          setPdfPage((p) => Math.max(1, p - 1));
        }
      } else if (e.key === 'ArrowRight') {
        if (gallery.length > 1) {
          setCurrentIndex((prev) => (prev + 1) % gallery.length);
        } else if (isPdf && pdfNumPages > 1) {
          setPdfPage((p) => Math.min(pdfNumPages, p + 1));
        }
      } else if (e.key === 'ArrowLeft') {
        if (gallery.length > 1) {
          setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
        } else if (isPdf && pdfNumPages > 1) {
          setPdfPage((p) => Math.max(1, p - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, gallery.length, isPdf, pdfNumPages, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-8 cursor-zoom-out"
    >
      {/* Top Close Control */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="w-11 h-11 bg-[#D72626] hover:bg-[#b51d1d] text-white flex items-center justify-center border border-white/20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[90vh] flex flex-col border border-zinc-800 bg-zinc-950 p-2 sm:p-3 shadow-2xl cursor-default"
      >
        <div
          className={`relative flex-1 min-h-0 flex items-center justify-center overflow-hidden ${
            isSvg ? 'bg-[#F2F2E9]' : 'bg-black/60'
          }`}
        >
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
              aria-label="Previous asset"
              className="absolute left-2 sm:left-4 z-20 w-11 h-11 bg-black/80 hover:bg-[#D72626] border border-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {isVideo ? (
            <video
              key={activeUrl}
              src={fixImageUrl(activeUrl)}
              controls
              autoPlay
              loop
              playsInline
              className="w-auto h-auto max-w-full max-h-[68vh] mx-auto bg-black"
            />
          ) : isPdf ? (
            <PdfPagePreview
              key={`${activeUrl}::${pdfPage}`}
              src={activeUrl}
              pageNumber={pdfPage}
              onDocumentLoad={setPdfNumPages}
              alt={`${activeFileName} — Page ${pdfPage}`}
              eager
              targetWidth={2200}
              className="w-auto h-auto max-w-full max-h-[68vh] object-contain mx-auto bg-white"
            />
          ) : (
            <img
              src={fixImageUrl(activeUrl)}
              alt={activeFileName}
              referrerPolicy="no-referrer"
              className={`w-auto h-auto max-w-full max-h-[68vh] object-contain mx-auto ${
                isSvg ? 'p-8 sm:p-14' : ''
              }`}
            />
          )}

          {gallery.length > 1 && (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % gallery.length)}
              aria-label="Next asset"
              className="absolute right-2 sm:right-4 z-20 w-11 h-11 bg-black/80 hover:bg-[#D72626] border border-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Integrated Brand Guide / PDF Reader Bar */}
        {isPdf && (
          <div className="mt-2 px-2 sm:px-3 py-2 border border-zinc-800 bg-black/70 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            {pdfNumPages > 1 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                  disabled={pdfPage <= 1}
                  className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-[#D72626] hover:text-white disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev Page</span>
                </button>

                {pdfNumPages <= 12 ? (
                  <div className="flex flex-wrap items-center gap-1">
                    {Array.from({ length: pdfNumPages }, (_, idx) => {
                      const pNum = idx + 1;
                      const active = pNum === pdfPage;
                      return (
                        <button
                          key={pNum}
                          type="button"
                          onClick={() => setPdfPage(pNum)}
                          className={`min-w-[28px] px-2 py-1 border text-[11px] tabular-nums transition-colors cursor-pointer ${
                            active
                              ? 'border-[#D72626] bg-[#D72626] text-white font-bold'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-600'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <span className="px-2 text-zinc-300 tabular-nums">
                    Page {pdfPage} / {pdfNumPages}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setPdfPage((p) => Math.min(pdfNumPages, p + 1))}
                  disabled={pdfPage >= pdfNumPages}
                  className="px-2.5 py-1 border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-[#D72626] hover:text-white disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-zinc-400 text-[11px] uppercase">
                <FileText className="w-3.5 h-3.5 text-[#D72626]" />
                <span>PDF Document · 1 Page</span>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <a
                href={safePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 border border-zinc-700 hover:border-[#D72626] bg-zinc-950 text-white hover:text-[#D72626] inline-flex items-center gap-1.5 text-[11px] uppercase transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open PDF</span>
              </a>
              <a
                href={safePdfUrl}
                download={activeFileName}
                className="px-2.5 py-1 border border-[#D72626] bg-[#D72626] hover:bg-[#b51d1d] text-white inline-flex items-center gap-1.5 text-[11px] font-bold uppercase transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        )}

        <div className="pt-2.5 pb-1 px-2 sm:px-3 font-mono text-xs text-zinc-400 border-t border-zinc-900 flex items-center justify-between gap-4">
          <span className="text-white font-bold truncate">
            {activeFileName}
            {isPdf && pdfNumPages > 1 ? ` · Page ${pdfPage} of ${pdfNumPages}` : ''}
          </span>
          {gallery.length > 1 ? (
            <span className="text-[#D72626] font-bold shrink-0 tabular-nums">
              {currentIndex + 1} / {gallery.length}
            </span>
          ) : (
            <span className="text-[#D72626] shrink-0">RXSTFXL Studio</span>
          )}
        </div>
      </div>
    </div>
  );
};
