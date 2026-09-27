import React from 'react';
import {
  Settings,
  ShieldCheck,
  MapPin,
  Package,
  Headphones,
  Sliders,
  Terminal,
  Volume2,
  VolumeX,
  ChevronRight,
  ArrowLeft,
  FileText,
  Building2,
  ExternalLink,
  Lock,
  Compass,
  Zap,
  HelpCircle,
  Truck,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { useCart } from '../context/CartContext';

interface SettingsScreenProps {
  onBackToHome: () => void;
  onNavigateTo: (screen: 'terms' | 'orders' | 'support' | 'addresses' | 'admin') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBackToHome, onNavigateTo }) => {
  const { isMuted, toggleMute, playClick } = useSound();
  const { selectedAddress } = useCart();

  const handleAction = (screen: 'terms' | 'orders' | 'support' | 'addresses' | 'admin') => {
    playClick();
    onNavigateTo(screen);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    selectedAddress.title + ' ' + selectedAddress.addressLine
  )}`;

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none pb-12">
      {/* Top Header */}
      <div className="bg-[#062B32] text-white p-5 rounded-2xl border border-[#041E24] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClick();
              onBackToHome();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-[#D8F43A]" />
              <h1 className="text-lg font-black tracking-tight">Settings & Account Center</h1>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Manage contractor preferences, addresses on Google Maps, legal terms, and operations
            </p>
          </div>
        </div>

        {/* Dev Admin Direct Action Button */}
        <button
          onClick={() => handleAction('admin')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D8F43A] text-[#062B32] text-xs font-black hover:bg-[#cbe633] transition-all shadow-xs"
        >
          <Terminal size={15} />
          <span>Dev Admin</span>
        </button>
      </div>

      {/* Contractor Account Mini Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#062B32] text-[#D8F43A] flex items-center justify-center font-black text-lg">
            NS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[#0F172A]">Nithin Selvaraj</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                Lead Engineer • Verified
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-medium">GSTIN: 29AAAAA0000A1Z5 • +91 98765 43210</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#64748B] font-medium">Site Credit:</span>
          <span className="font-black text-[#062B32]">₹50,000 Approved</span>
        </div>
      </div>

      {/* Main Settings Navigation Menu */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden divide-y divide-[#F1F5F9]">
        {/* 1. Terms of Service & Legal Compliance */}
        <button
          onClick={() => handleAction('terms')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-[#0F172A]">Terms of Service & B2B Compliance</p>
              <span className="text-[11px] text-[#64748B] font-medium">
                Bulletproof terms for 8-min SLA, tool rental liability, GST ITC claims & warranty
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#94A3B8]" />
        </button>

        {/* 2. Jobsite Addresses & Google Maps Integration */}
        <button
          onClick={() => handleAction('addresses')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-[#0F172A]">Jobsite Addresses & Google Maps</p>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.2 rounded">
                  Google Maps Sync
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] font-medium">
                Active: {selectedAddress.title} ({selectedAddress.addressLine})
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#94A3B8]" />
        </button>

        {/* 3. Order History & Dispatches */}
        <button
          onClick={() => handleAction('orders')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Package size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-[#0F172A]">Order History & GST Invoices</p>
              <span className="text-[11px] text-[#64748B] font-medium">
                Download itemized tax invoices, re-order materials, and inspect dispatch logs
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#94A3B8]" />
        </button>

        {/* 4. 24x7 Customer Service & Site Support */}
        <button
          onClick={() => handleAction('support')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-[#0F172A]">24x7 Site Customer Service & Emergency Dispatch</p>
              <span className="text-[11px] text-[#64748B] font-medium">
                Live assistant, instant WhatsApp connect, priority tickets & site hotline
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#94A3B8]" />
        </button>

        {/* 5. Dev Admin Portal Direct Gateway */}
        <button
          onClick={() => handleAction('admin')}
          className="w-full p-4 flex items-center justify-between bg-slate-900 text-white hover:bg-slate-800 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8F43A] text-[#062B32] flex items-center justify-center flex-shrink-0">
              <Terminal size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-white">Dev Admin Portal</p>
                <span className="text-[10px] font-black bg-[#D8F43A] text-[#062B32] px-2 py-0.5 rounded-full">
                  OPERATIONS & INVENTORY
                </span>
              </div>
              <span className="text-[11px] text-white/70 font-medium">
                Edit 462 product stock & pricing, dispatch van routing, heavy machinery rental tracker
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#D8F43A]" />
        </button>
      </div>

      {/* App Preferences & Tactile Audio Settings */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-2xs space-y-4">
        <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          App Sound & Tactile Preferences
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Synthesized Web Audio Acoustic Micro-Clicks</p>
              <p className="text-[11px] text-[#64748B]">Auditory feedback on button taps, adding items, and dispatch alerts</p>
            </div>
          </div>

          <button
            onClick={() => {
              toggleMute();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              !isMuted
                ? 'bg-[#062B32] text-[#D8F43A]'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {!isMuted ? 'Sound Enabled' : 'Muted'}
          </button>
        </div>
      </div>

      {/* Data & CSV Export Center */}
      <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#062B32] flex items-center justify-center font-bold">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                Corporate Data & Inventory CSV Export
              </h3>
              <p className="text-[11px] text-[#64748B] font-medium">Download raw BOM tables, catalog SKUs, and legal terms</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => {
              playClick();
              window.location.href = '#';
              // Trigger CSV catalog download
              const headers = 'SKU_ID,Product_Name,Category,Price_INR,MRP_INR,SLA_Dispatch\n';
              import('../data/catalog').then(({ PRODUCTS }) => {
                const rows = PRODUCTS.map(p => `"${p.id}","${p.name.replace(/"/g, '""')}","${p.category}",${p.price},${p.originalPrice},"${p.deliveryTimeMins || 8} MINS"`).join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'buildit_catalog_inventory_462_skus.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              });
            }}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] text-left transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-black text-[#0F172A] block">Export Full Catalog (CSV)</span>
              <span className="text-[10px] text-[#64748B]">462 SKUs across 15 categories</span>
            </div>
            <Download size={14} className="text-[#062B32]" />
          </button>

          <button
            onClick={() => handleAction('terms')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] text-left transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-black text-[#0F172A] block">Export Terms & SLA (CSV)</span>
              <span className="text-[10px] text-[#64748B]">Legal clauses, ITC & insurance</span>
            </div>
            <ChevronRight size={14} className="text-[#062B32]" />
          </button>
        </div>
      </div>

      {/* Google Maps Shortcut Pinpoint */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-950">Quick Google Maps View for Active Site</p>
            <p className="text-[11px] text-blue-700">{selectedAddress.title} • {selectedAddress.addressLine}</p>
          </div>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-xs"
        >
          <span>Open Maps</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};
