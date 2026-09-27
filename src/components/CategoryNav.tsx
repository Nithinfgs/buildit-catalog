import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/catalog';
import { getCategoryIcon } from './CategoryIcons';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'all': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'power-tools': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'electronics-robotics': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  'lithium-batteries': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'fasteners-hardware': { bg: 'bg-zinc-100', text: 'text-zinc-700', border: 'border-zinc-300' },
  'plumbing-pvc': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'electrical-wiring': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'construction-cement': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'adhesives-sealants': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'safety-ppe': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'paints-finishes': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'painting-supplies': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  'door-hardware': { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
  'hand-tools': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'fabrication': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'cad-blueprints': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="py-2 select-none">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-base font-black text-[#102326] tracking-tight">
          Shop by Category
        </h3>
        <span className="text-xs font-bold text-[#062B32] hover:underline cursor-pointer">
          Scroll to explore →
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
        {CATEGORIES.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          const color = CATEGORY_COLORS[cat.id] || { bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200' };

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all min-w-[95px] sm:min-w-[105px] border cursor-pointer ${
                isSelected
                  ? 'bg-[#062B32] text-white border-[#062B32] shadow-sm'
                  : 'bg-white hover:bg-neutral-50 text-[#102326] border-[#D7DDD8] shadow-2xs'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1.5 transition-transform ${
                  isSelected ? 'bg-white/10 text-[#D8F43A]' : `${color.bg} ${color.text}`
                }`}
              >
                {getCategoryIcon(cat.id, "w-6 h-6")}
              </div>
              <span className={`text-[11px] font-bold text-center leading-tight line-clamp-1 ${
                isSelected ? 'text-white' : 'text-[#102326]'
              }`}>
                {cat.name.split('&')[0].trim()}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
