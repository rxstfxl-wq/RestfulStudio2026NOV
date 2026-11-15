import React, { useState, useEffect, useMemo } from 'react';
import { Project, ProjectSubfolder } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  Maximize2,
  Palette,
  Type,
  CheckCircle2,
  Grid,
  Play,
} from 'lucide-react';
import { fixImageUrl, isPdfUrl, isSvgUrl, isVideoUrl } from '../utils/imageUtils';
import { PdfPagePreview } from './PdfPagePreview';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onSelectProject: (p: Project) => void;
  allProjects: Project[];
  onOpenLightbox: (imageUrl: string, title: string, images?: string[], index?: number) => void;
  isAuthorLoggedIn?: boolean;
  hiddenProjectIds?: Set<string>;
  onToggleHideProject?: (projectId: string) => void;
  hiddenSubProjectKeys?: Set<string>;
  onToggleHideSubProject?: (subKey: string) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBack,
  onSelectProject,
  allProjects,
  onOpenLightbox,
  isAuthorLoggedIn,
  hiddenProjectIds,
  onToggleHideProject,
  hiddenSubProjectKeys,
  onToggleHideSubProject,
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'overview' | 'typography' | 'outcomes'>('gallery');
  // 'all' displays root folder media (if any) + each subfolder sub-library stacked cleanly;
  // 'root' isolates root folder media; otherwise equals subfolder.id
  const [activeScope, setActiveScope] = useState<string>('all');
  const [expandedSubIds, setExpandedSubIds] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState<number>(1);
  const [showAllAssets, setShowAllAssets] = useState<boolean>(false);

  const isHidden = hiddenProjectIds?.has(project.id);

  useEffect(() => {
    setActiveScope('all');
    setExpandedSubIds(new Set());
    setPage(1);
    setShowAllAssets(false);
    setActiveTab('gallery');
  }, [project.id]);

  useEffect(() => {
    setPage(1);
    setShowAllAssets(false);
  }, [activeScope]);

  const isVisualMedia = (type: string) =>
    type === 'image' || type === 'svg' || type === 'video' || type === 'pdf';

  // Root-level media files directly inside public/projects-media/<project>
  const rootMediaUrls = useMemo(
    () =>
      project.files
        .filter((f) => !f.subfolder && isVisualMedia(f.type))
        .map((f) => f.url),
    [project.files]
  );

  // Visible subfolder sub-libraries inside public/projects-media/<project>/<subfolder>
  const allSubfolders = project.subfolders || [];
  const visibleSubfolders: ProjectSubfolder[] = useMemo(
    () =>
      allSubfolders.filter((sf) => {
        const subKey = `${project.id}__sub_${sf.folderName}`;
        return isAuthorLoggedIn || !hiddenSubProjectKeys?.has(subKey);
      }),
    [allSubfolders, project.id, isAuthorLoggedIn, hiddenSubProjectKeys]
  );

  // Combined ordered media list across root + visible sub-libraries
  const allCombinedMedia = useMemo(() => {
    if (allSubfolders.length === 0) {
      return project.files.filter((f) => isVisualMedia(f.type)).map((f) => f.url);
    }
    return [
      ...rootMediaUrls,
      ...visibleSubfolders.flatMap((sf) => sf.images),
    ];
  }, [allSubfolders.length, project.files, rootMediaUrls, visibleSubfolders]);

  // Isolated media list when viewing a single scope (no subfolders, 'root', or one sub-library)
  const isolatedSubfolder = visibleSubfolders.find((sf) => sf.id === activeScope) || null;
  const isolatedMedia = useMemo(() => {
    if (allSubfolders.length === 0) return allCombinedMedia;
    if (activeScope === 'root') return rootMediaUrls;
    if (isolatedSubfolder) return isolatedSubfolder.images;
    return allCombinedMedia;
  }, [allSubfolders.length, allCombinedMedia, activeScope, rootMediaUrls, isolatedSubfolder]);

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(isolatedMedia.length / perPage));
  const safePage = Math.min(page, totalPages);
  const displayedImages = showAllAssets
    ? isolatedMedia
    : isolatedMedia.slice((safePage - 1) * perPage, safePage * perPage);

  const isSvgHero = isSvgUrl(project.heroImage);
  const isVideoHero = isVideoUrl(project.heroImage);
  const isPdfHero = isPdfUrl(project.heroImage);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject =
    allProjects.length > 1 ? allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length] : null;
  const nextProject = allProjects.length > 1 ? allProjects[(currentIndex + 1) % allProjects.length] : null;

  const toggleSubExpanded = (subId: string) => {
    setExpandedSubIds((prev) => {
      const next = new Set(prev);
      if (next.has(subId)) next.delete(subId);
      else next.add(subId);
      return next;
    });
  };

  const renderMediaCard = (
    mediaUrl: string,
    indexInScope: number,
    scopeGallery: string[]
  ) => {
    const fileName = decodeURIComponent(mediaUrl.split('/').pop() || `Asset ${indexInScope + 1}`);
    const isSvg = isSvgUrl(mediaUrl);
    const isVideo = isVideoUrl(mediaUrl);
    const isPdf = isPdfUrl(mediaUrl);

    return (
      <button
        key={`${mediaUrl}-${indexInScope}`}
        type="button"
        onClick={() => onOpenLightbox(mediaUrl, fileName, scopeGallery, indexInScope)}
        className="group text-left border border-zinc-800 hover:border-[#D72626] bg-zinc-950 overflow-hidden transition-colors cursor-pointer flex flex-col"
      >
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center ${
            isSvg ? 'bg-[#F2F2E9]' : 'bg-black'
          }`}
        >
          {isVideo ? (
            <>
              <video
                src={fixImageUrl(mediaUrl)}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 bg-black/80 border border-zinc-700 px-2 py-0.5 font-mono text-[10px] text-white inline-flex items-center gap-1 uppercase">
                <Play className="w-3 h-3 text-[#D72626] fill-[#D72626]" />
                <span>Video</span>
              </div>
            </>
          ) : isPdf ? (
            <PdfPagePreview
              src={mediaUrl}
              alt={fileName}
              targetWidth={680}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <img
              src={fixImageUrl(mediaUrl)}
              alt={fileName}
              loading="lazy"
              referrerPolicy="no-referrer"
              className={`w-full h-full transition-transform duration-300 ${
                isSvg
                  ? 'object-contain p-6 group-hover:scale-105'
                  : 'object-cover group-hover:scale-105'
              }`}
            />
          )}
        </div>
        <div className="p-2.5 border-t border-zinc-900 flex items-center justify-between gap-2 font-mono text-[10px] text-zinc-400">
          <span className="truncate">{fileName}</span>
          <span className="text-[#D72626] shrink-0 tabular-nums">
            {String(indexInScope + 1).padStart(2, '0')}
          </span>
        </div>
      </button>
    );
  };

  return (
    <article className="bg-[#080808] text-[#F2F2F2] py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Top Navigation Row */}
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-4 gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[40px] group font-mono text-xs text-zinc-400 hover:text-white uppercase tracking-widest inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#D72626] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Gallery</span>
          </button>

          <div className="flex items-center gap-3">
            {isAuthorLoggedIn && onToggleHideProject && (
              <button
                type="button"
                onClick={() => onToggleHideProject(project.id)}
                className={`font-mono text-xs font-bold uppercase px-3 py-1.5 border transition-colors cursor-pointer ${
                  isHidden
                    ? 'border-red-500 text-red-400 bg-zinc-950'
                    : 'border-emerald-500 text-emerald-400 bg-zinc-950'
                }`}
              >
                {isHidden ? 'State: Hidden' : 'State: Active'}
              </button>
            )}
            <span className="font-mono text-xs text-zinc-400 tabular-nums">
              {project.number} · {project.year}
            </span>
          </div>
        </div>

        {/* Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div className="font-mono text-xs text-[#D72626] font-bold tracking-widest uppercase">
              {project.disciplineLabel}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] text-white tracking-tight uppercase [text-wrap:balance]">
              {project.title}
            </h1>

            <p className="font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              {project.overview}
              {project.liveUrl && (
                <>
                  {' '}
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D72626] hover:text-white underline underline-offset-4 font-medium transition-colors"
                  >
                    {project.liveUrlLabel || 'Visit Website'}
                  </a>
                </>
              )}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-800 py-4 font-mono text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Folder</span>
                <span className="text-white font-bold break-all">{project.folderName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Library</span>
                <span className="text-white font-bold tabular-nums">
                  {project.assetCount} {project.assetCount === 1 ? 'File' : 'Files'}
                  {visibleSubfolders.length > 0
                    ? ` · ${visibleSubfolders.length} ${
                        visibleSubfolders.length === 1 ? 'Sub-Library' : 'Sub-Libraries'
                      }`
                    : ''}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Category</span>
                <span className="text-[#D72626] font-bold uppercase">{project.category}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Year</span>
                <span className="text-white font-bold tabular-nums">{project.year}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              onClick={() => {
                if (project.heroImage) {
                  const idx = allCombinedMedia.indexOf(project.heroImage);
                  onOpenLightbox(
                    project.heroImage,
                    project.title,
                    allCombinedMedia.length > 0 ? allCombinedMedia : [project.heroImage],
                    idx >= 0 ? idx : 0
                  );
                }
              }}
              className={`relative aspect-[16/10] border border-zinc-800 overflow-hidden cursor-zoom-in group flex items-center justify-center ${
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
                    className="w-full h-full object-cover"
                  />
                ) : isPdfHero ? (
                  <PdfPagePreview
                    src={project.heroImage}
                    alt={project.title}
                    eager
                    targetWidth={1280}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={fixImageUrl(project.heroImage)}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full transition-transform duration-500 ${
                      isSvgHero
                        ? 'object-contain p-12 group-hover:scale-105'
                        : 'object-cover group-hover:scale-[1.02]'
                    }`}
                  />
                )
              ) : (
                <Folder className="w-12 h-12 text-zinc-700" />
              )}

              {project.heroImage && (
                <div className="absolute bottom-3 right-3 bg-black/80 border border-zinc-700 px-3 py-1.5 font-mono text-[11px] text-white inline-flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#D72626]" />
                  <span>Inspect</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="border-t border-zinc-800 pt-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4 font-mono text-xs">
            {(
              [
                { id: 'gallery', label: `Media Library (${allCombinedMedia.length})` },
                { id: 'overview', label: 'Brief & Strategy' },
                { id: 'typography', label: 'Typography & Palette' },
                { id: 'outcomes', label: 'Summary' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[40px] px-4 py-2 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#D72626] text-white font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Unified Media Library & Subfolder Sub-Libraries */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              {/* Sub-Library Filter Strip when folder contains subfolders */}
              {allSubfolders.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveScope('all')}
                    className={`min-h-[40px] px-3.5 py-2 border font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer ${
                      activeScope === 'all'
                        ? 'border-[#D72626] bg-[#D72626]/15 text-white font-bold'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5 text-[#D72626]" />
                    <span>All Media</span>
                    <span className="text-zinc-500 tabular-nums">({allCombinedMedia.length})</span>
                  </button>

                  {rootMediaUrls.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveScope('root')}
                      className={`min-h-[40px] px-3.5 py-2 border font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer ${
                        activeScope === 'root'
                          ? 'border-[#D72626] bg-[#D72626]/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[#D72626]" />
                      <span>Main Folder</span>
                      <span className="text-zinc-500 tabular-nums">({rootMediaUrls.length})</span>
                    </button>
                  )}

                  {allSubfolders.map((sf) => {
                    const subKey = `${project.id}__sub_${sf.folderName}`;
                    const isSubHidden = hiddenSubProjectKeys?.has(subKey);
                    if (!isAuthorLoggedIn && isSubHidden) return null;

                    const active = activeScope === sf.id;
                    return (
                      <div key={sf.id} className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveScope(sf.id)}
                          className={`min-h-[40px] px-3.5 py-2 border font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer ${
                            active
                              ? 'border-[#D72626] bg-[#D72626]/15 text-white font-bold'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Folder className="w-3.5 h-3.5 text-[#D72626]" />
                          <span>{sf.title}</span>
                          <span className="text-zinc-500 tabular-nums">({sf.images.length})</span>
                        </button>
                        {isAuthorLoggedIn && onToggleHideSubProject && (
                          <button
                            type="button"
                            onClick={() => onToggleHideSubProject(subKey)}
                            className="min-h-[40px] px-2 border border-zinc-800 font-mono text-[10px] text-zinc-400 hover:text-white cursor-pointer"
                          >
                            {isSubHidden ? 'Show' : 'Hide'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Grouped "All Media" view when subfolders exist */}
              {allSubfolders.length > 0 && activeScope === 'all' ? (
                <div className="space-y-10">
                  {/* Root / Main Folder Section (only if project also has top-level files) */}
                  {rootMediaUrls.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                        <div className="flex items-center gap-2.5 font-mono text-xs">
                          <FolderOpen className="w-4 h-4 text-[#D72626]" />
                          <span className="text-white font-bold uppercase tracking-wider">
                            {project.title} — Main Folder
                          </span>
                          <span className="text-zinc-500 tabular-nums">
                            ({rootMediaUrls.length} {rootMediaUrls.length === 1 ? 'asset' : 'assets'})
                          </span>
                        </div>
                        {rootMediaUrls.length > 8 && (
                          <button
                            type="button"
                            onClick={() => setActiveScope('root')}
                            className="font-mono text-[11px] text-[#D72626] hover:underline uppercase cursor-pointer"
                          >
                            Focus Main Folder
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {rootMediaUrls.map((url, idx) => renderMediaCard(url, idx, rootMediaUrls))}
                      </div>
                    </section>
                  )}

                  {/* Each Subfolder rendered explicitly as an interactive Sub-Library */}
                  {visibleSubfolders.map((sf) => {
                    const isExpanded = expandedSubIds.has(sf.id);
                    const previewLimit = 8;
                    const needsExpand = sf.images.length > previewLimit;
                    const visibleItems =
                      needsExpand && !isExpanded ? sf.images.slice(0, previewLimit) : sf.images;

                    return (
                      <section
                        key={sf.id}
                        className="border border-zinc-800/90 bg-zinc-950/40 p-4 sm:p-5 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 font-mono text-xs">
                              <Folder className="w-4 h-4 text-[#D72626] shrink-0" />
                              <span className="text-white font-bold uppercase tracking-wider truncate">
                                {sf.title}
                              </span>
                              <span className="text-zinc-500 tabular-nums shrink-0">
                                ({sf.images.length} {sf.images.length === 1 ? 'asset' : 'assets'})
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-zinc-500 block mt-0.5 truncate">
                              Sub-library · {project.folderName}/{sf.folderName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            {needsExpand && (
                              <button
                                type="button"
                                onClick={() => toggleSubExpanded(sf.id)}
                                className="px-3 py-1.5 border border-zinc-800 hover:border-[#D72626] text-zinc-300 hover:text-white uppercase cursor-pointer"
                              >
                                {isExpanded ? 'Show Less' : `Expand All (${sf.images.length})`}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setActiveScope(sf.id)}
                              className="px-3 py-1.5 border border-zinc-800 hover:border-[#D72626] text-[#D72626] uppercase font-bold cursor-pointer"
                            >
                              Open Sub-Library
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                          {visibleItems.map((url, idx) => renderMediaCard(url, idx, sf.images))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                /* Focused / Single-Folder / Isolated Sub-Library Paginated View */
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Grid className="w-4 h-4 text-[#D72626]" />
                      <span>
                        {isolatedSubfolder
                          ? `${isolatedSubfolder.title} (Sub-library)`
                          : activeScope === 'root'
                            ? `${project.title} — Main Folder`
                            : project.title}{' '}
                        · {isolatedMedia.length} {isolatedMedia.length === 1 ? 'asset' : 'assets'}
                      </span>
                    </div>

                    {isolatedMedia.length > perPage && (
                      <div className="flex items-center gap-2">
                        {!showAllAssets && (
                          <span className="tabular-nums">
                            Page {safePage} / {totalPages}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowAllAssets((prev) => !prev)}
                          className="px-3 py-1.5 border border-zinc-800 hover:border-[#D72626] text-zinc-300 hover:text-white uppercase cursor-pointer"
                        >
                          {showAllAssets ? `Paginate (${perPage})` : `View All (${isolatedMedia.length})`}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {displayedImages.map((mediaUrl, idx) => {
                      const globalIdx = showAllAssets ? idx : (safePage - 1) * perPage + idx;
                      return renderMediaCard(mediaUrl, globalIdx, isolatedMedia);
                    })}
                  </div>

                  {!showAllAssets && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-2 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={safePage <= 1}
                        className="min-h-[40px] px-4 py-2 border border-zinc-800 text-zinc-300 disabled:opacity-40 hover:border-[#D72626] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Prev</span>
                      </button>
                      <span className="text-zinc-400 tabular-nums">
                        {safePage} / {totalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safePage >= totalPages}
                        className="min-h-[40px] px-4 py-2 border border-zinc-800 text-zinc-300 disabled:opacity-40 hover:border-[#D72626] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Overview & Strategy */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-2">
                <h3 className="font-mono text-xs text-[#D72626] uppercase font-bold tracking-widest">
                  Challenge
                </h3>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed">{project.challenge}</p>
              </div>
              <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-2">
                <h3 className="font-mono text-xs text-[#D72626] uppercase font-bold tracking-widest">
                  Strategy
                </h3>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed">{project.strategy}</p>
              </div>
              <div className="bg-zinc-950 p-5 border border-zinc-800 space-y-2">
                <h3 className="font-mono text-xs text-[#D72626] uppercase font-bold tracking-widest">
                  Solution
                </h3>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed">{project.solution}</p>
              </div>
            </div>
          )}

          {/* TAB 3: Typography & Color Palette */}
          {activeTab === 'typography' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-950 p-6 border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-[#D72626] font-mono text-xs uppercase font-bold">
                  <Type className="w-4 h-4" />
                  <span>Typography</span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase block">Primary</span>
                  <span className="font-display text-3xl text-white uppercase">
                    {project.typographyUsed.primary}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase block">Secondary</span>
                  <span className="font-mono text-lg text-zinc-200">{project.typographyUsed.secondary}</span>
                </div>
              </div>

              <div className="bg-zinc-950 p-6 border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2 text-[#D72626] font-mono text-xs uppercase font-bold">
                  <Palette className="w-4 h-4" />
                  <span>Color System</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.colorPalette.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 border border-zinc-800 p-2.5 bg-black/40"
                    >
                      <div
                        className="w-7 h-7 border border-zinc-700 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="font-mono text-[11px] min-w-0">
                        <span className="text-white font-bold block truncate">{color.name}</span>
                        <span className="text-zinc-400">{color.hex}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Summary */}
          {activeTab === 'outcomes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.results.map((res, i) => (
                <div key={i} className="bg-zinc-950 p-5 border border-zinc-800 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D72626] shrink-0 mt-0.5" />
                  <p className="font-sans text-sm text-zinc-300 leading-relaxed">{res}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next / Previous Project Footer */}
        {(prevProject || nextProject) && (
          <div className="border-t border-zinc-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {prevProject ? (
              <button
                type="button"
                onClick={() => onSelectProject(prevProject)}
                className="p-4 border border-zinc-800 hover:border-[#D72626] bg-zinc-950 text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <span className="text-[10px] text-zinc-500 uppercase block">Previous Project</span>
                  <span className="text-white font-bold uppercase truncate block">{prevProject.title}</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#D72626] shrink-0" />
              </button>
            ) : (
              <div />
            )}

            {nextProject && (
              <button
                type="button"
                onClick={() => onSelectProject(nextProject)}
                className="p-4 border border-zinc-800 hover:border-[#D72626] bg-zinc-950 text-right flex items-center justify-between transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-[#D72626] shrink-0" />
                <div className="min-w-0 pl-3">
                  <span className="text-[10px] text-zinc-500 uppercase block">Next Project</span>
                  <span className="text-white font-bold uppercase truncate block">{nextProject.title}</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
