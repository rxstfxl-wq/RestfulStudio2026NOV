import React, { useState } from 'react';
import { Project } from '../types';
import { fixImageUrl } from '../utils/imageUtils';

interface ClientMarksSectionProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}

type LogoTone = 'white' | 'black' | 'color';

function getInitialLogoTone(url: string, name: string): LogoTone {
  const combined = `${url} ${name}`.toLowerCase();
  if (/(rxstfxl|white)/.test(combined)) return 'white';
  if (/(black|\bblk\b|rebirth)/.test(combined)) return 'black';
  return 'color';
}

function classifyLoadedLogo(img: HTMLImageElement): LogoTone {
  try {
    const width = 64;
    const ratio = img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : 1;
    const height = Math.max(16, Math.min(64, Math.round(width * ratio)));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 'white';

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);

    let opaquePixels = 0;
    let chromaticPixels = 0;
    let darkPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 25) continue;
      opaquePixels += 1;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const spread = max - min;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      if (spread > 28) {
        chromaticPixels += 1;
      } else if (luminance < 110) {
        darkPixels += 1;
      }
    }

    if (opaquePixels === 0) return 'white';
    if (chromaticPixels / opaquePixels >= 0.02) return 'color';
    if (darkPixels / opaquePixels >= 0.25) return 'black';
    return 'white';
  } catch {
    return 'white';
  }
}

export const ClientMarksSection: React.FC<ClientMarksSectionProps> = ({
  projects,
  onSelectProject,
}) => {
  const [logoTones, setLogoTones] = useState<Record<string, LogoTone>>({});

  // Collect real SVG logo assets from discovered project folders + studio logo
  const svgFiles = projects.flatMap((p) =>
    p.files
      .filter((f) => f.type === 'svg')
      .map((f) => ({
        id: f.id,
        name: f.name.replace(/\.svg$/i, '').replace(/[-_]+/g, ' '),
        logo: f.url,
        project: p,
      }))
  );

  const marks = [
    {
      id: 'rxstfxl-studio-mark',
      name: 'RXSTFXL Studio',
      logo: '/brand-assets/RXSTFXL LOGO - LANDSCAPE.svg',
      project: undefined as Project | undefined,
    },
    ...svgFiles,
  ];

  if (marks.length === 0) return null;

  const handleImageLoad = (id: string, img: HTMLImageElement) => {
    const detected = classifyLoadedLogo(img);
    setLogoTones((prev) => (prev[id] === detected ? prev : { ...prev, [id]: detected }));
  };

  return (
    <section className="bg-[#080808] text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-grid-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="border border-zinc-800 bg-[#050505] p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-3 border-b border-zinc-800 gap-2">
            <h3 className="font-mono text-xs text-white font-bold tracking-widest uppercase">
              Studio & Project Marks
            </h3>
            <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
              {marks.length} {marks.length === 1 ? 'Mark' : 'Marks'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {marks.map((item) => {
              const tone = logoTones[item.id] ?? getInitialLogoTone(item.logo, item.name);
              const filterClass =
                tone === 'white'
                  ? 'invert'
                  : tone === 'color'
                    ? 'grayscale group-hover:grayscale-0'
                    : '';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.project && onSelectProject) {
                      onSelectProject(item.project);
                    }
                  }}
                  className={`w-full h-24 sm:h-28 border border-zinc-800/90 hover:border-[#D72626] p-4 flex items-center justify-center transition-colors group bg-[#e1ddc8] ${
                    item.project ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  title={item.name}
                >
                  <img
                    src={fixImageUrl(item.logo)}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onLoad={(e) => handleImageLoad(item.id, e.currentTarget)}
                    className={`max-h-14 max-w-[85%] w-auto object-contain transition-all duration-300 group-hover:scale-105 ${filterClass}`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

