import React, { useState } from 'react';
import { X, Plus, Minus, Heart, MapPin, Tag, Check, ArrowRight, BellOff, DoorClosed, PhoneOff, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useSound } from '../context/SoundContext';

const INSTRUCTION_OPTIONS = [
  { id: 'nobell', label: "Don't ring bell", icon: <BellOff size={15} /> },
  { id: 'guard', label: 'Leave at security gate', icon: <DoorClosed size={15} /> },
  { id: 'nocall', label: 'Avoid calling on site', icon: <PhoneOff size={15} /> },
  { id: 'pet', label: 'Call on gate arrival', icon: <Shield size={15} /> }
];

const TIP_OPTIONS = [20, 50, 100, 200];

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    itemTotal,
    originalTotal,
    totalSavings,
    deliveryFee,
    handlingFee,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    tipAmount,
    setTipAmount,
    isDonationChecked,
    setIsDonationChecked,
    deliveryInstructions,
    toggleInstruction,
    grandTotal,
    selectedAddress,
    addToCart,
    removeFromCart,
    placeOrder,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  const { playClick, playSuccess } = useSound();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = () => {
    playClick();
    setCouponError(null);
    setCouponSuccess(null);

    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === 'BUILDIT50' || couponCode.toUpperCase() === 'FIRST' || couponCode.toUpperCase() === 'PRO') {
      const discount = 150;
      setAppliedDiscount(discount);
      setCouponSuccess('Contractor coupon applied! ₹150 OFF saved.');
      playSuccess();
    } else if (couponCode.toUpperCase() === 'FREEDEL') {
      setAppliedDiscount(deliveryFee);
      setCouponSuccess('Free jobsite delivery coupon applied!');
      playSuccess();
    } else {
      setCouponError('Invalid coupon code. Try "BUILDIT50"');
    }
  };

  const finalPayable = Math.max(0, grandTotal - appliedDiscount);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      placeOrder();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playClick();
            setIsCartDrawerOpen(false);
          }}
          className="absolute inset-0 bg-navy/80 backdrop-blur-xs"
        />

        {/* Sliding Right Sheet with Slide-Back Drag Gesture */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.05, right: 0.7 }}
          onDragEnd={(_e, info) => {
            if (info.offset.x > 80 || info.velocity.x > 350) {
              setIsCartDrawerOpen(false);
            }
          }}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-md h-[90vh] sm:h-full bg-surface-page rounded-t-3xl sm:rounded-none sm:rounded-l-3xl overflow-hidden flex flex-col z-10 shadow-2xl border-l border-stroke"
        >
          {/* Top Header */}
          <div className="px-5 py-4 bg-surface-card border-b border-stroke flex items-center justify-between sticky top-0 z-20">
            <div>
              <h2 className="text-base font-black text-navy">
                Site Requisition Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h2>
              <p className="text-xs text-primary font-bold mt-0.5">
                Dispatching in 10 mins to {selectedAddress.title}
              </p>
            </div>

            <button
              onClick={() => {
                playClick();
                setIsCartDrawerOpen(false);
              }}
              className="p-2 rounded-xl bg-surface-secondary text-content-secondary hover:text-navy transition-colors border border-stroke"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 hide-scrollbar">
            {/* Free Delivery Goal Banner */}
            {amountNeededForFreeDelivery > 0 ? (
              <div className="bg-surface-card border border-stroke rounded-2xl p-4 shadow-crisp">
                <div className="flex items-center justify-between text-xs font-bold text-navy mb-2">
                  <span>Add ₹{amountNeededForFreeDelivery} more for FREE Site Delivery</span>
                  <span className="text-primary font-black">₹{itemTotal}/₹{freeDeliveryThreshold}</span>
                </div>
                <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (itemTotal / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3 flex items-center gap-2 text-primary text-xs font-bold">
                <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>You unlocked FREE jobsite express delivery!</span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke divide-y divide-stroke shadow-crisp">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedUnit}`} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-stroke flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-navy truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-xs text-content-secondary font-medium block mt-0.5">
                      {item.selectedUnit || item.product.unit}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-navy tabular-nums mt-1 block">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-primary text-white rounded-xl px-1.5 py-1 shadow-2xs border border-primary-secondary">
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedUnit)}
                      className="w-6 h-6 flex items-center justify-center hover:opacity-80 active:scale-90"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="px-2 text-xs font-black tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.product, item.selectedUnit, item.price)}
                      className="w-6 h-6 flex items-center justify-center hover:opacity-80 active:scale-90"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke space-y-2.5 shadow-crisp">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-primary" />
                <span className="text-xs font-bold text-navy">Contractor Coupons & GST Discounts</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (e.g. BUILDIT50)"
                  className="flex-1 bg-surface-secondary rounded-xl px-3 py-2 text-xs font-medium text-navy outline-none uppercase placeholder:normal-case border border-stroke"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-navy text-lime font-black text-xs hover:bg-navy-dark transition-colors border border-navy"
                >
                  Apply
                </button>
              </div>

              {couponSuccess && (
                <p className="text-xs font-bold text-primary flex items-center gap-1">
                  <Check size={14} /> {couponSuccess}
                </p>
              )}
              {couponError && (
                <p className="text-xs font-bold text-red-600">
                  {couponError}
                </p>
              )}
            </div>

            {/* Delivery Instructions */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke shadow-crisp">
              <span className="text-xs font-bold text-navy block mb-2.5">
                Site Delivery Instructions
              </span>
              <div className="grid grid-cols-2 gap-2">
                {INSTRUCTION_OPTIONS.map((opt) => {
                  const isSelected = deliveryInstructions.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        playClick();
                        toggleInstruction(opt.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                          : 'border-stroke bg-surface-secondary text-navy hover:bg-neutral-100'
                      }`}
                    >
                      <span className="text-primary">{opt.icon}</span>
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tip Delivery Partner */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke space-y-2.5 shadow-crisp">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Heart size={16} className="text-primary fill-primary/20" />
                  <span className="text-xs font-bold text-navy">Tip Heavy-Duty Fleet Partner</span>
                </div>
                <span className="text-[11px] text-content-secondary font-medium">100% goes to driver</span>
              </div>

              <div className="flex items-center gap-2">
                {TIP_OPTIONS.map((tip) => {
                  const isSelected = tipAmount === tip;
                  return (
                    <button
                      key={tip}
                      onClick={() => {
                        playClick();
                        setTipAmount(isSelected ? 0 : tip);
                      }}
                      className={`flex-1 py-2 rounded-xl border text-xs font-black transition-all ${
                        isSelected
                          ? 'border-navy bg-navy text-lime'
                          : 'border-stroke bg-surface-secondary text-navy hover:bg-neutral-100'
                      }`}
                    >
                      ₹{tip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke space-y-2.5 text-xs shadow-crisp">
              <span className="font-extrabold text-navy uppercase tracking-wider text-[11px] block">
                Requisition Bill Details
              </span>

              <div className="flex justify-between text-content-secondary">
                <span>Items Total (Excl. Tax)</span>
                <span className="font-bold text-navy">₹{itemTotal}</span>
              </div>

              <div className="flex justify-between text-content-secondary">
                <span>Jobsite Express Delivery Fee</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-primary' : 'text-navy'}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between text-content-secondary">
                <span>Warehouse Handling & Staging</span>
                <span className="font-bold text-navy">₹{handlingFee}</span>
              </div>

              {tipAmount > 0 && (
                <div className="flex justify-between text-content-secondary">
                  <span>Driver Tip</span>
                  <span className="font-bold text-navy">₹{tipAmount}</span>
                </div>
              )}

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-primary font-bold">
                  <span>Contractor Discount</span>
                  <span>-₹{appliedDiscount}</span>
                </div>
              )}

              {/* Feeding India / Skill Development Donation */}
              <label className="flex items-center justify-between pt-2 border-t border-stroke cursor-pointer text-content-secondary">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isDonationChecked}
                    onChange={(e) => {
                      playClick();
                      setIsDonationChecked(e.target.checked);
                    }}
                    className="accent-primary rounded"
                  />
                  <span className="text-xs font-medium text-navy">Support Construction Worker Welfare (₹1)</span>
                </div>
                <span className="font-semibold text-navy">{isDonationChecked ? '₹1' : '₹0'}</span>
              </label>

              <div className="pt-2 border-t border-stroke flex justify-between items-center font-black text-sm text-navy">
                <span>Total Payable (incl. GST)</span>
                <span className="text-lg text-primary tabular-nums">₹{finalPayable}</span>
              </div>

              {totalSavings > 0 && (
                <div className="bg-primary/10 text-primary font-black text-xs p-2.5 rounded-xl text-center border border-primary/20">
                  You saved ₹{totalSavings + appliedDiscount} on wholesale contractor rates!
                </div>
              )}
            </div>

            {/* Delivery Address Preview */}
            <div className="bg-surface-card rounded-2xl p-4 border border-stroke flex items-center justify-between shadow-crisp">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-surface-secondary border border-stroke flex items-center justify-center text-navy flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-navy block">Delivering to {selectedAddress.title}</span>
                  <span className="text-[11px] text-content-secondary truncate block">{selectedAddress.addressLine}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Checkout Button Bar */}
          <div className="p-5 bg-surface-card border-t border-stroke flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-content-secondary font-medium">Total Amount</span>
              <span className="text-xl font-black text-navy tabular-nums">₹{finalPayable}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={isProcessing}
              onClick={handleCheckout}
              className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-hero transition-all ${
                isProcessing
                  ? 'bg-neutral-400 text-white'
                  : 'bg-lime hover:bg-lime-hover text-navy border border-navy/20 shadow-lime-glow'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-navy border-t-transparent animate-spin" />
                  <span>Dispatching to Site...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Order • 10 Mins</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

