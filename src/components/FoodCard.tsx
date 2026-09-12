import React, { useState } from 'react';
import {
  Eye,
  Flame,
  Sparkles,
  Utensils,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { MenuItem } from '../types';
import { formatPrice } from '../utils/helpers';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { setSelectedItemForModal, cafeSettings } = useCafe();
  const [imageError, setImageError] = useState(false);

  const hasVariants = item.variants && item.variants.length > 0;
  const lowestPrice = hasVariants
    ? Math.min(...item.variants!.map((v) => v.price))
    : item.price;

  return (
    <div
      id={`food-card-${item.id}`}
      onClick={() => setSelectedItemForModal(item)}
      className="group bg-theme-surface border border-theme rounded-2xl overflow-hidden border-theme-hover transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelectedItemForModal(item);
        }
      }}
      aria-label={`${item.name} - ${formatPrice(lowestPrice)}`}
    >
      <div>
        {/* Food Image Container */}
        <div className="relative aspect-[16/10] sm:h-48 w-full bg-theme-subtle overflow-hidden">
          {!imageError && item.image ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-theme-subtle text-theme-muted p-4 select-none">
              <div className="w-12 h-12 rounded-full bg-theme-surface border border-theme flex items-center justify-center mb-2 shadow-xs">
                <Utensils className="w-5 h-5 text-theme-primary" />
              </div>
              <span className="text-xs font-serif font-medium text-theme-primary text-center line-clamp-1">
                {item.name}
              </span>
              <span className="text-[10px] text-theme-secondary mt-0.5 tracking-wider uppercase font-semibold">
                {cafeSettings.cafeName}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {item.isNew && (
              <span className="bg-white text-black text-[10px] px-2.5 py-0.5 rounded-sm uppercase font-black tracking-wider shadow-md">
                NEW
              </span>
            )}
            {item.isChefsSpecial && (
              <span className="bg-white text-black text-[10px] px-2 py-0.5 rounded-md uppercase font-bold tracking-tight shadow-xs flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-black" />
                <span>Chef's Special</span>
              </span>
            )}
            {item.isPopular && !item.isChefsSpecial && !item.isNew && (
              <span className="bg-neutral-800 text-white text-[10px] px-2 py-0.5 rounded-md uppercase font-bold tracking-tight border border-neutral-700 shadow-xs">
                Bestseller
              </span>
            )}
            {item.isVegetarian && (
              <span className="bg-neutral-900 text-neutral-200 text-[10px] px-2 py-0.5 rounded-md uppercase font-bold tracking-tight border border-neutral-700 shadow-xs">
                Vegetarian
              </span>
            )}
            {item.isSpicy && (
              <span className="bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded-md uppercase font-bold tracking-tight flex items-center gap-0.5 border border-neutral-700 shadow-xs">
                <Flame className="w-2.5 h-2.5 text-neutral-300" />
                <span>Spicy</span>
              </span>
            )}
          </div>

          {/* Sold Out Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px] flex items-center justify-center z-20">
              <span className="px-3.5 py-1 rounded-full bg-neutral-900 text-white text-xs font-bold tracking-wider uppercase border border-neutral-700 shadow-md">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-serif font-bold text-theme-primary text-base sm:text-lg leading-snug group-hover:text-theme-secondary transition-colors">
              {item.name}
            </h3>
            <span className="font-bold text-sm sm:text-base text-theme-primary whitespace-nowrap pt-0.5">
              {hasVariants ? `From ${formatPrice(lowestPrice)}` : `${formatPrice(item.price)}${item.priceNote || ''}`}
            </span>
          </div>

          <p className="text-xs sm:text-[13px] text-theme-secondary leading-relaxed line-clamp-2 mt-1">
            {item.description}
          </p>

          {item.note && (
            <p className="text-[11px] text-neutral-400 font-medium italic mt-1.5">
              {item.note}
            </p>
          )}

          {hasVariants && (
            <div className="mt-3 pt-2.5 border-t border-theme flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted">
                Sizes:
              </span>
              {item.variants!.map((v) => (
                <span
                  key={v.name}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-theme-subtle text-theme-secondary border border-theme"
                >
                  {v.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Action: View Details */}
      <div className="p-4 sm:p-5 pt-0">
        <button
          id={`view-details-btn-${item.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedItemForModal(item);
          }}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs bg-theme-subtle text-theme-primary border border-theme hover:bg-theme-main hover:border-theme-hover"
          aria-label={`View details for ${item.name}`}
        >
          <Eye className="w-3.5 h-3.5 text-zinc-400" />
          <span>View Details & Options</span>
        </button>
      </div>
    </div>
  );
};
