import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useSound } from '../context/SoundContext';
import { getCategoryIcon } from './CategoryIcons';

interface CategoryBrowserScreenProps {
  onSelectProduct: (product: Product) => void;
  initialCategoryId?: string;
}

export const CategoryBrowserScreen: React.FC<CategoryBrowserScreenProps> = ({
  onSelectProduct,
  initialCategoryId = 'power-tools'
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState(
    initialCategoryId === 'all' ? 'power-tools' : initialCategoryId
  );
  const { playClick } = useSound();

  // Sync state when initialCategoryId changes from props (e.g. top bar clicks)
  React.useEffect(() => {
    if (initialCategoryId && initialCategoryId !== 'all') {
      setActiveCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[1] || { id: activeCategoryId, name: activeCategoryId.replace(/-/g, ' ').toUpperCase(), icon: activeCategoryId };

  const categoryProducts = PRODUCTS.filter(
    (p) => p.category === activeCategoryId || activeCategoryId === 'all'
  );

  return (
    <div className="flex-1 flex overflow-hidden bg-surface-card select-none">
      {/* Left Sidebar Category List */}
      <div className="w-32 bg-surface-page border-r border-stroke overflow-y-auto hide-scrollbar flex flex-col py-3">
        {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playClick();
                setActiveCategoryId(cat.id);
              }}
              className={`py-3 px-2 flex flex-col items-center text-center transition-all relative ${
                isActive ? 'bg-surface-card font-black text-navy' : 'text-content-secondary hover:bg-surface-secondary'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r" />
              )}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-transform ${
                  isActive
                    ? 'scale-105 shadow-crisp bg-primary text-white border border-primary-secondary'
                    : 'bg-surface-secondary text-primary border border-stroke'
                }`}
              >
                {getCategoryIcon(cat.id, "w-5 h-5")}
              </div>
              <span className="text-[10px] leading-tight line-clamp-2 font-bold">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Right Product Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-surface-secondary/40 hide-scrollbar">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-crisp">
              {getCategoryIcon(activeCategory.id, "w-5 h-5")}
            </div>
            <div>
              <h2 className="text-sm font-black text-navy uppercase tracking-wider">
                {activeCategory.name}
              </h2>
              <span className="text-[11px] text-content-secondary font-semibold">
                {categoryProducts.length} site-ready materials available
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

