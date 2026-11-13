import React, { useState } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  Scale,
  Clock,
  CreditCard,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { STUDIO_RATE_CARD, TERMS_AND_CONDITIONS } from '../data/termsAndConditions';

interface TermsAndConditionsViewProps {
  onOpenInvoice?: () => void;
  standalone?: boolean;
}

export const TermsAndConditionsView: React.FC<TermsAndConditionsViewProps> = ({
  onOpenInvoice,
}) => {
  const [subView, setSubView] = useState<'rates' | 'terms'>('rates');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClause, setExpandedClause] = useState<number | null>(null);

  const keyHighlights = [
    {
      icon: Clock,
      label: 'STANDARD HOURLY RATE',
      val: 'R350 / HOUR',
      desc: 'Branding & UI: R400/hr · Art Direction: R450/hr · Rush Work: R500/hr (ZAR, No VAT).',
    },
    {
      icon: CreditCard,
      label: 'DEPOSITS & QUOTES',
      val: '50% DEPOSIT',
      desc: '50% before commencement; 50% on approval before final files. Quotes valid 14 days.',
    },
    {
      icon: FileCheck,
      label: 'REVISIONS INCLUDED',
      val: '2 CONSOLIDATED ROUNDS',
      desc: 'Two revision rounds per deliverable. Additional/out-of-scope work billed at R350/hr.',
    },
    {
      icon: ShieldCheck,
      label: 'PRIVACY & TAX STATUS',
      val: 'POPIA · NO VAT',
      desc: 'POPIA compliant under South African law. RXSTFXL STUDIO is not VAT registered.',
    },
  ];

  const totalClauses = TERMS_AND_CONDITIONS.clauses.length;

  const filteredClauses = TERMS_AND_CONDITIONS.clauses.filter((clause) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      clause.title.toLowerCase().includes(term) ||
      clause.summary.toLowerCase().includes(term) ||
      clause.content.some((c) => c.toLowerCase().includes(term))
    );
  });

  const toggleClause = (num: number) => {
    setExpandedClause((prev) => (prev === num ? null : num));
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner / Document Header */}
      <div className="border border-zinc-800 bg-[#080808] text-white p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] text-[#D72626] font-bold tracking-widest uppercase block">
              RXSTFXL STUDIO · {TERMS_AND_CONDITIONS.effectiveDate}
            </span>
            <h3 className="font-display text-2xl sm:text-4xl text-white uppercase font-bold tracking-tight">
              RATE CARD &amp; TERMS OF SERVICE
            </h3>
            <p className="text-zinc-400 text-xs font-sans max-w-2xl font-light">
              Governing graphic design, branding, digital design and creative direction by {TERMS_AND_CONDITIONS.designer} in {TERMS_AND_CONDITIONS.location}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={STUDIO_RATE_CARD.pdfPath}
              download="RXSTFXL_2026-27_Rate_Card.pdf"
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-900 hover:bg-[#D72626] text-white border border-zinc-700 hover:border-[#D72626] px-3.5 py-2 font-mono text-xs flex items-center gap-2 transition-colors uppercase font-bold tracking-wider"
              title="Download official 2026–27 Studio Rate Card PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>RATE CARD PDF</span>
            </a>

            <a
              href={TERMS_AND_CONDITIONS.pdfPath}
              download="RXSTFXL_Terms_and_Conditions_2026-27.pdf"
              target="_blank"
              rel="noreferrer"
              className="bg-zinc-900 hover:bg-[#D72626] text-white border border-zinc-700 hover:border-[#D72626] px-3.5 py-2 font-mono text-xs flex items-center gap-2 transition-colors uppercase font-bold tracking-wider"
              title="Download official 2026–27 Terms & Conditions PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>TS &amp; CS PDF</span>
            </a>

            {onOpenInvoice && (
              <button
                type="button"
                onClick={onOpenInvoice}
                className="bg-[#D72626] hover:bg-[#b01c1c] text-white px-3.5 py-2 font-mono text-xs flex items-center gap-2 transition-colors uppercase font-bold tracking-wider cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>QUOTE BUILDER</span>
              </button>
            )}
          </div>
        </div>

        {/* Legal Preamble */}
        <div className="p-4 bg-zinc-950 border-l-2 border-[#D72626] text-zinc-300 text-xs leading-relaxed font-sans">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
            SERVICE AGREEMENT PREAMBLE
          </span>
          <p>{TERMS_AND_CONDITIONS.preamble}</p>
        </div>

        {/* 4 Key Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {keyHighlights.map((k, idx) => {
            const Icon = k.icon;
            return (
              <div
                key={idx}
                className="bg-zinc-950 border border-zinc-800 p-4 space-y-2 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{k.label}</span>
                  <Icon className="w-4 h-4 text-[#D72626]" />
                </div>
                <div className="font-display text-lg text-white font-bold">{k.val}</div>
                <p className="text-[11px] text-zinc-400 font-sans leading-normal font-light">{k.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Internal View Switcher: 2026–27 Rate Card vs 14 Legal Clauses */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => setSubView('rates')}
            className={`px-4 py-2 border font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              subView === 'rates'
                ? 'bg-[#D72626] border-[#D72626] text-white'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Studio Rate Card (2026–27)
          </button>
          <button
            type="button"
            onClick={() => setSubView('terms')}
            className={`px-4 py-2 border font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              subView === 'terms'
                ? 'bg-[#D72626] border-[#D72626] text-white'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Terms &amp; Conditions ({totalClauses} Clauses)
          </button>
        </div>
      </div>

      {/* SECTION A: STUDIO RATE CARD (2026–27) */}
      {subView === 'rates' && (
        <div className="space-y-6">
          {/* 01 Hourly Services */}
          <div className="border border-zinc-800 bg-[#080808] text-white p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-white">
                01. Hourly Services
              </h4>
              <span className="text-[10px] text-zinc-400 uppercase">All Prices ZAR · No VAT</span>
            </div>

            <div className="divide-y divide-zinc-800/80">
              {STUDIO_RATE_CARD.hourlyServices.map((row) => (
                <div
                  key={row.service}
                  className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <span className="text-zinc-200 font-sans text-xs sm:text-sm">{row.service}</span>
                  <span className="text-[#D72626] font-bold tabular-nums text-xs sm:text-sm">
                    {row.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 02 Fixed-Price Services */}
          <div className="border border-zinc-800 bg-[#080808] text-white p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-white">
                02. Fixed-Price Services
              </h4>
              <span className="text-[10px] text-zinc-400 uppercase">Starting Prices</span>
            </div>

            <div className="divide-y divide-zinc-800/80">
              {STUDIO_RATE_CARD.fixedServices.map((row) => (
                <div
                  key={row.service}
                  className="py-3 grid grid-cols-1 md:grid-cols-12 gap-1.5 md:gap-4 items-baseline"
                >
                  <div className="md:col-span-4 font-bold text-white text-xs sm:text-sm font-sans">
                    {row.service}
                  </div>
                  <div className="md:col-span-2 text-[#D72626] font-bold tabular-nums text-xs sm:text-sm">
                    {row.startingPrice}
                  </div>
                  <div className="md:col-span-6 text-zinc-400 font-sans text-xs leading-relaxed">
                    {row.scope}
                  </div>
                </div>
              ))}
            </div>

            <p className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 font-sans">
              {STUDIO_RATE_CARD.fixedNote}
            </p>
          </div>

          {/* 03 Monthly Creative Retainers */}
          <div className="border border-zinc-800 bg-[#080808] text-white p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-white">
                03. Monthly Creative Retainers
              </h4>
              <span className="text-[10px] text-zinc-400 uppercase">Billed Monthly in Advance</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STUDIO_RATE_CARD.retainers.map((plan) => (
                <div
                  key={plan.plan}
                  className="border border-zinc-800 bg-zinc-950 p-4 space-y-2"
                >
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">
                    {plan.plan}
                  </span>
                  <div className="font-display text-3xl text-white font-bold tabular-nums">
                    {plan.monthlyFee}
                    <span className="text-xs font-mono text-zinc-500 font-normal"> / month</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{plan.allocation}</p>
                </div>
              ))}
            </div>

            <p className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 font-sans leading-relaxed">
              {STUDIO_RATE_CARD.retainerNote}
            </p>
          </div>

          {/* 04 Working Terms */}
          <div className="border border-zinc-800 bg-[#080808] text-white p-5 sm:p-6 space-y-3">
            <h4 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-white border-b border-zinc-800 pb-3">
              04. Working Terms Summary
            </h4>
            <ul className="space-y-2 font-sans text-xs text-zinc-300">
              {STUDIO_RATE_CARD.workingTerms.map((term, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#D72626] font-mono font-bold">•</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* SECTION B: 14 LEGAL CLAUSES */}
      {subView === 'terms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/90 p-3 border border-zinc-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clauses (e.g. deposit, retainer, rush work, POPIA, VAT)..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#D72626] text-white pl-9 pr-4 py-2 font-mono text-xs focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 text-zinc-400 text-[11px] px-1">
              <span className="tabular-nums">
                {filteredClauses.length} OF {totalClauses} CLAUSES
              </span>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-[#D72626] hover:underline uppercase text-[10px] cursor-pointer"
                >
                  CLEAR FILTER
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredClauses.map((clause) => {
              const isExpanded = expandedClause === clause.number || searchTerm.trim().length > 0;
              return (
                <div
                  key={clause.number}
                  className="border border-zinc-800 bg-[#080808] transition-colors hover:border-zinc-700"
                >
                  <button
                    type="button"
                    onClick={() => toggleClause(clause.number)}
                    className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-left focus:outline-none group cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <span className="w-8 h-8 bg-zinc-900 border border-zinc-800 text-[#D72626] flex items-center justify-center font-bold shrink-0 group-hover:border-[#D72626] transition-colors tabular-nums">
                        {String(clause.number).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="font-display text-base sm:text-lg text-white uppercase group-hover:text-[#D72626] transition-colors">
                          {clause.number}. {clause.title}
                        </h4>
                        <span className="text-[11px] text-zinc-400 block font-sans">
                          {clause.summary}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-1 sm:pt-0 text-zinc-500 group-hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-zinc-900 text-zinc-300 font-sans text-xs space-y-2.5 leading-relaxed">
                      {clause.content.map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-zinc-300">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* POPIA & South Africa Jurisdiction Badge */}
      <div className="border border-zinc-800 bg-zinc-950 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 text-xs">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-[#D72626] shrink-0" />
          <div>
            <span className="font-bold text-white block uppercase">
              GOVERNED UNDER SOUTH AFRICAN LAW · POPIA COMPLIANT
            </span>
            <span className="text-zinc-400 text-[11px]">
              Draft for business use under the laws of the Republic of South Africa. No VAT is charged.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <span className="text-zinc-400">AUSTIN FOUCHÉ</span>
          <span aria-hidden="true">·</span>
          <span className="text-zinc-200">{TERMS_AND_CONDITIONS.phone}</span>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${TERMS_AND_CONDITIONS.email}`} className="text-[#D72626] hover:underline font-bold">
            {TERMS_AND_CONDITIONS.email}
          </a>
        </div>
      </div>
    </div>
  );
};
