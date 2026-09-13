import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCafe } from '../context/CafeContext';
import { MenuItem } from '../types';

interface DigitalMenuSectionProps {
  initialCategoryId?: string;
}

export const DigitalMenuSection: React.FC<DigitalMenuSectionProps> = ({ initialCategoryId }) => {
  const { menuItems, categories, setSelectedItemForModal } = useCafe();
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategoryId || 'breakfast');

  // Specific category metadata and notes
  const categoryNotes: Record<string, string[]> = {
    breakfast: [
      'Eggs can be ordered as two or three per serving',
      'Choice of bread: White / Brown / Multigrain',
      'Choice of side: Meat Slice / Hash Brown',
      'All omelets are made with 2 eggs',
    ],
    'sandwiches-burgers': [
      'Bread choices: White / Brown / Focaccia',
      'Served with golden fries or garden greens',
    ],
    'chefs-specials': [
      'Served with one side: Steamed Rice / Garlic Rice / Egg Fried Rice',
    ],
    'main-course': [
      'Seafood specialties subject to seasonal fresh market availability',
    ],
    'teas-coffees': [
      'Simmered slow in copper kettles & single-estate orthodox leaves',
    ],
  };

  // Ensure active category exists, fallback to first
  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0] || {
      id: 'breakfast',
      name: 'Breakfast',
    };
  }, [categories, activeCategoryId]);

  // Filter items for the selected category
  const activeItems = useMemo(() => {
    return menuItems.filter((item) => item.categoryId === activeCategoryId);
  }, [menuItems, activeCategoryId]);

  // Format price helper
  const formatItemPrice = (item: MenuItem) => {
    if (item.priceNote) {
      return item.priceNote;
    }
    return `PKR ${item.price.toLocaleString()}`;
  };

  return (
    <section
      id="menu-section"
      className="scroll-mt-20 sm:scroll-mt-24 relative bg-[#030304] text-white pt-[70px] pb-[80px] px-6 md:pt-[90px] md:pb-[100px] md:px-10 lg:pt-[140px] lg:pb-[150px] lg:px-[60px] overflow-hidden border-t border-white/[0.06]"
    >
      <div className="max-w-[1200px] mx-auto w-full">
        {/* ========================================================================= */}
        {/* SECTION HEADER */}
        {/* ========================================================================= */}
        <div className="text-center max-w-[750px] mx-auto mb-[50px] md:mb-[65px]">
          {/* Small Eyebrow */}
          <span className="uppercase text-[11px] sm:text-[12px] tracking-[0.24em] text-neutral-400 font-medium mb-[18px] block">
            OUR MENU
          </span>

          {/* Large Main Heading */}
          <h2 className="font-serif font-normal text-white text-[36px] sm:text-[46px] lg:text-[58px] leading-[1.08] tracking-[-0.01em] mb-[22px]">
            Good food. Good tea. Good moments.
          </h2>

          {/* Supporting Paragraph */}
          <p className="text-[15px] sm:text-[16.5px] leading-[1.7] text-[#AFAFAF] max-w-[650px] mx-auto font-light">
            Explore our selection of comforting classics, signature dishes and carefully brewed favourites.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* HORIZONTAL CATEGORY NAVIGATION */}
        {/* ========================================================================= */}
        <div className="border-b border-white/[0.08] mb-[50px] md:mb-[65px]">
          <div
            role="tablist"
            aria-label="Menu categories"
            className="flex items-center gap-7 sm:gap-9 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center no-scrollbar"
          >
            {categories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  id={`menu-tab-${cat.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`menu-category-${cat.id}`}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`text-[14px] sm:text-[15px] whitespace-nowrap tracking-normal transition-all duration-300 pb-2 relative cursor-pointer font-light select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-[2px] ${
                    isActive
                      ? 'text-white font-normal'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                  {/* Subtle Underline Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white transition-all duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE CATEGORY TITLE & EDITORIAL NOTES */}
        {/* ========================================================================= */}
        <div className="mb-[40px] md:mb-[50px]">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 border-b border-white/[0.05] pb-4">
            <h3 className="font-serif uppercase text-[28px] sm:text-[36px] lg:text-[42px] text-white font-normal tracking-wide">
              {activeCategory.name}
            </h3>
            <span className="text-[12px] sm:text-[13px] text-neutral-400 font-light">
              {activeItems.length} curated offerings
            </span>
          </div>

          {/* Subtle Category Notes */}
          {categoryNotes[activeCategoryId] && (
            <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] sm:text-[13px] text-neutral-400 font-light">
              {categoryNotes[activeCategoryId].map((note, idx) => (
                <span key={idx} className="flex items-center gap-3">
                  {idx > 0 && <span className="text-white/20">·</span>}
                  <span>{note}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* FOOD CARDS 2-COLUMN EDITORIAL GRID */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-[32px] gap-y-[45px] sm:gap-y-[55px]"
          >
            {activeItems.map((item) => (
              <article
                key={item.id}
                id={`food-card-${item.id}`}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${item.name}`}
                onClick={() => setSelectedItemForModal(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItemForModal(item);
                  }
                }}
                className="group flex flex-col cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-[2px]"
              >
                {/* Image Container with 4:3 Aspect Ratio and Subtle Hover Zoom */}
                <div className="relative w-full aspect-[4/3] max-h-[360px] min-h-[260px] rounded-[2px] overflow-hidden bg-neutral-950 border border-white/[0.06] group-hover:border-white/20 transition-colors duration-300">
                  <img
                    src={item.image}
                    alt={`${item.name} served at Chaayé Khana DHA-4`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out md:group-hover:scale-[1.025] motion-reduce:transition-none"
                  />
                  {/* Gentle atmospheric vignette */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

                  {/* Subtle Badge Overlay if applicable */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                    {item.isChefsSpecial && (
                      <span className="text-[9.5px] uppercase tracking-[0.16em] bg-black/75 backdrop-blur-xs text-neutral-300 px-2.5 py-1 rounded-[2px] border border-white/10 font-medium">
                        Chef's Special
                      </span>
                    )}
                    {item.isPopular && !item.isChefsSpecial && (
                      <span className="text-[9.5px] uppercase tracking-[0.16em] bg-black/75 backdrop-blur-xs text-neutral-300 px-2.5 py-1 rounded-[2px] border border-white/10 font-medium">
                        Signature
                      </span>
                    )}
                  </div>
                </div>

                {/* Food Item Typography & Details */}
                <div className="pt-[20px] sm:pt-[22px] flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h4 className="font-serif text-[21px] sm:text-[23px] font-normal text-white tracking-[-0.01em]">
                        {item.name}
                      </h4>
                      <span className="text-[15px] sm:text-[16px] text-white font-normal tracking-tight whitespace-nowrap">
                        {formatItemPrice(item)}
                      </span>
                    </div>
                    <p className="text-[13.5px] sm:text-[14.5px] leading-[1.6] text-[#AFAFAF] font-light max-w-[500px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State Fallback (Defensive) */}
        {activeItems.length === 0 && (
          <div className="text-center py-20 text-neutral-400 font-light">
            No offerings available in this category at this time.
          </div>
        )}
      </div>
    </section>
  );
};
