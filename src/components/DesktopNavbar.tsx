import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  ChevronDown,
  ShoppingBag,
  X,
  HardHat,
  Wrench,
  Compass,
  Store,
  Cpu,
  Nut,
  Droplets,
  Boxes,
  Palette,
  Zap,
  ShieldCheck,
  Truck,
  Settings,
  Terminal,
  Users
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface DesktopNavbarProps {
  onOpenAddressModal: () => void;
  onOpenAccount: () => void;
  onSearchClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  selectedCategory?: string;
  onSelectCategory?: (catId: string) => void;
  setActiveTab: (tab: any) => void;
}

const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Items', icon: Store },
  { id: 'services', label: 'Hire Helpers & Crew', icon: Users },
  { id: 'power-tools', label: 'Power Tools', icon: Wrench },
  { id: 'electronics-robotics', label: 'Electronics', icon: Cpu },
  { id: 'fasteners-hardware', label: 'Fasteners & Screws', icon: Nut },
  { id: 'plumbing-pvc', label: 'Plumbing & Pipes', icon: Droplets },
  { id: 'construction-cement', label: 'Cement & Materials', icon: Boxes },
  { id: 'paints-finishes', label: 'Paints & Finishes', icon: Palette },
  { id: 'electrical-wiring', label: 'Wires & MCBs', icon: Zap },
  { id: 'safety-ppe', label: 'Safety Gear', icon: ShieldCheck },
  { id: 'rent', label: 'Rent Machinery', icon: Truck },
  { id: 'print', label: 'CAD Blueprints', icon: Compass },
];

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  onOpenAddressModal,
  onOpenAccount,
  onSearchClick,
  searchQuery,
  setSearchQuery,
  activeTab,
  selectedCategory,
  onSelectCategory,
  setActiveTab,
}) => {
  const { itemCount, grandTotal, selectedAddress, setIsCartDrawerOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#062B32] border-b border-[#041E24] select-none text-[#FAFAF6] shadow-sm">
      {/* Main Quick-Commerce Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo & Jobsite Location Selector */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D8F43A] flex items-center justify-center text-[#062B32] font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none text-white">
                BUILD<span className="text-[#D8F43A]">IT</span>
              </span>
              <span className="text-[10px] font-bold text-[#D8F43A] tracking-wide mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8F43A] inline-block animate-pulse" />
                8-Min Delivery
              </span>
            </div>
          </button>

          {/* Jobsite Address Switcher */}
          <div className="hidden md:flex flex-col pl-4 border-l border-white/10">
            <span className="text-[11px] font-medium text-white/70">
              Delivering to
            </span>
            <button
              onClick={onOpenAddressModal}
              className="flex items-center gap-1 text-sm font-bold text-white hover:text-[#D8F43A] transition-colors max-w-[210px] text-left"
            >
              <MapPin size={14} className="text-[#D8F43A] flex-shrink-0" />
              <span className="truncate">{selectedAddress.title}</span>
              <ChevronDown size={14} className="text-white/60 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Large Instamart-Style Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <div
            onClick={onSearchClick}
            className="flex items-center gap-3 bg-[#093E48] rounded-xl px-4 py-3 border border-white/10 focus-within:border-[#D8F43A] focus-within:bg-[#0A4753] transition-all hover:bg-[#0A4753] cursor-pointer shadow-inner"
          >
            <Search size={18} className="text-[#D8F43A] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search "Drill", "ESP32", "PVC Pipe", "Cement", "Drywall Screws"...'
              className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                }}
                className="p-1 text-white/70 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation Actions & Cart */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Quick Hire Crew / Helper Button */}
          <button
            onClick={() => setActiveTab('services')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-[#D8F43A] text-[#062B32]'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Users size={14} className={activeTab === 'services' ? 'text-[#062B32]' : 'text-[#D8F43A]'} />
            <span>Hire Crew</span>
          </button>

          {/* Quick Machinery Rent Button */}
          <button
            onClick={() => setActiveTab('rent')}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rent'
                ? 'bg-[#D8F43A] text-[#062B32]'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Wrench size={14} />
            <span>Rentals</span>
          </button>

          {/* Quick Settings Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#D8F43A] text-[#062B32]'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
            title="Account Settings, Terms of Service, Orders & Addresses"
          >
            <Settings size={15} className={activeTab === 'settings' ? 'text-[#062B32]' : 'text-[#D8F43A]'} />
            <span className="hidden md:inline">Settings</span>
          </button>

          {/* Quick Contractor Account */}
          <button
            onClick={onOpenAccount}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold transition-all ${
              activeTab === 'account'
                ? 'bg-[#D8F43A] text-[#062B32]'
                : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            <HardHat size={14} className={activeTab === 'account' ? 'text-[#062B32]' : 'text-[#D8F43A]'} />
            <span className="hidden lg:inline">Account</span>
          </button>

          {/* High-Impact Neon Lime Shopping Cart CTA */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 bg-[#D8F43A] hover:bg-[#cbe633] text-[#062B32] px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm tracking-tight shadow-md transition-all ml-1"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag size={18} strokeWidth={2.5} />
              {itemCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#062B32] text-[#D8F43A] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-[#D8F43A]">
                  {itemCount}
                </span>
              )}
            </div>
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="bg-[#062B32]/15 px-2 py-0.5 rounded-md text-xs font-black">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Quick Category Navigation Bar (Lucide SVG Icons) */}
      <div className="bg-[#042026] border-t border-white/10 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto hide-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {QUICK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isCatActive =
              (cat.id === 'all' && activeTab === 'home') ||
              (cat.id === 'services' && activeTab === 'services') ||
              (cat.id === 'rent' && activeTab === 'rent') ||
              (cat.id === 'print' && activeTab === 'print') ||
              (activeTab === 'categories' && (selectedCategory === cat.id || (selectedCategory === 'all' && cat.id === 'all'))) ||
              (activeTab === cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'all') {
                    setActiveTab('home');
                  } else if (cat.id === 'services') {
                    setActiveTab('services');
                  } else if (cat.id === 'rent') {
                    setActiveTab('rent');
                  } else if (cat.id === 'print') {
                    setActiveTab('print');
                  } else {
                    if (onSelectCategory) {
                      onSelectCategory(cat.id);
                    } else {
                      setActiveTab(cat.id);
                    }
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isCatActive
                    ? 'bg-[#D8F43A] text-[#062B32] shadow-xs font-black'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={14} className={isCatActive ? 'text-[#062B32]' : 'text-[#D8F43A]'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
