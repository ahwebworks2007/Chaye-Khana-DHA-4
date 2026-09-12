import React from 'react';
import { motion } from 'motion/react';
import { useCafe } from '../context/CafeContext';
import rooftopImage from '../assets/images/chaaye_khana_rooftop_1788985644536.jpg';
import heroBackground from '../assets/images/hero_background_1789169162945.jpg';

export const AboutSection: React.FC = () => {
  const { activeBranch } = useCafe();

  return (
    <div className="bg-[#030304] text-white min-h-[90vh] selection:bg-white selection:text-black pt-20 sm:pt-28 pb-32 sm:pb-44 border-b border-neutral-900">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 space-y-24 sm:space-y-36">
        
        {/* ========================================================================= */}
        {/* EDITORIAL BRAND STORY & ASYMMETRIC MAGAZINE LAYOUT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Storytelling text & micro-labels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6 space-y-12 text-left"
          >
            {/* Small Eyebrow */}
            <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-medium block">
              OUR STORY
            </span>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08] tracking-tight">
              Where chai became a reason to stay.
            </h1>

            {/* Supporting Brand Story Quotation */}
            <p className="text-white text-lg sm:text-xl font-serif italic font-light leading-relaxed border-l border-white/20 pl-6 text-[#E5E0D8]">
              &ldquo;Chaayé Khana was created around a simple idea: that good food and a carefully brewed cup of chai can turn an ordinary moment into something worth remembering.&rdquo;
            </p>

            {/* Story Paragraph 1: The Ritual */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block">
                01 — THE RITUAL
              </span>
              <p className="text-[#B8B8B8] text-base sm:text-lg leading-relaxed font-light">
                In an era that moves too quickly, Chaayé Khana was founded to honor the deliberate art of the brew. From robust traditional Karak to aromatic single-estate leaves, every cup of chai represents a quiet commitment to craftsmanship, patience, and warmth.
              </p>
            </div>

            {/* Story Paragraph 2: The Table */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block">
                02 — THE TABLE
              </span>
              <p className="text-[#B8B8B8] text-base sm:text-lg leading-relaxed font-light">
                Around our tables, food is crafted to be shared. From slow-cooked comfort dishes to freshly baked morning pastries and hearty breakfast platters, every plate is prepared from scratch with honest ingredients and generous hospitality.
              </p>
            </div>

            {/* Story Paragraph 3: The Moment & DHA-4 */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block">
                03 — THE MOMENT
              </span>
              <p className="text-[#B8B8B8] text-base sm:text-lg leading-relaxed font-light">
                Nestled in the heart of {activeBranch.area}, Rawalpindi, our light-filled dining salon, quiet library nooks, and open-air rooftop create an urban sanctuary where conversations linger, mornings stretch, and time slows down just enough.
              </p>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Vertical Sequence of Editorial Photographs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6 space-y-10 lg:pt-12"
          >
            {/* Photograph 1: Interior / Dining Sanctuary */}
            <div className="relative w-full aspect-[4/5] rounded-[2px] border border-white/[0.08] overflow-hidden bg-neutral-950 group">
              <img
                src={rooftopImage}
                alt="Chaayé Khana DHA-4 warm ambient dining interior and library sanctuary"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Photograph 2: Artisanal Spread / Chai Detail */}
            <div className="relative w-full aspect-[16/11] rounded-[2px] border border-white/[0.08] overflow-hidden bg-neutral-950 group lg:-ml-12 lg:w-[110%] shadow-2xl">
              <img
                src={heroBackground}
                alt="Artisanal breakfast spread, pastries, and signature Karak chai at Chaayé Khana"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Photograph 3: Atmosphere / Conversation Detail */}
            <div className="relative w-full aspect-[4/5] rounded-[2px] border border-white/[0.08] overflow-hidden bg-neutral-950 group lg:ml-8 lg:w-[90%]">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
                alt="Quiet hospitality and conversation at Chaayé Khana"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
