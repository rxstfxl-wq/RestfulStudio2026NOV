import React, { useState } from 'react';
import { AUSTIN_PROFILE, EXPERIENCES, EDUCATION_LIST, SKILLS_LIST, EXPERTISE_CATEGORIES, AWARDS, CLIENTS } from '../data/about';
import { MapPin, Briefcase, Sparkles, GraduationCap, Terminal, Code2, Layers, CheckCircle2 } from 'lucide-react';
import { fixImageUrl } from '../utils/imageUtils';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'education' | 'skills' | 'expertise' | 'philosophy'>('timeline');

  return (
    <section id="about" className="bg-[#080808] text-[#F2F2F2] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-grid-pattern relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Outer Framed Wireframe Box */}
        <div className="border border-zinc-800 bg-[#050505] p-5 sm:p-8 lg:p-10 relative">
          
          {/* Panel 03 Header Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-12">
            
            {/* LEFT: Profile & Statement */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-7">
              <div>
                <span className="font-mono text-xs text-[#D72626] font-bold tracking-widest uppercase block mb-2">
                  03. Profile & Practice
                </span>
                <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none text-white uppercase font-bold">
                  About Austin Fouche
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-mono text-sm sm:text-base text-[#D72626] font-bold tracking-wider uppercase">
                    {AUSTIN_PROFILE.title}
                  </h3>
                  <h4 className="font-mono text-xs sm:text-sm text-zinc-300 font-bold tracking-widest uppercase">
                    {AUSTIN_PROFILE.subtitle}
                  </h4>
                </div>

                <div className="space-y-3 font-sans text-xs text-zinc-300 font-light leading-relaxed">
                  {AUSTIN_PROFILE.bioLines.map((line, idx) => (
                    <p key={idx} className="text-xs">{line}</p>
                  ))}
                </div>
              </div>

              {/* Red Handwritten Signature Graphic */}
              <div className="pt-2">
                <div className="font-syne text-4xl text-[#D72626] not-italic font-bold tracking-tight select-none rotate-1">
                  Austin F.
                </div>
              </div>

              {/* Metadata Contact Bullets */}
              <div className="space-y-3 border-t border-zinc-800 pt-6 font-mono text-xs text-zinc-400">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#D72626]" />
                  <span>BASED IN CAPE TOWN, SOUTH AFRICA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-[#D72626]" />
                  <span>SOLO GRAPHIC DESIGNER — LAGOON BEACH HOTEL & SPA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#D72626]" />
                  <span>FOUNDER & CREATIVE DIRECTOR — RXSTFXL STUDIO</span>
                </div>
              </div>

            </div>

            {/* RIGHT: Concrete Architectural Portrait */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              <div className="relative w-full aspect-[4/5] bg-zinc-950 border border-zinc-800 overflow-hidden group shadow-2xl">
                
                {/* Architectural Concrete Photo */}
                <img
                  src={fixImageUrl("/about-media/austin-about/Me Jul 7, 2026, 12_19_23 PM - altered.png")}
                  alt="Austin Fouche Portrait"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-700"
                />

                {/* Fading Dark Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

                {/* Red Geometric Accent Block Framing */}
                <div className="absolute top-6 right-0 w-12 h-24 bg-[#D72626] z-20"></div>
                <div className="absolute top-16 right-4 w-20 h-8 bg-[#D72626] z-20 opacity-90"></div>
                <div className="absolute bottom-8 -left-4 w-12 h-16 bg-white z-20 mix-blend-difference hidden sm:block"></div>

                {/* Technical Target Circle Overlay */}
                <svg className="absolute inset-0 w-full h-full stroke-zinc-600/30 fill-none pointer-events-none z-10" viewBox="0 0 400 500">
                  <circle cx="300" cy="400" r="80" strokeWidth="0.5" strokeDasharray="3 3" />
                </svg>

                <div className="absolute bottom-4 left-4 z-20 font-mono text-[10px] text-zinc-400">
                  <span className="text-white font-bold block">SPECIMEN // 03</span>
                  <span>RXSTFXL_CREATIVE_DIRECTOR</span>
                </div>

              </div>

            </div>

          </div>

          {/* Tabbed Interactive Dossier Section */}
          <div className="border-t border-zinc-800 pt-10">
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-zinc-800 pb-4 mb-8 font-mono text-xs">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 sm:px-4 py-2 uppercase tracking-widest transition-all duration-300 border ${
                  activeTab === 'timeline'
                    ? 'bg-[#D72626] border-[#D72626] text-white font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white animate-unclicked-pulse'
                }`}
              >
                01 // EXPERIENCE
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`px-3 sm:px-4 py-2 uppercase tracking-widest transition-all duration-300 border ${
                  activeTab === 'education'
                    ? 'bg-[#D72626] border-[#D72626] text-white font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white animate-unclicked-pulse'
                }`}
              >
                02 // EDUCATION
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3 sm:px-4 py-2 uppercase tracking-widest transition-all duration-300 border ${
                  activeTab === 'skills'
                    ? 'bg-[#D72626] border-[#D72626] text-white font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white animate-unclicked-pulse'
                }`}
              >
                03 // SKILLS & TOOLING
              </button>
              <button
                onClick={() => setActiveTab('expertise')}
                className={`px-3 sm:px-4 py-2 uppercase tracking-widest transition-all duration-300 border ${
                  activeTab === 'expertise'
                    ? 'bg-[#D72626] border-[#D72626] text-white font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white animate-unclicked-pulse'
                }`}
              >
                04 // EXPERTISE
              </button>
              <button
                onClick={() => setActiveTab('philosophy')}
                className={`px-3 sm:px-4 py-2 uppercase tracking-widest transition-all duration-300 border ${
                  activeTab === 'philosophy'
                    ? 'bg-[#D72626] border-[#D72626] text-white font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white animate-unclicked-pulse'
                }`}
              >
                05 // PHILOSOPHY
              </button>
            </div>

            {/* Tab 1: Experience Timeline */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                {EXPERIENCES.map((exp, index) => (
                  <div key={index} className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-3 hover:border-[#D72626] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono text-xs gap-2">
                      <span className="text-[#D72626] font-bold tracking-widest">{exp.year}</span>
                      <span className="text-zinc-500 uppercase">{exp.location}</span>
                    </div>
                    <h4 className="font-display text-3xl text-white uppercase">{exp.role} — {exp.company}</h4>
                    <p className={`font-sans text-sm text-zinc-300 leading-relaxed max-w-4xl${index === 0 ? ' whitespace-pre-line' : ''}`}>
                      {index === 0
                        ? `Sole in-house designer overseeing all creative output across the hotel and its hospitality brands. Developed brand identities, guidelines and rebranding initiatives.\n- Brand Identity & Rebranding\n- Marketing & Campaign Design\n- Print & Digital Collateral\n- Signage & Environmental Graphics\n- UX/UI & Website Design\n- Motion Graphics & Animation\n- Social Media & Email Marketing\n- Print Production & Supplier Liaison\n- Multi-brand Management & Collaboration`
                        : exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.tags.map((tag, i) => (
                        <span key={i} className="font-mono text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2.5 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Education & Qualifications */}
            {activeTab === 'education' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {EDUCATION_LIST.map((edu, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-800 p-6 space-y-3 hover:border-[#D72626] transition-colors">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-[#D72626] font-bold tracking-widest">{edu.year}</span>
                      <GraduationCap className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                      <h4 className="font-display text-2xl text-white uppercase">{edu.degree}</h4>
                      <span className="font-mono text-xs text-zinc-400 block mt-0.5">{edu.institution}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {edu.highlights.map((h, i) => (
                        <span key={i} className="font-mono text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-800 px-2 py-0.5">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Skills & Tooling */}
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#D72626] font-mono text-xs uppercase font-bold">
                    <Terminal className="w-4 h-4" />
                    <span>ADOBE CREATIVE CLOUD</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 font-mono text-xs text-zinc-300">
                    {SKILLS_LIST.adobe.map((item, i) => (
                      <div key={i} className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                        <span>{item}</span>
                        <span className="text-[#D72626] text-[10px] font-bold">EXPERT</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#D72626] font-mono text-xs uppercase font-bold">
                    <Layers className="w-4 h-4" />
                    <span>DESIGN & 3D TOOLS</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 font-mono text-xs text-zinc-300">
                    {SKILLS_LIST.designTools.map((item, i) => (
                      <div key={i} className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                        <span>{item}</span>
                        <span className="text-zinc-400 text-[10px]">ADVANCED</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#D72626] font-mono text-xs uppercase font-bold">
                    <Code2 className="w-4 h-4" />
                    <span>WEB & DEVELOPMENT</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 font-mono text-xs text-zinc-300">
                    {SKILLS_LIST.webDev.map((item, i) => (
                      <div key={i} className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                        <span>{item}</span>
                        <span className="text-zinc-400 text-[10px]">PROFICIENT</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#D72626] font-mono text-xs uppercase font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DESIGN FUNDAMENTALS</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 font-mono text-xs text-zinc-300">
                    {SKILLS_LIST.fundamentals.map((item, i) => (
                      <div key={i} className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                        <span>{item}</span>
                        <span className="text-[#D72626] text-[10px] font-bold">CORE</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 4: Areas of Expertise */}
            {activeTab === 'expertise' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {EXPERTISE_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="bg-zinc-950 border border-zinc-800 p-6 space-y-3">
                    <span className="font-mono text-xs text-[#D72626] font-bold block border-b border-zinc-900 pb-2">
                      0{idx+1} // {cat.category}
                    </span>
                    <ul className="space-y-1.5 font-mono text-xs text-zinc-300">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#D72626]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Core Philosophy */}
            {activeTab === 'philosophy' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {AUSTIN_PROFILE.corePhilosophy.map((p, i) => (
                  <div key={i} className="bg-zinc-950 border border-zinc-800 p-6 space-y-2">
                    <span className="font-mono text-xs text-[#D72626] font-bold">0{i+1} // PRINCIPLE</span>
                    <h4 className="font-display text-2xl text-white uppercase">{p.title}</h4>
                    <p className="font-sans text-sm text-zinc-300 leading-relaxed">{p.content}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

