import React from 'react';
import {
  Coffee,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCafe } from '../context/CafeContext';

export const AboutSection: React.FC = () => {
  const { setCurrentView } = useCafe();

  return (
    <div className="bg-[#030304] text-white min-h-[90vh] selection:bg-white selection:text-black pt-12 md:pt-16 pb-24 sm:pb-32 border-b border-neutral-900">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-10 lg:px-14 space-y-20 sm:space-y-28">
        
        {/* ========================================================================= */}
        {/* 1. HEADER TITLE */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-3xl mx-auto pt-6"
        >
          <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.24em] text-neutral-400 font-medium block mb-3.5">
            OUR HERITAGE &amp; PHILOSOPHY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.12] tracking-tight">
            Where Tea, Food &amp; Conversation Meet
          </h1>
          <p className="mt-4 sm:mt-5 text-[#AFAFAF] text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
            Founded as Pakistan’s pioneering tea cafe, Chaayé Khana brings together an urban community sanctuary and an expansive menu of single-estate orthodox teas, hearty breakfasts, and artisanal dining.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. VISUAL STORY SPLIT */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-medium block">
              OUR COMMITMENT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
              A dining sanctuary built upon patience, freshness, and quiet warmth.
            </h2>
            <p className="text-[#AFAFAF] text-sm sm:text-[15px] leading-relaxed font-light">
              We started with an enduring belief: an exceptional dining space should never compromise between authentic ingredient quality and comfortable variety. Whether you come for a steaming kettle of traditional Karak chai, slow-cooked Nihari, freshly toasted breakfast platters, or an espresso, every offering is prepared to order.
            </p>
            <p className="text-[#AFAFAF] text-sm sm:text-[15px] leading-relaxed font-light">
              In DHA Phase 4, our light-filled dining salon, quiet library corner, and open-air rooftop terrace provide a welcoming retreat from city hustle.
            </p>

            <div className="pt-3 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-[3px] bg-[#09090b] border border-white/[0.06]">
                <span className="text-2xl font-serif text-white block">100%</span>
                <span className="text-xs text-neutral-400 font-light mt-1 block">Fresh Halal Ingredients</span>
              </div>
              <div className="p-5 rounded-[3px] bg-[#09090b] border border-white/[0.06]">
                <span className="text-2xl font-serif text-white block">Zero</span>
                <span className="text-xs text-neutral-400 font-light mt-1 block">Artificial Additives</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6"
          >
            <div className="overflow-hidden rounded-[3px] border border-white/[0.06] bg-neutral-950 aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
                alt="Chaayé Khana DHA-4 warm ambient dining lounge and wooden library seating"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="overflow-hidden rounded-[3px] border border-white/[0.06] bg-neutral-950 aspect-[3/4] mt-6 sm:mt-8">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop"
                alt="Artisanal freshly roasted coffee beans and espresso preparation at Chaayé Khana DHA-4"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* 3. FOUR PILLARS OF HOSPITALITY */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <div className="p-6 sm:p-7 rounded-[3px] bg-[#09090b] border border-white/[0.06] space-y-3.5 hover:border-white/20 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-neutral-300" />
            </div>
            <h3 className="font-serif text-lg text-white font-normal">Uncompromised Quality</h3>
            <p className="text-xs sm:text-[13px] text-[#AFAFAF] leading-relaxed font-light">
              Every morning begins with fresh preparation. No premade frozen patties or commercial shortcuts.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-[3px] bg-[#09090b] border border-white/[0.06] space-y-3.5 hover:border-white/20 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
              <Coffee className="w-4 h-4 text-neutral-300" />
            </div>
            <h3 className="font-serif text-lg text-white font-normal">Single-Estate Leaves</h3>
            <p className="text-xs sm:text-[13px] text-[#AFAFAF] leading-relaxed font-light">
              Over 70 varieties of orthodox loose leaf teas sourced globally and brewed precisely at optimal temperature.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-[3px] bg-[#09090b] border border-white/[0.06] space-y-3.5 hover:border-white/20 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
              <Users className="w-4 h-4 text-neutral-300" />
            </div>
            <h3 className="font-serif text-lg text-white font-normal">Thoughtful Spaces</h3>
            <p className="text-xs sm:text-[13px] text-[#AFAFAF] leading-relaxed font-light">
              An urban sanctuary with generous light, quiet acoustics, and comfortable seating in DHA-4, Rawalpindi.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-[3px] bg-[#09090b] border border-white/[0.06] space-y-3.5 hover:border-white/20 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-neutral-300" />
            </div>
            <h3 className="font-serif text-lg text-white font-normal">Honest Hospitality</h3>
            <p className="text-xs sm:text-[13px] text-[#AFAFAF] leading-relaxed font-light">
              Generous culinary portions and sincere hospitality, making memorable dining accessible every day.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. KITCHEN QUOTE & CALL TO ACTION */}
        {/* ========================================================================= */}
        <div className="p-8 sm:p-12 rounded-[3px] bg-[#09090b] border border-white/[0.06] text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block">
              OUR PROMISE
            </span>
            <blockquote className="font-serif text-xl sm:text-2xl text-white font-normal italic leading-relaxed">
              "We prepare food we love sharing with our own family. Every pot of chai, every dish, and every moment is an expression of care for our guests."
            </blockquote>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-light">
              The Culinary Team • Chaayé Khana DHA-4
            </p>

            <div className="pt-4">
              <button
                id="about-explore-menu-btn"
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-neutral-700 hover:border-white text-white hover:text-black hover:bg-white text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 ease-out cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
              >
                <span>EXPLORE MENU</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
