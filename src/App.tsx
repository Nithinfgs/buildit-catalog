import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundProvider } from './context/SoundContext';
import { CartProvider } from './context/CartContext';
import { DesktopNavbar } from './components/DesktopNavbar';
import { DesktopFooter } from './components/DesktopFooter';
import { BannerSlider } from './components/BannerSlider';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CategoryBrowserScreen } from './components/CategoryBrowserScreen';
import { ToolRentScreen } from './components/ToolRentScreen';
import { PrintStoreScreen } from './components/PrintStoreScreen';
import { ReorderScreen } from './components/ReorderScreen';
import { AccountScreen } from './components/AccountScreen';
import { AddressModal } from './components/AddressModal';
import { SearchBar } from './components/SearchBar';
import { HomeScreenSkeleton } from './components/SkeletonLoader';
import { SettingsScreen } from './components/SettingsScreen';
import { TermsOfServiceModal } from './components/TermsOfServiceModal';
import { CustomerServiceModal } from './components/CustomerServiceModal';
import { OrderHistoryScreen } from './components/OrderHistoryScreen';
import { AddressManager } from './components/AddressManager';
import { DevAdminPortal } from './components/DevAdminPortal';
import { HireHelpersScreen } from './components/HireHelpersScreen';
import { PRODUCTS } from './data/catalog';
import { Product } from './types';
import { ChevronRight, Zap, ShieldCheck, RotateCcw, FileText, ArrowLeft, Flame, Wrench, Cpu, Nut, Droplets, Palette, Users } from 'lucide-react';

export type NavTab = 'home' | 'categories' | 'rent' | 'print' | 'reorder' | 'account' | 'settings' | 'terms' | 'orders' | 'support' | 'addresses' | 'admin' | 'services';

interface NavState {
  tab: NavTab;
  category: string;
}

function BuildItWebApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation History Stack for Back Slide Navigation
  const [navHistory, setNavHistory] = useState<NavState[]>([
    { tab: 'home', category: 'all' }
  ]);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');

  const navigateTo = (tab: NavTab | string, category = 'all') => {
    setSlideDirection('forward');
    const knownTabs: NavTab[] = ['home', 'categories', 'rent', 'print', 'reorder', 'account', 'settings', 'terms', 'orders', 'support', 'addresses', 'admin', 'services'];
    
    if (knownTabs.includes(tab as NavTab)) {
      setSelectedCategory(category);
      setActiveTab(tab as NavTab);
      setNavHistory((prev) => [...prev, { tab: tab as NavTab, category }]);
      try {
        window.history.pushState({ tab, category }, '');
      } catch {}
    } else {
      // It's a category id passed as tab
      setSelectedCategory(tab);
      setActiveTab('categories');
      setNavHistory((prev) => [...prev, { tab: 'categories', category: tab }]);
      try {
        window.history.pushState({ tab: 'categories', category: tab }, '');
      } catch {}
    }
  };

  const goBack = () => {
    if (navHistory.length > 1) {
      setSlideDirection('backward');
      const updatedHistory = [...navHistory];
      updatedHistory.pop();
      const previous = updatedHistory[updatedHistory.length - 1];
      setNavHistory(updatedHistory);
      setSelectedCategory(previous.category || 'all');
      setActiveTab(previous.tab);
    } else {
      setSlideDirection('backward');
      setSelectedCategory('all');
      setActiveTab('home');
    }
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setSlideDirection('backward');
        setActiveTab(e.state.tab);
        setSelectedCategory(e.state.category || 'all');
      } else {
        goBack();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navHistory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Filtered collections for quick-commerce rails
  const popularNearYou = PRODUCTS.filter((p) => 
    ['pt-1', 'el-1', 'fas-1', 'plumb-1', 'mat-1', 'elec-1', 'pnt-apex-ult-20l', 'safe-1'].includes(p.id) ||
    p.rating >= 4.8
  ).slice(0, 8);

  const powerTools = PRODUCTS.filter((p) => p.category === 'power-tools');
  const electronics = PRODUCTS.filter((p) => p.category === 'electronics-robotics' || p.category === 'lithium-batteries');
  const fasteners = PRODUCTS.filter((p) => p.category === 'fasteners-hardware');
  const plumbing = PRODUCTS.filter((p) => p.category === 'plumbing-pvc');
  const paints = PRODUCTS.filter((p) => p.category === 'paints-finishes' || p.category === 'painting-supplies');
  const electricals = PRODUCTS.filter((p) => p.category === 'electrical-wiring');
  const materials = PRODUCTS.filter((p) => p.category === 'construction-cement' || p.category === 'adhesives-sealants');

  const handleSelectBannerCategory = (category: string) => {
    if (category === 'print') {
      navigateTo('print');
    } else if (category === 'rent') {
      navigateTo('rent');
    } else if (category === 'services') {
      navigateTo('services');
    } else {
      navigateTo('categories', category);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] flex flex-col font-sans selection:bg-[#062B32] selection:text-[#D8F43A]">
      {/* Top Desktop Website Navbar */}
      <DesktopNavbar
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        onOpenAccount={() => navigateTo('account')}
        onSearchClick={() => setIsSearchOverlayOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => navigateTo('categories', catId)}
        setActiveTab={(tab) => navigateTo(tab)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <AnimatePresence mode="wait">
            {isLoading ? (
              <HomeScreenSkeleton key="skeleton" />
            ) : (
              <motion.div
                key="home-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Hero Showcase Banner */}
                <BannerSlider onSelectCategory={handleSelectBannerCategory} />

                {/* Shop by Category (Instamart Visual Scroll) */}
                <CategoryNav
                  selectedCategory={selectedCategory}
                  onSelectCategory={(id) => {
                    if (id !== 'all') {
                      navigateTo('categories', id);
                    } else {
                      setSelectedCategory('all');
                    }
                  }}
                />

                {/* Trust & Speed Value Props Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-[#E5E7EB] shadow-2xs text-xs font-semibold text-[#334155]">
                  <div className="flex items-center gap-2.5 px-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Zap size={16} className="fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">8-Min Site Delivery</p>
                      <p className="text-[11px] text-[#64748B]">Instant van dispatch</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">100% Genuine OEM</p>
                      <p className="text-[11px] text-[#64748B]">Direct from top brands</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                      <RotateCcw size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">Instant Replacement</p>
                      <p className="text-[11px] text-[#64748B]">Hassle-free site return</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">GST Ready Invoices</p>
                      <p className="text-[11px] text-[#64748B]">1-Click download</p>
                    </div>
                  </div>
                </div>

                {/* Section 1: Popular Near Your Jobsite */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <span className="p-1 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Flame size={18} className="fill-amber-500 text-amber-500" />
                        </span>
                        <span>Popular Near Your Jobsite</span>
                      </h3>
                      <p className="text-xs text-[#64748B]">Frequently ordered by active contractors and makers right now</p>
                    </div>
                    <button
                      onClick={() => navigateTo('categories', 'all')}
                      className="text-xs font-bold text-[#062B32] hover:underline flex items-center gap-0.5"
                    >
                      <span>See all items</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
                    {popularNearYou.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        index={idx}
                        product={product}
                        onOpenDetails={(p) => setSelectedProductForModal(p)}
                      />
                    ))}
                  </div>
                </section>

                {/* Section 2: Power Tools & Machinery */}
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <span className="p-1 rounded-md bg-teal-50 text-[#062B32] flex items-center justify-center">
                          <Wrench size={18} />
                        </span>
                        <span>Power Tools & Heavy Machinery</span>
                      </h3>
                      <p className="text-xs text-[#64748B]">Bosch, DeWalt, Stanley drills, grinders & chop saws</p>
                    </div>
                    <button
                      onClick={() => navigateTo('categories', 'power-tools')}
                      className="text-xs font-bold text-[#062B32] hover:underline flex items-center gap-0.5"
                    >
                      <span>See all {powerTools.length}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
                    {powerTools.slice(0, 4).map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        index={idx}
                        product={product}
                        onOpenDetails={(p) => setSelectedProductForModal(p)}
                      />
                    ))}
                  </div>
                </section>

                {/* Section 3: Electronics & Robotics Prototyping */}
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <span className="p-1 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Cpu size={18} />
                        </span>
                        <span>Electronics, Robotics & Li-Ion Cells</span>
                      </h3>
                      <p className="text-xs text-[#64748B]">ESP32, Arduino, Samsung 18650 cells, N20 motors & BMS boards</p>
                    </div>
                    <button
                      onClick={() => navigateTo('categories', 'electronics-robotics')}
                      className="text-xs font-bold text-[#062B32] hover:underline flex items-center gap-0.5"
                    >
                      <span>See all {electronics.length}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
                    {electronics.slice(0, 4).map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        index={idx}
                        product={product}
                        onOpenDetails={(p) => setSelectedProductForModal(p)}
                      />
                    ))}
                  </div>
                </section>

                {/* Section 4: Fasteners & Screws */}
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <span className="p-1 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                          <Nut size={18} />
                        </span>
                        <span>Fasteners, Screws & Hardware</span>
                      </h3>
                      <p className="text-xs text-[#64748B]">SS304 hex bolts, black drywall screws & expansion anchor sets</p>
                    </div>
                    <button
                      onClick={() => navigateTo('categories', 'fasteners-hardware')}
                      className="text-xs font-bold text-[#062B32] hover:underline flex items-center gap-0.5"
                    >
                      <span>See all {fasteners.length}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
                    {fasteners.slice(0, 4).map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        index={idx}
                        product={product}
                        onOpenDetails={(p) => setSelectedProductForModal(p)}
                      />
                    ))}
                  </div>
                </section>

                {/* Section 5: Plumbing & PVC Pipes */}
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <span className="p-1 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center">
                          <Droplets size={18} />
                        </span>
                        <span>Plumbing & PVC Pipes</span>
                      </h3>
                      <p className="text-xs text-[#64748B]">Astral UPVC pipes, CPVC brass elbows, ball valves & solvent cement</p>
                    </div>
                    <button
                      onClick={() => navigateTo('categories', 'plumbing-pvc')}
                      className="text-xs font-bold text-[#062B32] hover:underline flex items-center gap-0.5"
                    >
                      <span>See all {plumbing.length}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
                    {plumbing.slice(0, 4).map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        index={idx}
                        product={product}
                        onOpenDetails={(p) => setSelectedProductForModal(p)}
                      />
                    ))}
                  </div>
                </section>

                {/* Section 6: Paints & Wall Coatings */}
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                        <span className="p-1 rounded-md bg-pink-50 text-pink-600 flex items-center justify-center">
                          <Palette size={18} />
                        </span>
                        <span>Paints, Primers & Wall Coatings</span>
                      </h3>
                      <p className="text-xs text-[#64748B]">Asian Paints Apex, Tractor Emulsion, Birla White Putty & rollers</p>
                    </div>
                    <button
                      onClick={() => navigateTo('categories', 'paints-finishes')}
                      className="text-xs font-bold text-[#062B32] hover:underline flex items-center gap-0.5"
                    >
                      <span>See all {paints.length}</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5">
                    {paints.slice(0, 4).map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        index={idx}
                        product={product}
                        onOpenDetails={(p) => setSelectedProductForModal(p)}
                      />
                    ))}
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* CATEGORIES BROWSER VIEW (With Slide-Back Gesture) */}
        {activeTab === 'categories' && (
          <motion.div
            key="categories-view"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.7 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 350) {
                goBack();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#0F172A] font-bold text-xs hover:border-[#062B32] transition-all shadow-2xs"
              >
                <ArrowLeft size={15} className="text-[#062B32]" />
                <span>Back to Home</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden min-h-[700px] shadow-xs">
              <CategoryBrowserScreen
                key={selectedCategory}
                initialCategoryId={selectedCategory}
                onSelectProduct={(prod) => setSelectedProductForModal(prod)}
              />
            </div>
          </motion.div>
        )}

        {/* TOOL RENT VIEW */}
        {activeTab === 'rent' && (
          <motion.div
            key="rent-view"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.7 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 350) {
                goBack();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#0F172A] font-bold text-xs hover:border-[#062B32] transition-all shadow-2xs"
              >
                <ArrowLeft size={15} className="text-[#062B32]" />
                <span>Back to Home</span>
              </button>
            </div>

            <ToolRentScreen />
          </motion.div>
        )}

        {/* HIRE HELPERS & PRO CREW VIEW */}
        {activeTab === 'services' && (
          <motion.div
            key="services-view"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.7 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 350) {
                goBack();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#0F172A] font-bold text-xs hover:border-[#062B32] transition-all shadow-2xs"
              >
                <ArrowLeft size={15} className="text-[#062B32]" />
                <span>Back to Home</span>
              </button>
            </div>

            <HireHelpersScreen onBackToHome={goBack} />
          </motion.div>
        )}

        {/* PRINT STORE VIEW */}
        {activeTab === 'print' && (
          <motion.div
            key="print-view"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.7 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 350) {
                goBack();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#0F172A] font-bold text-xs hover:border-[#062B32] transition-all shadow-2xs"
              >
                <ArrowLeft size={15} className="text-[#062B32]" />
                <span>Back to Home</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden p-5 sm:p-7 shadow-xs">
              <PrintStoreScreen />
            </div>
          </motion.div>
        )}

        {/* REORDER VIEW */}
        {activeTab === 'reorder' && (
          <motion.div
            key="reorder-view"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.7 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 350) {
                goBack();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 max-w-5xl mx-auto"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#0F172A] font-bold text-xs hover:border-[#062B32] transition-all shadow-2xs"
              >
                <ArrowLeft size={15} className="text-[#062B32]" />
                <span>Back to Home</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden p-5 sm:p-7 shadow-xs">
              <ReorderScreen
                onSelectProduct={(prod) => setSelectedProductForModal(prod)}
              />
            </div>
          </motion.div>
        )}

        {/* ACCOUNT VIEW */}
        {activeTab === 'account' && (
          <motion.div
            key="account-view"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.7 }}
            onDragEnd={(_e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 350) {
                goBack();
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#0F172A] font-bold text-xs hover:border-[#062B32] transition-all shadow-2xs"
              >
                <ArrowLeft size={15} className="text-[#062B32]" />
                <span>Back to Home</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden p-5 sm:p-7 shadow-xs">
              <AccountScreen
                onBackToHome={() => goBack()}
                onOpenAddressModal={() => setIsAddressModalOpen(true)}
                onNavigateTo={(screen) => navigateTo(screen as any)}
              />
            </div>
          </motion.div>
        )}

        {/* SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <motion.div
            key="settings-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <SettingsScreen
              onBackToHome={goBack}
              onNavigateTo={(screen) => navigateTo(screen as any)}
            />
          </motion.div>
        )}

        {/* TERMS OF SERVICE VIEW */}
        {activeTab === 'terms' && (
          <motion.div
            key="terms-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <TermsOfServiceModal onBack={goBack} />
          </motion.div>
        )}

        {/* ORDER HISTORY VIEW */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <OrderHistoryScreen onBackToHome={goBack} />
          </motion.div>
        )}

        {/* 24x7 CUSTOMER SERVICE & SUPPORT VIEW */}
        {activeTab === 'support' && (
          <motion.div
            key="support-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <CustomerServiceModal onBack={goBack} />
          </motion.div>
        )}

        {/* ADDRESSES & GOOGLE MAPS VIEW */}
        {activeTab === 'addresses' && (
          <motion.div
            key="addresses-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <AddressManager onBackToHome={goBack} />
          </motion.div>
        )}

        {/* DEV ADMIN PORTAL VIEW */}
        {activeTab === 'admin' && (
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <DevAdminPortal onBackToStorefront={() => navigateTo('home')} />
          </motion.div>
        )}
      </main>

      {/* Full Website Desktop Footer */}
      <DesktopFooter />

      {/* Slide-In Cart Drawer */}
      <CartDrawer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      {/* Address Switcher Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      {/* Search Overlay Modal */}
      {isSearchOverlayOpen && (
        <SearchBar
          initialQuery={searchQuery}
          onClose={() => setIsSearchOverlayOpen(false)}
          onSelectProduct={(prod) => {
            setIsSearchOverlayOpen(false);
            setSelectedProductForModal(prod);
          }}
        />
      )}

      {/* Live Order Delivery Tracking Modal */}
      <OrderTrackingModal />
    </div>
  );
}

export default function App() {
  return (
    <SoundProvider>
      <CartProvider>
        <BuildItWebApp />
      </CartProvider>
    </SoundProvider>
  );
}
