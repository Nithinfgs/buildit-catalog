import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, ShieldCheck, Clock, Zap, Star, CheckCircle, ArrowRight, Truck, Sparkles, Filter } from 'lucide-react';
import { RENTAL_TOOLS, RENTAL_CATEGORIES } from '../data/rentalTools';
import { RentalTool } from '../types';
import { RentalBookingModal } from './RentalBookingModal';

export const ToolRentScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedToolForRental, setSelectedToolForRental] = useState<RentalTool | null>(null);

  const filteredTools = RENTAL_TOOLS.filter(
    (t) => activeCategory === 'all' || t.category === activeCategory
  );

  return (
    <div className="space-y-7 select-none pb-12">
      {/* Top Banner Hero */}
      <div className="bg-gradient-to-r from-[#061F2B] via-[#063B32] to-[#0B4A40] text-white rounded-3xl p-6 sm:p-8 shadow-hero relative overflow-hidden border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-lime text-navy px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 shadow-lime-glow">
            <Zap size={13} className="fill-navy" />
            <span>Heavy Machinery & Equipment Rentals</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Rent Professional Tools by the Day or Week
          </h1>

          <p className="text-xs sm:text-sm text-[#E9ECE6]/90 mt-2 font-medium leading-relaxed">
            Demolition hammers, diamond core drills, welding inverters, laser levels & scaffolding towers. Delivered to your site in <span className="text-lime font-black">10 minutes</span> with free return pickup when your project wraps up.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-5 text-xs font-bold text-[#E9ECE6]">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
              <ShieldCheck size={16} className="text-lime" />
              <span>100% Refundable Deposits</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
              <Clock size={16} className="text-lime" />
              <span>10-Min Emergency Site Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
              <Truck size={16} className="text-lime" />
              <span>Free Return Pickup Included</span>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none hidden lg:block" />
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {RENTAL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all btn-highlight ${
                isActive
                  ? 'bg-[#063B32] text-white shadow-hero border border-[#0B4A40]'
                  : 'bg-surface-card text-navy hover:bg-surface-secondary border border-stroke shadow-crisp'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Rental Tools Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="bg-surface-card rounded-3xl border border-stroke overflow-hidden shadow-crisp flex flex-col group hover:border-[#063B32]/40 transition-colors"
          >
            {/* Tool Image & Badges */}
            <div className="relative h-48 bg-surface-secondary overflow-hidden">
              <img
                src={tool.image}
                alt={tool.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-[#061F2B]/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/10">
                {tool.categoryLabel}
              </div>

              <div className="absolute top-3 right-3 bg-lime text-navy font-black text-[10px] px-2.5 py-1 rounded-lg shadow-sm">
                10-Min Dispatch
              </div>

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-navy text-[11px] font-black px-2.5 py-0.5 rounded-lg border border-stroke flex items-center gap-1 shadow-xs">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>{tool.rating} ({tool.ratingCount})</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wide">
                    {tool.brand}
                  </span>
                  <span className="text-[10px] font-bold text-[#063B32] bg-[#063B32]/10 px-2 py-0.5 rounded-md">
                    Deposit: ₹{tool.securityDeposit}
                  </span>
                </div>

                <h3 className="text-sm font-black text-navy mt-1 line-clamp-2 leading-snug">
                  {tool.name}
                </h3>

                <p className="text-xs text-[#063B32] font-bold mt-2 flex items-center gap-1.5">
                  <Zap size={13} className="text-lime fill-lime" />
                  <span>{tool.powerSpecs}</span>
                </p>

                <p className="text-xs text-content-secondary mt-2 line-clamp-2 font-medium">
                  {tool.description}
                </p>
              </div>

              {/* Pricing & Reservation CTA */}
              <div className="pt-4 border-t border-stroke flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-navy">₹{tool.dailyRate}</span>
                    <span className="text-[11px] font-semibold text-content-secondary">/ day</span>
                  </div>
                  <span className="text-[10px] font-bold text-content-secondary block">
                    ₹{tool.weeklyRate} / week (Save 20%)
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedToolForRental(tool)}
                  className="bg-[#063B32] hover:bg-[#08483d] text-lime px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm btn-highlight"
                >
                  <span>Rent Now</span>
                  <ArrowRight size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rental Booking Modal */}
      <RentalBookingModal
        tool={selectedToolForRental}
        onClose={() => setSelectedToolForRental(null)}
      />
    </div>
  );
};
