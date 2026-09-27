import React from 'react';
import { ShoppingBag, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useSound } from '../context/SoundContext';

export const FloatingCartBar: React.FC = () => {
  const { items, itemCount, grandTotal, setIsCartDrawerOpen } = useCart();
  const { playClick } = useSound();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-14 left-0 right-0 max-w-[420px] mx-auto px-3.5 z-30 pointer-events-none">
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={() => {
            playClick();
            setIsCartDrawerOpen(true);
          }}
          className="pointer-events-auto bg-brand text-white rounded-2xl p-3 shadow-cart-float flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform border border-white/20"
        >
          {/* Left info */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={18} className="text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-black tracking-tight leading-none">
                {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'} • ₹{grandTotal}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-brand-light mt-1 font-semibold">
                <Clock size={10} />
                <span>Delivery in 8 mins</span>
              </div>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl font-bold text-xs tracking-wide">
            <span>View Cart</span>
            <ChevronRight size={15} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
