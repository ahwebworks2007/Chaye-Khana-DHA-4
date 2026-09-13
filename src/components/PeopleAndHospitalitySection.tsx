import React from 'react';
import { motion } from 'motion/react';

interface HospitalityMoment {
  id: string;
  number: string;
  label: string;
  theme: string;
  title: string;
  description: string;
  alt: string;
  imageUrl: string;
}

const HOSPITALITY_MOMENTS: HospitalityMoment[] = [
  {
    id: 'moment-01',
    number: '01',
    label: '01 — THE WELCOME',
    theme: 'FIRST IMPRESSION',
    title: 'A Warm Welcome',
    description: 'Hospitality begins the moment you step through our doors — met with attentive grace and an inviting presence.',
    alt: 'Attentive, welcoming restaurant hospitality staff greeting guests at Chaayé Khana DHA-4',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'moment-02',
    number: '02',
    label: '02 — THE POUR',
    theme: 'THE RITUAL',
    title: 'Artisanal Tea Pouring',
    description: 'Every cup of signature Karak chai is poured with measured calm, releasing fragrant cardamom steam.',
    alt: 'Artisanal slow pour of steaming hot Karak chai into fine ceramic teaware at Chaayé Khana',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'moment-03',
    number: '03',
    label: '03 — THE KITCHEN',
    theme: 'CRAFT & DEDICATION',
    title: 'From the Kitchen',
    description: 'Behind the pass, our culinary team plates fresh morning bakes, savory classics, and gourmet entrees with precision.',
    alt: 'Chef working attentively in the warm ambient kitchen crafting gourmet dishes at Chaayé Khana',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'moment-04',
    number: '04',
    label: '04 — THE TABLE',
    theme: 'CONNECTION',
    title: 'Shared Conversations',
    description: 'Long unhurried brunches, laughter across the table, and friendships renewed over fresh pots of tea.',
    alt: 'Guests enjoying conversation, tea, and dining together around a wooden table at Chaayé Khana DHA-4',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'moment-05',
    number: '05',
    label: '05 — THE DETAIL',
    theme: 'TACTILE CARE',
    title: 'Care in Every Gesture',
    description: 'Hands passing warm platters, setting polished teaware, and ensuring every small detail is effortless.',
    alt: 'Close-up detail of hands serving culinary specialties and tea at the dining table',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'moment-06',
    number: '06',
    label: '06 — THE ROOM',
    theme: 'ATMOSPHERE',
    title: 'A Room Full of Life',
    description: 'The natural hum of dining room life — wooden shelves, ambient lighting, and welcoming warmth.',
    alt: 'Atmospheric restaurant dining room with people naturally enjoying food, tea, and ambience at Chaayé Khana',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
  },
];

