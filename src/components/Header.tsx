import React, { useState, useEffect } from 'react';
import { Plus, X, Menu, Sun, Moon, Lock, ShieldCheck, Monitor, Layout } from 'lucide-react';
import { fixImageUrl } from '../utils/imageUtils';
import type { PortfolioViewMode } from '../App';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickIndex: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: 'all' | 'professional' | 'passion') => void;
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  isAuthorLoggedIn: boolean;
  onOpenAuthorAuth: () => void;
  viewMode: PortfolioViewMode;
  setViewMode: (mode: PortfolioViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickIndex,
  setSelectedCategory,
  theme,
  setTheme,
  isAuthorLoggedIn,
  onOpenAuthorAuth,
  viewMode,
  setViewMode
}) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsBurgerOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-white/10 ${
        scrolled || isBurgerOpen
          ? 'bg-[#080808]/95 backdrop-blur-md py-2.5 sm:py-3'
          : 'bg-[#080808]/80 backdrop-blur-sm py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('work');
            setSelectedCategory('all');
            setIsBurgerOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center text-left focus:outline-none shrink-0 whitespace-nowrap cursor-pointer"
        >
          <img
            src={fixImageUrl('brand-assets/RXSTFXL LOGO - LANDSCAPE.svg')}
            alt="RXSTFXL Studio"
            referrerPolicy="no-referrer"
            className="h-5 sm:h-6 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </button>

        {/* Zone 2: Clean Single-Line Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`font-mono text-xs tracking-widest uppercase relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#D72626] font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D72626]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Compact Utility & View Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop View Mode Toggle: Editorial vs Desktop Explorer */}
          <div className="hidden md:flex items-center border border-zinc-800 bg-[#121212] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('editorial')}
              aria-label="Editorial View"
              title="Editorial View"
              className={`px-2.5 h-7 flex items-center gap-1.5 font-mono text-[11px] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                viewMode === 'editorial'
                  ? 'bg-[#D72626] text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Editorial</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('desktop-explorer')}
              aria-label="Desktop Explorer View"
              title="Desktop Explorer View"
              className={`px-2.5 h-7 flex items-center gap-1.5 font-mono text-[11px] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                viewMode === 'desktop-explorer'
                  ? 'bg-[#D72626] text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Explorer</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'Off-White' : 'Dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'Off-White' : 'Dark'} mode`}
            className="w-9 h-9 md:w-8 md:h-8 bg-[#121212] hover:bg-[#D72626] border border-zinc-800 hover:border-[#D72626] flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-zinc-300" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-300" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAuthorAuth}
            aria-label="Author Login & Controls"
            title={isAuthorLoggedIn ? 'Author active' : 'Author login'}
            className={`hidden sm:flex w-8 h-8 border items-center justify-center transition-colors cursor-pointer ${
              isAuthorLoggedIn
                ? 'bg-[#D72626] border-[#D72626] text-white'
                : 'bg-[#121212] hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            {isAuthorLoggedIn ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenQuickIndex}
            aria-label="Open index menu"
            title="Search & Index"
            className="w-9 h-9 md:w-8 md:h-8 bg-[#121212] hover:bg-[#D72626] border border-zinc-800 hover:border-[#D72626] flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsBurgerOpen((prev) => !prev)}
            aria-label={isBurgerOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden w-9 h-9 bg-[#121212] hover:bg-[#D72626] border border-zinc-800 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            {isBurgerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Minimal Mobile Navigation Drawer */}
      {isBurgerOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#080808]/98 backdrop-blur-md px-4 py-4 space-y-3">
          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`min-h-[44px] px-3 py-2 border font-mono text-xs tracking-widest uppercase text-left transition-colors ${
                    isActive
                      ? 'border-[#D72626] bg-[#D72626]/10 text-[#D72626] font-bold'
                      : 'border-zinc-800 bg-[#121212] text-zinc-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              setIsBurgerOpen(false);
              onOpenAuthorAuth();
            }}
            className="w-full min-h-[44px] px-3 py-2 border border-zinc-800 bg-[#121212] font-mono text-xs uppercase tracking-wider text-zinc-300 flex items-center justify-between"
          >
            <span>{isAuthorLoggedIn ? 'Author Controls Active' : 'Author Login'}</span>
            {isAuthorLoggedIn ? (
              <ShieldCheck className="w-4 h-4 text-[#D72626]" />
            ) : (
              <Lock className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        </div>
      )}
    </header>
  );
};
