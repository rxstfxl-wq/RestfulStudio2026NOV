import React, { useState } from 'react';
import { X, ArrowUpRight, Search } from 'lucide-react';
import { Project } from '../types';
import { fixImageUrl } from '../utils/imageUtils';

interface QuickIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onNavigateSection: (sectionId: string) => void;
  isAuthorLoggedIn?: boolean;
  hiddenProjectIds?: Set<string>;
}

export const QuickIndexModal: React.FC<QuickIndexModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSelectProject,
  onNavigateSection,
  isAuthorLoggedIn,
  hiddenProjectIds
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const visibleProjects = projects.filter((p) => {
    if (!isAuthorLoggedIn && hiddenProjectIds?.has(p.id)) {
      return false;
    }
    return true;
  });

  const filteredProjects = visibleProjects.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.folderName.toLowerCase().includes(q) ||
      p.disciplineLabel.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subfolders.some(
        (sf) => sf.title.toLowerCase().includes(q) || sf.folderName.toLowerCase().includes(q)
      )
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#080808]/95 backdrop-blur-xl text-white flex flex-col p-4 sm:p-10 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-zinc-800 pb-5 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <img
            src={fixImageUrl('brand-assets/RXSTFXL LOGO - LANDSCAPE.svg')}
            alt="RXSTFXL Logo"
            referrerPolicy="no-referrer"
            className="h-6 sm:h-7 w-auto object-contain"
          />
          <span className="hidden sm:inline-block font-mono text-xs text-[#D72626] tracking-widest uppercase font-bold border-l border-zinc-800 pl-4">
            Studio Index & Search
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close studio index"
          className="w-11 h-11 bg-zinc-900 hover:bg-[#D72626] text-white flex items-center justify-center border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Left Column: Section Jump */}
        <div className="lg:col-span-4 space-y-6 font-mono">
          <div className="border-b border-zinc-800 pb-2">
            <span className="text-xs text-zinc-500 uppercase tracking-widest block">01. Sections</span>
          </div>

          <div className="flex flex-col space-y-2 text-2xl font-display uppercase tracking-wider">
            <button
              type="button"
              onClick={() => {
                onNavigateSection('work');
                onClose();
              }}
              className="text-left text-zinc-300 hover:text-[#D72626] transition-colors py-1.5 border-b border-zinc-900 cursor-pointer"
            >
              01. Selected Work
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateSection('about');
                onClose();
              }}
              className="text-left text-zinc-300 hover:text-[#D72626] transition-colors py-1.5 border-b border-zinc-900 cursor-pointer"
            >
              02. About Austin Fouche
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateSection('services');
                onClose();
              }}
              className="text-left text-zinc-300 hover:text-[#D72626] transition-colors py-1.5 border-b border-zinc-900 cursor-pointer"
            >
              03. Services & Process
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateSection('contact');
                onClose();
              }}
              className="text-left text-zinc-300 hover:text-[#D72626] transition-colors py-1.5 border-b border-zinc-900 cursor-pointer"
            >
              04. Contact & Terms
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-400 space-y-1.5">
            <span className="text-zinc-500 block uppercase text-[10px]">Direct Email</span>
            <a
              href="mailto:rxstfxl@gmail.com"
              className="text-white font-bold hover:text-[#D72626] transition-colors"
            >
              rxstfxl@gmail.com
            </a>
          </div>
        </div>

        {/* Right Column: Searchable Project Directory */}
        <div className="lg:col-span-8 space-y-5">
          <div className="border-b border-zinc-800 pb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest tabular-nums">
              02. Project Folders ({filteredProjects.length})
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project folder, title, or discipline..."
              className="w-full min-h-[44px] bg-zinc-950 border border-zinc-800 focus:border-[#D72626] text-white pl-10 pr-4 py-2.5 font-mono text-xs focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
            {filteredProjects.map((p) => {
              const isHidden = hiddenProjectIds?.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectProject(p);
                    onClose();
                  }}
                  className={`w-full text-left group cursor-pointer bg-zinc-950 border p-4 flex items-center justify-between transition-colors font-mono text-xs ${
                    isHidden
                      ? 'border-dashed border-red-900/70 bg-red-950/20'
                      : 'border-zinc-800 hover:border-[#D72626]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[#D72626] font-bold font-display text-lg tabular-nums shrink-0">
                      {p.number}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold block text-sm group-hover:text-[#D72626] transition-colors truncate">
                          {p.title}
                        </span>
                        {isHidden && (
                          <span className="text-[10px] text-[#D72626] font-bold uppercase">
                            Hidden
                          </span>
                        )}
                      </div>
                      <span className="text-zinc-500 text-[11px] block truncate tabular-nums">
                        {p.folderName} · {p.assetCount} assets
                        {p.subfolders.length > 0
                          ? ` · ${p.subfolders.length} ${
                              p.subfolders.length === 1 ? 'sub-library' : 'sub-libraries'
                            }`
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-zinc-500 hidden sm:inline tabular-nums">{p.year}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#D72626] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