export const PeopleAndHospitalitySection: React.FC = () => {
  return (
    <section
      id="people-hospitality-section"
      aria-label="The People Behind the Table"
      className="relative py-28 sm:py-36 lg:py-44 border-b border-white/[0.06] bg-[#040405] text-white overflow-hidden select-none"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14">
        {/* ========================================================================= */}
        {/* TOP EDITORIAL HERO COMPOSITION: Dominant Welcome (Left) + Text & Pour (Right) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center mb-20 sm:mb-28 lg:mb-36">
          {/* Left Column: Dominant Large Image (01 — THE WELCOME) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                {HOSPITALITY_MOMENTS[0].label}
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06]" />
            </div>

            <div className="group relative overflow-hidden rounded-[2px] border border-white/[0.07] bg-[#09090b] aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/12]">
              <img
                src={HOSPITALITY_MOMENTS[0].imageUrl}
                alt={HOSPITALITY_MOMENTS[0].alt}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 z-10 pointer-events-none transition-all duration-400 ease-out transform translate-y-1 sm:translate-y-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                <span className="block text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-1">
                  {HOSPITALITY_MOMENTS[0].theme}
                </span>
                <p className="font-serif text-white font-normal text-[16px] sm:text-[18px] leading-snug">
                  {HOSPITALITY_MOMENTS[0].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Section Header, Editorial Statement & Supporting Photo (02 — THE POUR) */}
          <div className="lg:col-span-5 space-y-8 sm:space-y-10 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-4"
            >
              <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.28em] uppercase text-neutral-400 block">
                PEOPLE &amp; HOSPITALITY
              </span>

              <h2 className="font-serif font-normal text-white text-[32px] sm:text-[44px] xl:text-[50px] leading-[1.1] tracking-tight">
                THE PEOPLE BEHIND THE TABLE
              </h2>

              <p className="text-[#AFAFAF] text-[15px] sm:text-[16.5px] leading-[1.75] font-light pt-1">
                &ldquo;Good hospitality is felt in the details &mdash; a warm welcome, a carefully poured cup of chai and a table made for good conversation.&rdquo;
              </p>

              {/* Quiet Editorial Statement (Not a button or CTA) */}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-6 h-[1px] bg-neutral-600" />
                <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.22em] text-[#D8D4CD] font-medium">
                  MADE FOR GOOD CONVERSATIONS.
                </span>
              </div>
            </motion.div>

            {/* Supporting Offset Image: 02 — THE POUR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-3 pt-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                  {HOSPITALITY_MOMENTS[1].label}
                </span>
                <div className="h-[1px] flex-1 bg-white/[0.06]" />
              </div>

              <div className="group relative overflow-hidden rounded-[2px] border border-white/[0.07] bg-[#09090b] aspect-[16/11] sm:aspect-[16/10]">
                <img
                  src={HOSPITALITY_MOMENTS[1].imageUrl}
                  alt={HOSPITALITY_MOMENTS[1].alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 pointer-events-none transition-all duration-400 ease-out transform translate-y-1 sm:translate-y-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                  <span className="block text-[10px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-1">
                    {HOSPITALITY_MOMENTS[1].theme}
                  </span>
                  <p className="font-serif text-white font-normal text-[15px] leading-snug">
                    {HOSPITALITY_MOMENTS[1].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MID EDITORIAL COMPOSITION: 03 (Kitchen) + 04 (Table) + 05 (Detail) */}
        {/* ========================================================================= */}
        <div className="space-y-12 sm:space-y-16 mb-20 sm:mb-28 lg:mb-36">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch">
            {/* 03 — THE KITCHEN */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-3 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                  {HOSPITALITY_MOMENTS[2].label}
                </span>
                <div className="h-[1px] flex-1 bg-white/[0.06]" />
              </div>

              <div className="group relative flex-1 overflow-hidden rounded-[2px] border border-white/[0.07] bg-[#09090b] aspect-[4/3] sm:aspect-[16/12]">
                <img
                  src={HOSPITALITY_MOMENTS[2].imageUrl}
                  alt={HOSPITALITY_MOMENTS[2].alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 pointer-events-none transition-all duration-400 ease-out transform translate-y-1 sm:translate-y-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                  <span className="block text-[10px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-1">
                    {HOSPITALITY_MOMENTS[2].theme}
                  </span>
                  <p className="font-serif text-white font-normal text-[15px] leading-snug">
                    {HOSPITALITY_MOMENTS[2].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 04 — THE TABLE */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-3 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                  {HOSPITALITY_MOMENTS[3].label}
                </span>
                <div className="h-[1px] flex-1 bg-white/[0.06]" />
              </div>

              <div className="group relative flex-1 overflow-hidden rounded-[2px] border border-white/[0.07] bg-[#09090b] aspect-[4/3] sm:aspect-[16/12]">
                <img
                  src={HOSPITALITY_MOMENTS[3].imageUrl}
                  alt={HOSPITALITY_MOMENTS[3].alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 pointer-events-none transition-all duration-400 ease-out transform translate-y-1 sm:translate-y-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                  <span className="block text-[10px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-1">
                    {HOSPITALITY_MOMENTS[3].theme}
                  </span>
                  <p className="font-serif text-white font-normal text-[15px] leading-snug">
                    {HOSPITALITY_MOMENTS[3].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 05 — THE DETAIL */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-3 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                  {HOSPITALITY_MOMENTS[4].label}
                </span>
                <div className="h-[1px] flex-1 bg-white/[0.06]" />
              </div>

              <div className="group relative flex-1 overflow-hidden rounded-[2px] border border-white/[0.07] bg-[#09090b] aspect-[4/3] sm:aspect-[16/12]">
                <img
                  src={HOSPITALITY_MOMENTS[4].imageUrl}
                  alt={HOSPITALITY_MOMENTS[4].alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 pointer-events-none transition-all duration-400 ease-out transform translate-y-1 sm:translate-y-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                  <span className="block text-[10px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-1">
                    {HOSPITALITY_MOMENTS[4].theme}
                  </span>
                  <p className="font-serif text-white font-normal text-[15px] leading-snug">
                    {HOSPITALITY_MOMENTS[4].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CINEMATIC CLOSURE: 06 — THE ROOM (Dining room atmosphere) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              {HOSPITALITY_MOMENTS[5].label}
            </span>
            <div className="h-[1px] flex-1 bg-white/[0.06]" />
          </div>

          <div className="group relative overflow-hidden rounded-[2px] border border-white/[0.07] bg-[#09090b] aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/9]">
            <img
              src={HOSPITALITY_MOMENTS[5].imageUrl}
              alt={HOSPITALITY_MOMENTS[5].alt}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 lg:p-8 z-10 pointer-events-none transition-all duration-400 ease-out transform translate-y-1 sm:translate-y-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="block text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-1">
                  {HOSPITALITY_MOMENTS[5].theme}
                </span>
                <p className="font-serif text-white font-normal text-[16px] sm:text-[18px] leading-snug">
                  {HOSPITALITY_MOMENTS[5].description}
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 whitespace-nowrap">
                CHAAYÉ KHANA DHA-4
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
