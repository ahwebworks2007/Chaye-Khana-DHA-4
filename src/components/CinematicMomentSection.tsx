import React from 'react';
import { motion } from 'motion/react';

export const CinematicMomentSection: React.FC = () => {
  return (
    <section
      id="cinematic-moment-section"
      aria-label="A Moment at Chaayé Khana"
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-black text-white select-none border-b border-white/[0.06]"
    >
      {/* ========================================================================= */}
      {/* 1. IMMERSIVE EDGE-TO-EDGE CINEMATIC BACKGROUND PHOTOGRAPHY */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=88"
          alt="Cinematic atmospheric restaurant dining room at Chaayé Khana"
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out motion-reduce:transform-none"
          referrerPolicy="no-referrer"
        />

        {/* Sophisticated cinematic dark gradient vignettes for optimal legibility while preserving photography depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/75" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTERED RESTRAINED EDITORIAL TYPOGRAPHY (NO BUTTON / NO CTA) */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Eyebrow */}
          <div>
            <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.32em] text-neutral-400 font-medium inline-block">
              A MOMENT AT CHAAYÉ KHANA
            </span>
          </div>

          {/* Primary Statement */}
          <div className="space-y-2 sm:space-y-3">
            <h2 className="font-serif font-normal text-white text-[34px] sm:text-[54px] md:text-[64px] lg:text-[76px] leading-[1.08] tracking-tight block">
              COME FOR THE CHAI.
            </h2>
            <h2 className="font-serif font-normal text-[#E8E4DC] text-[34px] sm:text-[54px] md:text-[64px] lg:text-[76px] leading-[1.08] tracking-tight block">
              STAY FOR THE CONVERSATION.
            </h2>
          </div>

          {/* Supporting Line */}
          <div className="pt-2 sm:pt-4">
            <span className="text-[13px] sm:text-[15px] font-sans font-light tracking-[0.18em] text-[#C0BCB4] uppercase inline-block">
              Breakfast &bull; Chai &bull; Lunch &bull; Evening
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
