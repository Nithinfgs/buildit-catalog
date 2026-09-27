import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Scale,
  AlertTriangle,
  Truck,
  Clock,
  RefreshCw,
  Lock,
  ChevronDown,
  ChevronUp,
  Download,
  ArrowLeft,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  HardHat,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../context/SoundContext';

interface TermsOfServiceProps {
  onBack?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  const { playClick, playSuccess } = useSound();
  const [expandedSection, setExpandedSection] = useState<string | null>('sec-1');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    playClick();
    setExpandedSection(expandedSection === id ? null : id);
  };

  const SECTIONS = [
    {
      id: 'sec-1',
      title: '1. Master Commercial Services Agreement & Platform Scope',
      icon: Scale,
      summary: 'Legally binding B2B/B2C framework under Indian Contract Act 1872 & IT Act 2000.',
      content: `BuildIt Technologies India Private Limited ("BuildIt", "Platform", "Company") operates an ultra-fast quick-commerce and enterprise supply platform for construction materials, power tools, electronics prototyping components, fasteners, plumbing, and on-demand professional site crew.

By creating an account, browsing the catalog, placing purchase orders, booking tool rentals, or hiring professional tradespeople/helpers, you ("Contractor", "Engineer", "Client", or "User") agree to be bound unconditionally by these Terms and Conditions in full compliance with the Indian Contract Act, 1872, Information Technology Act, 2000, and Consumer Protection (E-Commerce) Rules, 2020.`
    },
    {
      id: 'sec-2',
      title: '2. 8-Minute Instant Jobsite Dispatch SLA & Logistics Policies',
      icon: Clock,
      summary: 'Hyper-local micro-hub fulfillment with automated bin-picking and GPS route tracking.',
      content: `All in-stock products tagged with the "8-Min Delivery" badge are fulfilled from hyper-local micro-fulfillment hubs (Dark Hubs) located within a 4.5km radius of designated commercial and construction corridors.
(a) Delivery timelines commence immediately upon automated warehouse bin-picking confirmation.
(b) In instances of Force Majeure, severe monsoons, road closures, or restricted jobsite gate access, our dispatch team will notify the site engineer immediately.
(c) BuildIt guarantees real-time GPS telemetry tracking from hub departure to site arrival with zero detour policy.`
    },
    {
      id: 'sec-3',
      title: '3. On-Demand Site Helpers & Pro Crew Hiring Terms (Urban Company Standard)',
      icon: Users,
      summary: 'Certified electricians, plumbers, tile masons, welders, and helpers with ₹10 Lakh insurance.',
      content: `BuildIt provides on-demand dispatch of background-verified trade professionals (Master Electricians, Plumbers, Precision Tile Masons, Finish Carpenters, Structural Welders, and General Site Helpers).
(a) Verification: Every professional undergoes mandatory Aadhaar e-KYC, police background check, and technical skill benchmark testing before deployment.
(b) ₹10,00,000 Accidental Damage Cover: All active bookings include up to ₹10,00,000 on-site comprehensive accidental damage insurance covering client property, materials, and structural elements.
(c) Shift Definitions: Minimum booking duration is 2 hours. Full-day shifts consist of 8 working hours with mandatory 45-minute lunch intervals. Overtime beyond scheduled shifts is billed at pro-rata hourly rates.
(d) Tools & PPE: Technicians arrive equipped with calibrated OEM power tools and personal protective equipment (ISI safety helmets, high-vis vests, steel-toe boots).
(e) Zero-Mess Promise: Technicians must clean and sweep active work areas upon completion of work.`
    },
    {
      id: 'sec-4',
      title: '4. Equipment & Heavy Machinery Rental Liability, Waiver & Escrow Deposits',
      icon: Truck,
      summary: 'Daily/weekly machinery lease, security deposit escrow, and maintenance indemnity.',
      content: `Machinery and heavy equipment (including demolition breakers, rotary hammers, diamond core drills, generators, and cut-off saws) rented via BuildIt are dispatched fully calibrated, safety-tested, and tagged with OEM certifications. The Contractor agrees:
(a) To operate equipment solely with certified personnel following manufacturer safety protocols.
(b) To maintain full custody and liability against site theft, water submersion, unapproved modifications, or gross negligence.
(c) Standard operational wear-and-tear is covered under the base rental fee.
(d) Refundable security deposits are held in a secure banking escrow and credited back to the registered business bank account/wallet within 2 hours of post-rental technician inspection.`
    },
    {
      id: 'sec-5',
      title: '5. GST E-Invoicing, Tax Compliance & 100% ITC Claims',
      icon: FileText,
      summary: 'Mandatory Rule 48(4) CGST Rules compliance with verifiable IRN and embedded QR codes.',
      content: `All business transactions are fully eligible for Input Tax Credit (ITC) under Section 16 of the Central Goods and Services Tax (CGST) Act, 2017.
(a) Contractors entering a valid GSTIN receive an automated, IRN-verified GST E-Invoice with embedded QR codes upon van dispatch.
(b) Itemized tax invoices with HS/SAC codes, CGST (9%), SGST (9%), or IGST (18%) breakdowns are generated and permanently stored in your Order History for 1-click audit download.`
    },
    {
      id: 'sec-6',
      title: '6. Genuine OEM Warranty, 48-Hour Site Replacement & Return Policy',
      icon: RefreshCw,
      summary: '100% authorized OEM manufacturer sourcing with direct jobsite replacement.',
      content: `BuildIt guarantees 100% genuine products sourced directly from authorized OEM manufacturers (Bosch, DeWalt, Stanley, Astral, Asian Paints, Schneider Electric, Samsung SDI).
(a) We offer a 48-Hour Instant Jobsite Replacement policy for manufacturing defects, transit damage, or incorrect specifications.
(b) Return pickups are collected directly from your registered construction site address at zero additional shipping fee.`
    },
    {
      id: 'sec-7',
      title: '7. Hazardous Materials, Solvents & Lithium-Ion Transport Compliance',
      icon: AlertTriangle,
      summary: 'PESO certified transport for solvents, industrial adhesives, and high-drain Li-Ion cells.',
      content: `Solvents (Astral ResiQuick, CPVC solvent cements), industrial adhesives (Fevicol Marine), paints, primers, and high-capacity Lithium-Ion cells (Samsung 18650, LiFePO4 packs) are transported in strict compliance with the Petroleum and Explosives Safety Organisation (PESO) and hazardous materials transport guidelines. Delivery vans carry fire-retardant thermal storage cases and Class-D fire extinguishers.`
    },
    {
      id: 'sec-8',
      title: '8. Data Protection, CAD Blueprint Privacy & Intellectual Property',
      icon: Lock,
      summary: 'End-to-end AES-256 encrypted architectural plotting with 24-hour buffer purging.',
      content: `Architectural CAD blueprints (.dwg, .dxf, .pdf) uploaded to the BuildIt Print Store are encrypted end-to-end with AES-256 in transit and at rest. Blueprint files are automatically purged from high-speed plotter buffer caches within 24 hours of printing. BuildIt does not claim ownership or license over any client schematics or proprietary project designs.`
    },
    {
      id: 'sec-9',
      title: '9. Limitation of Liability, Indemnity & Force Majeure',
      icon: ShieldCheck,
      summary: 'Clear liability boundaries, contractor indemnification, and event excusal terms.',
      content: `(a) To the maximum extent permitted by applicable Indian law, BuildIt’s total aggregate liability arising out of any order or service booking shall not exceed the total transaction amount paid for that specific order.
(b) The Client agrees to indemnify and hold harmless BuildIt, its directors, employees, and partner merchants from any third-party claims arising from unauthorized site modifications, structural misuse, or failure to obtain statutory construction permits.
(c) Neither party shall be liable for failure to perform obligations caused by acts of God, extreme floods, civil unrest, or statutory lockouts.`
    },
    {
      id: 'sec-10',
      title: '10. Dispute Resolution, Governing Law & Binding Arbitration',
      icon: Scale,
      summary: 'Governed by Indian Law with expedited arbitration in Bengaluru under the 1996 Act.',
      content: `These terms are governed exclusively by the laws of India. Any dispute, controversy, or claim arising out of or in connection with transactions on BuildIt shall be resolved by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Bengaluru, Karnataka, India, conducted in English by a sole arbitrator appointed mutually.`
    }
  ];

  const handleExportCSV = () => {
    playSuccess();
    const headers = 'Section_ID,Clause_Title,Clause_Summary,Full_Legal_Text\n';
    const rows = SECTIONS.map(
      (s) =>
        `"${s.id}","${s.title.replace(/"/g, '""')}","${s.summary.replace(/"/g, '""')}","${s.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BuildIt_Master_Terms_and_Conditions_2026.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess('CSV Exported');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadText = () => {
    playSuccess();
    const file = new Blob([
      `================================================================================\n` +
      `BUILDIT TECHNOLOGIES INDIA PRIVATE LIMITED — MASTER COMMERCIAL & LEGAL TERMS\n` +
      `Last Vetted & Effective Date: 2026-09-04 | Legal Version: 14.2.0-PROD\n` +
      `Applicable Framework: Indian Contract Act 1872, CGST Act 2017, IT Act 2000\n` +
      `================================================================================\n\n` +
      SECTIONS.map((s) => `${s.title}\n${'='.repeat(s.title.length)}\nSummary: ${s.summary}\n\n${s.content}\n\n--------------------------------------------------------------------------------\n`).join('\n')
    ], { type: 'text/plain' });

    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BuildIt_Master_Terms_and_Conditions_2026.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess('Text Document Exported');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none pb-12">
      {/* Header Bar */}
      <div className="bg-[#062B32] text-white p-5 rounded-2xl border border-[#041E24] flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                playClick();
                onBack();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#D8F43A]" />
              <h2 className="text-lg font-black tracking-tight">Bulletproof Terms & B2B Compliance</h2>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Governing 8-Min SLA, On-Demand Helpers, Tool Rentals, GST ITC, and Dispute Arbitration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
          >
            <FileSpreadsheet size={14} className="text-[#D8F43A]" />
            <span>{downloadSuccess === 'CSV Exported' ? 'Exported!' : 'Export Terms (CSV)'}</span>
          </button>

          <button
            onClick={handleDownloadText}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D8F43A] text-[#062B32] text-xs font-black hover:bg-[#cbe633] transition-all shadow-xs"
          >
            <Download size={14} />
            <span>Download Legal Copy</span>
          </button>
        </div>
      </div>

      {/* Trust & Compliance Pill Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Scale size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A]">Indian Contract Act</p>
            <p className="text-[10px] text-[#64748B]">Vetted B2B framework</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A]">₹10 Lakh Insurance</p>
            <p className="text-[10px] text-[#64748B]">On-demand helper cover</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A]">100% ITC Eligible</p>
            <p className="text-[10px] text-[#64748B]">Rule 48(4) GST E-Invoices</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#E5E7EB] flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Award size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A]">Arbitration Act 1996</p>
            <p className="text-[10px] text-[#64748B]">Expedited BLR resolution</p>
          </div>
        </div>
      </div>

      {/* Accordion Clauses */}
      <div className="space-y-2.5">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isExpanded = expandedSection === sec.id;
          return (
            <div
              key={sec.id}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isExpanded ? 'bg-[#062B32] text-[#D8F43A]' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0F172A] block">{sec.title}</span>
                    <span className="text-[11px] text-[#64748B] font-medium">{sec.summary}</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={16} className="text-[#062B32] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#64748B] flex-shrink-0" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-[#E5E7EB] px-5 py-4 bg-slate-50/60 text-xs text-[#334155] leading-relaxed whitespace-pre-line font-medium"
                  >
                    {sec.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Legal Footer Note */}
      <div className="p-4 rounded-xl bg-slate-100 text-[#64748B] text-[11px] text-center font-medium">
        BuildIt Technologies India Pvt. Ltd. • CIN: U74999KA2024PTC123456 • Registered Office: Embassy Tech Village, Outer Ring Road, Bengaluru, Karnataka 560103
      </div>
    </div>
  );
};
