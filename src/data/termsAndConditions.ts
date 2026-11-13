export interface TermsClause {
  number: number;
  title: string;
  summary: string;
  content: string[];
}

export interface RateCardHourlyItem {
  service: string;
  rate: string;
  unitRate: number;
}

export interface RateCardFixedItem {
  service: string;
  startingPrice: string;
  unitRate: number;
  scope: string;
}

export interface RateCardRetainerItem {
  plan: string;
  monthlyFee: string;
  unitRate: number;
  allocation: string;
}

export const STUDIO_RATE_CARD = {
  period: '2026–27',
  subtitle: 'Independent creative services • South Africa • All prices in ZAR',
  tagline: 'A considered design practice for brands, businesses and people building something distinct.',
  pdfPath: '/brand-assets/RXSTFXL_2026-27_Rate_Card.pdf',
  hourlyServices: [
    { service: 'Standard graphic design', rate: 'R350 / hour', unitRate: 350 },
    { service: 'Branding & identity development', rate: 'R400 / hour', unitRate: 400 },
    { service: 'Digital design / UI design', rate: 'R400 / hour', unitRate: 400 },
    { service: 'Art direction & creative direction', rate: 'R450 / hour', unitRate: 450 },
    {
      service: 'Additional revisions / out-of-scope work',
      rate: 'R350 / hour (or applicable specialist rate)',
      unitRate: 350,
    },
    { service: 'Rush work', rate: 'R500 / hour, subject to availability', unitRate: 500 },
  ] as RateCardHourlyItem[],
  fixedServices: [
    {
      service: 'Logo design',
      startingPrice: 'R2,250',
      unitRate: 2250,
      scope: 'One primary logo direction, refinement and final export suite.',
    },
    {
      service: 'Brand development',
      startingPrice: 'R4,000',
      unitRate: 4000,
      scope: 'Development of an existing identity; agreed supporting elements.',
    },
    {
      service: 'Brand creation',
      startingPrice: 'R6,500',
      unitRate: 6500,
      scope: 'Starter identity system: strategy direction, logo suite, colour and typography.',
    },
    {
      service: 'Poster set',
      startingPrice: 'R1,500',
      unitRate: 1500,
      scope: 'One poster concept with up to two agreed size adaptations.',
    },
    {
      service: 'Business card design',
      startingPrice: 'R1,100',
      unitRate: 1100,
      scope: 'One double-sided card design; print-ready artwork.',
    },
    {
      service: 'Brochure design',
      startingPrice: 'R2,000',
      unitRate: 2000,
      scope: 'Up to 4 pages; additional pages quoted separately.',
    },
    {
      service: 'Flyer design',
      startingPrice: 'R1,200',
      unitRate: 1200,
      scope: 'One single- or double-sided flyer design.',
    },
    {
      service: 'Custom marketing collateral',
      startingPrice: 'R1,800+',
      unitRate: 1800,
      scope: 'Quoted according to format, quantity and complexity.',
    },
    {
      service: 'Website design (Wix)',
      startingPrice: 'R4,500+',
      unitRate: 4500,
      scope: 'Starter website; page count, content and functionality scoped separately.',
    },
    {
      service: 'Apparel graphics',
      startingPrice: 'R1,500',
      unitRate: 1500,
      scope: 'One garment graphic / placement; production files as agreed.',
    },
    {
      service: 'Packaging design',
      startingPrice: 'R1,800+',
      unitRate: 1800,
      scope: 'Starting point; dielines, variants and technical artwork may affect price.',
    },
    {
      service: 'Digital advertising asset',
      startingPrice: 'R1,100',
      unitRate: 1100,
      scope: 'One key visual; campaign adaptations quoted separately.',
    },
  ] as RateCardFixedItem[],
  fixedNote:
    'Fixed prices are starting rates for the stated scope, not blanket prices for unlimited formats or content.',
  retainers: [
    {
      plan: 'Essential',
      monthlyFee: 'R1,750',
      unitRate: 1750,
      allocation: 'Up to 5 design hours; guide: up to 2 small-format assets.',
    },
    {
      plan: 'Studio',
      monthlyFee: 'R3,500',
      unitRate: 3500,
      allocation: 'Up to 10 design hours; guide: up to 4 small-format assets.',
    },
    {
      plan: 'Creative Partner',
      monthlyFee: 'R5,000',
      unitRate: 5000,
      allocation: 'Up to 15 design hours; guide: up to 6 small-format assets.',
    },
  ] as RateCardRetainerItem[],
  retainerNote:
    'Retainer hours cover the work used to produce the included deliverables. The deliverable guide is an indicative planning allowance, not an additional allocation. Actual capacity depends on complexity, content readiness and agreed scope. Work beyond the allocation requires written approval and is billed at the applicable hourly rate.',
  workingTerms: [
    'Two revision rounds per agreed deliverable unless the quote states otherwise.',
    '50% deposit before commencement; balance due before final file release.',
    'Quotes valid for 14 calendar days unless stated otherwise.',
    'Printing, installation, courier, stock assets, fonts, licences and third-party costs are additional.',
    'Unused retainer hours do not roll over; retainers are billed monthly in advance.',
    'RXSTFXL STUDIO is not VAT registered. No VAT is charged.',
  ],
};

