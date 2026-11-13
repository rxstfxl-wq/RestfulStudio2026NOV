import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Instagram, 
  Linkedin, 
  Send, 
  CheckCircle2, 
  Scale, 
  Download, 
  ShieldCheck, 
  FileCheck2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { AUSTIN_PROFILE } from '../data/about';
import { TermsAndConditionsView } from './TermsAndConditionsView';
import { TERMS_AND_CONDITIONS } from '../data/termsAndConditions';

export const ContactSection: React.FC = () => {
  // Main view tab: 'inquiry' | 'terms'
  const [activeTab, setActiveTab] = useState<'inquiry' | 'terms'>('inquiry');

  // Direct inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Brand Identity',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-[#080808] text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 bg-grid-pattern">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Outer Framed Wireframe Box */}
        <div className="border border-zinc-800 bg-[#e1ddc8] text-zinc-900 p-5 sm:p-8 lg:p-10 relative">
          
          {/* Header */}
          <div className="border-b border-zinc-900/20 pb-6 sm:pb-8 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#D72626] font-bold tracking-widest uppercase block mb-2">
                  05. Inquiries & Terms
                </span>
                <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none text-zinc-950 uppercase font-bold">
                  Let’s Connect
                </h2>
                <p className="font-sans text-sm sm:text-base text-zinc-700 max-w-2xl mt-3 font-light leading-relaxed">
                  Let’s create something impactful. Reach out for project inquiries, brand audits, creative direction, 
                  and review our official Terms & Conditions under South African law.
                </p>
              </div>

              {/* PDF Download Buttons */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
                <a
                  href={TERMS_AND_CONDITIONS.rateCardPdfPath}
                  target="_blank"
                  rel="noreferrer"
                  download="RXSTFXL_2026-27_Rate_Card.pdf"
                  className="bg-[#d8d4be] hover:bg-zinc-900 hover:text-white border border-zinc-400 px-3.5 py-2 font-bold transition-all flex items-center gap-1.5 uppercase text-[11px]"
                  title="Download official 2026–27 Studio Rate Card PDF"
                >
                  <Download className="w-3.5 h-3.5 text-[#D72626]" />
                  <span>RATE CARD PDF</span>
                </a>
                <a
                  href={TERMS_AND_CONDITIONS.pdfPath}
                  target="_blank"
                  rel="noreferrer"
                  download="RXSTFXL_Terms_and_Conditions_2026-27.pdf"
                  className="bg-[#d8d4be] hover:bg-zinc-900 hover:text-white border border-zinc-400 px-3.5 py-2 font-bold transition-all flex items-center gap-1.5 uppercase text-[11px]"
                  title="Download official 2026–27 Terms & Conditions PDF"
                >
                  <Download className="w-3.5 h-3.5 text-[#D72626]" />
                  <span>TS & CS PDF</span>
                </a>
              </div>
            </div>

            {/* Navigation Tabs (Direct Inquiry vs Terms & Conditions) */}
            <div className="flex flex-wrap gap-2 pt-6 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('inquiry')}
                className={`px-4 py-2.5 flex items-center gap-2 border font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'inquiry'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md scale-[1.02]'
                    : 'bg-[#d8d4be] text-zinc-800 border-zinc-400/80 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <MessageSquare className={`w-4 h-4 ${activeTab === 'inquiry' ? 'text-[#D72626]' : ''}`} />
                <span>PROJECT INQUIRY CONSOLE</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`px-4 py-2.5 flex items-center gap-2 border font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'terms'
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md scale-[1.02]'
                    : 'bg-[#d8d4be] text-zinc-800 border-zinc-400/80 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Scale className={`w-4 h-4 ${activeTab === 'terms' ? 'text-[#D72626]' : ''}`} />
                <span>RATE CARD &amp; TS &amp; CS (2026–27)</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Left Details Sidebar + Right Dynamic Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT SIDEBAR (lg:col-span-4): Studio Coordinates, Key Rates, Ts & Cs Quick Facts */}
            <div className="lg:col-span-4 space-y-6 font-mono text-xs text-zinc-800">
              
              {/* Official Coordinates Card */}
              <div className="space-y-3">
                <span className="text-zinc-600 block text-[10px] uppercase font-bold tracking-widest">
                  COMMUNICATION CHANNELS:
                </span>

                <div className="flex items-start gap-3.5 p-3.5 border border-zinc-400/60 bg-[#d8d4be]">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#D72626]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-zinc-600 block text-[9px] uppercase font-bold">DIRECT EMAIL:</span>
                    <a href={`mailto:${AUSTIN_PROFILE.email}`} className="text-xs sm:text-sm font-bold text-zinc-950 hover:text-[#D72626] transition-colors truncate block">
                      {AUSTIN_PROFILE.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 border border-zinc-400/60 bg-[#d8d4be]">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#D72626]" />
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[9px] uppercase font-bold">TELEPHONE:</span>
                    <a href="tel:0609733782" className="text-xs sm:text-sm font-bold text-zinc-950 hover:text-[#D72626] transition-colors">
                      060 973 3782
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 border border-zinc-400/60 bg-[#d8d4be]">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#D72626]" />
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[9px] uppercase font-bold">JURISDICTION & LOCATION:</span>
                    <span className="text-xs sm:text-sm font-bold text-zinc-950">Cape Town, South Africa</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 border border-zinc-400/60 bg-[#d8d4be]">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-[#D72626]" />
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[9px] uppercase font-bold">ENGAGEMENT CAPACITY:</span>
                    <span className="text-xs font-bold text-zinc-950">Freelance / Full-time / Retainer</span>
                  </div>
                </div>
              </div>

              {/* COMMERCIAL TERMS SUMMARY BOX (from 2026-27 Rate Card & T&Cs documentation) */}
              <div className="border-2 border-zinc-900 bg-zinc-900 text-white p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <span className="text-[10px] text-[#D72626] uppercase font-bold tracking-wider">
                    COMMERCIAL TERMS &amp; RATES
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">2026–27 ZAR</span>
                </div>

                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">STANDARD DESIGN:</span>
                    <span className="font-bold text-white text-right">R350 / HOUR</span>
                  </div>

                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">BRANDING / UI DESIGN:</span>
                    <span className="font-bold text-white text-right">R400 / HOUR</span>
                  </div>

                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">ART / CREATIVE DIR:</span>
                    <span className="font-bold text-white text-right">R450 / HOUR</span>
                  </div>

                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">RUSH WORK:</span>
                    <span className="font-bold text-white text-right">R500 / HOUR</span>
                  </div>

                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">MONTHLY RETAINERS:</span>
                    <span className="font-bold text-white text-right">R1,750 / R3,500 / R5,000</span>
                  </div>

                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">FIXED PROJECTS:</span>
                    <span className="font-bold text-white text-right">R1,100 – R6,500+</span>
                  </div>

                  <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">PAYMENT &amp; QUOTES:</span>
                    <span className="font-bold text-[#D72626] text-right">50% DEPOSIT / 14 DAYS</span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="text-zinc-400">REVISIONS &amp; TAX:</span>
                    <span className="font-bold text-white text-right">2 ROUNDS · NO VAT</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('terms')}
                  className="w-full bg-[#d8d4be] hover:bg-white text-zinc-950 font-bold py-2.5 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-[#D72626]" />
                  <span>VIEW RATE CARD &amp; 14 CLAUSES</span>
                </button>
              </div>

              {/* Direct Social Platforms */}
              <div className="pt-2 border-t border-zinc-900/20 space-y-2">
                <span className="text-zinc-600 block text-[10px] uppercase tracking-widest font-bold">
                  DIRECT PLATFORMS:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  <a 
                    href={AUSTIN_PROFILE.instagramUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#d8d4be] border border-zinc-400 text-zinc-900 hover:text-[#D72626] hover:border-[#D72626] px-2.5 py-1 font-bold transition-colors"
                  >
                    INSTAGRAM: {AUSTIN_PROFILE.instagram}
                  </a>
                  <a 
                    href={`https://${AUSTIN_PROFILE.linkedin}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#d8d4be] border border-zinc-400 text-zinc-900 hover:text-[#D72626] hover:border-[#D72626] px-2.5 py-1 font-bold transition-colors"
                  >
                    LINKEDIN ↗
                  </a>
                  <a 
                    href={AUSTIN_PROFILE.behanceUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#d8d4be] border border-zinc-400 text-zinc-900 hover:text-[#D72626] hover:border-[#D72626] px-2.5 py-1 font-bold transition-colors"
                  >
                    BEHANCE ↗
                  </a>
                </div>
              </div>

            </div>

            {/* RIGHT MAIN VIEW (lg:col-span-8): Dynamic Tabs View */}
            <div className="lg:col-span-8">
              
              {/* TAB 1: DIRECT INQUIRY CONSOLE */}
              {activeTab === 'inquiry' && (
                <div className="bg-[#080808] text-white p-6 sm:p-8 border border-zinc-800 relative shadow-2xl animate-fade-in">
                  
                  <h3 className="font-display text-2xl sm:text-3xl uppercase mb-6 text-white tracking-tight border-b border-zinc-800 pb-3 flex items-center justify-between">
                    <span>PROJECT INQUIRY CONSOLE</span>
                    <span className="font-mono text-[10px] text-[#D72626] tracking-widest uppercase">SYS.FORM_05</span>
                  </h3>

                  {submitted ? (
                    <div className="py-12 text-center space-y-4">
                      <CheckCircle2 className="w-12 h-12 text-[#D72626] mx-auto" />
                      <h4 className="font-display text-3xl uppercase text-white">INQUIRY RECEIVED</h4>
                      <p className="font-mono text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out to RXSTFXL STUDIO. Austin will review your inquiry specifications and reply within 24 business hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="font-mono text-xs bg-[#D72626] hover:bg-[#b01c1c] text-white px-5 py-2.5 uppercase font-bold tracking-wider"
                      >
                        SEND ANOTHER MESSAGE
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
                      
                      <div>
                        <label className="block text-zinc-400 uppercase tracking-widest mb-2 text-[10px]">
                          YOUR NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#D72626] text-white p-3 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 uppercase tracking-widest mb-2 text-[10px]">
                          EMAIL ADDRESS *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. sarah@company.com"
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#D72626] text-white p-3 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 uppercase tracking-widest mb-2 text-[10px]">
                          PRIMARY DISCIPLINE
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#D72626] text-white p-3 focus:outline-none transition-colors"
                        >
                          <option value="Brand Identity">Brand Identity System</option>
                          <option value="Packaging & Print">Packaging & Print Production</option>
                          <option value="Digital Product & Web">Digital Experience / Web UX</option>
                          <option value="Creative Direction">Creative Direction & Editorial</option>
                          <option value="Full Rebrand">Full Brand Architecture</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-zinc-400 uppercase tracking-widest mb-2 text-[10px]">
                          PROJECT MESSAGE & GOALS *
                        </label>
                        <textarea
                          rows={5}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Outline your brand vision, timelines, and scope..."
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#D72626] text-white p-3 focus:outline-none transition-colors resize-none"
                        />
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-[#D72626] hover:bg-[#b01c1c] text-white font-mono text-xs font-bold tracking-widest px-6 py-3.5 uppercase flex items-center justify-center gap-2 transition-colors group cursor-pointer"
                        >
                          <span>SEND SPECIFICATION</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('terms')}
                          className="text-zinc-400 hover:text-white underline text-[11px] uppercase font-mono cursor-pointer"
                        >
                          REVIEW STUDIO TS & CS
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              )}

              {/* TAB 2: TERMS & CONDITIONS (TS & CS) */}
              {activeTab === 'terms' && (
                <div className="space-y-4 animate-fade-in">
                  <TermsAndConditionsView />
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
