import React from 'react';
import { ArrowDown } from 'lucide-react';
import { fixImageUrl } from '../utils/imageUtils';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
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

            {/* Right Column: Clean Monochrome Portrait */}
            <div className="lg:col-span-5">
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[360px] aspect-[4/3] sm:aspect-[4/5] lg:aspect-auto bg-zinc-950 border border-zinc-800 overflow-hidden group">
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
