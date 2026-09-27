import React, { useState } from 'react';
import { X, Calendar, Clock, ShieldCheck, UserCheck, CheckCircle2, Zap, ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RentalTool } from '../types';
import { useCart } from '../context/CartContext';

interface RentalBookingModalProps {
  tool: RentalTool | null;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

const PRESET_DURATIONS = [1, 2, 3, 7, 14, 30];

export const RentalBookingModal: React.FC<RentalBookingModalProps> = ({ tool, onClose, onBookingSuccess }) => {
  const { selectedAddress } = useCart();
  const [durationDays, setDurationDays] = useState<number>(tool?.minDays || 1);
  const [hasOperator, setHasOperator] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState('10-Minute Express Dispatch');
  const [isBooked, setIsBooked] = useState(false);

  if (!tool) return null;

  // Calculate rental pricing
  const isWeekly = durationDays >= 7;
  const effectiveDailyRate = isWeekly
    ? Math.round((tool.weeklyRate / 7) * 0.95)
    : tool.dailyRate;

  const rentalSubtotal = effectiveDailyRate * durationDays;
  const operatorFee = hasOperator ? 350 * durationDays : 0;
  const refundableDeposit = tool.securityDeposit;
  const grandTotal = rentalSubtotal + operatorFee + refundableDeposit;

  const handleConfirmRental = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      if (onBookingSuccess) onBookingSuccess();
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#061F2B]/80 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.1, right: 0.8 }}
          onDragEnd={(_e, info) => {
            if (info.offset.x > 80 || info.velocity.x > 350) {
              onClose();
            }
          }}
          initial={{ x: 60, opacity: 0, scale: 0.96 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 120, opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-xl max-h-[90vh] bg-surface-card rounded-3xl overflow-hidden flex flex-col z-10 shadow-2xl border border-stroke cursor-grab active:cursor-grabbing"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-stroke flex items-center justify-between bg-surface-card/95 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-black text-white bg-[#063B32] px-3 py-1 rounded-xl uppercase tracking-wider">
                {tool.categoryLabel}
              </span>
              <span className="text-xs font-black text-navy">{tool.brand}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-surface-secondary text-content-secondary hover:text-navy transition-colors border border-stroke"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
            {/* Success State */}
            {isBooked ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#063B32] text-lime flex items-center justify-center mx-auto shadow-lime-glow animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-lg font-black text-navy">Rental Reserved Successfully!</h3>
                <p className="text-xs text-content-secondary max-w-sm mx-auto">
                  Tool is pre-tested and queued for 10-minute dispatch to <span className="font-bold text-navy">{selectedAddress.title}</span>.
                </p>
              </div>
            ) : (
              <>
                {/* Tool Brief */}
                <div className="flex gap-4 items-start bg-surface-secondary/50 p-4 rounded-2xl border border-stroke">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-24 h-24 rounded-xl object-cover border border-stroke flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-navy leading-snug">{tool.name}</h3>
                    <p className="text-xs text-[#063B32] font-bold mt-1 flex items-center gap-1.5">
                      <Zap size={13} className="text-lime fill-lime" />
                      <span>{tool.powerSpecs}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-black text-navy">
                        ₹{effectiveDailyRate} <span className="text-[11px] text-content-secondary font-medium">/ day</span>
                      </span>
                      <span className="text-[11px] font-bold text-content-secondary">
                        Deposit: ₹{tool.securityDeposit} (100% Refundable)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rental Duration Stepper */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-navy uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar size={14} className="text-primary" />
                      <span>Select Rental Duration</span>
                    </label>
                    <span className="text-xs font-black text-primary">
                      {durationDays} {durationDays === 1 ? 'Day' : 'Days'} Total
                    </span>
                  </div>

                  {/* Preset Pills */}
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_DURATIONS.map((days) => (
                      <button
                        key={days}
                        onClick={() => setDurationDays(days)}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          durationDays === days
                            ? 'bg-[#063B32] text-white shadow-hero border border-[#0B4A40]'
                            : 'bg-surface-secondary text-navy hover:border-primary border border-stroke'
                        }`}
                      >
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>

                  {/* Custom Days Stepper */}
                  <div className="flex items-center justify-between p-3.5 bg-surface-card border border-stroke rounded-2xl">
                    <span className="text-xs font-bold text-navy">Custom Duration (Days)</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDurationDays((prev) => Math.max(tool.minDays || 1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-surface-secondary text-navy font-black flex items-center justify-center hover:bg-stroke"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-navy w-6 text-center">{durationDays}</span>
                      <button
                        onClick={() => setDurationDays((prev) => Math.min(60, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-surface-secondary text-navy font-black flex items-center justify-center hover:bg-stroke"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inclusions checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-navy uppercase tracking-wider block">
                    Kit Inclusions & Accessories
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tool.includes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-navy bg-surface-secondary/40 p-2.5 rounded-xl border border-stroke">
                        <CheckCircle2 size={14} className="text-[#063B32] flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operator Add-On Option */}
                <div
                  onClick={() => setHasOperator((prev) => !prev)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    hasOperator
                      ? 'bg-[#063B32]/10 border-[#063B32]'
                      : 'bg-surface-card border-stroke hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      hasOperator ? 'bg-[#063B32] text-lime' : 'bg-surface-secondary text-navy'
                    }`}>
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-navy">Certified Site Technician / Operator</h4>
                      <p className="text-[11px] text-content-secondary mt-0.5">
                        Trained specialist operates and maintains equipment on your jobsite (+₹350/day)
                      </p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    hasOperator ? 'bg-[#063B32] border-[#063B32] text-lime' : 'border-stroke'
                  }`}>
                    {hasOperator && <CheckCircle2 size={14} />}
                  </div>
                </div>

                {/* Security Deposit Note */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black">100% Refundable Security Deposit (₹{tool.securityDeposit}):</span>
                    <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                      Deposited upon dispatch and refunded immediately to your original payment method when our rider picks up and inspects the tool after your rental period.
                    </p>
                  </div>
                </div>

                {/* Cost Breakdown Summary */}
                <div className="bg-[#061F2B] text-white p-5 rounded-2xl space-y-2.5 border border-white/10">
                  <div className="flex justify-between text-xs text-[#E9ECE6]/80 font-medium">
                    <span>Tool Rental ({durationDays} days @ ₹{effectiveDailyRate}/day)</span>
                    <span className="text-white font-bold">₹{rentalSubtotal}</span>
                  </div>
                  {hasOperator && (
                    <div className="flex justify-between text-xs text-[#E9ECE6]/80 font-medium">
                      <span>Certified Operator ({durationDays} days @ ₹350/day)</span>
                      <span className="text-white font-bold">₹{operatorFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-[#E9ECE6]/80 font-medium">
                    <span className="flex items-center gap-1">
                      <span>Refundable Deposit</span>
                      <ShieldCheck size={13} className="text-lime" />
                    </span>
                    <span className="text-lime font-bold">₹{refundableDeposit}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#E9ECE6]/80 font-medium">
                    <span>Jobsite Delivery & Return Pickup</span>
                    <span className="text-lime font-black uppercase">FREE</span>
                  </div>
                  <div className="pt-2.5 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-[#E9ECE6]/60 uppercase tracking-widest block font-bold">Total Initial Due</span>
                      <span className="text-xs text-lime font-medium">(Includes ₹{refundableDeposit} refundable)</span>
                    </div>
                    <span className="text-xl font-black text-white">₹{grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer CTA */}
          {!isBooked && (
            <div className="p-4 bg-surface-card border-t border-stroke flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-content-secondary font-bold uppercase tracking-wider block">Payable Now</span>
                <span className="text-lg font-black text-navy">₹{grandTotal}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleConfirmRental}
                className="flex-1 bg-lime hover:bg-lime-hover text-navy font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-lime/20 btn-highlight"
              >
                <span>Express Reserve & 10-Min Dispatch</span>
                <ArrowRight size={16} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
