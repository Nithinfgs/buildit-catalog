import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Wrench, Sparkles, Truck } from 'lucide-react';

interface BannerSliderProps {
  onSelectCategory: (categoryId: string) => void;
}

const HERO_SLIDES = [
  {
    id: 'hero-1',
    badgeText: 'Delivered to your jobsite in 10 mins',
    badgeIcon: Zap,
    title: 'Everything your project needs, right now.',
    subtitle: 'Genuine power tools, electronics, raw cement, PVC pipes & fasteners delivered straight to your gate.',
    cta: 'Shop site essentials',
    category: 'power-tools',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-[#062B32] via-[#093E48] to-[#0D4D5A]'
  },
  {
    id: 'hero-2',
    badgeText: 'R&D Lab & Robotics Dispatch',
    badgeIcon: Sparkles,
    title: 'ESP32, Sensors & High-Drain 18650 Cells',
    subtitle: 'Microcontrollers, 3S/4S BMS battery packs, N20 gear motors and jumper kits ready for instant testing.',
    cta: 'Browse electronics',
    category: 'electronics-robotics',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-[#0A2F35] via-[#0E424B] to-[#125560]'
  },
  {
    id: 'hero-3',
    badgeText: 'Heavy Equipment Lease',
    badgeIcon: Truck,
    title: 'Rent Demolition Breakers & Core Drills',
    subtitle: 'Heavy machinery delivered to your site on flexible daily or weekly rentals with 100% refundable deposits.',
    cta: 'View rental machinery',
    category: 'rent',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-[#05262D] via-[#083842] to-[#0B4A57]'
  }
];

export const BannerSlider: React.FC<BannerSliderProps> = ({ onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentIndex];
  const BadgeIcon = slide.badgeIcon;

  return (
    <div className="select-none py-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Instamart-Style Hero Showcase (8 Cols) */}
        <div className="lg:col-span-8 relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-black/5 bg-[#062B32]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => onSelectCategory(slide.category)}
              className={`w-full h-full bg-gradient-to-r ${slide.bgGradient} p-6 sm:p-9 flex items-center justify-between cursor-pointer relative overflow-hidden text-white`}
            >
              {/* Background ambient lighting */}
              <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full bg-[#D8F43A]/15 blur-3xl pointer-events-none" />

              {/* Text content */}
              <div className="z-10 max-w-[60%] flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8F43A] text-[#062B32] text-xs font-black self-start mb-3 shadow-xs">
                  <BadgeIcon size={13} className="text-[#062B32]" />
                  <span>{slide.badgeText}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2 tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-5 font-normal leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Big Action CTA */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 bg-[#D8F43A] hover:bg-[#cbe633] text-[#062B32] px-5 py-3 rounded-xl text-xs font-black shadow-md self-start uppercase tracking-wider transition-colors"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight size={15} strokeWidth={2.5} />
                </motion.div>
              </div>

              {/* Product Visual Showcase Image */}
              <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 flex-shrink-0 flex items-center justify-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-2xl shadow-xl border-2 border-white/20 hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-8 flex items-center gap-1.5 z-20">
            {HERO_SLIDES.map((_, idx: number) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-200 rounded-full ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-[#D8F43A]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Quick Bento Cards (4 Cols) */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
          {/* Bento Card 1: Electronics & Fast Delivery */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory('electronics-robotics')}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D7DDD8] hover:border-[#062B32] transition-all cursor-pointer flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="text-[10px] font-black text-[#062B32] bg-[#D8F43A]/40 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 w-fit">
                <Zap size={11} />
                <span>8-Min Dispatch</span>
              </span>
              <h4 className="text-base font-bold text-[#102326] mt-1.5 group-hover:text-[#062B32] transition-colors leading-tight">
                Robotics & Power Cells
              </h4>
              <p className="text-xs text-[#66736F] mt-0.5 font-medium">ESP32, 18650 cells & drivers</p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-[#F4F3ED] overflow-hidden border border-[#D7DDD8] flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=200&q=80"
                alt="Electronics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          </motion.div>

          {/* Bento Card 2: Machinery Rentals */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory('rent')}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D7DDD8] hover:border-[#062B32] transition-all cursor-pointer flex items-center justify-between group shadow-xs"
          >
            <div>
              <span className="text-[10px] font-black text-[#062B32] bg-[#D8F43A]/40 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 w-fit">
                <Truck size={11} />
                <span>Daily Rental</span>
              </span>
              <h4 className="text-base font-bold text-[#102326] mt-1.5 group-hover:text-[#062B32] transition-colors leading-tight">
                Rent Machinery
              </h4>
              <p className="text-xs text-[#66736F] mt-0.5 font-medium">Demolition drills & welders</p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-[#062B32] text-[#D8F43A] flex-shrink-0 flex items-center justify-center border border-white/10 shadow-xs">
              <Wrench size={24} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
