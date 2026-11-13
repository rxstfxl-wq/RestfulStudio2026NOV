import React, { useMemo, useState, useEffect } from 'react';
import {
  Folder,
  ChevronRight,
  ChevronDown,
  Grid,
  List,
  Search,
  Image as ImageIcon,
  FileText,
  Video,
  Code,
  ArrowUpRight,
  X,
  Eye,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { buildFileSystem, FolderNode, FileType } from '../../data/fileSystem';
import { Project } from '../../types';
import { fixImageUrl, isSvgUrl, isVideoUrl } from '../../utils/imageUtils';

interface DesktopExplorerViewProps {
  projects: Project[];
  onOpenLightbox: (url: string, title: string, images?: string[], index?: number) => void;
  onGoToEditorial: () => void;
  onOpenAuthorAuth: () => void;
  onSelectProject: (project: Project) => void;
  onRefreshProjects?: () => void;
  isAuthorLoggedIn?: boolean;
  hiddenProjectIds?: Set<string>;
  theme?: 'dark' | 'light';
}

export const DesktopExplorerView: React.FC<DesktopExplorerViewProps> = ({
  projects,
  onOpenLightbox,
  onGoToEditorial,
  onOpenAuthorAuth,
  onSelectProject,
  onRefreshProjects,
  isAuthorLoggedIn = false,
  hiddenProjectIds,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  const visibleProjects = useMemo(() => {
    return projects.filter((p) => isAuthorLoggedIn || !hiddenProjectIds?.has(p.id));
  }, [projects, isAuthorLoggedIn, hiddenProjectIds]);

  const directories = useMemo(() => buildFileSystem(visibleProjects), [visibleProjects]);

  const [selectedDirId, setSelectedDirId] = useState<string>('all_projects');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeSubfolderId, setActiveSubfolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentDirectory =
    directories.find((d) => d.id === selectedDirId) || directories[0];

  const items = (currentDirectory?.subfolders || []).filter((folder) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      folder.name.toLowerCase().includes(q) ||
      folder.label.toLowerCase().includes(q) ||
      (folder.typeLabel && folder.typeLabel.toLowerCase().includes(q))
    );
  });

  const activeProjectNode: FolderNode | null = useMemo(() => {
    if (!activeProjectId) return null;
    for (const dir of directories) {
      const match = (dir.subfolders || []).find((f) => f.id === activeProjectId);
      if (match) return match;
    }
    return null;
  }, [activeProjectId, directories]);

  const fullProject: Project | null = useMemo(() => {
    if (!activeProjectNode?.projectId) return null;
    return visibleProjects.find((p) => p.id === activeProjectNode.projectId) || null;
  }, [activeProjectNode, visibleProjects]);

  // Auto-open the first subfolder when selecting a project that has subfolders
  useEffect(() => {
    if (activeProjectNode?.subfolders && activeProjectNode.subfolders.length > 0) {
      setActiveSubfolderId(activeProjectNode.subfolders[0].id);
    } else {
      setActiveSubfolderId(null);
    }
  }, [activeProjectNode?.id]);

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'svg':
        return <Code className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-[#D72626] shrink-0" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-400 shrink-0" />;
      default:
        return <Folder className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto border ${
        isLight
          ? 'border-zinc-300 bg-[#F2F2E9] text-zinc-900 shadow-xl'
          : 'border-zinc-800 bg-[#050505] text-white shadow-2xl'
      } flex flex-col h-[calc(100vh-88px)] min-h-[600px] max-h-[860px] overflow-hidden`}
    >
      {/* Window Title Bar */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between ${
          isLight ? 'bg-zinc-200/80 border-zinc-300' : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-bebas text-lg tracking-wider font-bold">RXSTFXL Studio</span>
          <span className="font-mono text-[11px] text-zinc-500">
            public/projects-media
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <span className="tabular-nums">{visibleProjects.length} Folders</span>
          {onRefreshProjects && (
            <button
              type="button"
              onClick={onRefreshProjects}
              className="px-2.5 py-1 border border-zinc-700 hover:border-[#D72626] text-zinc-300 hover:text-white inline-flex items-center gap-1.5 text-[11px] uppercase cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Dual-Pane Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`w-60 lg:w-68 border-r flex flex-col justify-between shrink-0 ${
            isLight ? 'bg-zinc-100/90 border-zinc-300' : 'bg-black/90 border-zinc-800/90'
          }`}
        >
          <div className="p-4 space-y-5 overflow-y-auto">
            <div className="space-y-1 font-mono text-xs">
              <div className="px-2 py-1.5 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                Directories
              </div>

              {directories.map((dir) => {
                const isSelected = selectedDirId === dir.id;
                return (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => {
                      setSelectedDirId(dir.id);
                      setActiveProjectId(null);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#D72626] text-white font-bold'
                        : isLight
                          ? 'text-zinc-700 hover:bg-zinc-200'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Folder className="w-4 h-4 shrink-0" />
                      <span className="truncate">{dir.label}</span>
                    </div>
                    <span className="text-[10px] opacity-75 tabular-nums ml-2">{dir.itemCount}</span>
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-zinc-800/60 space-y-1">
                <div className="px-2 py-1 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  Project Folders
                </div>
                {visibleProjects.map((p) => {
                  const isActive = activeProjectId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveProjectId(p.id)}
                      className={`w-full px-3 py-1.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'text-[#D72626] font-bold bg-zinc-900/60'
                          : isLight
                            ? 'text-zinc-600 hover:bg-zinc-200'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                      }`}
                    >
                      <span className="truncate">{p.folderName}</span>
                      <span className="text-[10px] text-zinc-500 tabular-nums ml-2">
                        {p.assetCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-zinc-800/80 space-y-2 font-mono text-xs">
            <button
              type="button"
              onClick={onGoToEditorial}
              className="w-full px-3 py-2 border border-zinc-800 hover:border-[#D72626] text-zinc-300 hover:text-white text-left uppercase transition-colors cursor-pointer"
            >
              Switch to Editorial View
            </button>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Action Bar */}
          <div
            className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-black/60 border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs min-w-0">
              <span className="text-[#D72626] font-bold">/</span>
              <span className="text-zinc-500">projects-media</span>
              <span className="text-zinc-600">/</span>
              <span className="font-bold truncate">{currentDirectory?.label}</span>
              {activeProjectNode && (
                <>
                  <span className="text-zinc-600">/</span>
                  <span className="text-[#D72626] font-bold truncate">{activeProjectNode.name}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center border border-zinc-800 bg-zinc-950">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#D72626] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-[#D72626] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-zinc-900/80 border border-zinc-800 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D72626] w-44 sm:w-56"
                />
              </div>

              <button
                type="button"
                onClick={onOpenAuthorAuth}
                className={`p-1.5 border font-mono text-xs uppercase transition-colors cursor-pointer ${
                  isAuthorLoggedIn
                    ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-400'
                    : 'border-zinc-800 hover:border-zinc-700 text-zinc-400'
                }`}
                title="Author Controls"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Directory Split Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Folder Grid / List */}
            <div
              className={`flex-1 p-5 overflow-y-auto ${
                activeProjectNode ? 'hidden lg:block lg:w-1/2 border-r border-zinc-800' : 'w-full'
              }`}
            >
              <div className="mb-5 pb-3 border-b border-zinc-800/80 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-bebas text-3xl uppercase tracking-wider">
                    {currentDirectory?.label}
                  </h2>
                  <p className="font-mono text-xs text-zinc-400 mt-0.5">
                    {currentDirectory?.description}
                  </p>
                </div>
                <span className="font-mono text-xs text-zinc-500 tabular-nums shrink-0">
                  {items.length} {items.length === 1 ? 'folder' : 'folders'}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-zinc-800 font-mono text-xs text-zinc-500">
                  No matching project folders in this directory.
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((folder) => {
                    const isSelected = activeProjectNode?.id === folder.id;
                    const isSvg = isSvgUrl(folder.coverImage);
                    const isVideo = isVideoUrl(folder.coverImage);
                    const subCount = folder.subfolders?.length || 0;
                    return (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => setActiveProjectId(folder.id)}
                        className={`text-left group cursor-pointer border transition-colors overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#D72626] bg-zinc-900/90 ring-1 ring-[#D72626]'
                            : isLight
                              ? 'border-zinc-300 bg-white hover:border-zinc-500'
                              : 'border-zinc-800/90 bg-zinc-950 hover:border-zinc-700'
                        }`}
                      >
                        <div
                          className={`relative aspect-[16/10] w-full overflow-hidden border-b border-zinc-800 flex items-center justify-center ${
                            isSvg ? 'bg-[#F2F2E9]' : 'bg-zinc-900'
                          }`}
                        >
                          {folder.coverImage ? (
                            isVideo ? (
                              <video
                                src={fixImageUrl(folder.coverImage)}
                                muted
                                loop
                                playsInline
                                autoPlay
                                preload="metadata"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <img
                                src={fixImageUrl(folder.coverImage)}
                                alt={folder.label}
                                referrerPolicy="no-referrer"
                                className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                                  isSvg ? 'object-contain p-6' : 'object-cover'
                                }`}
                              />
                            )
                          ) : (
                            <Folder className="w-10 h-10 text-zinc-700" />
                          )}
                        </div>

                        <div className="p-3.5 w-full">
                          <h4 className="font-mono text-xs font-bold text-white group-hover:text-[#D72626] transition-colors truncate">
                            {folder.label}
                          </h4>
                          <p className="font-mono text-[10px] text-zinc-500 truncate mt-0.5 tabular-nums">
                            {folder.name} · {folder.itemCount} assets
                            {subCount > 0 ? ` · ${subCount} sub-libraries` : ''}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-zinc-800 bg-zinc-950 divide-y divide-zinc-800 font-mono text-xs">
                  {items.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setActiveProjectId(folder.id)}
                      className={`w-full text-left grid grid-cols-12 px-4 py-3 items-center cursor-pointer transition-colors ${
                        activeProjectNode?.id === folder.id
                          ? 'bg-[#D72626]/10 text-white'
                          : 'hover:bg-zinc-900/60 text-zinc-300'
                      }`}
                    >
                      <div className="col-span-6 flex items-center gap-2.5 truncate font-bold">
                        <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="truncate">{folder.label}</span>
                      </div>
                      <div className="col-span-4 text-zinc-400 truncate text-[11px]">
                        {folder.name}
                      </div>
                      <div className="col-span-2 text-right text-zinc-500 text-[11px] tabular-nums">
                        {folder.itemCount}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Inspector Drawer */}
            {activeProjectNode && (
              <div className="w-full lg:w-1/2 p-5 overflow-y-auto bg-zinc-950/95 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="min-w-0">
                    <h3 className="font-bebas text-2xl uppercase tracking-wider text-white truncate">
                      {activeProjectNode.label}
                    </h3>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {activeProjectNode.name} · {activeProjectNode.itemCount} assets
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveProjectId(null)}
                    aria-label="Close inspector"
                    className="p-2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {fullProject && (
                  <button
                    type="button"
                    onClick={() => onSelectProject(fullProject)}
                    className="w-full py-2.5 px-4 bg-[#D72626] hover:bg-[#b51d1d] text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Open Full Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}

                {/* Subfolders as Sub-Libraries */}
                {activeProjectNode.subfolders && activeProjectNode.subfolders.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      Sub-Libraries ({activeProjectNode.subfolders.length})
                    </div>
                    {activeProjectNode.subfolders.map((sub) => {
                      const isOpen = activeSubfolderId === sub.id;
                      const subMedia = (sub.files || [])
                        .filter((f) => f.type === 'image' || f.type === 'svg' || f.type === 'video')
                        .map((f) => f.url!);
                      return (
                        <div key={sub.id} className="border border-zinc-800 bg-black/50">
                          <button
                            type="button"
                            onClick={() => setActiveSubfolderId(isOpen ? null : sub.id)}
                            className="w-full p-3 flex items-center justify-between hover:bg-zinc-900/60 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Folder className="w-4 h-4 text-[#D72626] shrink-0" />
                              <span className="font-bold text-white truncate">{sub.label}</span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-[11px] shrink-0 tabular-nums">
                              <span>{sub.files?.length || 0}</span>
                              {isOpen ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </div>
                          </button>

                          {isOpen && sub.files && sub.files.length > 0 && (
                            <div className="border-t border-zinc-800 p-2 space-y-1 max-h-72 overflow-y-auto">
                              {sub.files.map((file) => {
                                const mediaIdx = file.url ? subMedia.indexOf(file.url) : -1;
                                const canPreview =
                                  file.type === 'image' || file.type === 'svg' || file.type === 'video';
                                return (
                                  <button
                                    key={file.id}
                                    type="button"
                                    onClick={() => {
                                      if (file.url && canPreview) {
                                        onOpenLightbox(file.url, file.name, subMedia, Math.max(0, mediaIdx));
                                      }
                                    }}
                                    className="w-full p-2 border border-zinc-900 hover:border-zinc-700 bg-zinc-950 flex items-center justify-between text-[11px] text-left cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2 min-w-0 text-zinc-300">
                                      {getFileIcon(file.type)}
                                      <span className="truncate">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 text-zinc-500 ml-2">
                                      <span className="tabular-nums">{file.size}</span>
                                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Direct Root Files */}
                {activeProjectNode.files && activeProjectNode.files.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      {activeProjectNode.subfolders && activeProjectNode.subfolders.length > 0
                        ? `Main Folder Files (${activeProjectNode.files.length})`
                        : `Files (${activeProjectNode.files.length})`}
                    </div>
                    <div className="space-y-1 max-h-96 overflow-y-auto">
                      {activeProjectNode.files.map((file) => {
                        const rootMedia = (activeProjectNode.files || [])
                          .filter((f) => f.type === 'image' || f.type === 'svg' || f.type === 'video')
                          .map((f) => f.url!);
                        const mediaIdx = file.url ? rootMedia.indexOf(file.url) : -1;
                        const canPreview =
                          file.type === 'image' || file.type === 'svg' || file.type === 'video';
                        return (
                          <button
                            key={file.id}
                            type="button"
                            onClick={() => {
                              if (file.url && canPreview) {
                                onOpenLightbox(file.url, file.name, rootMedia, Math.max(0, mediaIdx));
                              }
                            }}
                            className="w-full p-2.5 border border-zinc-800 hover:border-[#D72626] bg-black/50 flex items-center justify-between text-[11px] text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2 min-w-0 text-zinc-300">
                              {getFileIcon(file.type)}
                              <span className="truncate">{file.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-zinc-500 ml-2">
                              <span className="tabular-nums">{file.size}</span>
                              <Eye className="w-3.5 h-3.5 text-zinc-400" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
