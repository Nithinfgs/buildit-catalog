import React from 'react';
import { MapPin, ChevronDown, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSound } from '../context/SoundContext';

interface HeaderProps {
  onOpenAddressModal: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddressModal, onOpenAccount }) => {
  const { selectedAddress } = useCart();
  const { playClick } = useSound();

  return (
    <header className="bg-brand px-4 pt-2 pb-3 sticky top-0 z-20 shadow-sm text-white">
      <div className="flex items-center justify-between gap-2">
        {/* Left Side: Delivery Speed & Location */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-extrabold text-[15px] tracking-tight text-white">
              Blinkit in <span className="text-brand-light font-black underline decoration-white/40">8 minutes</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>

          <button
            onClick={() => {
              playClick();
              onOpenAddressModal();
            }}
            className="flex items-center gap-1 text-xs text-white/90 font-medium group hover:opacity-80 transition-opacity text-left max-w-full"
          >
            <MapPin size={12} className="text-white flex-shrink-0" />
            <span className="truncate font-semibold max-w-[200px]">
              {selectedAddress.title} - {selectedAddress.addressLine}
            </span>
            <ChevronDown size={13} className="text-white/80 group-hover:translate-y-0.5 transition-transform flex-shrink-0" />
          </button>
        </div>

        {/* Right Side: Profile Icon */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              playClick();
              onOpenAccount();
            }}
            className="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-colors shadow-sm active:scale-95"
            title="Profile & Orders"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
