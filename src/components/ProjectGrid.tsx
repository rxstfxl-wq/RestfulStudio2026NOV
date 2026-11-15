import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { ArrowUpRight, ArrowLeft, ArrowRight, ChevronRight, RefreshCw, Folder } from 'lucide-react';
import { fixImageUrl, isPdfUrl, isSvgUrl, isVideoUrl } from '../utils/imageUtils';
import { PdfPagePreview } from './PdfPagePreview';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  selectedCategory?: 'all' | 'professional' | 'passion';
  setSelectedCategory?: (cat: 'all' | 'professional' | 'passion') => void;
  selectedDiscipline?: string;
  setSelectedDiscipline?: (discipline: string) => void;
  isAuthorLoggedIn?: boolean;
  hiddenProjectIds?: Set<string>;
  onToggleHideProject?: (projectId: string) => void;
  onRefreshProjects?: () => void;
  loading?: boolean;
}

const CATEGORIES_LIST = [
  { id: 'all', label: 'All' },
  { id: 'branding', label: 'Branding' },
  { id: 'print', label: 'Print & Ads' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'digital', label: 'Digital' },
  { id: 'signage', label: 'Signage' }
];

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
  selectedCategory = 'all',
  setSelectedCategory,
  selectedDiscipline = 'all',
  setSelectedDiscipline,
  isAuthorLoggedIn,
  hiddenProjectIds,
  onToggleHideProject,
  onRefreshProjects,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showAll, setShowAll] = useState<boolean>(true);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const activePageIndex = Math.min(currentPage, totalPages - 1);
  const visibleProjects = showAll
    ? projects
    : projects.slice(activePageIndex * pageSize, (activePageIndex + 1) * pageSize);

  const handleCategorySelect = (catId: string) => {
    setCurrentPage(0);
    if (setSelectedDiscipline) {
      setSelectedDiscipline(catId);
    }
  };

  const handlePortfolioTypeSelect = (type: 'all' | 'professional' | 'passion') => {
    setCurrentPage(0);
    if (setSelectedCategory) {
      if (selectedCategory === type && type !== 'all') {
        setSelectedCategory('all');
      } else {
        setSelectedCategory(type);
      }
    }
  };

  return (
    <section
      id="work"
      className="bg-[#080808] text-white py-8 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 selection:bg-[#D72626] selection:text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="border border-zinc-800 bg-[#050505] p-4 sm:p-8 relative">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 mb-6 sm:mb-8 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400 uppercase tracking-widest mb-1.5">
                <span>public/projects-media</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{projects.length} Folders</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl tracking-tight leading-none text-white font-bold uppercase">
                Portfolio Gallery
              </h2>
            </div>

            {/* Category & Discipline Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              {/* Channel Segmented Control */}
              <div className="flex items-center gap-1 border border-zinc-800 bg-zinc-950 p-1 font-mono text-[11px]">
                {(['all', 'professional', 'passion'] as const).map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handlePortfolioTypeSelect(cat)}
                      className={`min-h-[34px] px-3 py-1 uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-[#D72626] text-white font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat === 'professional' ? 'Professional' : 'Passion'}
                    </button>
                  );
                })}
              </div>

              {onRefreshProjects && (
                <button
                  type="button"
                  onClick={onRefreshProjects}
                  title="Rescan public/projects-media for newly uploaded folders"
                  className="min-h-[42px] px-3 py-1.5 border border-zinc-800 hover:border-[#D72626] bg-zinc-950 text-zinc-300 hover:text-white font-mono text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Folders</span>
                </button>
              )}
            </div>
          </div>

          {/* Horizontal Discipline Filter Strip */}
          <div className="relative flex items-center mb-6 sm:mb-8 pb-4 border-b border-zinc-800/80">
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-4 overflow-x-auto no-scrollbar pr-8 font-mono text-xs uppercase tracking-wider whitespace-nowrap"
            >
              {CATEGORIES_LIST.map((cat) => {
                const isActive = selectedDiscipline === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`min-h-[36px] py-1 transition-colors shrink-0 cursor-pointer ${
                      isActive
                        ? 'text-[#D72626] font-bold underline underline-offset-4 decoration-[#D72626]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => categoryScrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' })}
              aria-label="Scroll disciplines"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#050505] pl-2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {isAuthorLoggedIn && (
            <div className="mb-6 bg-zinc-950 border border-emerald-500/40 p-3.5 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase">Author Mode Active</span>
              <span className="text-zinc-400">
                Toggle visibility on any folder below to hide or publish it.
              </span>
            </div>
          )}

          {/* Responsive Project Cards Grid */}
          {visibleProjects.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-zinc-800 space-y-4">
              <p className="font-mono text-zinc-400 text-sm">
                No project folders matched the current filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (setSelectedCategory) setSelectedCategory('all');
                  if (setSelectedDiscipline) setSelectedDiscipline('all');
                  setCurrentPage(0);
                }}
                className="bg-[#D72626] text-white font-mono text-xs px-4 py-2.5 uppercase font-bold tracking-wider hover:bg-[#b51d1d] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {visibleProjects.map((project) => {
                const isHidden = hiddenProjectIds?.has(project.id);
                const isSvgHero = isSvgUrl(project.heroImage);
                const isVideoHero = isVideoUrl(project.heroImage);
                const isPdfHero = isPdfUrl(project.heroImage);

                return (
                  <article
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className={`group cursor-pointer border bg-[#0A0A0A] transition-colors duration-200 flex flex-col justify-between overflow-hidden ${
                      isHidden
                        ? 'border-dashed border-red-900/80 opacity-75'
                        : 'border-zinc-800 hover:border-[#D72626]'
                    }`}
                  >
                    {/* Media Preview */}
                    <div
                      className={`relative aspect-[4/3] overflow-hidden border-b border-zinc-800/80 flex items-center justify-center ${
                        isSvgHero ? 'bg-[#F2F2E9]' : 'bg-zinc-950'
                      }`}
                    >
                      {project.heroImage ? (
                        isVideoHero ? (
                          <video
                            src={fixImageUrl(project.heroImage)}
                            muted
                            loop
                            playsInline
                            autoPlay
                            preload="metadata"
                            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                              isHidden ? 'grayscale opacity-40' : ''
                            }`}
                          />
                        ) : isPdfHero ? (
                          <PdfPagePreview
                            src={project.heroImage}
                            alt={project.title}
                            eager
                            targetWidth={760}
                            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                              isHidden ? 'grayscale opacity-40' : ''
                            }`}
                          />
                        ) : (
                          <img
                            src={fixImageUrl(project.heroImage)}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className={`w-full h-full transition-transform duration-500 ease-out ${
                              isSvgHero
                                ? 'object-contain p-10 group-hover:scale-105'
                                : 'object-cover group-hover:scale-105'
                            } ${isHidden ? 'grayscale opacity-40' : ''}`}
                          />
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-zinc-600 p-6">
                          <Folder className="w-10 h-10 mb-2" />
                          <span className="font-mono text-xs uppercase">{project.folderName}</span>
                        </div>
                      )}

                      {isAuthorLoggedIn && onToggleHideProject && (
                        <div className="absolute top-3 right-3 z-20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleHideProject(project.id);
                            }}
                            className={`font-mono text-[10px] font-bold uppercase px-2.5 py-1 border transition-colors cursor-pointer ${
                              isHidden
                                ? 'bg-zinc-950/95 border-red-500 text-red-400'
                                : 'bg-zinc-950/95 border-emerald-500 text-emerald-400'
                            }`}
                          >
                            {isHidden ? 'Hidden' : 'Active'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Body — Zero-Pill Clean Typographic Metadata */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 uppercase tracking-wider tabular-nums">
                          <span className="text-[#D72626] font-bold">{project.number}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{project.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{project.year}</span>
                        </div>

                        <h3 className="font-display text-2xl sm:text-3xl text-white group-hover:text-[#D72626] transition-colors leading-tight uppercase">
                          {project.title}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                          {project.shortDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                        <span className="truncate pr-2 tabular-nums">
                          {project.assetCount} {project.assetCount === 1 ? 'asset' : 'assets'}
                          {project.subfolders.length > 0
                            ? ` · ${project.subfolders.length} ${
                                project.subfolders.length === 1 ? 'sub-library' : 'sub-libraries'
                              }`
                            : ''}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#D72626] font-bold shrink-0 uppercase">
                          <span>Open</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Optional Pagination when more than pageSize projects exist */}
          {projects.length > pageSize && (
            <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <span className="text-zinc-400 tabular-nums">
                Showing {visibleProjects.length} of {projects.length} folders
              </span>

              <div className="flex items-center gap-2">
                {!showAll && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={activePageIndex === 0}
                      className="px-3 py-2 border border-zinc-800 text-zinc-300 disabled:opacity-40 hover:border-[#D72626] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={activePageIndex >= totalPages - 1}
                      className="px-3 py-2 border border-zinc-800 text-zinc-300 disabled:opacity-40 hover:border-[#D72626] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="px-3 py-2 border border-zinc-800 hover:border-[#D72626] text-zinc-300 hover:text-white uppercase cursor-pointer"
                >
                  {showAll ? 'Paginate' : `View All (${projects.length})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
