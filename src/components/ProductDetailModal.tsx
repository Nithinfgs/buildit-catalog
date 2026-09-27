import React, { useState } from 'react';
import { X, Zap, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const currentVariant = product.variants && product.variants.length > 0
    ? product.variants[selectedVariantIdx]
    : null;

  const currentUnit = currentVariant ? currentVariant.unit : product.unit;
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentOriginalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;

  const quantity = getItemQuantity(product.id, currentUnit);
  const discountPercent = currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const manufacturer = product.manufacturer ?? product.brand ?? 'Genuine OEM';

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.1, right: 0.8 }}
          onDragEnd={(_e, info) => {
            if (info.offset.x > 75 || info.velocity.x > 350) {
              onClose();
            }
          }}
          initial={{ y: 30, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-lg max-h-[88vh] bg-white rounded-3xl overflow-hidden flex flex-col z-10 shadow-2xl border border-[#E2E8F0]"
        >
          {/* Top Header Bar */}
          <div className="px-5 py-3.5 border-b border-[#F1F5F9] flex items-center justify-between bg-white sticky top-0 z-20">
            <span className="text-xs font-bold text-[#062B32] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
              {manufacturer}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors border border-[#E2E8F0]"
                title="Share Item"
              >
                <Share2 size={16} />
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-xl bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors border border-[#E2E8F0]"
              >
                <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors border border-[#E2E8F0]"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {copiedLink && (
            <div className="bg-[#062B32] text-[#D8F43A] text-xs font-bold py-1.5 px-4 text-center">
              Item link copied to clipboard!
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 hide-scrollbar bg-white">
            {/* Product Image Stage */}
            <div className="relative w-full aspect-square rounded-2xl bg-[#F8F9FA] overflow-hidden flex items-center justify-center border border-[#E2E8F0]">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#062B32] px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 shadow-sm border border-black/5">
                <Zap size={13} className="text-[#062B32] fill-[#D8F43A]" />
                <span>Delivery in {product.etaMinutes ?? product.deliveryTimeMins ?? 8} mins</span>
              </div>

              {discountPercent > 0 && (
                <div className="absolute top-3 right-3 bg-[#D8F43A] text-[#062B32] px-2.5 py-1 rounded-lg text-xs font-black shadow-sm">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-[#FEF3C7] text-amber-900 px-2 py-0.5 rounded-md text-xs font-bold">
                  <span>{product.rating}</span>
                  <Star size={11} className="fill-amber-500 text-amber-500" />
                </div>
                <span className="text-xs text-[#64748B]">
                  ({product.ratingCount.toLocaleString()} verified ratings)
                </span>
              </div>
            </div>

            {/* Variant / Pack Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-2">
                  Select Pack / Size
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={variant.unit}
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedVariantIdx === idx
                          ? 'border-[#062B32] bg-[#062B32]/5 text-[#062B32] ring-1 ring-[#062B32]'
                          : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B]'
                      }`}
                    >
                      <p className="text-xs font-bold">{variant.unit}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-extrabold">₹{variant.price.toLocaleString('en-IN')}</span>
                        {variant.originalPrice > variant.price && (
                          <span className="text-xs text-[#94A3B8] line-through">₹{variant.originalPrice}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Specs */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] space-y-2 text-xs">
              <h3 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                Product Details
              </h3>
              <p className="text-[#64748B] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#475569] py-1">
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center gap-1">
                <ShieldCheck size={18} className="text-[#062B32]" />
                <span className="font-bold text-[11px] text-[#0F172A]">100% Genuine</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center gap-1">
                <Truck size={18} className="text-[#062B32]" />
                <span className="font-bold text-[11px] text-[#0F172A]">8-Min Delivery</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center gap-1">
                <RotateCcw size={18} className="text-[#062B32]" />
                <span className="font-bold text-[11px] text-[#0F172A]">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="p-4 sm:p-5 border-t border-[#F1F5F9] bg-white flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#64748B] block font-medium">Price for {currentUnit}</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#0F172A]">₹{currentPrice.toLocaleString('en-IN')}</span>
                {currentOriginalPrice > currentPrice && (
                  <span className="text-xs text-[#94A3B8] line-through font-semibold">₹{currentOriginalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>

            {quantity === 0 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product, currentUnit, currentPrice)}
                className="px-6 py-3.5 rounded-xl bg-[#062B32] hover:bg-[#083842] text-white text-xs font-black transition-colors uppercase tracking-wider flex-1 max-w-[200px] text-center shadow-md active:ring-2 active:ring-[#D8F43A]"
              >
                Add to Cart
              </motion.button>
            ) : (
              <div className="flex items-center bg-[#062B32] text-white rounded-xl px-2 py-1.5 shadow-md">
                <button
                  onClick={() => removeFromCart(product.id, currentUnit)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg"
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="px-3 text-xs font-black text-[#D8F43A]">{quantity} in cart</span>
                <button
                  onClick={() => addToCart(product, currentUnit, currentPrice)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
