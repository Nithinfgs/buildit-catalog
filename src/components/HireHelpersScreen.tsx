import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Droplets,
  HardHat,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  Check,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRO_SERVICES, SERVICE_CATEGORIES, ProService } from '../data/proServices';
import { ServiceBookingModal } from './ServiceBookingModal';
import { useSound } from '../context/SoundContext';

interface HireHelpersScreenProps {
  onBackToHome?: () => void;
}

export const HireHelpersScreen: React.FC<HireHelpersScreenProps> = () => {
  const { playClick } = useSound();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ProService | null>(null);

  const filteredServices = PRO_SERVICES.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062B32] via-[#093E48] to-[#041E24] text-white p-6 sm:p-8 border border-[#041E24] shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8F43A]/20 text-[#D8F43A] text-xs font-black border border-[#D8F43A]/30">
            <Sparkles size={13} />
            <span>On-Demand Verified Site Crew • Urban Company Style</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Hire Certified Electricians, Plumbers, Tile Masons & Site Helpers
          </h1>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
            Background verified, tool-equipped technicians arriving at your construction site or lab in <strong className="text-[#D8F43A]">15–20 minutes</strong>. Transparent hourly or daily shift rates with ₹10 Lakh on-site damage insurance.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-white/90">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
              <ShieldCheck size={14} className="text-[#D8F43A]" />
              100% Police & Skill Verified
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
              <Zap size={14} className="text-[#D8F43A]" />
              15-Min Express Site Arrival
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
              <CheckCircle2 size={14} className="text-[#D8F43A]" />
              ₹10 Lakh Insurance Covered
            </span>
          </div>
        </div>

        {/* Decorative Watermark Icon */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden lg:block">
          <HardHat size={220} className="text-white" />
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#062B32] text-[#D8F43A] shadow-xs font-black'
                    : 'bg-white border border-[#E5E7EB] text-[#475569] hover:border-slate-400'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs flex-1 max-w-xs shadow-2xs">
          <Search size={15} className="text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plumber, electrician, tiling..."
            className="w-full bg-transparent outline-none text-[#0F172A] font-medium"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image & Quick Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#062B32]/90 backdrop-blur-xs text-[#D8F43A] text-[10px] font-black border border-[#D8F43A]/30 flex items-center gap-1">
                    <Zap size={11} className="fill-[#D8F43A]" />
                    {service.etaMinutes}-Min Arrival
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#0F172A] text-[10px] font-black flex items-center gap-1 shadow-xs">
                    <Star size={11} className="fill-amber-400 text-amber-500" />
                    {service.rating} ({service.reviewsCount})
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-[#D8F43A] uppercase tracking-wider block">
                    {service.trade}
                  </span>
                  <h3 className="text-base font-black text-white leading-tight">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-[#475569] font-medium leading-relaxed">
                  {service.description}
                </p>

                {/* Verified Perks Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {service.verifiedBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100 flex items-center gap-1"
                    >
                      <Check size={11} className="text-emerald-600" />
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Key Skills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-[#64748B] uppercase tracking-wider block">
                    Core Skills & Tools Equipped
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.skills.slice(0, 3).map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">
                      +{service.skills.length - 3} more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Booking Footer */}
            <div className="p-5 pt-3 bg-slate-50/70 border-t border-[#F1F5F9] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64748B] font-bold block uppercase">Starting Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[#062B32]">
                    ₹{service.hourlyRate}
                  </span>
                  <span className="text-[11px] text-[#64748B] font-medium">/hr • ₹{service.fullDayRate}/day</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playClick();
                  setSelectedServiceForBooking(service);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#062B32] hover:bg-[#093E48] text-[#D8F43A] font-black text-xs transition-all shadow-xs flex items-center gap-1.5 group-hover:scale-102"
              >
                <span>Hire Professional</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <ShieldCheck size={22} />
          </div>
          <h4 className="text-xs font-black text-[#0F172A]">Aadhaar & Police Verified</h4>
          <p className="text-[11px] text-[#64748B] font-medium leading-relaxed">
            Every technician passes rigorous ID verification, criminal background check, and trade skill tests.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <Award size={22} />
          </div>
          <h4 className="text-xs font-black text-[#0F172A]">₹10 Lakh Damage Insurance</h4>
          <p className="text-[11px] text-[#64748B] font-medium leading-relaxed">
            Full comprehensive accidental damage protection for your construction site, materials, and property.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <Clock size={22} />
          </div>
          <h4 className="text-xs font-black text-[#0F172A]">15-Min Express Site Dispatch</h4>
          <p className="text-[11px] text-[#64748B] font-medium leading-relaxed">
            Emergency technician dispatched from our hyper-local micro-hubs with calibrated OEM power tools.
          </p>
        </div>
      </div>

      {/* Service Booking Modal */}
      <ServiceBookingModal
        service={selectedServiceForBooking}
        onClose={() => setSelectedServiceForBooking(null)}
      />
    </div>
  );
};
