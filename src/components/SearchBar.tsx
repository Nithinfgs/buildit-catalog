import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Mic,
  X,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Store,
  Wrench,
  Cpu,
  BatteryCharging,
  Nut,
  Droplets,
  Boxes,
  Palette,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, TRENDING_SEARCHES } from '../data/catalog';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface SearchBarProps {
  onSelectProduct: (product: Product) => void;
  initialQuery?: string;
  onClose?: () => void;
}

const PLACEHOLDER_ITEMS = [
  'Search "Bosch rotary drill"',
  'Search "ESP32 WiFi Bluetooth board"',
  'Search "Samsung 18650 battery cell"',
  'Search "M3 Stainless Steel Hex Bolt Kit"',
  'Search "Astral 1 inch UPVC Pipe"',
  'Search "UltraTech cement 50kg bag"',
  'Search "Asian Paints Apex Exterior"',
  'Search "Dr. Fixit waterproofing"'
];

const SEARCH_CATEGORIES = [
  { id: 'all', label: 'All Items', icon: Store },
  { id: 'power-tools', label: 'Power Tools', icon: Wrench },
  { id: 'electronics-robotics', label: 'Electronics', icon: Cpu },
  { id: 'lithium-batteries', label: 'Batteries', icon: BatteryCharging },
  { id: 'fasteners-hardware', label: 'Fasteners', icon: Nut },
  { id: 'plumbing-pvc', label: 'Plumbing', icon: Droplets },
  { id: 'construction-cement', label: 'Cement & Materials', icon: Boxes },
  { id: 'paints-finishes', label: 'Paints', icon: Palette },
  { id: 'safety-ppe', label: 'Safety Gear', icon: ShieldCheck },
  { id: 'electrical-wiring', label: 'Electricals', icon: Zap }
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectProduct, initialQuery = '', onClose }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_ITEMS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Autofocus input
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products based on search query, SKU, brand, and category filter
  const searchResults = PRODUCTS.filter((p) => {
    const matchesCategory =
      activeCategoryFilter === 'all' || p.category === activeCategoryFilter;

    if (!matchesCategory) return false;

    if (!query.trim()) {
      return activeCategoryFilter !== 'all';
    }

    const q = query.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory?.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.manufacturer?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setQuery('18650 Battery Pack');
    }, 1400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.05, right: 0.7 }}
          onDragEnd={(_e, info) => {
            if (info.offset.x > 80 || info.velocity.x > 350) {
              handleClose();
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col overflow-hidden select-none"
        >
          {/* Top Search Input Header */}
          <div className="bg-[#062B32] px-4 sm:px-6 py-4 border-b border-[#041E24] text-white shadow-md">
            <div className="max-w-6xl mx-auto flex items-center gap-3">
              <button
                onClick={handleClose}
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                title="Close Search (Esc)"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex-1 flex items-center bg-[#093E48] rounded-xl px-4 py-3 border border-white/15 focus-within:border-[#D8F43A] focus-within:bg-[#0A4753] transition-all">
                <Search size={18} className="text-[#D8F43A] mr-2.5 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={PLACEHOLDER_ITEMS[placeholderIndex]}
                  className="w-full bg-transparent text-sm font-medium text-white placeholder-white/60 outline-none"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-1 text-white/70 hover:text-white mr-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                onClick={handleVoiceSearch}
                className={`p-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isListening
                    ? 'bg-[#D8F43A] text-[#062B32] animate-pulse font-black'
                    : 'text-white hover:bg-white/10 bg-white/5 border border-white/10'
                }`}
                title="Voice Search"
              >
                <Mic size={16} />
              </button>
            </div>

            {/* Category Quick Filter Chips */}
            <div className="max-w-6xl mx-auto mt-3 overflow-x-auto hide-scrollbar flex items-center gap-2 pt-1 pb-0.5">
              {SEARCH_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-[#D8F43A] text-[#062B32] font-black shadow-xs'
                        : 'bg-white/10 text-white/90 hover:bg-white/15'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-[#062B32]' : 'text-[#D8F43A]'} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 hide-scrollbar">
            {isListening && (
              <div className="max-w-6xl mx-auto p-4 mb-4 rounded-xl bg-[#062B32]/10 border border-[#062B32]/20 text-[#062B32] text-xs font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8F43A] inline-block animate-ping"></span>
                <span>Listening... Speak what you need (e.g. &quot;Bosch drill&quot; or &quot;Samsung 18650 cells&quot;)</span>
              </div>
            )}

            {/* No Query & 'All' Category: Show Trending Searches */}
            {!query.trim() && activeCategoryFilter === 'all' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0F172A] uppercase tracking-wider mb-3">
                    <TrendingUp size={15} className="text-[#062B32]" />
                    <span>Popular Searches Near You</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="px-3 py-1.5 bg-white border border-[#E2E8F0] hover:border-[#062B32] rounded-xl text-xs font-bold text-[#1E293B] hover:bg-[#F8FAFC] transition-colors shadow-2xs"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0F172A] uppercase tracking-wider mb-3">
                    <Sparkles size={15} className="text-[#062B32]" />
                    <span>Explore by Department</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[
                      { title: 'Power Tools & Machines', desc: 'Bosch, DeWalt, Stanley', query: 'drill', icon: Wrench, color: 'text-amber-600 bg-amber-50' },
                      { title: 'Electronics & Robotics', desc: 'ESP32, Arduino, motors', query: 'ESP32', icon: Cpu, color: 'text-sky-600 bg-sky-50' },
                      { title: 'Li-Ion Battery Packs', desc: 'Samsung 18650 & BMS', query: '18650', icon: BatteryCharging, color: 'text-green-600 bg-green-50' },
                      { title: 'Fasteners & Screws', desc: 'SS304 bolts, drywall screws', query: 'screw', icon: Nut, color: 'text-zinc-700 bg-zinc-100' },
                      { title: 'Plumbing & Pipes', desc: 'Astral UPVC & CPVC lines', query: 'pipe', icon: Droplets, color: 'text-cyan-600 bg-cyan-50' },
                      { title: 'Paints & Finishes', desc: 'Asian Paints Apex & Putty', query: 'paint', icon: Palette, color: 'text-purple-600 bg-purple-50' },
                      { title: 'Cement & Materials', desc: 'UltraTech 53 & Dr Fixit', query: 'cement', icon: Boxes, color: 'text-orange-600 bg-orange-50' },
                      { title: 'Site Safety Gear', desc: '3M Helmets & Goggles', query: 'helmet', icon: ShieldCheck, color: 'text-yellow-600 bg-yellow-50' },
                    ].map((cat) => {
                      const CatIcon = cat.icon;
                      return (
                        <button
                          key={cat.title}
                          onClick={() => setQuery(cat.query)}
                          className="p-3.5 bg-white border border-[#E2E8F0] hover:border-[#062B32] rounded-2xl text-left transition-all hover:shadow-sm flex items-start gap-3"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                            <CatIcon size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0F172A]">{cat.title}</p>
                            <p className="text-[11px] text-[#64748B] mt-0.5">{cat.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results Display */}
            {(query.trim() || activeCategoryFilter !== 'all') && (
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#64748B]">
                    Showing {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'}
                    {query.trim() && ` matching "${query}"`}
                  </span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#64748B] flex items-center justify-center mx-auto mb-3 border border-[#E2E8F0]">
                      <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A]">No products found</h3>
                    <p className="text-xs text-[#64748B] mt-1 max-w-xs mx-auto">
                      Try searching for &quot;drill&quot;, &quot;battery&quot;, &quot;ESP32&quot;, &quot;paint&quot;, or &quot;pipe&quot;.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 pb-16">
                    {searchResults.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onOpenDetails={(p) => {
                          handleClose();
                          onSelectProduct(p);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
