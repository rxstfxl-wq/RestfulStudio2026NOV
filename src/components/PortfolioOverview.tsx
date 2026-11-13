import React from 'react';
import { ArrowUpRight, Filter } from 'lucide-react';

interface PortfolioOverviewProps {
  selectedCategory: 'all' | 'professional' | 'passion';
  setSelectedCategory: (cat: 'all' | 'professional' | 'passion') => void;
  selectedDiscipline: string;
  setSelectedDiscipline: (discipline: string) => void;
  onViewAllClick: () => void;
  totalProjects: number;
  professionalCount: number;
  passionCount: number;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedDiscipline,
  setSelectedDiscipline,
  onViewAllClick,
  totalProjects,
  professionalCount,
  passionCount
}) => {
  const disciplines = [
    { id: 'all', label: 'All' },
    { id: 'branding', label: 'Branding' },
    { id: 'print', label: 'Print & Ads' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'packaging', label: 'Packaging' },
    { id: 'digital', label: 'Digital' }
  ];

  return (
    <section className="bg-[#080808] text-white py-8 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-grid-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="border border-zinc-800 bg-[#e1ddc8] text-[#080808] p-5 sm:p-8 lg:p-10">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#080808]/25 pb-5 sm:pb-8 mb-6 sm:mb-8 gap-4">
            <div>
              <span className="font-mono text-[11px] text-[#D72626] font-bold tracking-widest uppercase block mb-1.5">
                02. Archive Channels
              </span>
              <h2 className="font-display text-4xl sm:text-5xl tracking-tight leading-none text-[#080808] uppercase font-bold">
                Selected Work
              </h2>
              <p className="font-sans text-sm sm:text-base text-zinc-800 max-w-xl mt-2 font-medium">
                Live exhibition synced directly from studio project folders ({totalProjects} indexed).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDiscipline('all');
                onViewAllClick();
              }}
              className="group font-mono text-xs font-bold tracking-widest text-[#080808] hover:text-[#D72626] uppercase inline-flex items-center gap-2 border-b border-[#080808] hover:border-[#D72626] pb-1 self-start sm:self-end transition-colors cursor-pointer"
            >
              <span>Browse All ({totalProjects})</span>
              <ArrowUpRight className="w-4 h-4 text-[#D72626] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Two Primary Portfolio Channels (Compact on Mobile, Spacious on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(selectedCategory === 'professional' ? 'all' : 'professional');
                onViewAllClick();
              }}
              className={`group text-left cursor-pointer border border-[#080808]/40 hover:border-[#080808] bg-transparent hover:bg-[#080808]/5 p-5 sm:p-7 flex flex-col justify-between transition-colors ${
                selectedCategory === 'professional' ? 'ring-2 ring-[#D72626]' : ''
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-display text-3xl sm:text-4xl text-[#D72626] font-bold">01</span>
                  <span className="text-[11px] text-zinc-700 uppercase font-bold tabular-nums">
                    {professionalCount} Projects
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-[#080808] uppercase tracking-tight group-hover:text-[#D72626] transition-colors">
                  Professional Portfolio
                </h3>
                <p className="hidden sm:block font-sans text-sm text-zinc-800 leading-relaxed">
                  Commercial identities, hospitality campaigns, brand manuals, print collateral, and logo systems.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#080808]/20 flex items-center justify-between font-mono text-xs font-bold text-[#080808] group-hover:text-[#D72626]">
                <span>Filter Professional</span>
                <ArrowUpRight className="w-4 h-4 text-[#D72626]" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory(selectedCategory === 'passion' ? 'all' : 'passion');
                onViewAllClick();
              }}
              className={`group text-left cursor-pointer border border-[#080808]/40 hover:border-[#080808] bg-transparent hover:bg-[#080808]/5 p-5 sm:p-7 flex flex-col justify-between transition-colors ${
                selectedCategory === 'passion' ? 'ring-2 ring-[#D72626]' : ''
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-display text-3xl sm:text-4xl text-[#D72626] font-bold">02</span>
                  <span className="text-[11px] text-zinc-700 uppercase font-bold tabular-nums">
                    {passionCount} Projects
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-[#080808] uppercase tracking-tight group-hover:text-[#D72626] transition-colors">
                  Passion Portfolio
                </h3>
                <p className="hidden sm:block font-sans text-sm text-zinc-800 leading-relaxed">
                  Experimental ateliers, concept brands, editorial monographs, and self-initiated visual studies.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#080808]/20 flex items-center justify-between font-mono text-xs font-bold text-[#080808] group-hover:text-[#D72626]">
                <span>Filter Passion</span>
                <ArrowUpRight className="w-4 h-4 text-[#D72626]" />
              </div>
            </button>
          </div>

          {/* Discipline Filter Tabs */}
          <div className="border-t border-[#080808]/20 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#080808] uppercase font-bold">
              <Filter className="w-3.5 h-3.5 text-[#D72626]" />
              <span>Discipline</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {disciplines.map((d) => {
                const active = selectedDiscipline === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDiscipline(d.id)}
                    className={`min-h-[36px] font-mono text-[11px] px-3 py-1.5 border border-[#080808]/30 uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[#080808] text-white font-bold border-[#080808]'
                        : 'bg-white/70 text-[#080808] hover:bg-white'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
