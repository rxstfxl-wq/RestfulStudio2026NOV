import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Send, 
  RotateCcw, 
  PenTool, 
  Type, 
  ShieldCheck, 
  Info,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { DEFAULT_INVOICE_ITEMS, InvoiceLineItem, TERMS_AND_CONDITIONS } from '../data/termsAndConditions';

interface InvoiceFormProps {
  onOpenTerms?: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onOpenTerms }) => {
  // Format current date as DD/MM/YYYY
  const getFormattedDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // Header & Document Identifiers
  const [docDate, setDocDate] = useState<string>(getFormattedDate);
  const [docNumber, setDocNumber] = useState<string>('RX-0000001');

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Services & Fees Line Items
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(DEFAULT_INVOICE_ITEMS);
  const [customServiceName, setCustomServiceName] = useState<string>('');
  const [customServiceRate, setCustomServiceRate] = useState<number>(500);

  // Client Remarks
  const [clientRemarks, setClientRemarks] = useState<string>('');

  // Acknowledgement & Acceptance
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('type');
  const [typedSignature, setTypedSignature] = useState<string>('');
  const [signatureDate, setSignatureDate] = useState<string>(getFormattedDate);
  const [hasDrawnSignature, setHasDrawnSignature] = useState<boolean>(false);

  // Submission & Print State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Canvas Signature Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Initialize Canvas
  useEffect(() => {
    if (signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#D72626';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [signatureMode]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setHasDrawnSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  // Toggle service selection
  const handleToggleSelect = (id: string) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Update quantity
  const handleQuantityChange = (id: string, qty: number) => {
    const validQty = Math.max(1, isNaN(qty) ? 1 : qty);
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: validQty } : item
      )
    );
  };

  // Add custom item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customServiceName.trim()) return;
    const newItem: InvoiceLineItem = {
      id: `custom-${Date.now()}`,
      name: customServiceName.toUpperCase(),
      sublabel: 'Custom creative or technical service specification',
      rateLabel: `R${customServiceRate}/fixed`,
      unitRate: customServiceRate,
      selected: true,
      quantity: 1,
      unit: 'item',
      isCustom: true
    };
    setLineItems((prev) => [...prev, newItem]);
    setCustomServiceName('');
  };

  // Remove custom item
  const handleRemoveItem = (id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Grand Total Calculation (ZAR)
  const totalAmount = lineItems.reduce((acc, item) => {
    if (!item.selected) return acc;
    return acc + item.unitRate * item.quantity;
  }, 0);

  const deposit50 = Math.round(totalAmount * 0.5);
  const balance50 = totalAmount - deposit50;

  // Form submission handler
  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !email) {
      alert('Please fill in Client Name and Email Address.');
      return;
    }
    if (!agreedToTerms) {
      alert('Please accept the RXSTFXL Terms & Conditions to proceed.');
      return;
    }
    setIsSubmitted(true);
  };

  // Copy quote spec to clipboard
  const handleCopySpec = () => {
    const selectedItems = lineItems.filter((i) => i.selected);
    const specText = `RXSTFXL STUDIO — INVOICE / QUOTE SPECIFICATION
==================================================
DOCUMENT NR: ${docNumber}
DATE: ${docDate}
DESIGNER: Austin Fouché / RXSTFXL (rxstfxl@gmail.com | 060 973 3782)
WEBSITE: www.rxstfxl.online | South Africa

CLIENT DETAILS:
- Name: ${clientName || 'N/A'}
- Business: ${businessName || 'N/A'}
- Email: ${email || 'N/A'}
- Phone: ${phone || 'N/A'}

SERVICES & FEES:
${selectedItems.map((item) => `• [X] ${item.name} | Qty: ${item.quantity} | Rate: ${item.rateLabel} | Total: R${(item.unitRate * item.quantity).toLocaleString()}`).join('\n')}

TOTAL: R${totalAmount.toLocaleString()}
• 50% Deposit Required: R${deposit50.toLocaleString()}
• Balance upon Final Approval: R${balance50.toLocaleString()}

PAYMENT TERMS:
- 50% deposit required before work begins
- Balance payable upon final approval, prior to release of final files
- Invoices payable within 7 calendar days of issue
- Quotes valid for 14 calendar days unless stated otherwise
- RXSTFXL STUDIO is not VAT registered; no VAT is charged
- Work may be paused where payment is overdue

CLIENT ACKNOWLEDGEMENT:
- Signed: ${signatureMode === 'type' ? typedSignature || clientName : '[Drawn Digital Signature]'}
- Date: ${signatureDate}
- Agreed to RXSTFXL 2026-27 Terms & Conditions (POPIA compliant)
${clientRemarks ? `\nCLIENT REMARKS:\n${clientRemarks}` : ''}
==================================================`;

    navigator.clipboard.writeText(specText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 font-mono text-xs">
      
      {/* Submitted Confirmation State */}
      {isSubmitted ? (
        <div className="border border-zinc-800 bg-[#080808] text-white p-6 sm:p-10 space-y-8 animate-fade-in">
          
          <div className="flex items-start justify-between border-b border-zinc-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#D72626] text-white flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#D72626] uppercase tracking-widest block font-bold">
                  COMMISSION SPECIFICATION TRANSMITTED
                </span>
                <h3 className="font-display text-3xl sm:text-4xl text-white uppercase font-bold tracking-tight">
                  INVOICE / QUOTE LOGGED
                </h3>
                <span className="text-zinc-500 text-xs font-mono">
                  REFERENCE CODE: {docNumber} // DATE: {docDate}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 transition-colors uppercase text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>EDIT INVOICE</span>
            </button>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950 p-6 border border-zinc-800">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">CLIENT DETAILS</span>
              <p className="text-white font-bold text-sm mt-1">{clientName}</p>
              {businessName && <p className="text-zinc-400 text-xs">{businessName}</p>}
              <p className="text-zinc-400 text-xs">{email}</p>
              {phone && <p className="text-zinc-400 text-xs">{phone}</p>}
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">COMMISSION TOTAL</span>
              <div className="font-display text-3xl text-white font-bold mt-1">
                R{totalAmount.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#D72626] font-bold block mt-1">
                50% UPFRONT DEPOSIT: R{deposit50.toLocaleString()}
              </span>
              <span className="text-[10px] text-zinc-500 block">
                BALANCE (50% ON APPROVAL): R{balance50.toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 text-[10px] uppercase block tracking-wider">LEGAL STATUS</span>
              <div className="flex items-center gap-2 text-white font-bold text-xs mt-1">
                <ShieldCheck className="w-4 h-4 text-[#D72626]" />
                <span>TERMS & CONDITIONS ACCEPTED</span>
              </div>
              <p className="text-zinc-500 text-[11px] mt-1">
                Signed by: {signatureMode === 'type' ? typedSignature || clientName : '[Drawn Digital Signature]'}
              </p>
              <p className="text-zinc-500 text-[10px]">
                Governing Law: Republic of South Africa (POPIA compliant)
              </p>
            </div>
          </div>

          {/* Selected Services Breakdown */}
          <div className="border border-zinc-800 overflow-hidden">
            <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-800 text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
              SPECIFIED ITEMS & DISCIPLINE ROSTER
            </div>
            <div className="divide-y divide-zinc-900 bg-zinc-950">
              {lineItems.filter((i) => i.selected).map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">{item.name}</span>
                    <span className="text-zinc-500 text-[11px]">{item.sublabel}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-400 block font-mono">
                      {item.quantity} × {item.rateLabel}
                    </span>
                    <span className="text-white font-bold block">
                      R{(item.unitRate * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="bg-zinc-900 hover:bg-[#D72626] text-white border border-zinc-700 hover:border-[#D72626] px-4 py-2.5 flex items-center gap-2 font-bold uppercase tracking-wider transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT / SAVE INVOICE</span>
              </button>

              <button
                type="button"
                onClick={handleCopySpec}
                className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 px-4 py-2.5 flex items-center gap-2 font-bold uppercase tracking-wider transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'SPEC COPIED' : 'COPY SPECIFICATION'}</span>
              </button>

              <a
                href={`mailto:rxstfxl@gmail.com?subject=INVOICE / QUOTE SPECIFICATION [${docNumber}] - ${encodeURIComponent(clientName)}&body=${encodeURIComponent(
                  `Hi Austin,\n\nI have generated an official quote / invoice specification via www.rxstfxl.online.\n\nDocument Reference: ${docNumber}\nClient: ${clientName} (${businessName || 'Individual'})\nEmail: ${email}\nPhone: ${phone}\nTotal: R${totalAmount.toLocaleString()} (50% Deposit: R${deposit50.toLocaleString()})\n\nLooking forward to commencing the project.\n\nBest regards,\n${clientName}`
                )}`}
                className="bg-[#D72626] hover:bg-[#b01c1c] text-white px-5 py-2.5 flex items-center gap-2 font-bold uppercase tracking-wider transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>DIRECT EMAIL TO AUSTIN</span>
              </a>
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="text-zinc-400 hover:text-white uppercase text-xs font-bold underline"
            >
              CREATE ANOTHER INVOICE
            </button>
          </div>

        </div>
      ) : (
        /* ==========================================================
           MAIN INVOICE & QUOTE FORM (Matching 4-page studio invoice)
           ========================================================== */
        <form onSubmit={handleSubmitInvoice} className="space-y-8">
          
          {/* Main Paper / Wireframe Box */}
          <div className="border-2 border-zinc-900 bg-[#FFFFFF] text-black shadow-2xl relative overflow-hidden">
            
            {/* Top Micro-Bar */}
            <div className="bg-black text-white px-4 sm:px-6 py-2 flex items-center justify-between text-[11px] font-bold tracking-widest uppercase">
              <span>RXSTFXL STUDIO | RXSTFXL CLOTHING</span>
              <span className="hidden sm:inline">WWW.RXSTFXL.ONLINE</span>
              <span className="text-[#D72626]">PAGE 1 / 4 SPECIFICATION</span>
            </div>

            {/* Document Header (Page 1) */}
            <div className="p-6 sm:p-10 border-b-2 border-black space-y-8 bg-white text-black relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Brand Mark & Big Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-display text-3xl font-black border-2 border-black">
                      RS
                    </div>
                    <div>
                      <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-none">
                        INVOICE/QUOTE
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Date & Document NR Controls */}
                <div className="space-y-3 font-mono text-xs border-l-2 md:border-l-4 border-black pl-4">
                  <div>
                    <label className="text-[10px] text-zinc-600 block uppercase font-black">
                      DATE:
                    </label>
                    <input
                      type="text"
                      value={docDate}
                      onChange={(e) => setDocDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="font-bold text-sm sm:text-base border-b border-black bg-transparent focus:outline-none focus:border-[#D72626] text-black py-0.5"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-600 block uppercase font-black">
                      DOCUMENT NR:
                    </label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      placeholder="RX-0000001"
                      className="font-bold text-sm sm:text-base border-b border-black bg-transparent focus:outline-none focus:border-[#D72626] text-black py-0.5"
                    />
                  </div>
                </div>

              </div>

              {/* Studio Details Row */}
              <div className="border-t-2 border-black pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <span className="font-display text-xl sm:text-2xl font-black uppercase text-black block">
                    RXSTFXL
                  </span>
                  <span className="text-zinc-700 font-bold block">Austin Fouché</span>
                  <span className="text-zinc-600 block">South Africa</span>
                </div>

                <div className="sm:text-right space-y-1">
                  <a href="tel:0609733782" className="block font-bold hover:text-[#D72626] transition-colors">
                    060 973 3782
                  </a>
                  <a href="mailto:rxstfxl@gmail.com" className="block font-bold hover:text-[#D72626] transition-colors">
                    rxstfxl@gmail.com
                  </a>
                  <span className="text-zinc-600 block">www.rxstfxl.online</span>
                </div>
              </div>

            </div>

            {/* SECTION 2: CLIENT DETAILS (Page 2) */}
            <div className="p-6 sm:p-10 border-b-2 border-black space-y-6 bg-white text-black">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h3 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                  CLIENT DETAILS
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  PAGE 2 // REGISTRATION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    CLIENT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John Doe / Art Director"
                    className="w-full border-b-2 border-black bg-zinc-50 p-2.5 font-mono text-xs focus:outline-none focus:border-[#D72626] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    BUSINESS NAME
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Acme Studio / Independent Brand"
                    className="w-full border-b-2 border-black bg-zinc-50 p-2.5 font-mono text-xs focus:outline-none focus:border-[#D72626] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. client@company.com"
                    className="w-full border-b-2 border-black bg-zinc-50 p-2.5 font-mono text-xs focus:outline-none focus:border-[#D72626] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +27 82 000 0000"
                    className="w-full border-b-2 border-black bg-zinc-50 p-2.5 font-mono text-xs focus:outline-none focus:border-[#D72626] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: SERVICES & FEES (Page 3) */}
            <div className="p-6 sm:p-10 border-b-2 border-black space-y-6 bg-white text-black">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div>
                  <h3 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                    SERVICES & FEES
                  </h3>
                  <p className="text-zinc-600 text-xs font-sans mt-1">
                    Mark requested services with 'X' and specify required quantities or hours.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
                  PAGE 3 // CURRENCY: ZAR (R)
                </span>
              </div>

              {/* Table conforming to Page 3 OCR / Screenshot */}
              <div className="border-2 border-black overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs text-left">
                  <thead>
                    <tr className="bg-black text-white border-b-2 border-black font-black uppercase text-[11px]">
                      <th className="p-3 sm:p-4 border-r-2 border-zinc-700 min-w-[200px]">SERVICES</th>
                      <th className="p-3 sm:p-4 border-r-2 border-zinc-700 text-center w-28">
                        MARK WITH X
                      </th>
                      <th className="p-3 sm:p-4 border-r-2 border-zinc-700 text-center w-28">QUANTITY</th>
                      <th className="p-3 sm:p-4 border-r-2 border-zinc-700 text-right w-36">RATE(ZAR)</th>
                      <th className="p-3 sm:p-4 text-right w-36">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => {
                      const itemTotal = item.selected ? item.unitRate * item.quantity : 0;
                      return (
                        <tr 
                          key={item.id} 
                          className={`border-b-2 border-black transition-colors ${
                            item.selected ? 'bg-zinc-100 font-bold' : 'bg-white text-zinc-500'
                          }`}
                        >
                          {/* Services column */}
                          <td className="p-3 sm:p-4 border-r-2 border-black">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <span className={`font-black text-xs sm:text-sm uppercase ${item.selected ? 'text-black' : 'text-zinc-600'}`}>
                                  {item.name}
                                </span>
                                {item.sublabel && (
                                  <span className="block text-[10px] text-zinc-500 font-normal font-sans">
                                    {item.sublabel}
                                  </span>
                                )}
                              </div>
                              {item.isCustom && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-zinc-400 hover:text-[#D72626] p-1 transition-colors"
                                  title="Delete Custom Service"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Mark With X Column */}
                          <td className="p-3 sm:p-4 border-r-2 border-black text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect(item.id)}
                              className={`w-8 h-8 mx-auto flex items-center justify-center border-2 border-black font-black text-sm transition-all ${
                                item.selected 
                                  ? 'bg-[#D72626] text-white' 
                                  : 'bg-white hover:bg-zinc-200 text-transparent'
                              }`}
                              title={item.selected ? 'Deselect service' : 'Select service with X'}
                            >
                              X
                            </button>
                          </td>

                          {/* Quantity Column */}
                          <td className="p-3 sm:p-4 border-r-2 border-black text-center">
                            {item.selected ? (
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                  className="w-16 border-2 border-black bg-white p-1 text-center font-bold text-xs focus:outline-none focus:border-[#D72626]"
                                />
                              </div>
                            ) : (
                              <span className="text-zinc-400">—</span>
                            )}
                          </td>

                          {/* Rate Column */}
                          <td className="p-3 sm:p-4 border-r-2 border-black text-right font-bold">
                            {item.rateLabel}
                          </td>

                          {/* Total Column */}
                          <td className="p-3 sm:p-4 text-right font-black text-sm">
                            {item.selected ? `R${itemTotal.toLocaleString()}` : 'R0'}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Grand Total Row (Page 3 Bottom) */}
                    <tr className="bg-black text-white font-black text-base sm:text-lg">
                      <td colSpan={4} className="p-4 sm:p-5 border-r-2 border-zinc-700 text-right uppercase tracking-wider">
                        TOTAL
                      </td>
                      <td className="p-4 sm:p-5 text-right font-display text-xl sm:text-2xl text-[#D72626]">
                        R {totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Add Custom Service Line Item Drawer */}
              <div className="bg-zinc-50 border-2 border-black p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    placeholder="Add custom service (e.g. 3D RENDER / PACKAGING)..."
                    className="flex-1 w-full bg-white border-2 border-black p-2 font-mono text-xs focus:outline-none focus:border-[#D72626]"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">RATE(R):</span>
                    <input
                      type="number"
                      step={50}
                      min={100}
                      value={customServiceRate}
                      onChange={(e) => setCustomServiceRate(parseInt(e.target.value, 10) || 0)}
                      className="w-24 bg-white border-2 border-black p-2 font-mono text-xs text-center focus:outline-none focus:border-[#D72626]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="w-full md:w-auto bg-black hover:bg-[#D72626] text-white border-2 border-black px-4 py-2 uppercase font-black tracking-wider transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD SERVICE ROW</span>
                </button>
              </div>

            </div>

            {/* SECTION 4: PAYMENT TERMS & ACKNOWLEDGEMENT (Page 4) */}
            <div className="p-6 sm:p-10 border-b-2 border-black space-y-8 bg-white text-black">
              
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h3 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                  PAYMENT TERMS
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
                  PAGE 4 // COMMERCIAL TERMS
                </span>
              </div>

              {/* Exact Bullets from OCR Page 4 with dynamic live calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                <div className="border-2 border-black p-4 space-y-2 bg-zinc-50">
                  <div className="font-black text-sm text-black uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#D72626] inline-block" />
                    <span>50% DEPOSIT REQUIRED</span>
                  </div>
                  <p className="text-zinc-700 leading-relaxed font-sans">
                    50% deposit required before project start.
                  </p>
                  <div className="pt-2 border-t border-zinc-300 font-black text-[#D72626] text-base">
                    R {deposit50.toLocaleString()} DUE AT START
                  </div>
                </div>

                <div className="border-2 border-black p-4 space-y-2 bg-zinc-50">
                  <div className="font-black text-sm text-black uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-black inline-block" />
                    <span>BALANCE ON APPROVAL</span>
                  </div>
                  <p className="text-zinc-700 leading-relaxed font-sans">
                    Balance due upon final approval, prior to delivery.
                  </p>
                  <div className="pt-2 border-t border-zinc-300 font-black text-black text-base">
                    R {balance50.toLocaleString()} DUE ON APPROVAL
                  </div>
                </div>

                <div className="border-2 border-black p-4 space-y-2 bg-zinc-50">
                  <div className="font-black text-sm text-black uppercase flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-zinc-400 inline-block" />
                    <span>INVOICE TIMELINE</span>
                  </div>
                  <ul className="text-zinc-700 space-y-1 text-[11px]">
                    <li>• Payable within 7 calendar days of issue</li>
                    <li>• Quotes valid for 14 calendar days</li>
                    <li>• Not VAT registered — no VAT charged</li>
                  </ul>
                </div>
              </div>

              {/* Client Remarks / Project Notes (from Page 4 of T&Cs doc) */}
              <div className="space-y-2 pt-4">
                <label className="block text-xs font-black uppercase text-black">
                  CLIENT REMARKS / SCOPE NOTES & INSTRUCTIONS
                </label>
                <textarea
                  rows={3}
                  value={clientRemarks}
                  onChange={(e) => setClientRemarks(e.target.value)}
                  placeholder="Outline key project deliverables, desired completion timeline, special requests, or print specifications..."
                  className="w-full border-2 border-black bg-zinc-50 p-3 font-mono text-xs focus:outline-none focus:border-[#D72626] resize-none"
                />
              </div>

              {/* ACKNOWLEDGEMENT BOX (Matching Page 2 & Page 4) */}
              <div className="border-4 border-black p-6 sm:p-8 space-y-6 bg-zinc-50">
                <div className="border-b-2 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-display text-2xl sm:text-4xl font-black uppercase text-black tracking-tight">
                    ACKNOWLEDGEMENT
                  </h4>
                  <span className="font-mono text-[11px] text-zinc-600 italic">
                    By accepting this quote/invoice, the client agrees to the RXSTFXL Terms & Conditions.
                  </span>
                </div>

                {/* Terms agreement checkbox */}
                <div className="flex items-start gap-3 bg-white p-4 border-2 border-black">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    required
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 accent-[#D72626] mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-zinc-800 font-sans cursor-pointer leading-relaxed">
                    <span className="font-bold text-black">I accept and agree to the RXSTFXL Terms & Conditions</span>, 
                    governing payment milestones, revision boundaries, POPIA data protection, and ownership rights under the laws of South Africa.{' '}
                    {onOpenTerms && (
                      <button
                        type="button"
                        onClick={onOpenTerms}
                        className="text-[#D72626] underline font-mono text-xs font-bold ml-1 hover:text-black"
                      >
                        [VIEW FULL 14 CLAUSES ↗]
                      </button>
                    )}
                  </label>
                </div>

                {/* Signature & Date Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  
                  {/* Signature Section */}
                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs uppercase text-black">
                        CLIENT SIGNATURE:
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <button
                          type="button"
                          onClick={() => setSignatureMode('type')}
                          className={`px-2 py-0.5 border ${
                            signatureMode === 'type' 
                              ? 'bg-black text-white border-black font-bold' 
                              : 'bg-white text-zinc-700 border-zinc-400'
                          }`}
                        >
                          TYPE
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignatureMode('draw')}
                          className={`px-2 py-0.5 border ${
                            signatureMode === 'draw' 
                              ? 'bg-black text-white border-black font-bold' 
                              : 'bg-white text-zinc-700 border-zinc-400'
                          }`}
                        >
                          DRAW
                        </button>
                        {signatureMode === 'draw' && (
                          <button
                            type="button"
                            onClick={clearCanvas}
                            className="text-[#D72626] hover:underline uppercase text-[10px] font-bold"
                          >
                            CLEAR
                          </button>
                        )}
                      </div>
                    </div>

                    {signatureMode === 'type' ? (
                      <div className="border-b-2 border-black bg-white p-3">
                        <input
                          type="text"
                          value={typedSignature}
                          onChange={(e) => setTypedSignature(e.target.value)}
                          placeholder={clientName ? `Type signature (e.g. ${clientName})` : "Type legal signatory name..."}
                          className="w-full font-serif italic text-xl sm:text-2xl text-black bg-transparent focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-black bg-white relative">
                        <canvas
                          ref={canvasRef}
                          width={400}
                          height={100}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="w-full h-24 cursor-crosshair touch-none"
                        />
                        {!hasDrawnSignature && (
                          <span className="absolute inset-0 flex items-center justify-center text-zinc-400 text-[11px] pointer-events-none font-sans">
                            Sign here using mouse or finger
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date Field */}
                  <div className="md:col-span-4 space-y-2">
                    <span className="font-black text-xs uppercase text-black block">
                      DATE:
                    </span>
                    <input
                      type="text"
                      value={signatureDate}
                      onChange={(e) => setSignatureDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full border-b-2 border-black bg-white p-3 font-mono text-sm font-bold text-black focus:outline-none focus:border-[#D72626]"
                    />
                  </div>

                </div>

              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-black text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] text-[#D72626] uppercase font-bold tracking-widest block">
                  TRANSMIT OFFICIAL SPECIFICATION
                </span>
                <p className="text-zinc-400 text-xs font-sans">
                  Total Quote: <strong className="text-white">R {totalAmount.toLocaleString()}</strong> (50% Deposit: R {deposit50.toLocaleString()})
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT / PDF</span>
                </button>

                <button
                  type="submit"
                  className="bg-[#D72626] hover:bg-[#b01c1c] text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg hover:scale-[1.02]"
                >
                  <span>SUBMIT COMMISSION QUOTE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Helper Footnotes & Official Template Downloads */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px] px-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D72626] shrink-0" />
              <span>
                2026–27 Rates: R350/hr standard, R400/hr branding/UI, R450/hr direction, R500/hr rush · Retainers from R1,750/mo (No VAT).
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <a
                href={TERMS_AND_CONDITIONS.invoicePdfPath}
                target="_blank"
                rel="noreferrer"
                download="RXSTFXL_2026-27_Rate_Card.pdf"
                className="text-zinc-400 hover:text-[#D72626] flex items-center gap-1 uppercase underline"
              >
                <span>RATE CARD 2026–27 PDF</span>
                <Download className="w-3 h-3" />
              </a>
              <span className="text-zinc-700">·</span>
              <a
                href={TERMS_AND_CONDITIONS.pdfPath}
                target="_blank"
                rel="noreferrer"
                download="RXSTFXL_Terms_and_Conditions_2026-27.pdf"
                className="text-zinc-400 hover:text-[#D72626] flex items-center gap-1 uppercase underline"
              >
                <span>TS &amp; CS 2026–27 PDF</span>
                <Download className="w-3 h-3" />
              </a>
            </div>
          </div>

        </form>
      )}

    </div>
  );
};