export const TERMS_AND_CONDITIONS = {
  header: 'RXSTFXL STUDIO / SERVICE AGREEMENT',
  url: 'https://www.rxstfxl.online',
  website: 'www.rxstfxl.online',
  email: 'rxstfxl@gmail.com',
  phone: '060 973 3782',
  designer: 'Austin Fouché trading as RXSTFXL STUDIO',
  location: 'South Africa',
  effectiveDate: 'November 2026 (2026–27)',
  pdfPath: '/brand-assets/RXSTFXL_Terms_and_Conditions_2026-27.pdf',
  rateCardPdfPath: '/brand-assets/RXSTFXL_2026-27_Rate_Card.pdf',
  invoicePdfPath: '/brand-assets/RXSTFXL_2026-27_Rate_Card.pdf',
  preamble:
    'These Terms & Conditions govern graphic design, branding, digital design and related creative services supplied by Austin Fouché trading as RXSTFXL STUDIO (the “Designer”) to the commissioning client (the “Client”). A signed quotation, written approval or payment of a deposit confirms acceptance of these terms, together with any project-specific terms stated in the quotation.',
  clauses: [
    {
      number: 1,
      title: 'Services and Project Scope',
      summary: 'Design disciplines offered and written quotation scope boundaries.',
      content: [
        'Services may include branding and logo design, visual identity development, graphic design, print and digital collateral, DTP, website and UI design, apparel graphics, packaging and creative direction.',
        'The approved quotation will define the deliverables, formats, fees, estimated timeline, included revisions and any exclusions. Work not expressly included is out of scope and will be quoted separately.',
      ],
    },
    {
      number: 2,
      title: 'Rates, Quotations and Retainers',
      summary: 'R350/hr standard rate, 14-day quote validity, ZAR pricing, no VAT, and monthly retainer terms.',
      content: [
        'The current standard hourly rate is R350. Specialist rates and fixed project prices are set out in the RXSTFXL STUDIO Rate Card or the applicable quotation.',
        'Fixed prices are based on the stated scope and assumptions. Quotations are valid for 14 calendar days unless another validity period is stated. Prices are in South African Rand (ZAR).',
        'RXSTFXL STUDIO is not VAT registered and does not charge VAT.',
        'Retainers are billed monthly in advance and include the hours and indicative deliverable guide stated in the selected plan. The hours allocation is the controlling limit; deliverables are produced within that allocation and are not additional to it. Unused hours expire at month-end and do not roll over unless agreed in writing. Work beyond the allocation requires approval and is billed at the applicable hourly rate.',
      ],
    },
    {
      number: 3,
      title: 'Deposits and Payment',
      summary: '50% deposit upfront, 50% prior to final file release, and 7-calendar-day invoice payment terms.',
      content: [
        'A 50% deposit is required before work begins, with the remaining 50% payable upon approval and before release of final files, unless the quotation specifies a different schedule.',
        'Invoices are payable within 7 calendar days of issue unless otherwise agreed. Work may be paused where payment is overdue; timelines will be adjusted accordingly.',
        'Any applicable late-payment interest or recovery costs will be charged only to the extent permitted by applicable South African law and any agreed written terms. The Client is responsible for bank charges and approved third-party expenses.',
      ],
    },
    {
      number: 4,
      title: 'Revisions, Feedback and Approvals',
      summary: 'Two consolidated revision rounds per deliverable; additional revisions charged at applicable hourly rate.',
      content: [
        'Each deliverable includes two rounds of revisions, unless the quotation states otherwise. A revision round means one consolidated set of feedback submitted by the Client at one time.',
        'New concepts, changes to an approved direction, new content, substantial restructuring or requests outside the agreed brief are treated as additional work. Additional revisions and out-of-scope work are charged at the applicable hourly rate, subject to approval.',
        'The Client must provide accurate content, assets and consolidated feedback. Delays in feedback, content or approvals may affect delivery dates. Approval of a proof or final design confirms that the Client has checked spelling, figures, details, layout and supplied information.',
      ],
    },
    {
      number: 5,
      title: 'Production, Output and Third-Party Costs',
      summary: 'Scope-based exports plus exclusion of external print, fabrication, licensing, and hosting costs.',
      content: [
        'Standard digital exports and print-ready artwork are included only where stated in the approved scope.',
        'Physical printing, fabrication, installation, courier, media spend, stock imagery, fonts, plugins, hosting, domain registration, licences and other third-party costs are excluded unless expressly listed. Such costs will be quoted or passed through with the Client’s approval.',
        'The Designer is not responsible for production defects caused by a third-party supplier, but will reasonably assist with communication where appropriate. The Client should approve production proofs and specifications before manufacture.',
      ],
    },
    {
      number: 6,
      title: 'Timelines, Rush Work and Project Inactivity',
      summary: 'Estimated schedules, written rush agreements (R500/hr), and 30-day inactivity hold policy.',
      content: [
        'Estimated timelines begin once the deposit, brief, required content and assets have been received. Timelines are estimates and may change where the scope changes, feedback is delayed or circumstances outside the Designer’s reasonable control arise.',
        'Rush work is subject to availability and must be agreed in writing before commencement; the applicable rush fee will be quoted.',
        'If a project is inactive because the Client has not supplied feedback, content or approvals for 30 consecutive calendar days, the Designer may place it on hold and reschedule it subject to availability. Restarting may require a revised quotation or schedule.',
      ],
    },
    {
      number: 7,
      title: 'Cancellation and Refunds',
      summary: 'Written cancellation, deposit allocation to completed work, and equitable unearned balance settlement.',
      content: [
        'A cancellation must be submitted in writing. If the Client cancels after work has commenced, the deposit will be applied to work completed and costs committed up to the cancellation date.',
        'If the value of work completed and approved expenses exceeds the deposit, the Client must pay the difference. Any unearned balance will be refunded where applicable. Refunds and cancellation charges will be assessed in accordance with the approved scope and applicable law.',
        'The Designer may suspend or terminate work for material breach, non-payment or abusive conduct after reasonable written notice where appropriate.',
      ],
    },
    {
      number: 8,
      title: 'Intellectual Property, Usage and Source Files',
      summary: 'Designer owns drafts until full settlement; usage rights transfer on final payment; source files licensed separately.',
      content: [
        'Until full payment has been received, all concepts, drafts and final artwork remain the Designer’s property and may not be used, reproduced, published or supplied to another party.',
        'Once full payment is received, the Client receives the agreed usage rights in the final approved deliverables for the purpose and channels described in the quotation.',
        'Unless expressly agreed, copyright in working files, unused concepts, methods, templates and source files is not transferred. Source files may be licensed or supplied for an additional fee. Third-party assets remain subject to their own licences and terms.',
        'The Designer may display completed work in a portfolio, case study and promotional material unless the parties agree in writing to confidentiality or an embargo.',
      ],
    },
    {
      number: 9,
      title: 'Client-Supplied Materials and Warranties',
      summary: 'Client responsibility for ownership, permissions, accuracy, and legality of supplied assets.',
      content: [
        'The Client warrants that it owns or has permission to use all text, images, logos, trademarks and other materials supplied to the Designer.',
        'The Client is responsible for the accuracy and legality of supplied content and for obtaining any necessary permissions, releases and approvals. The Designer may refuse material that reasonably appears unlawful or infringes third-party rights.',
      ],
    },
    {
      number: 10,
      title: 'Confidentiality and Personal Information',
      summary: 'Mutual confidentiality and Protection of Personal Information Act 4 of 2013 (POPIA) safeguards.',
      content: [
        'Each party will take reasonable steps to protect confidential information received from the other and use it only for the project, subject to information already public, independently developed or required to be disclosed by law.',
        'Personal information will be handled in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA), where applicable, and used for communication, administration, invoicing and delivery of services. The Designer will take reasonable measures to safeguard personal information and will not sell client personal information.',
      ],
    },
    {
      number: 11,
      title: 'Limitation of Liability',
      summary: 'Reasonable professional care and aggregate liability capped at fees paid for specific services.',
      content: [
        'The Designer will perform services with reasonable professional care. To the extent permitted by law, the Designer will not be liable for indirect or consequential loss, loss of profit, loss of business or loss arising from the Client’s use or modification of deliverables.',
        'Nothing in these terms excludes or limits liability where doing so would be unlawful. Subject to that qualification, the Designer’s aggregate liability arising from a project will not exceed the fees paid for the specific services giving rise to the claim. The Client remains responsible for reviewing and approving final content and production proofs.',
      ],
    },
    {
      number: 12,
      title: 'Independent Contractor and Force Majeure',
      summary: 'Independent contractor status and relief for events beyond reasonable control.',
      content: [
        'The Designer acts as an independent contractor and not as an employee, partner or agent of the Client.',
        'Neither party will be liable for delay caused by events beyond its reasonable control, provided the affected party gives notice and takes reasonable steps to minimise the impact.',
      ],
    },
    {
      number: 13,
      title: 'Governing Law and Disputes',
      summary: 'Governed by the laws of the Republic of South Africa with good-faith dispute resolution first.',
      content: [
        'These terms are governed by the laws of the Republic of South Africa. The parties will first attempt in good faith to resolve any dispute through written discussion. If unresolved, either party may pursue the remedies available through the appropriate South African forum or court.',
      ],
    },
    {
      number: 14,
      title: 'General and Acceptance',
      summary: 'Written amendments required; signing a quote, written approval, or deposit payment confirms acceptance.',
      content: [
        'Any change to the approved scope or these terms must be recorded in writing. If any provision is found unenforceable, the remaining provisions will continue to apply.',
        'The approved quotation and these Terms & Conditions form the agreement between the parties for the project. By signing a quotation, approving the project in writing or paying the required deposit, the Client confirms acceptance of the applicable terms.',
      ],
    },
  ] as TermsClause[],
};

