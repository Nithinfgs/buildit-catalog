import React from 'react';
import { RotateCcw } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ReorderScreenProps {
  onSelectProduct: (product: Product) => void;
}

export const ReorderScreen: React.FC<ReorderScreenProps> = ({ onSelectProduct }) => {
  const frequentProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="flex-1 overflow-y-auto space-y-5 bg-surface-page hide-scrollbar select-none pb-24">
      {/* Header */}
      <div className="bg-surface-card rounded-3xl p-5 border border-stroke shadow-crisp flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-secondary text-primary flex items-center justify-center border border-stroke">
          <RotateCcw size={22} />
        </div>
        <div>
          <h2 className="text-base font-black text-navy">Recurring Site Requisitions</h2>
          <p className="text-xs text-content-secondary font-medium">
            Fast 1-click reorder for cables, drill bits, cement & safety gear
          </p>
        </div>
      </div>

      {/* Grid of Frequent Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {frequentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenDetails={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};

