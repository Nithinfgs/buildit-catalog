import React from 'react';
import { motion } from 'framer-motion';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-card rounded-2xl p-3.5 border border-stroke shadow-crisp flex flex-col justify-between">
      <div>
        {/* Shimmer Image Area */}
        <div className="w-full aspect-square rounded-xl skeleton-box mb-3" />

        {/* Shimmer Unit Pill */}
        <div className="w-20 h-4 rounded-md skeleton-box mb-2" />

        {/* Shimmer Title Lines */}
        <div className="w-full h-4 rounded-md skeleton-box mb-1.5" />
        <div className="w-2/3 h-4 rounded-md skeleton-box mb-2" />
      </div>

      {/* Price and Add button area */}
      <div className="mt-3 pt-2.5 border-t border-stroke flex items-center justify-between">
        <div className="w-14 h-5 rounded-md skeleton-box" />
        <div className="w-16 h-8 rounded-xl skeleton-box" />
      </div>
    </div>
  );
};

export const CategoryNavSkeleton: React.FC = () => {
  return (
    <div className="py-2 flex items-center gap-3 overflow-hidden">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl min-w-[100px] md:min-w-[114px] bg-surface-card border border-stroke shadow-crisp">
          <div className="w-12 h-12 rounded-xl skeleton-box mb-1.5" />
          <div className="w-16 h-3 rounded-md skeleton-box" />
        </div>
      ))}
    </div>
  );
};

export const BannerSliderSkeleton: React.FC = () => {
  return (
    <div className="w-full h-48 sm:h-64 rounded-3xl skeleton-box border border-stroke shadow-crisp" />
  );
};

export const HomeScreenSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <BannerSliderSkeleton />
      <CategoryNavSkeleton />

      {/* Grid 1 Skeleton */}
      <div className="bg-surface-card rounded-3xl p-6 sm:p-7 border border-stroke shadow-crisp space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="w-48 h-6 rounded-lg skeleton-box" />
            <div className="w-64 h-4 rounded-md skeleton-box" />
          </div>
          <div className="w-24 h-4 rounded-md skeleton-box" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <ProductCardSkeleton key={n} />
          ))}
        </div>
      </div>

      {/* Grid 2 Skeleton */}
      <div className="bg-surface-card rounded-3xl p-6 sm:p-7 border border-stroke shadow-crisp space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="w-48 h-6 rounded-lg skeleton-box" />
            <div className="w-64 h-4 rounded-md skeleton-box" />
          </div>
          <div className="w-24 h-4 rounded-md skeleton-box" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <ProductCardSkeleton key={n} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