export interface InvoiceLineItem {
  id: string;
  name: string;
  sublabel?: string;
  rateLabel: string;
  unitRate: number; // in ZAR
  selected: boolean;
  quantity: number;
  unit: string;
  isCustom?: boolean;
}

export const DEFAULT_INVOICE_ITEMS: InvoiceLineItem[] = [
  {
    id: 'standard-graphic-design',
    name: 'STANDARD GRAPHIC DESIGN',
    sublabel: 'Standard design execution & additional revisions',
    rateLabel: 'R350 / hour',
    unitRate: 350,
    selected: true,
    quantity: 5,
    unit: 'hours',
  },
  {
    id: 'branding-identity-hourly',
    name: 'BRANDING & IDENTITY / UI DESIGN',
    sublabel: 'Branding development, identity systems & digital UI design',
    rateLabel: 'R400 / hour',
    unitRate: 400,
    selected: false,
    quantity: 5,
    unit: 'hours',
  },
  {
    id: 'art-creative-direction',
    name: 'ART & CREATIVE DIRECTION',
    sublabel: 'Senior direction, visual positioning & campaign oversight',
    rateLabel: 'R450 / hour',
    unitRate: 450,
    selected: false,
    quantity: 4,
    unit: 'hours',
  },
  {
    id: 'logo-design',
    name: 'LOGO DESIGN (FIXED)',
    sublabel: 'One primary logo direction, refinement and final export suite',
    rateLabel: 'R2,250 fixed',
    unitRate: 2250,
    selected: false,
    quantity: 1,
    unit: 'project',
  },
  {
    id: 'brand-creation',
    name: 'BRAND CREATION (FIXED)',
    sublabel: 'Starter identity system: strategy, logo suite, colour & typography',
    rateLabel: 'R6,500 fixed',
    unitRate: 6500,
    selected: false,
    quantity: 1,
    unit: 'project',
  },
  {
    id: 'retainer-essential',
    name: 'RETAINER — ESSENTIAL',
    sublabel: 'Up to 5 design hours; guide: up to 2 small-format assets',
    rateLabel: 'R1,750 / month',
    unitRate: 1750,
    selected: false,
    quantity: 1,
    unit: 'month',
  },
  {
    id: 'retainer-studio',
    name: 'RETAINER — STUDIO',
    sublabel: 'Up to 10 design hours; guide: up to 4 small-format assets',
    rateLabel: 'R3,500 / month',
    unitRate: 3500,
    selected: false,
    quantity: 1,
    unit: 'month',
  },
  {
    id: 'retainer-creative-partner',
    name: 'RETAINER — CREATIVE PARTNER',
    sublabel: 'Up to 15 design hours; guide: up to 6 small-format assets',
    rateLabel: 'R5,000 / month',
    unitRate: 5000,
    selected: false,
    quantity: 1,
    unit: 'month',
  },
];
