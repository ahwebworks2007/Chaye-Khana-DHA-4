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

  // Category editorial chapter subtitles
  const categorySubtitles: Record<string, string> = {
    breakfast: 'Slow mornings, done properly.',
    snacks: 'Light bites, savoury pastries and afternoon tea accompaniments.',
    'sandwiches-burgers': 'Gourmet sandwiches and grilled classics served on artisanal breads.',
    'chefs-specials': 'Distinctive entrees and signature creations crafted with seasonal ingredients.',
    'main-course': 'Hearty continental and regional classics cooked to perfection.',
    'bakery-desserts': 'Freshly baked pastries, warm cakes and classic confectionery.',
    beverages: 'Freshly pressed juices, signature mocktails and refreshing chillers.',
    'teas-coffees': 'Artisanal orthodox leaf infusions, traditional karak chai and single-origin espresso.',
    pizzas: 'Stone-baked sourdough crusts with handcrafted sauces and premium cheeses.',
  };

  // Specific category metadata notes
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

  // Selective chapter atmospheric images
  const categoryAtmosphereImages: Record<string, string> = {
    breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1400&q=85',
    snacks: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1400&q=85',
    'sandwiches-burgers': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=85',
    'chefs-specials': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85',
    'main-course': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85',
    'bakery-desserts': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1400&q=85',
    beverages: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1400&q=85',
    'teas-coffees': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1400&q=85',
    pizzas: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=85',
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
      className="scroll-mt-20 sm:scroll-mt-24 relative bg-[#030304] text-white py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-16 overflow-hidden border-t border-white/[0.06]"
    >
      <div className="max-w-[1300px] mx-auto w-full">
        {/* ========================================================================= */}
        {/* SECTION HEADER: Editorial Restaurant Menu */}
        {/* ========================================================================= */}
        <div className="text-center max-w-[750px] mx-auto mb-16 sm:mb-20 lg:mb-24">
          <span className="uppercase text-[11px] sm:text-[12px] tracking-[0.28em] text-neutral-400 font-medium mb-4 block">
            OUR MENU
          </span>

          <h2 className="font-serif font-normal text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.08] tracking-tight mb-4">
            Good food. Good tea. Good moments.
          </h2>

          <p className="text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed text-[#AFAFAF] max-w-[620px] mx-auto font-light">
            Explore our selection of comforting classics, signature dishes and carefully brewed favourites.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* REFINED EDITORIAL CATEGORY NAVIGATION */}
        {/* ========================================================================= */}
        <div className="border-b border-white/[0.08] mb-14 sm:mb-20">
          <div
            role="tablist"
            aria-label="Menu categories"
            className="flex items-center gap-6 sm:gap-9 overflow-x-auto pb-4 scrollbar-none justify-start lg:justify-center no-scrollbar"
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
                  className={`text-sm sm:text-[15px] whitespace-nowrap tracking-wide transition-all duration-300 pb-3 relative cursor-pointer select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-[1px] ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-neutral-400 hover:text-white font-light'
                  }`}
                >
                  <span>{cat.name}</span>
                  {/* Subtle Underline Indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="menu-active-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE CATEGORY CHAPTER & EDITORIAL PRESENTATION */}
        {/* ========================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-12 sm:space-y-16"
          >
            {/* Chapter Heading & Optional Atmosphere Banner */}
            <div className="border-b border-white/[0.08] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 text-left">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block">
                  CATEGORY
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal tracking-tight uppercase">
                  {activeCategory.name}
                </h3>
                {categorySubtitles[activeCategoryId] && (
                  <p className="text-neutral-400 text-sm sm:text-base font-light font-serif italic text-[#C8C4BC] pt-1">
                    &ldquo;{categorySubtitles[activeCategoryId]}&rdquo;
                  </p>
                )}
              </div>

              <div className="text-left md:text-right">
                <span className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium block">
                  {activeItems.length} SELECTIONS
                </span>
              </div>
            </div>

            {/* Subtle Category Notes / Preparation Specifics */}
            {categoryNotes[activeCategoryId] && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-400 font-light border-l border-white/20 pl-4 py-1 text-left">
                {categoryNotes[activeCategoryId].map((note, idx) => (
                  <span key={idx} className="flex items-center gap-3">
                    {idx > 0 && <span className="text-white/20">·</span>}
                    <span>{note}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Optional Selective Atmosphere Editorial Photography */}
            {categoryAtmosphereImages[activeCategoryId] && (
              <div className="relative w-full h-48 sm:h-64 lg:h-80 rounded-[2px] overflow-hidden border border-white/[0.08] bg-neutral-950 group">
                <img
                  src={categoryAtmosphereImages[activeCategoryId]}
                  alt={`${activeCategory.name} dining ambiance at Chaayé Khana`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.01] motion-reduce:transition-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30 pointer-events-none" />
                <div className="absolute bottom-5 left-6 sm:left-8 pointer-events-none">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-neutral-300 font-light">
                    {activeCategory.name} Experience &bull; Chaayé Khana DHA-4
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* EDITORIAL DISH LISTING (No Boxed Cards / Generous Negative Space) */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-20 gap-y-10 sm:gap-y-14">
              {activeItems.map((item) => (
                <article
                  key={item.id}
                  id={`menu-item-${item.id}`}
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
                  className="group text-left border-b border-white/[0.06] pb-8 sm:pb-10 flex flex-col justify-between cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white rounded-[1px] transition-colors"
                >
                  <div className="space-y-2.5">
                    {/* Dish Title & Aligned Price */}
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="font-serif text-xl sm:text-2xl text-white font-normal uppercase tracking-wide group-hover:text-[#E8E4DC] transition-colors">
                        {item.name}
                      </h4>
                      <span className="font-sans text-sm sm:text-base text-[#D8D4CD] font-medium tracking-wider whitespace-nowrap flex-shrink-0">
                        {formatItemPrice(item)}
                      </span>
                    </div>

                    {/* Dish Description */}
                    {item.description && (
                      <p className="text-neutral-400 text-sm sm:text-[15px] leading-relaxed font-light max-w-xl">
                        {item.description}
                      </p>
                    )}

                    {/* Subtle Variants Note if available */}
                    {item.variants && item.variants.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-neutral-400 font-light">
                        {item.variants.map((v, i) => (
                          <span key={i} className="flex items-center gap-2">
                            {i > 0 && <span className="text-white/20">·</span>}
                            <span>{v.name}: PKR {v.price.toLocaleString()}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State Fallback (Defensive) */}
            {activeItems.length === 0 && (
              <div className="text-center py-20 text-neutral-400 font-light">
                No offerings available in this category at this time.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
