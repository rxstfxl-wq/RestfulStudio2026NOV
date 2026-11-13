import React from 'react';
import { Project } from '../types';
import { fixImageUrl } from '../utils/imageUtils';

interface ClientMarksSectionProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}

export const ClientMarksSection: React.FC<ClientMarksSectionProps> = ({
  projects,
  onSelectProject,
}) => {
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
            {marks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.project && onSelectProject) {
                    onSelectProject(item.project);
                  }
                }}
                className={`w-full h-24 sm:h-28 border border-zinc-800/90 hover:border-[#D72626] p-4 flex items-center justify-center transition-colors group ${
                  item.id === 'rxstfxl-studio-mark' ? 'bg-zinc-950' : 'bg-[#F2F2E9]'
                } ${item.project ? 'cursor-pointer' : 'cursor-default'}`}
                title={item.name}
              >
                <img
                  src={fixImageUrl(item.logo)}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="max-h-14 max-w-[85%] w-auto object-contain transition-transform group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
