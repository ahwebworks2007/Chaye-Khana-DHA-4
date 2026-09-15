import React from 'react';
import { motion } from 'motion/react';

export const PeopleAndHospitalitySection: React.FC = () => {
  return (
    <section
      id="people-hospitality-section"
      aria-label="The People Behind the Table"
      className="relative py-24 sm:py-32 lg:py-40 border-b border-white/[0.06] bg-[#040405] text-white overflow-hidden select-none"
    >
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* ========================================================================= */}
        {/* EDITORIAL HEADER: Restrained, Human & Atmosphere-Focused */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mb-16 sm:mb-20 lg:mb-24 text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-5 sm:space-y-6"
          >
            <span className="text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block">
              THE PEOPLE BEHIND THE TABLE
            </span>

            <h2 className="font-serif font-normal text-white text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] leading-[1.08] tracking-tight">
              GOOD HOSPITALITY IS FELT IN THE DETAILS.
            </h2>

            <p className="text-neutral-400 text-base sm:text-lg lg:text-[19px] leading-relaxed font-light pt-1 max-w-2xl">
              &ldquo;Good hospitality is felt in the details &mdash; a warm welcome, a carefully poured cup of chai and a table made for good conversation.&rdquo;
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="w-8 h-[1px] bg-white/20" />
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#D8D4CD] font-medium">
                MADE FOR GOOD CONVERSATIONS.
              </span>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* ASYMMETRICAL EDITORIAL PHOTO COMPOSITION */}
        {/* Candid, authentic restaurant moments — hospitality, tea pouring, table life */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          {/* Primary Main Image: Warm Welcome & Table Interaction (col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 relative group overflow-hidden rounded-[2px] border border-white/[0.08] bg-neutral-950 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/12]"
          >
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=85"
              alt="Warm hospitality, attentive service and welcoming atmosphere at Chaayé Khana"
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
              referrerPolicy="no-referrer"
            />
            {/* Subtle atmospheric gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
          </motion.div>

          {/* Secondary Stacked Details: Chai Pouring & Hands at the Table (col-span-5) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-8 lg:gap-10">
            {/* Detail 1: Artisanal Chai Pouring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative group overflow-hidden rounded-[2px] border border-white/[0.08] bg-neutral-950 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/9]"
            >
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85"
                alt="Artisanal slow pour of steaming hot chai into teaware at Chaayé Khana"
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Detail 2: Table Connection & Dining Detail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative group overflow-hidden rounded-[2px] border border-white/[0.08] bg-neutral-950 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/9]"
            >
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85"
                alt="Friends and guests sharing conversation and tea around a table at Chaayé Khana"
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
