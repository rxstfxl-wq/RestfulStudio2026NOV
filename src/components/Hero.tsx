import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';
import { fixImageUrl, isPdfUrl, isSvgUrl, isVideoUrl } from '../utils/imageUtils';
import { PdfPagePreview } from './PdfPagePreview';

interface HeroProps {
  onExploreClick: () => void;
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  projects = [],
  onSelectProject,
}) => {
  const carouselProjects = projects.filter((p) => Boolean(p.heroImage));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (carouselProjects.length > 0 && activeIndex >= carouselProjects.length) {
      setActiveIndex(0);
    }
  }, [carouselProjects.length, activeIndex]);

  useEffect(() => {
    if (carouselProjects.length <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselProjects.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [carouselProjects.length, isPaused]);

  const safeIndex =
    carouselProjects.length > 0 ? activeIndex % carouselProjects.length : 0;
  const activeProject = carouselProjects[safeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (carouselProjects.length <= 1) return;
    setActiveIndex(
      (prev) => (prev - 1 + carouselProjects.length) % carouselProjects.length
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (carouselProjects.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % carouselProjects.length);
  };

  return (
    <section className="relative bg-[#080808] text-[#F2F2F2] pt-20 sm:pt-28 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-grid-pattern overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="border border-zinc-800 bg-[#050505] p-5 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Minimal Editorial Typography */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-zinc-400">
                  <span>Austin Fouche</span>
                  <span aria-hidden="true">·</span>
                  <span>Cape Town</span>
                </div>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95] uppercase text-white font-bold [text-wrap:balance]">
                  RXSTFXL Studio<span className="text-[#D72626]">.</span>
                </h1>

                <p className="w-fit bg-[#D72626] text-white px-2.5 py-1 font-mono text-xs sm:text-sm tracking-wider uppercase font-bold">
                  Graphic & Multimedia Designer
                </p>

                <p className="font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-xl">
                  I design bold, intentional visuals that communicate ideas, build identities, and leave a lasting impression.
                </p>
              </div>

              <div className="space-y-5 pt-4 border-t border-zinc-800/80">
                <div className="grid grid-cols-2 gap-4 font-mono text-[11px] text-zinc-400 max-w-md">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Location</span>
                    <span className="text-zinc-200">Cape Town, ZA</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Availability</span>
                    <span className="text-zinc-200">Freelance & Full-Time</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onExploreClick}
                  className="group inline-flex items-center gap-3 min-h-[44px] font-mono text-xs tracking-widest text-zinc-300 hover:text-white uppercase transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="w-9 h-9 rounded-full border border-zinc-700 group-hover:border-[#D72626] group-hover:bg-[#D72626] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </span>
                  <span>Explore Archive</span>
                </button>
              </div>
            </div>

            {/* Right Column: Looping Carousel of All Projects */}
            <div className="lg:col-span-5">
              <div
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onClick={() => {
                  if (activeProject && onSelectProject) {
                    onSelectProject(activeProject);
                  }
                }}
                className={`relative w-full h-full min-h-[280px] sm:min-h-[360px] aspect-[4/3] sm:aspect-[4/5] lg:aspect-auto bg-zinc-950 border border-zinc-800 hover:border-[#D72626] overflow-hidden group transition-colors ${
                  activeProject && onSelectProject ? 'cursor-pointer' : ''
                }`}
              >
                {carouselProjects.length > 0 ? (
                  <>
                    {carouselProjects.map((project, idx) => {
                      const isActive = idx === safeIndex;
                      const isSvgHero = isSvgUrl(project.heroImage);
                      const isVideoHero = isVideoUrl(project.heroImage);
                      const isPdfHero = isPdfUrl(project.heroImage);

                      return (
                        <div
                          key={project.id}
                          aria-hidden={!isActive}
                          className={`absolute inset-0 transition-opacity duration-700 ease-out flex items-center justify-center ${
                            isSvgHero ? 'bg-[#F2F2E9]' : 'bg-zinc-950'
                          } ${
                            isActive
                              ? 'opacity-100 z-10'
                              : 'opacity-0 z-0 pointer-events-none'
                          }`}
                        >
                          {isVideoHero ? (
                            <video
                              src={fixImageUrl(project.heroImage)}
                              muted
                              loop
                              playsInline
                              autoPlay
                              preload="metadata"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          ) : isPdfHero ? (
                            <PdfPagePreview
                              src={project.heroImage}
                              alt={project.title}
                              eager={isActive}
                              targetWidth={960}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <img
                              src={fixImageUrl(project.heroImage)}
                              alt={project.title}
                              referrerPolicy="no-referrer"
                              className={`w-full h-full transition-transform duration-700 ease-out ${
                                isSvgHero
                                  ? 'object-contain p-10 group-hover:scale-105'
                                  : 'object-cover object-center group-hover:scale-105'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}

                    {/* Top Slide Progress Bars */}
                    {carouselProjects.length > 1 && (
                      <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-1.5">
                        {carouselProjects.map((project, idx) => (
                          <button
                            key={project.id}
                            type="button"
                            aria-label={`View ${project.title}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveIndex(idx);
                            }}
                            className={`h-1 flex-1 transition-colors cursor-pointer ${
                              idx === safeIndex
                                ? 'bg-[#D72626]'
                                : 'bg-zinc-500/60 hover:bg-zinc-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Bottom Readability Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#080808]/95 via-[#080808]/60 to-transparent z-10 pointer-events-none" />

                    {/* Active Project Info & Carousel Controls */}
                    {activeProject && (
                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 flex items-end justify-between gap-3">
                        <div className="min-w-0 font-mono">
                          <span className="text-[10px] text-[#D72626] font-bold uppercase tracking-widest block tabular-nums">
                            {activeProject.number} · {activeProject.year}
                          </span>
                          <span className="font-display text-xl sm:text-2xl text-white uppercase tracking-wide leading-tight truncate block group-hover:text-[#D72626] transition-colors">
                            {activeProject.title}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                            <span>Open Project</span>
                            <ArrowUpRight className="w-3 h-3 text-[#D72626]" />
                          </span>
                        </div>

                        {carouselProjects.length > 1 && (
                          <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                            <button
                              type="button"
                              onClick={handlePrev}
                              aria-label="Previous project"
                              className="w-8 h-8 bg-black/80 hover:bg-[#D72626] border border-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-2 py-1 bg-black/80 border border-zinc-800 text-zinc-300 tabular-nums">
                              {String(safeIndex + 1).padStart(2, '0')}/
                              {String(carouselProjects.length).padStart(2, '0')}
                            </span>
                            <button
                              type="button"
                              onClick={handleNext}
                              aria-label="Next project"
                              className="w-8 h-8 bg-black/80 hover:bg-[#D72626] border border-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <img
                      src={fixImageUrl('/about-media/austin-about/Me Submerged in darkness with soft light.png')}
                      alt="Austin Fouche - Creative Director & Designer"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center grayscale contrast-125 brightness-90 group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 font-mono text-[10px] text-zinc-300">
                      <span className="text-white font-bold block">Austin Fouche</span>
                      <span className="text-zinc-400">RXSTFXL Studio Founder</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Editorial Philosophy Line */}
        <div className="hidden sm:grid pt-10 grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-3 font-mono text-xs text-zinc-500 tracking-widest uppercase">
            01. Philosophy
          </div>
          <div className="md:col-span-9 font-syne text-xl lg:text-2xl font-semibold text-zinc-300 leading-snug">
            “We don’t decorate — we construct visual architecture that demands attention and stands the test of time.”
          </div>
        </div>
      </div>
    </section>
  );
};
