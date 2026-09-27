import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  Calendar,
  Users,
  Wrench,
  CheckCircle2,
  Zap,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProService } from '../data/proServices';
import { useCart } from '../context/CartContext';
import { useSound } from '../context/SoundContext';

interface ServiceBookingModalProps {
  service: ProService | null;
  onClose: () => void;
  onBookingSuccess?: (bookingId: string) => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ service, onClose, onBookingSuccess }) => {
  const { selectedAddress } = useCart();
  const { playClick, playSuccess } = useSound();

  const [shiftDuration, setShiftDuration] = useState<'hourly' | 'halfDay' | 'fullDay'>('hourly');
  const [crewCount, setCrewCount] = useState<number>(1);
  const [timing, setTiming] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState('Tomorrow 09:00 AM');
  const [includeTools, setIncludeTools] = useState<boolean>(true);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!service) return null;

  let baseRate = service.hourlyRate * 2; // min 2 hours
  if (shiftDuration === 'halfDay') baseRate = service.halfDayRate;
  if (shiftDuration === 'fullDay') baseRate = service.fullDayRate;

  const toolFee = includeTools ? 150 : 0;
  const grandTotal = (baseRate + toolFee) * crewCount;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccess();
    const generatedId = `PRO-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingId(generatedId);
    setIsBooked(true);
    if (onBookingSuccess) onBookingSuccess(generatedId);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    selectedAddress.title + ' ' + selectedAddress.addressLine
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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

        {/* Modal Window */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden z-10 shadow-2xl border border-[#E5E7EB] max-h-[90vh] flex flex-col select-none"
        >
          {/* Header */}
          <div className="bg-[#062B32] text-white p-5 flex items-center justify-between border-b border-[#041E24]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D8F43A] text-[#062B32] flex items-center justify-center font-black">
                <Wrench size={20} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black tracking-tight">{service.title}</h3>
                <div className="flex items-center gap-2 text-xs text-white/80 mt-0.5 font-medium">
                  <span className="flex items-center gap-1 text-[#D8F43A] font-bold">
                    <Star size={13} className="fill-[#D8F43A]" />
                    {service.rating} ({service.reviewsCount} jobs)
                  </span>
                  <span>•</span>
                  <span>⚡ {service.etaMinutes}-Min Arrival</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 hide-scrollbar">
            {isBooked ? (
              /* Success Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">Professional Crew Dispatched!</h3>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1 font-medium">
                    Booking ID: <strong className="font-mono text-[#062B32]">#{bookingId}</strong>. Your certified {service.trade} specialist is en route with verified tools.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-[#E5E7EB] text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Assigned Specialist:</span>
                    <strong className="text-[#0F172A]">M. Kumar (Lead Verified Wireman)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">ETA at Jobsite:</span>
                    <strong className="text-emerald-600 font-black">12-15 Mins (Dispatched)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Destination:</span>
                    <span className="font-medium text-[#0F172A] truncate max-w-[200px]">{selectedAddress.title}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-2">
                    <span className="text-[#64748B]">Total Booking Amount:</span>
                    <strong className="text-sm font-black text-[#062B32]">₹{grandTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClick();
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#062B32] hover:bg-[#093E48] text-[#D8F43A] font-black text-xs transition-all shadow-sm"
                >
                  Done • Back to Store
                </button>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                {/* 1. Shift Duration Selector */}
                <div>
                  <label className="font-black text-[#0F172A] uppercase tracking-wider block mb-2">
                    Select Shift / Work Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setShiftDuration('hourly');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        shiftDuration === 'hourly'
                          ? 'border-[#062B32] bg-[#062B32]/5 ring-2 ring-[#062B32]'
                          : 'border-[#E5E7EB] hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-black text-[#0F172A] block">2 Hours Shift</span>
                      <span className="text-[10px] text-[#64748B] block">Quick fix / repairs</span>
                      <span className="text-xs font-black text-[#062B32] mt-1 block">
                        ₹{(service.hourlyRate * 2).toLocaleString('en-IN')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setShiftDuration('halfDay');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        shiftDuration === 'halfDay'
                          ? 'border-[#062B32] bg-[#062B32]/5 ring-2 ring-[#062B32]'
                          : 'border-[#E5E7EB] hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-black text-[#0F172A] block">4 Hours (Half Day)</span>
                      <span className="text-[10px] text-[#64748B] block">Installation / layout</span>
                      <span className="text-xs font-black text-[#062B32] mt-1 block">
                        ₹{service.halfDayRate.toLocaleString('en-IN')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setShiftDuration('fullDay');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        shiftDuration === 'fullDay'
                          ? 'border-[#062B32] bg-[#062B32]/5 ring-2 ring-[#062B32]'
                          : 'border-[#E5E7EB] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#0F172A]">8 Hours (Full Day)</span>
                        <span className="text-[9px] font-black bg-[#D8F43A] text-[#062B32] px-1.5 py-0.2 rounded">Save 20%</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] block">Full site project shift</span>
                      <span className="text-xs font-black text-[#062B32] mt-1 block">
                        ₹{service.fullDayRate.toLocaleString('en-IN')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Number of Crew Members Stepper */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0F172A] block">Number of Professionals / Crew</span>
                    <span className="text-[11px] text-[#64748B]">Scale team for larger site volume</span>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white border border-[#E5E7EB] px-2 py-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setCrewCount(Math.max(1, crewCount - 1));
                      }}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-black text-[#0F172A] flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="font-black text-xs text-[#0F172A] w-5 text-center">{crewCount}</span>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setCrewCount(Math.min(10, crewCount + 1));
                      }}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-black text-[#0F172A] flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 3. Arrival Timing */}
                <div>
                  <label className="font-black text-[#0F172A] uppercase tracking-wider block mb-2">
                    Dispatch Timing
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setTiming('instant');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        timing === 'instant'
                          ? 'border-[#062B32] bg-[#062B32]/5 ring-2 ring-[#062B32]'
                          : 'border-[#E5E7EB] hover:border-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                        <Zap size={16} />
                      </div>
                      <div>
                        <span className="font-bold text-[#0F172A] block">Instant 15-Min Dispatch</span>
                        <span className="text-[10px] text-[#64748B]">Immediate van & technician route</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setTiming('scheduled');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        timing === 'scheduled'
                          ? 'border-[#062B32] bg-[#062B32]/5 ring-2 ring-[#062B32]'
                          : 'border-[#E5E7EB] hover:border-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <span className="font-bold text-[#0F172A] block">Schedule Next Shift</span>
                        <span className="text-[10px] text-[#64748B]">Tomorrow at 09:00 AM</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Equipment Addon & Insurance */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-[#E5E7EB] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench size={16} className="text-[#062B32]" />
                      <span className="font-bold text-[#0F172A]">Professional OEM Tool Kit Included</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeTools}
                      onChange={(e) => setIncludeTools(e.target.checked)}
                      className="w-4 h-4 accent-[#062B32] rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] font-medium pl-6">
                    {service.toolsEquipped.join(', ')}
                  </p>
                </div>

                {/* 5. Destination & Google Maps */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-rose-500 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-[#0F172A] block">{selectedAddress.title}</span>
                      <span className="text-[11px] text-[#64748B] truncate max-w-xs block">{selectedAddress.addressLine}</span>
                    </div>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Google Maps</span>
                    <ExternalLink size={10} />
                  </a>
                </div>

                {/* 6. Special Instructions */}
                <div>
                  <label className="font-bold text-[#0F172A] block mb-1">
                    Jobsite Gate Instructions / Scope Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Tower 4 basement DB room, ladder required on site..."
                    className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 border border-[#E5E7EB] outline-none focus:border-[#062B32] text-xs font-medium"
                  />
                </div>

                {/* Trust Guarantee Pill */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-[11px] text-emerald-900 font-medium">
                  <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{service.insuranceCover}</span>
                </div>

                {/* Bottom CTA Bar */}
                <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB]">
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Total Service Fee (Incl. GST)</span>
                    <span className="text-base font-black text-[#062B32]">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#062B32] hover:bg-[#093E48] text-[#D8F43A] font-black text-xs transition-all shadow-md active:scale-95"
                  >
                    Confirm & Dispatch Professional Crew →
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
