import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Building2,
  Home,
  Plus,
  ExternalLink,
  Check,
  Trash2,
  ArrowLeft,
  Search,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useSound } from '../context/SoundContext';
import { Address } from '../types';
import { MOCK_ADDRESSES } from '../data/catalog';

interface AddressManagerProps {
  onBackToHome: () => void;
}

export const AddressManager: React.FC<AddressManagerProps> = ({ onBackToHome }) => {
  const { selectedAddress, setSelectedAddress } = useCart();
  const { playClick, playSuccess } = useSound();
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('560103');
  const [siteType, setSiteType] = useState<'work' | 'home' | 'other'>('work');

  const handleSelectAddress = (addr: Address) => {
    playSuccess();
    setSelectedAddress(addr);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAddressLine.trim()) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      type: siteType,
      title: newTitle.trim(),
      addressLine: newAddressLine.trim(),
      landmark: newLandmark.trim() || 'Near Main Gate',
      pincode: newPincode.trim() || '560103'
    };

    setAddresses([newAddr, ...addresses]);
    setSelectedAddress(newAddr);
    playSuccess();
    setIsAddingNew(false);
    setNewTitle('');
    setNewAddressLine('');
    setNewLandmark('');
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    if (addresses.length <= 1) return;
    const filtered = addresses.filter((a) => a.id !== id);
    setAddresses(filtered);
    if (selectedAddress.id === id) {
      setSelectedAddress(filtered[0]);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto select-none">
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
              <MapPin size={20} className="text-[#D8F43A]" />
              <h2 className="text-lg font-black tracking-tight">Jobsite Addresses & Google Maps</h2>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Manage construction sites, R&D labs, and sync live delivery GPS routes
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playClick();
            setIsAddingNew(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D8F43A] text-[#062B32] text-xs font-black hover:bg-[#cbe633] transition-all shadow-xs"
        >
          <Plus size={15} />
          <span>Add New Site</span>
        </button>
      </div>

      {/* Live GPS Pinpoint Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Navigation size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#0F172A]">Live Jobsite GPS Coordinates</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                12.9279° N, 77.6848° E (Bellandur)
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-medium">Auto-calibrated with nearest micro-fulfillment dark hub</p>
          </div>
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=12.9279,77.6848"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-all"
        >
          <Compass size={14} className="text-[#062B32]" />
          <span>Open Live GPS on Google Maps</span>
          <ExternalLink size={12} className="text-[#64748B]" />
        </a>
      </div>

      {/* New Address Form Modal / Inline */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-[#062B32] p-5 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                Register New Construction Site / Warehouse
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-[#64748B] hover:text-[#0F172A] font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddNew} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-[#0F172A] block mb-1">Site / Project Facility Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Prestige Tech Cloud - Tower C Fabrication"
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] text-[#0F172A] font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-[#0F172A] block mb-1">Street Address / Gate / Unit Number</label>
                <input
                  type="text"
                  required
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  placeholder="Gate 3, Material Intake Bay, Bellandur Ring Road"
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] text-[#0F172A] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Landmark (For Dispatch Drivers)</label>
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="Opposite Ready-Mix Batching Plant"
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] text-[#0F172A] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Pincode</label>
                <input
                  type="text"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  placeholder="560103"
                  className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] text-[#0F172A] font-medium"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#475569] font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062B32] text-[#D8F43A] font-black text-xs hover:bg-[#093E48]"
                >
                  Save & Set as Active Dispatch Site
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {addresses.map((addr) => {
          const isSelected = selectedAddress.id === addr.id;
          const mapsQuery = `${addr.title} ${addr.addressLine} Bengaluru ${addr.pincode}`;
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

          return (
            <div
              key={addr.id}
              onClick={() => handleSelectAddress(addr)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white shadow-2xs flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-[#062B32] ring-2 ring-[#062B32]'
                  : 'border-[#E5E7EB] hover:border-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#062B32] text-[#D8F43A]' : 'bg-slate-100 text-[#475569]'
                    }`}>
                      {addr.type === 'home' ? <Home size={16} /> : <Building2 size={16} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#0F172A]">{addr.title}</h4>
                      <span className="text-[10px] text-[#64748B] font-medium">{addr.landmark}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-[#062B32] text-[#D8F43A]">
                      <Check size={12} strokeWidth={3} />
                      Active Site
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#475569] font-medium leading-relaxed">
                  {addr.addressLine} • PIN {addr.pincode}
                </p>
              </div>

              {/* Action Buttons & Google Maps Link */}
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <MapPin size={13} className="text-rose-500" />
                  <span>Google Maps Location</span>
                  <ExternalLink size={12} />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectAddress(addr)}
                    className="text-[11px] font-bold text-[#062B32] hover:underline"
                  >
                    {isSelected ? 'Delivering Here' : 'Deliver Here'}
                  </button>

                  {addresses.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteAddress(addr.id, e)}
                      className="p-1 text-[#94A3B8] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
