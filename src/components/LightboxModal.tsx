import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fixImageUrl, isSvgUrl, isVideoUrl } from '../utils/imageUtils';

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

  useEffect(() => {
    if (!imageUrl) return;
    if (images && images.length > 0) {
      const idx = initialIndex >= 0 && initialIndex < images.length ? initialIndex : images.indexOf(imageUrl);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else {
      setCurrentIndex(0);
    }
  }, [imageUrl, images, initialIndex]);

  useEffect(() => {
    if (!imageUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && gallery.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % gallery.length);
      } else if (e.key === 'ArrowLeft' && gallery.length > 1) {
        setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, gallery.length, onClose]);

  if (!imageUrl) return null;

  const activeUrl = gallery[currentIndex] || imageUrl;
  const isSvg = isSvgUrl(activeUrl);
  const isVideo = isVideoUrl(activeUrl);
  const activeFileName = decodeURIComponent(activeUrl.split('/').pop() || title);

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
        className="relative w-full max-w-6xl max-h-[86vh] flex flex-col border border-zinc-800 bg-zinc-950 p-2 sm:p-3 shadow-2xl cursor-default"
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
              className="w-auto h-auto max-w-full max-h-[72vh] mx-auto bg-black"
            />
          ) : (
            <img
              src={fixImageUrl(activeUrl)}
              alt={activeFileName}
              referrerPolicy="no-referrer"
              className={`w-auto h-auto max-w-full max-h-[72vh] object-contain mx-auto ${
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

        <div className="pt-2.5 pb-1 px-2 sm:px-3 font-mono text-xs text-zinc-400 border-t border-zinc-900 flex items-center justify-between gap-4">
          <span className="text-white font-bold truncate">{activeFileName}</span>
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
