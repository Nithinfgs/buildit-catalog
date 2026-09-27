import React, { useState } from 'react';
import { X, Plus, Check, Navigation, Building2, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_ADDRESSES } from '../data/catalog';
import { Address } from '../types';
import { useCart } from '../context/CartContext';
import { useSound } from '../context/SoundContext';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  const { selectedAddress, setSelectedAddress } = useCart();
  const { playClick, playSuccess } = useSound();
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  if (!isOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAddressLine.trim()) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      type: 'other',
      title: newTitle,
      addressLine: newAddressLine,
      landmark: newLandmark || 'Near locality',
      pincode: '560103'
    };

    setAddresses([newAddr, ...addresses]);
    setSelectedAddress(newAddr);
    playSuccess();
    setIsAddingNew(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute inset-0 bg-navy/80 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-[460px] max-h-[85vh] bg-surface-card rounded-3xl overflow-hidden flex flex-col z-10 shadow-2xl border border-stroke"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-stroke flex items-center justify-between">
            <h3 className="text-sm font-black text-navy">
              {isAddingNew ? 'Add Jobsite / Warehouse Address' : 'Select Delivery Jobsite'}
            </h3>
            <button
              onClick={() => {
                playClick();
                if (isAddingNew) setIsAddingNew(false);
                else onClose();
              }}
              className="p-2 rounded-xl bg-surface-secondary text-content-secondary hover:text-navy border border-stroke"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar bg-surface-card">
            {!isAddingNew ? (
              <>
                {/* Current GPS Location Button */}
                <button
                  onClick={() => {
                    playSuccess();
                    onClose();
                  }}
                  className="w-full p-3.5 rounded-2xl bg-surface-secondary border border-stroke text-navy flex items-center gap-3 text-left hover:border-primary/40 transition-colors shadow-crisp"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-primary-secondary">
                    <Navigation size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black block">Use Live Project Site GPS Location</span>
                    <span className="text-[10px] text-content-secondary font-medium">Gate 4, Electronic City Phase 1, Bengaluru</span>
                  </div>
                </button>

                {/* Saved Addresses List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black text-navy uppercase tracking-wider block">
                    Registered Sites & Facilities
                  </span>

                  {addresses.map((addr) => {
                    const isSelected = selectedAddress.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          playClick();
                          setSelectedAddress(addr);
                          onClose();
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between shadow-crisp ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-stroke bg-surface-card hover:bg-surface-secondary'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-surface-secondary flex items-center justify-center text-primary mt-0.5 border border-stroke">
                            {addr.type === 'home' ? <Home size={15} /> : <Building2 size={15} />}
                          </div>
                          <div>
                            <span className="text-xs font-black text-navy block">{addr.title}</span>
                            <span className="text-[11px] text-content-secondary line-clamp-1 font-medium">{addr.addressLine}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add New Address Trigger */}
                <button
                  onClick={() => {
                    playClick();
                    setIsAddingNew(true);
                  }}
                  className="w-full py-3.5 rounded-2xl border-2 border-dashed border-stroke text-navy text-xs font-black flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                  <span>Add New Construction Site</span>
                </button>
              </>
            ) : (
              /* Add New Address Form */
              <form onSubmit={handleAddNew} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-navy block mb-1">Site / Project Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Site B - Embassy Tech Village"
                    className="w-full bg-surface-secondary rounded-xl px-3.5 py-2.5 border border-stroke outline-none focus:border-primary text-navy"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy block mb-1">Gate / Block / Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddressLine}
                    onChange={(e) => setNewAddressLine(e.target.value)}
                    placeholder="Gate 2, Tower 4, Outer Ring Road"
                    className="w-full bg-surface-secondary rounded-xl px-3.5 py-2.5 border border-stroke outline-none focus:border-primary text-navy"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy block mb-1">Site Landmark (Optional)</label>
                  <input
                    type="text"
                    value={newLandmark}
                    onChange={(e) => setNewLandmark(e.target.value)}
                    placeholder="Opposite Concrete Batching Plant"
                    className="w-full bg-surface-secondary rounded-xl px-3.5 py-2.5 border border-stroke outline-none focus:border-primary text-navy"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 py-3 rounded-xl bg-surface-secondary font-bold text-content-secondary hover:bg-neutral-100 border border-stroke"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-black shadow-hero border border-primary-secondary"
                  >
                    Save & Dispatch Here
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

