import React from 'react';
import { SERVICES } from '../data/about';
import { ArrowUpRight, CheckSquare, Layers, Cpu, Compass } from 'lucide-react';

interface InfoServicesSectionProps {
  onStartProjectClick: () => void;
}

export const InfoServicesSection: React.FC<InfoServicesSectionProps> = ({ onStartProjectClick }) => {
  const processSteps = [
    {
      num: '01',
      title: 'DISCOVERY & STRATEGIC AUDIT',
      description: 'We deconstruct your current positioning, audience expectations, and architectural requirements before touching a single pixel.'
    },
    {
      num: '02',
      title: 'GRID & TYPOGRAPHIC ARCHITECTURE',
      description: 'Engineering the baseline spatial grid, variable font hierarchies, and color contrasts to establish uncompromising visual structure.'
    },
    {
      num: '03',
      title: 'TACTILE & DIGITAL SYNTHESIS',
      description: 'Applying identity systems across heavy paper, aluminum signage, web interfaces, and packaging mockups.'
    },
    {
      num: '04',
      title: 'PRODUCTION & DEPLOYMENT',
      description: 'Delivering production-ready print specs, vector assets, digital design tokens, and comprehensive brand guidelines.'
    }
  ];

  return (
    <section id="services" className="bg-[#080808] text-white py-16 sm:py-20 px-3 sm:px-6 lg:px-8 border-b border-zinc-900 bg-grid-pattern">
      <div className="max-w-7xl mx-auto">
        
        {/* Wireframe Sub-label */}
        <div className="flex items-center justify-between pb-2 font-mono text-[11px] text-zinc-500 tracking-wider">
          <span>SERVICES SPEC // 04</span>
          <span className="hidden sm:inline-block">RXSTFXL_CAPABILITIES_SYSTEM</span>
        </div>

        {/* Outer Framed Wireframe Box */}
        <div className="border border-zinc-800 bg-[#050505] p-6 sm:p-8 lg:p-10 relative space-y-12 sm:space-y-16">
          
          {/* Header */}
          <div className="border-b border-zinc-800 pb-8">
            <span className="font-mono text-xs text-[#D72626] font-bold tracking-widest uppercase block mb-2">
              04 // STUDIO SERVICES & CAPABILITIES
            </span>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white uppercase font-bold">
              SERVICES & PROCESS
            </h2>
          </div>

          {/* Services Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {SERVICES.map((srv) => (
              <div key={srv.id} className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-5 hover:border-[#D72626] transition-colors group">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <span className="font-mono text-xs text-[#D72626] font-bold">{srv.id.toUpperCase()}</span>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase bg-zinc-900 px-2 py-1 border border-zinc-800">CORE OFFERING</span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl text-white uppercase group-hover:text-[#D72626] transition-colors">
                  {srv.title}
                </h3>

                <p className="font-sans text-sm text-zinc-300 leading-relaxed font-light">
                  {srv.description}
                </p>

                <div className="pt-4 border-t border-zinc-900 space-y-2">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">DISCIPLINES INCLUDED:</span>
                  <div className="flex flex-wrap gap-2">
                    {srv.disciplines.map((d, idx) => (
                      <span key={idx} className="font-mono text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-zinc-300">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Process Roadmap */}
          <div className="space-y-8 border-t border-zinc-800 pt-12">
            <div>
              <span className="font-mono text-xs text-[#D72626] font-bold tracking-widest uppercase block mb-2">
                METHODOLOGY // HOW WE WORK
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-white uppercase">THE 4-STAGE DESIGN PROCESS</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {processSteps.map((step) => (
                <div key={step.num} className="bg-zinc-950 border border-zinc-800 p-5 sm:p-6 space-y-3 hover:border-zinc-700 transition-colors">
                  <span className="font-display text-4xl text-[#D72626] font-bold">{step.num}</span>
                  <h4 className="font-display text-xl text-white uppercase">{step.title}</h4>
                  <p className="font-sans text-xs text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Bar */}
          <div className="bg-[#d72626] text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-800 transition-colors">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-3xl sm:text-4xl uppercase leading-none font-bold text-white">
                READY TO BUILD AN IMPACTFUL IDENTITY?
              </h3>
              <p className="font-sans text-sm text-white/90 font-light">
                We take on a limited number of commissions each quarter to ensure total creative focus.
              </p>
            </div>

            <button
              onClick={onStartProjectClick}
              className="group bg-[#e1ddc8] hover:bg-[#d5d0ba] text-zinc-950 font-mono text-xs font-bold tracking-widest px-6 py-3.5 uppercase flex items-center gap-3 transition-all shrink-0 border border-zinc-900 shadow-sm"
            >
              <span>INQUIRE FOR PROJECT AVAILABILITY</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
