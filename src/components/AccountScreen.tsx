import React, { useState } from 'react';
import {
  Wallet,
  MapPin,
  Package,
  Headphones,
  ChevronRight,
  ArrowLeft,
  HardHat,
  FileText,
  Wrench,
  Clock,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Settings,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSound } from '../context/SoundContext';

interface AccountScreenProps {
  onBackToHome: () => void;
  onOpenAddressModal: () => void;
  onNavigateTo?: (screen: 'terms' | 'orders' | 'support' | 'addresses' | 'settings' | 'admin') => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({ onBackToHome, onOpenAddressModal, onNavigateTo }) => {
  const { selectedAddress } = useCart();
  const { playClick } = useSound();
  const [pickupRequested, setPickupRequested] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-surface-page hide-scrollbar select-none pb-12">
      {/* Top Header */}
      <div className="bg-navy p-5 rounded-3xl mb-5 flex items-center justify-between shadow-hero text-white border border-primary-secondary">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClick();
              onBackToHome();
            }}
            className="p-1.5 -ml-1 text-white rounded-xl hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-black text-white tracking-tight">
            BuildIt Contractor & Engineer Account
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile Card */}
        <div className="bg-surface-card rounded-3xl p-5 border border-stroke shadow-crisp flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-secondary border border-stroke flex items-center justify-center text-primary">
            <HardHat size={28} />
          </div>
          <div>
            <h2 className="text-base font-black text-navy">Nithin Selvaraj (Lead Engineer)</h2>
            <p className="text-xs text-content-secondary font-medium">GSTIN: 29AAAAA0000A1Z5 • +91 98765 43210</p>
            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-lime text-navy text-[10px] font-black border border-navy/10">
              BuildIt Pro Builder Tier • Verified Account
            </span>
          </div>
        </div>

        {/* Active Tool Rental Tracker Card */}
        <div className="bg-surface-card rounded-3xl p-5 border border-[#063B32]/30 shadow-crisp space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#063B32] text-lime flex items-center justify-center">
                <Wrench size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black text-navy uppercase tracking-wider">Active Tool Rental</h3>
                <span className="text-[10px] text-content-secondary font-bold">Site: {selectedAddress.title}</span>
              </div>
            </div>
            <span className="text-[10px] font-black text-[#063B32] bg-[#063B32]/10 px-2.5 py-1 rounded-full border border-[#063B32]/20">
              Due in 2 Days
            </span>
          </div>

          <div className="bg-surface-secondary/60 p-3.5 rounded-2xl border border-stroke flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-black text-navy">Bosch GSH 11 E SDS-Max Demolition Breaker</h4>
              <p className="text-[11px] text-content-secondary mt-0.5 font-medium">
                Rental: 3 Days • Refundable Deposit: ₹2,500
              </p>
            </div>
            <button
              onClick={() => {
                playClick();
                setPickupRequested(true);
              }}
              disabled={pickupRequested}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                pickupRequested
                  ? 'bg-emerald-600 text-white flex items-center gap-1.5'
                  : 'bg-[#063B32] text-lime hover:bg-[#094d42] active:scale-95'
              }`}
            >
              {pickupRequested ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Pickup Scheduled</span>
                </>
              ) : (
                <span>Request Return Pickup</span>
              )}
            </button>
          </div>
        </div>

        {/* Site Credit & Wallet */}
        <div className="bg-gradient-to-r from-navy via-primary to-primary-secondary text-white rounded-3xl p-5 shadow-hero relative overflow-hidden flex items-center justify-between border border-primary-secondary">
          <div>
            <div className="flex items-center gap-1.5 text-lime text-xs font-black mb-1">
              <Wallet size={14} />
              <span>Approved Jobsite Credit Line</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">₹50,000.00</h3>
            <span className="text-[10px] text-white/80">Instant 30-day interest free project billing</span>
          </div>
          <button
            onClick={playClick}
            className="px-4 py-2.5 bg-lime text-navy rounded-xl text-xs font-black shadow-lime-glow hover:bg-lime-hover active:scale-95 transition-all border border-navy/10"
          >
            Manage Credit
          </button>
        </div>

        {/* Quick Menu List */}
        <div className="bg-surface-card rounded-3xl border border-stroke shadow-crisp divide-y divide-stroke text-xs font-bold text-navy">
          <button
            onClick={() => {
              playClick();
              if (onNavigateTo) onNavigateTo('addresses');
              else onOpenAddressModal();
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-surface-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-secondary text-primary flex items-center justify-center border border-stroke">
                <MapPin size={18} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p>Saved Job Sites & Google Maps</p>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">Maps Sync</span>
                </div>
                <span className="text-[10px] text-content-secondary font-medium">
                  {selectedAddress.title} ({selectedAddress.addressLine})
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-content-secondary" />
          </button>

          <button
            onClick={() => {
              playClick();
              if (onNavigateTo) onNavigateTo('orders');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-surface-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-secondary text-primary flex items-center justify-center border border-stroke">
                <Package size={18} />
              </div>
              <div className="text-left">
                <p>Order History & Dispatches</p>
                <span className="text-[10px] text-content-secondary font-medium">Track previous site deliveries & download GST invoices</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-content-secondary" />
          </button>

          <button
            onClick={() => {
              playClick();
              if (onNavigateTo) onNavigateTo('support');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-surface-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-secondary text-primary flex items-center justify-center border border-stroke">
                <Headphones size={18} />
              </div>
              <div className="text-left">
                <p>24x7 Site Customer Service</p>
                <span className="text-[10px] text-content-secondary font-medium">Live assistant, WhatsApp & emergency site line</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-content-secondary" />
          </button>

          <button
            onClick={() => {
              playClick();
              if (onNavigateTo) onNavigateTo('terms');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-surface-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-secondary text-primary flex items-center justify-center border border-stroke">
                <ShieldCheck size={18} />
              </div>
              <div className="text-left">
                <p>Terms of Service & Compliance</p>
                <span className="text-[10px] text-content-secondary font-medium">8-min SLA, tool rental liability & ITC claims</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-content-secondary" />
          </button>

          <button
            onClick={() => {
              playClick();
              if (onNavigateTo) onNavigateTo('settings');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-surface-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-secondary text-primary flex items-center justify-center border border-stroke">
                <Settings size={18} />
              </div>
              <div className="text-left">
                <p>App & Sound Preferences</p>
                <span className="text-[10px] text-content-secondary font-medium">Web audio acoustic feedback & notification controls</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-content-secondary" />
          </button>

          <button
            onClick={() => {
              playClick();
              if (onNavigateTo) onNavigateTo('admin');
            }}
            className="w-full p-4 flex items-center justify-between bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded-b-3xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D8F43A] text-[#062B32] flex items-center justify-center">
                <Terminal size={18} />
              </div>
              <div className="text-left">
                <p className="text-white font-black">Dev Admin Portal</p>
                <span className="text-[10px] text-white/70 font-medium">Direct inventory control & 8-min dispatch overrides</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#D8F43A]" />
          </button>
        </div>

        {/* App Version & Meta */}
        <div className="text-center py-2 text-[10px] text-content-secondary font-medium">
          BuildIt Electronics & Construction Hub OS v14.0.0
        </div>
      </div>
    </div>
  );
};

