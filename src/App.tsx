import React, { useState, useMemo, useEffect } from 'react';
import { X, Monitor, Layout, SlidersHorizontal } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PortfolioOverview } from './components/PortfolioOverview';
import { ClientMarksSection } from './components/ClientMarksSection';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectDetail } from './components/ProjectDetail';
import { AboutSection } from './components/AboutSection';
import { InfoServicesSection } from './components/InfoServicesSection';
import { ContactSection } from './components/ContactSection';
import { QuickIndexModal } from './components/QuickIndexModal';
import { LightboxModal } from './components/LightboxModal';
import { AuthorAuthModal } from './components/AuthorAuthModal';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { DesktopExplorerView } from './components/desktop/DesktopExplorerView';
import { useProjects } from './hooks/useProjects';
import { Project } from './types';

export type PortfolioViewMode = 'editorial' | 'desktop-explorer';

export default function App() {
  const { projects, loading, refreshProjects } = useProjects();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<string>('work');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'professional' | 'passion'>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Two consistent views: Responsive Editorial View (default on all devices) & Desktop Explorer View (desktop only)
  const [viewMode, setViewMode] = useState<PortfolioViewMode>('editorial');

  const [lightboxData, setLightboxData] = useState<{
    url: string;
    title: string;
    images?: string[];
    index?: number;
  } | null>(null);
  const [isQuickIndexOpen, setIsQuickIndexOpen] = useState<boolean>(false);

  // Author Authentication & Project Hiding State
  const [isAuthorLoggedIn, setIsAuthorLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('rxstfxl_author_logged_in') === 'true';
  });
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState<boolean>(false);

  const [hiddenProjectIds, setHiddenProjectIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('rxstfxl_hidden_projects');
      if (saved) return new Set<string>(JSON.parse(saved) as string[]);
    } catch {}
    return new Set<string>();
  });

  const [hiddenSubProjectKeys, setHiddenSubProjectKeys] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('rxstfxl_hidden_sub_projects');
      if (saved) return new Set<string>(JSON.parse(saved) as string[]);
    } catch {}
    return new Set<string>();
  });

  // Automatically enforce minimal responsive Editorial View on mobile viewports (< 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'desktop-explorer') {
        setViewMode('editorial');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Keep selectedProject synced with refreshed projects list
  useEffect(() => {
    if (selectedProject) {
      const fresh = projects.find((p) => p.id === selectedProject.id);
      if (fresh) {
        setSelectedProject(fresh);
      }
    }
  }, [projects]);

  // Lock body scroll and handle ESC key when project popup is active
  useEffect(() => {
    if (selectedProject) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !lightboxData) {
          setSelectedProject(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedProject, lightboxData]);

  // Sync visibility state with backend server
  const syncToServer = async (projectsArr: string[], subProjectsArr: string[], timestamp: number) => {
    try {
      await fetch('/api/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hiddenProjects: projectsArr,
          hiddenSubProjects: subProjectsArr,
          updatedAt: timestamp,
        }),
      });
    } catch {}
  };

  useEffect(() => {
    const fetchVisibilityState = async () => {
      try {
        const res = await fetch('/api/visibility');
        if (res.ok) {
          const data = await res.json();
          const serverProjects: string[] | null = Array.isArray(data.hiddenProjects) ? data.hiddenProjects : null;
          const serverSubProjects: string[] | null = Array.isArray(data.hiddenSubProjects) ? data.hiddenSubProjects : null;
          const serverUpdatedAt: number = typeof data.updatedAt === 'number' ? data.updatedAt : 0;

          let localUpdatedAt = 0;
          try {
            const raw = localStorage.getItem('rxstfxl_visibility_updated_at');
            if (raw) localUpdatedAt = parseInt(raw, 10) || 0;
          } catch {}

          if (serverUpdatedAt > localUpdatedAt) {
            if (serverProjects !== null) {
              setHiddenProjectIds(new Set(serverProjects));
              localStorage.setItem('rxstfxl_hidden_projects', JSON.stringify(serverProjects));
            }
            if (serverSubProjects !== null) {
              setHiddenSubProjectKeys(new Set(serverSubProjects));
              localStorage.setItem('rxstfxl_hidden_sub_projects', JSON.stringify(serverSubProjects));
            }
            localStorage.setItem('rxstfxl_visibility_updated_at', serverUpdatedAt.toString());
          }
        }
      } catch {}
    };

    fetchVisibilityState();
    const interval = setInterval(fetchVisibilityState, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthorLogin = (email: string, pass: string): boolean => {
    if (email.toLowerCase() === 'rxstfxl@gmail.com' && pass === 'JESUS15K1NG777@@!!') {
      setIsAuthorLoggedIn(true);
      localStorage.setItem('rxstfxl_author_logged_in', 'true');
      return true;
    }
    return false;
  };

  const handleAuthorLogout = () => {
    setIsAuthorLoggedIn(false);
    localStorage.removeItem('rxstfxl_author_logged_in');
  };

  const handleToggleHideProject = (projectId: string) => {
    setHiddenProjectIds((prev) => {
      const updated = new Set<string>(prev);
      if (updated.has(projectId)) updated.delete(projectId);
      else updated.add(projectId);
      const arr = Array.from(updated);
      const now = Date.now();
      localStorage.setItem('rxstfxl_hidden_projects', JSON.stringify(arr));
      localStorage.setItem('rxstfxl_visibility_updated_at', now.toString());
      syncToServer(arr, Array.from(hiddenSubProjectKeys), now);
      return updated;
    });
  };

  const handleToggleHideSubProject = (subKey: string) => {
    setHiddenSubProjectKeys((prev) => {
      const updated = new Set<string>(prev);
      if (updated.has(subKey)) updated.delete(subKey);
      else updated.add(subKey);
      const arr = Array.from(updated);
      const now = Date.now();
      localStorage.setItem('rxstfxl_hidden_sub_projects', JSON.stringify(arr));
      localStorage.setItem('rxstfxl_visibility_updated_at', now.toString());
      syncToServer(Array.from(hiddenProjectIds), arr, now);
      return updated;
    });
  };

  useEffect(() => {
    if (!isAuthorLoggedIn && selectedProject && hiddenProjectIds.has(selectedProject.id)) {
      setSelectedProject(null);
    }
  }, [isAuthorLoggedIn, selectedProject, hiddenProjectIds]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const visibleProjects = useMemo(() => {
    return projects.filter((p) => isAuthorLoggedIn || !hiddenProjectIds.has(p.id));
  }, [projects, isAuthorLoggedIn, hiddenProjectIds]);

  const filteredProjects = useMemo(() => {
    return visibleProjects.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchDiscipline =
        selectedDiscipline === 'all' || p.disciplines.includes(selectedDiscipline as any);
      return matchCategory && matchDiscipline;
    });
  }, [visibleProjects, selectedCategory, selectedDiscipline]);

  const professionalCount = useMemo(
    () => visibleProjects.filter((p) => p.category === 'professional').length,
    [visibleProjects]
  );
  const passionCount = useMemo(
    () => visibleProjects.filter((p) => p.category === 'passion').length,
    [visibleProjects]
  );

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleOpenLightbox = (url: string, title: string, images?: string[], index?: number) => {
    setLightboxData({ url, title, images, index });
  };

  const handleNavigateSection = (sectionId: string) => {
    setSelectedProject(null);
    setViewMode('editorial');
    setActiveTab(sectionId);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'light'
          ? 'light-mode bg-[#EAE6D4] text-[#25231B] selection:bg-[#25231B] selection:text-white'
          : 'bg-[#000000] text-[#F2F2F2] selection:bg-[#D72626] selection:text-white'
      } font-sans antialiased relative transition-colors duration-300`}
    >
      <CustomCursor />

      {/* Top Switcher Bar when in Desktop Explorer Mode */}
      {viewMode === 'desktop-explorer' && (
        <div
          className={`w-full border-b sticky top-0 z-50 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 ${
            theme === 'light'
              ? 'bg-[#F2F2E9]/95 border-zinc-300 text-zinc-900'
              : 'bg-[#080808]/95 border-zinc-900 text-white'
          }`}
        >
          <span className="font-bebas text-xl tracking-wider uppercase font-bold">
            RXSTFXL<span className="text-[#D72626]">.</span>Studio
          </span>

          <div className="flex items-center border border-zinc-800 bg-zinc-950 p-0.5 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode('editorial')}
              className="px-3 py-1 flex items-center gap-1.5 transition-colors uppercase font-bold text-zinc-400 hover:text-white cursor-pointer"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Editorial View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('desktop-explorer')}
              className="px-3 py-1 flex items-center gap-1.5 transition-colors uppercase font-bold bg-[#D72626] text-white cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop Explorer</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-2.5 py-1 border border-zinc-800 font-mono text-[10px] uppercase text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={() => setIsAuthorModalOpen(true)}
              className={`px-2.5 py-1 border font-mono text-[10px] uppercase flex items-center gap-1 transition-colors cursor-pointer ${
                isAuthorLoggedIn
                  ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-400 font-bold'
                  : 'border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{isAuthorLoggedIn ? 'Author Active' : 'Author'}</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: DESKTOP DUAL-PANE FILE EXPLORER (Desktop Only) */}
      {viewMode === 'desktop-explorer' && (
        <div className="w-full py-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <DesktopExplorerView
            projects={projects}
            onOpenLightbox={handleOpenLightbox}
            onGoToEditorial={() => setViewMode('editorial')}
            onOpenAuthorAuth={() => setIsAuthorModalOpen(true)}
            onSelectProject={handleSelectProject}
            onRefreshProjects={refreshProjects}
            isAuthorLoggedIn={isAuthorLoggedIn}
            hiddenProjectIds={hiddenProjectIds}
            theme={theme}
          />
        </div>
      )}

      {/* VIEW 2: RESPONSIVE EDITORIAL VIEW (Minimal on Mobile, Full Case Study Grid on Desktop) */}
      {viewMode === 'editorial' && (
        <div
          className={`min-h-screen flex flex-col transition-all duration-300 ${
            selectedProject ? 'filter blur-[8px] opacity-50 pointer-events-none select-none' : ''
          }`}
        >
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenQuickIndex={() => setIsQuickIndexOpen(true)}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            theme={theme}
            setTheme={setTheme}
            isAuthorLoggedIn={isAuthorLoggedIn}
            onOpenAuthorAuth={() => setIsAuthorModalOpen(true)}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <main className="relative z-10 flex-1">
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('project-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <PortfolioOverview
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDiscipline={selectedDiscipline}
              setSelectedDiscipline={setSelectedDiscipline}
              totalProjects={visibleProjects.length}
              professionalCount={professionalCount}
              passionCount={passionCount}
              onViewAllClick={() => {
                const el = document.getElementById('project-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div id="project-grid-section">
              <ProjectGrid
                projects={filteredProjects}
                onSelectProject={handleSelectProject}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDiscipline={selectedDiscipline}
                setSelectedDiscipline={setSelectedDiscipline}
                isAuthorLoggedIn={isAuthorLoggedIn}
                hiddenProjectIds={hiddenProjectIds}
                onToggleHideProject={handleToggleHideProject}
                onRefreshProjects={refreshProjects}
                loading={loading}
              />
            </div>

            <ClientMarksSection
              projects={visibleProjects}
              onSelectProject={handleSelectProject}
            />

            <AboutSection />

            <InfoServicesSection
              onStartProjectClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ContactSection />
          </main>

          <Footer />
        </div>
      )}

      {/* Unified Project Detail Modal */}
      {selectedProject && (
        <div
          id="project-popup-overlay"
          className="fixed inset-0 z-[150] overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedProject(null);
          }}
        >
          <div className="relative w-full max-w-7xl h-full sm:h-auto sm:max-h-[94vh] flex flex-col bg-[#080808] sm:border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 min-w-0">
                <span className="font-bold text-white uppercase tracking-wider truncate">
                  {selectedProject.title}
                </span>
                <span className="hidden sm:inline text-zinc-600">·</span>
                <span className="hidden sm:inline text-zinc-500 uppercase truncate">
                  {selectedProject.folderName}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close Project View"
                className="min-h-[38px] flex items-center gap-1.5 font-mono text-xs font-bold text-white bg-zinc-900 hover:bg-[#D72626] border border-zinc-700 hover:border-[#D72626] px-3 py-1.5 transition-colors cursor-pointer shrink-0"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ProjectDetail
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
                onSelectProject={handleSelectProject}
                allProjects={visibleProjects}
                onOpenLightbox={handleOpenLightbox}
                isAuthorLoggedIn={isAuthorLoggedIn}
                hiddenProjectIds={hiddenProjectIds}
                onToggleHideProject={handleToggleHideProject}
                hiddenSubProjectKeys={hiddenSubProjectKeys}
                onToggleHideSubProject={handleToggleHideSubProject}
              />
            </div>
          </div>
        </div>
      )}

      <QuickIndexModal
        isOpen={isQuickIndexOpen}
        onClose={() => setIsQuickIndexOpen(false)}
        projects={projects}
        onSelectProject={handleSelectProject}
        onNavigateSection={handleNavigateSection}
        isAuthorLoggedIn={isAuthorLoggedIn}
        hiddenProjectIds={hiddenProjectIds}
      />

      <AuthorAuthModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        isLoggedIn={isAuthorLoggedIn}
        onLogin={handleAuthorLogin}
        onLogout={handleAuthorLogout}
      />

      <LightboxModal
        imageUrl={lightboxData?.url || null}
        title={lightboxData?.title || ''}
        images={lightboxData?.images}
        initialIndex={lightboxData?.index}
        onClose={() => setLightboxData(null)}
      />
    </div>
  );
}
