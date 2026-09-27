import React, { useState } from 'react';
import { Plus, Minus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails, index = 0 }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentVariant = product.variants && product.variants.length > 0
    ? product.variants[selectedVariantIndex]
    : null;

  const currentUnit = currentVariant ? currentVariant.unit : product.unit;
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentOriginalPrice = currentVariant ? currentVariant.originalPrice : product.originalPrice;

  const quantity = getItemQuantity(product.id, currentUnit);

  const discountPercent = currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const manufacturer = product.manufacturer ?? product.brand ?? 'Genuine OEM';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.15) }}
      className="bg-white rounded-2xl p-3 border border-[#E5E7EB] hover:border-[#062B32]/30 transition-all flex flex-col justify-between relative group select-none shadow-xs hover:shadow-md"
    >
      {/* Product Image Box */}
      <div
        className="relative w-full aspect-square rounded-xl bg-[#F8F9FA] overflow-hidden mb-3 cursor-pointer flex items-center justify-center border border-black/5"
        onClick={() => onOpenDetails?.(product)}
      >
        {/* Placeholder shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#E5E7EB] animate-pulse" />
        )}

        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
          }}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-90'
          }`}
          loading="lazy"
        />

        {/* 8-Min Delivery Badge */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-[#062B32] px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1 shadow-2xs border border-black/5">
          <Zap size={11} className="text-[#062B32] fill-[#D8F43A]" />
          <span>{product.etaMinutes ?? product.deliveryTimeMins ?? 8} MINS</span>
        </div>

        {/* Discount Ribbon */}
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-[#D8F43A] text-[#062B32] px-2 py-0.5 rounded-md text-[10px] font-black shadow-2xs">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Product Metadata & Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand Name */}
          <span className="text-[11px] font-bold text-[#64748B] block mb-0.5 truncate">
            {manufacturer}
          </span>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetails?.(product)}
            className="text-xs sm:text-sm font-bold text-[#1E293B] leading-snug line-clamp-2 hover:text-[#062B32] transition-colors cursor-pointer mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Unit / Pack Specification */}
          {product.variants && product.variants.length > 1 ? (
            <select
              value={selectedVariantIndex}
              onChange={(e) => {
                e.stopPropagation();
                setSelectedVariantIndex(Number(e.target.value));
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-xs font-semibold text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg px-2 py-1 mb-2 outline-none border border-transparent transition-colors cursor-pointer"
            >
              {product.variants.map((v, idx) => (
                <option key={v.unit} value={idx}>
                  {v.unit} — ₹{v.price}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md inline-block mb-2">
              {currentUnit}
            </span>
          )}
        </div>

        {/* Price & Add to Cart CTA */}
        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-[#0F172A]">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {currentOriginalPrice > currentPrice && (
              <span className="text-[11px] text-[#94A3B8] line-through font-medium">
                ₹{currentOriginalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Big Prominent + ADD Button */}
          {quantity === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, currentUnit, currentPrice);
              }}
              className="px-4 py-2 rounded-xl bg-[#062B32] hover:bg-[#083842] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1 active:ring-2 active:ring-[#D8F43A]"
            >
              <Plus size={13} strokeWidth={3} />
              <span>ADD</span>
            </motion.button>
          ) : (
            <div className="flex items-center bg-[#062B32] text-white rounded-xl px-1.5 py-1 shadow-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(product.id, currentUnit);
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                title="Decrease"
              >
                <Minus size={13} strokeWidth={3} />
              </button>

              <span className="px-2 text-xs font-black text-[#D8F43A]">
                {quantity}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, currentUnit, currentPrice);
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                title="Increase"
              >
                <Plus size={13} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
