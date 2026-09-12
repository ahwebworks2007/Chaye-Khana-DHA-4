import React, { useEffect, useState } from 'react';
import {
  Flame,
  Info,
  Sparkles,
  Utensils,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCafe } from '../context/CafeContext';
import { MenuItem } from '../types';
import { formatPrice } from '../utils/helpers';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose }) => {
  const { cafeSettings } = useCafe();
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setImageError(false);
    }
  }, [item]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!item) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const hasVariants = item.variants && item.variants.length > 0;
  const lowestPrice = hasVariants
    ? Math.min(...item.variants!.map((v) => v.price))
    : item.price;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Darkened Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          id="item-details-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-item-title"
          className="relative bg-neutral-900 text-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 border border-neutral-800 my-auto max-h-[92vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-zinc-300 hover:text-white flex items-center justify-center border border-neutral-700 transition-colors shadow-sm cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto flex-1 overscroll-contain">
            {/* Large Image Header */}
            <div className="relative w-full h-64 sm:h-76 bg-black overflow-hidden">
              {!imageError && item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Placeholder */
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 text-zinc-500 p-6 select-none">
                  <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 shadow-xs">
                    <Utensils className="w-6 h-6 text-zinc-300" />
                  </div>
                  <span className="text-base font-serif font-semibold text-white text-center">
                    {item.name}
                  </span>
                  <span className="text-xs text-zinc-500 mt-1 tracking-wider uppercase font-semibold">
                    {cafeSettings.cafeName}
                  </span>
                </div>
              )}

              {/* Badges on Image */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 z-10">
                {item.isNew && (
                  <span className="bg-white text-black text-[10px] sm:text-[11px] px-2.5 py-1 rounded-sm uppercase font-black tracking-wider shadow-md">
                    NEW
                  </span>
                )}
                {item.isChefsSpecial && (
                  <span className="bg-white text-black text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md uppercase font-bold tracking-tight shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-black" />
                    <span>Chef's Special</span>
                  </span>
                )}
                {item.isPopular && !item.isChefsSpecial && !item.isNew && (
                  <span className="bg-neutral-800 text-white text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md uppercase font-bold tracking-tight shadow-xs border border-neutral-700">
                    Bestseller
                  </span>
                )}
                {item.isVegetarian && (
                  <span className="bg-neutral-900 text-neutral-200 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md uppercase font-bold tracking-tight shadow-xs border border-neutral-700">
                    Vegetarian
                  </span>
                )}
                {item.isSpicy && (
                  <span className="bg-neutral-900 text-white text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md uppercase font-bold tracking-tight shadow-xs flex items-center gap-1 border border-neutral-700">
                    <Flame className="w-3 h-3 text-neutral-300" />
                    <span>Spicy</span>
                  </span>
                )}
              </div>

              {/* Out of Stock Overlay */}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-20">
                  <span className="px-4 py-1.5 rounded-full bg-neutral-900 text-zinc-300 text-xs font-bold tracking-wider uppercase border border-neutral-700 shadow-md">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Item Title & Price */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h2
                    id="modal-item-title"
                    className="font-serif text-2xl sm:text-3xl text-white leading-tight"
                  >
                    {item.name}
                  </h2>
                  <span className="inline-block text-xs uppercase tracking-wider text-zinc-400 font-medium mt-1">
                    {item.categoryId.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="sm:text-right flex-shrink-0">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                    Price
                  </span>
                  <span className="text-2xl font-bold text-white font-mono">
                    {hasVariants ? `From ${formatPrice(lowestPrice)}` : `${formatPrice(item.price)}${item.priceNote || ''}`}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <span className="block text-xs uppercase tracking-wider font-bold text-zinc-400 mb-1.5">
                  About This Dish
                </span>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
                {item.note && (
                  <p className="text-xs text-neutral-400 font-medium italic mt-2">
                    {item.note}
                  </p>
                )}
              </div>

              {/* Available Sizes / Portions Breakdown */}
              {item.variants && item.variants.length > 0 && (
                <div className="pt-2">
                  <span className="block text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
                    Portions & Sizes
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.variants.map((v) => (
                      <div
                        key={v.name}
                        className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/60 flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-zinc-200">{v.name}</span>
                        <span className="text-sm font-bold text-white font-mono">
                          {formatPrice(v.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Options & Add-ons */}
              {item.options && item.options.length > 0 && (
                <div className="pt-2">
                  <span className="block text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
                    Available Choices & Add-ons
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.options.map((opt) => (
                      <div
                        key={opt.name}
                        className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 flex items-center justify-between"
                      >
                        <span className="text-xs font-medium text-zinc-300">{opt.name}</span>
                        <span className="text-xs font-bold text-zinc-200 font-mono">
                          {opt.price === 0 ? 'Included' : `+${formatPrice(opt.price)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dining & Inquiries Notice */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3 text-xs text-zinc-400">
                <Info className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Handcrafted fresh to order at <span className="text-white font-semibold">{cafeSettings.cafeName}</span>.
                  For table reservations or special dietary requests, please call{' '}
                  <a href={`tel:${cafeSettings.phone}`} className="text-white underline hover:text-zinc-200">
                    {cafeSettings.phone}
                  </a>.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              {cafeSettings.address}
            </div>
            <button
              id="modal-close-btn"
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
