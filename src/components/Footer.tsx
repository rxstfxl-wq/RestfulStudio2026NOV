import React from 'react';
import { Barcode, Globe, ArrowUp } from 'lucide-react';
import { fixImageUrl } from '../utils/imageUtils';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] text-white border-t-2 border-zinc-900 py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Footer Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-zinc-900 pb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <img 
              src={fixImageUrl("brand-assets/RXSTFXL LOGO - LANDSCAPE.svg")}
              alt="RXSTFXL Studio Logo"
              referrerPolicy="no-referrer"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <div className="border-l border-zinc-800 pl-4 py-1">
              <span className="font-display text-2xl sm:text-3xl text-white tracking-widest block">
                RXSTFXL STUDIO
              </span>
              <span className="text-zinc-500 text-[10px] uppercase block font-mono">
                AUSTIN FOUCHE // FOUNDER & CREATIVE DIRECTOR
              </span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 bg-zinc-950 hover:bg-[#D72626] border border-zinc-800 hover:border-[#D72626] text-white px-4 py-2 uppercase tracking-widest transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Technical Data Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-zinc-400 text-[11px]">
          <div>
            <span className="text-zinc-600 block uppercase text-[9px]">LOCATION COORDINATES:</span>
            <span className="text-white">33.9249° S, 18.4241° E [CAPE TOWN]</span>
          </div>

          <div>
            <span className="text-zinc-600 block uppercase text-[9px]">DESIGN SYSTEM:</span>
            <span className="text-white">NU-BRUTALIST // SWISS EDITORIAL 12COL</span>
          </div>

          <div>
            <span className="text-zinc-600 block uppercase text-[9px]">PRIMARY TYPEFACE:</span>
            <span className="text-white">BEBAS NEUE / MANROPE / SPACE MONO</span>
          </div>

          <div>
            <span className="text-zinc-600 block uppercase text-[9px]">LEGAL & COMMERCIAL:</span>
            <div className="flex flex-wrap gap-2 text-[10px] mt-0.5">
              <a href="#contact" className="text-white hover:text-[#D72626] underline transition-colors">
                TS & CS (POPIA COMPLIANT)
              </a>
            </div>
          </div>


          <div>
            <span className="text-zinc-600 block uppercase text-[9px]">RIGHTS & COPYRIGHT:</span>
            <span className="text-white">© {new Date().getFullYear()} AUSTIN FOUCHÉ. ALL RIGHTS RESERVED.</span>
          </div>
        </div>


        {/* Bottom Bar with Barcode */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-zinc-600 gap-4">
          <div className="flex items-center gap-3">
            <Barcode className="w-12 h-6 text-zinc-500" />
            <span className="text-[10px] tracking-widest">RXSTFXL-SPEC-2026-RELEASE-V1.0</span>
          </div>

          <div className="text-[10px] tracking-widest uppercase">
            DESIGNED & DEVELOPED WITH UNCOMPROMISING PRECISION
          </div>
        </div>

      </div>
    </footer>
  );
};
