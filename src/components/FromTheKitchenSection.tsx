import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCafe } from '../context/CafeContext';

interface KitchenDish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const featuredDishes: KitchenDish[] = [
  {
    id: 'spc-chicken-chow-mein',
    name: 'Chicken Chow Mein',
    description: 'Wok-tossed egg noodles with julienned chicken breast, crisp vegetables, and dark sesame soy glaze.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=88',
  },
  {
    id: 'spc-chicken-chili-dry',
    name: 'Chicken Chili Dry',
    description: 'Crisp chicken strips stir-fried with green chilies, ginger slivers, and savory garlic soy reduction.',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=88',
  },
  {
    id: 'spc-basil-chicken',
    name: 'Basil Chicken',
    description: 'Thai style minced chicken sautéed with fresh holy basil, bird’s eye chili, and savory oyster sauce.',
    price: 2150,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=88',
  },
];

export const FromTheKitchenSection: React.FC = () => {
  const { setCurrentView } = useCafe();
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  const activeDish = featuredDishes[activeDishIndex];

  return (
    <section
      id="from-the-kitchen"
      className="relative w-full bg-[#030304] text-white py-28 sm:py-36 lg:py-44 border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* DESKTOP / TABLET EDITORIAL SPLIT COMPOSITION */}
        <div className="hidden lg:grid grid-cols-12 gap-16 xl:gap-24 items-center">
          
          {/* LEFT: Large Cinematic Visual (56% / col-span-7) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 relative aspect-[4/3] xl:aspect-[16/11] rounded-[2px] border border-white/[0.08] overflow-hidden bg-neutral-950 shadow-2xl group"
          >
            {featuredDishes.map((dish, idx) => (
              <div
                key={dish.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  idx === activeDishIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={dish.image}
                  alt={`${dish.name} - Chaayé Khana Chef's Special`}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
              </div>
            ))}
            
            {/* Minimal Image Caption */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none bg-black/60 backdrop-blur-md px-4 py-2 rounded-[2px] border border-white/10 text-xs tracking-[0.2em] uppercase text-white/80 font-light">
              <span className="text-[#D8D4CD] font-medium">0{activeDishIndex + 1}</span>
              <span className="text-neutral-600 mx-2">/</span>
              <span>CHEF&apos;S TABLE</span>
            </div>
          </motion.div>

          {/* RIGHT: Editorial Content & 3 Dishes (44% / col-span-5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 space-y-10 text-left"
          >
            {/* Section Header */}
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-medium block">
                FROM THE KITCHEN
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-white font-normal leading-[1.08] tracking-tight">
                CHEF&apos;S SPECIALS
              </h2>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
                &ldquo;A selection of dishes created for the table, the season and the moment.&rdquo;
              </p>
            </div>

            {/* 3 Featured Dishes List */}
            <div className="space-y-6 pt-4 border-t border-white/[0.08]">
              {featuredDishes.map((dish, idx) => {
                const isActive = idx === activeDishIndex;
                return (
                  <div
                    key={dish.id}
                    onMouseEnter={() => setActiveDishIndex(idx)}
                    onClick={() => {
                      setCurrentView('menu');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group/item cursor-pointer p-5 -mx-5 rounded-[2px] transition-all duration-300 border ${
                      isActive
                        ? 'bg-white/[0.04] border-white/15'
                        : 'bg-transparent border-transparent hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className={`font-serif text-xl tracking-wide transition-colors duration-200 ${isActive ? 'text-white' : 'text-neutral-300 group-hover/item:text-white'}`}>
                        {dish.name}
                      </h3>
                      <span className="font-mono text-sm text-neutral-400 tracking-wider font-light">
                        PKR {dish.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[#AFAFAF] text-sm leading-relaxed font-light">
                      {dish.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Subtle Action to Full Menu */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-neutral-300 hover:text-white transition-colors cursor-pointer group"
              >
                <span>Explore Full Menu</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </button>
            </div>

          </motion.div>

        </div>

        {/* MOBILE / TABLET EDITORIAL SEQUENCE */}
        <div className="lg:hidden space-y-16">
          <div className="space-y-3 text-left">
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-medium block">
              FROM THE KITCHEN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
              CHEF&apos;S SPECIALS
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
              &ldquo;A selection of dishes created for the table, the season and the moment.&rdquo;
            </p>
          </div>

          {/* Featured Hero Image on Mobile */}
          <div className="relative w-full aspect-[4/3] rounded-[2px] border border-white/[0.08] overflow-hidden bg-neutral-950">
            <img
              src={activeDish.image}
              alt={activeDish.name}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Dishes list on Mobile */}
          <div className="space-y-8 divide-y divide-white/[0.06]">
            {featuredDishes.map((dish, idx) => (
              <div key={dish.id} className="pt-8 first:pt-0 space-y-3 text-left">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono text-neutral-500">0{idx + 1}</span>
                  <span className="font-mono text-sm text-neutral-300">PKR {dish.price.toLocaleString()}</span>
                </div>
                <h3 className="font-serif text-2xl text-white font-normal">
                  {dish.name}
                </h3>
                <p className="text-[#AFAFAF] text-sm leading-relaxed font-light">
                  {dish.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
