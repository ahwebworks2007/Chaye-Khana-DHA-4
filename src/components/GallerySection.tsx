import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import rooftopImage from '../assets/images/chaaye_khana_rooftop_1788985644536.jpg';

interface GalleryItem {
  id: string;
  theme: string;
  category: string;
  caption: string;
  alt: string;
  imageUrl: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  // 01 — FOOD (Dominant large feature image)
  {
    id: 'gallery-01',
    theme: '01 — THE TABLE',
    category: 'MORNING TABLE & CUISINE',
    caption: 'Freshly prepared artisanal breakfast spread with crusty sourdough, eggs, and condiments.',
    alt: 'Plated gourmet breakfast spread with sourdough bread, fresh eggs and tea at Chaayé Khana DHA-4',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1800&q=85',
  },

  // 02 — CHAI (The ritual)
  {
    id: 'gallery-02',
    theme: '02 — THE RITUAL',
    category: 'THE ART OF CHAI',
    caption: 'Signature Karak Chai, simmered slowly and poured with artisanal precision.',
    alt: 'Authentic rich Karak Chai poured into traditional ceramic teaware with steam at Chaayé Khana',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85',
  },

  // 03 — FOOD / DETAIL (Bakery & pastries)
  {
    id: 'gallery-03',
    theme: '02 — THE RITUAL',
    category: 'BAKERY & SPECIALTIES',
    caption: 'Handcrafted golden pastries and bakery specialties baked fresh daily.',
    alt: 'Freshly baked artisanal croissants and pastries at Chaayé Khana',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
  },

  // 04 — INTERIOR / THE ROOM (Cinematic full-width architecture)
  {
    id: 'gallery-04',
    theme: '03 — THE ROOM',
    category: 'ARCHITECTURE & AMBIENCE',
    caption: 'The main dining room — a sanctuary of natural timber, literature, and warm welcoming light.',
    alt: 'Atmospheric dining hall of Chaayé Khana with timber architecture, bookshelves, and tables',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2000&q=85',
  },

  // 05 — PEOPLE (Hospitality & connection)
  {
    id: 'gallery-05',
    theme: '04 — THE DETAIL',
    category: 'PEOPLE & HOSPITALITY',
    caption: 'Shared stories, quiet laughter, and genuine hospitality around the table.',
    alt: 'Guests enjoying tea, conversation, and hospitality at Chaayé Khana DHA-4',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85',
  },

  // 06 — INTERIOR (Library nook & quiet lounge)
  {
    id: 'gallery-06',
    theme: '04 — THE DETAIL',
    category: 'THE LIBRARY LOUNGE',
    caption: 'Quiet wooden corners curated for slow reading, thought, and contemplation.',
    alt: 'Library reading nook and vintage bookshelves at Chaayé Khana',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
  },

  // 07 — DETAIL (Tactile teaware & craftsmanship)
  {
    id: 'gallery-07',
    theme: '04 — THE DETAIL',
    category: 'TACTILE CRAFTSMANSHIP',
    caption: 'Hand-thrown ceramic teacups, raw textures, and mindful brewing details.',
    alt: 'Close-up detail of handcrafted ceramic teacup and artisanal tea setting',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1200&q=85',
  },

  // 08 — EVENING (Warm ambient dining room)
  {
    id: 'gallery-08',
    theme: '05 — THE EVENING',
    category: 'AFTER-DARK MOOD',
    caption: 'Intimate evening gatherings illuminated by warm ambient lighting and quiet luxury.',
    alt: 'Atmospheric evening dining ambience with warm lamps at Chaayé Khana DHA-4',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1600&q=85',
  },

  // 09 — EVENING (DHA-4 Rooftop & Terrace)
  {
    id: 'gallery-09',
    theme: '05 — THE EVENING',
    category: 'DHA-4 ROOFTOP TERRACE',
    caption: 'Open-air rooftop terrace dining under the starlit Rawalpindi evening sky.',
    alt: 'Chaayé Khana DHA-4 open-air rooftop terrace dining at night with ambient lighting and city views',
    imageUrl: rooftopImage,
  },
];

export const GallerySection: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Keyboard navigation for Lightbox & body scroll lock
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_ITEMS.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedImageIndex]);

  // Touch handlers for mobile lightbox swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || selectedImageIndex === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diffX > 50) {
      // Swiped right -> previous
      setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : null));
    } else if (diffX < -50) {
      // Swiped left -> next
      setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_ITEMS.length : null));
    }
    touchStartXRef.current = null;
  };

  // Helper render for individual interactive photo card
  const renderPhotoCard = (
    item: GalleryItem,
    index: number,
    aspectRatioClass: string,
    additionalClasses = ''
  ) => {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`View photograph: ${item.caption}`}
        onClick={() => setSelectedImageIndex(index)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedImageIndex(index);
          }
        }}
        className={`group relative overflow-hidden bg-[#09090b] cursor-pointer rounded-[2px] border border-white/[0.07] hover:border-white/25 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white transition-all duration-500 select-none ${additionalClasses}`}
      >
        <div className={`w-full ${aspectRatioClass} overflow-hidden`}>
          <img
            src={item.imageUrl}
            alt={item.alt}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Subtle dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-50 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Minimal caption reveal */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 lg:p-7 z-10 pointer-events-none transition-all duration-400 ease-out transform translate-y-1 sm:translate-y-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
          <span className="block text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-neutral-400 font-medium mb-1">
            {item.category}
          </span>
          <p className="font-serif text-white font-normal text-[15px] sm:text-[17px] leading-snug">
            {item.caption}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
      id="gallery-section"
      className="scroll-mt-20 sm:scroll-mt-24 relative w-full bg-[#030304] text-white pt-24 sm:pt-32 pb-32 sm:pb-40 border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14">
        {/* ========================================================================= */}
        {/* 1. SECTION TITLE & EDITORIAL INTRO */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.28em] uppercase text-neutral-400 block mb-3.5">
            OUR GALLERY
          </span>

          <h2 className="font-serif font-normal text-white text-[36px] sm:text-[48px] lg:text-[58px] leading-[1.08] tracking-tight">
            MOMENTS AT CHAAYÉ KHANA
          </h2>

          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16.5px] leading-[1.7] text-[#AFAFAF] max-w-[650px] mx-auto font-light">
            &ldquo;A glimpse into the food, people and moments that make every visit memorable.&rdquo;
          </p>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL STORY SEQUENCE: FOOD → CHAI → PEOPLE → INTERIOR → DETAIL → EVENING */}
        {/* ========================================================================= */}
        <div className="space-y-16 sm:space-y-24 lg:space-y-28">
          {/* ----------------------------------------------------------------------- */}
          {/* COMPOSITION 01 — LARGE FEATURE IMAGE (Dominant Food) */}
          {/* ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                01 — THE TABLE
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06]" />
            </div>
            {renderPhotoCard(GALLERY_ITEMS[0], 0, 'aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]')}
          </motion.div>

          {/* ----------------------------------------------------------------------- */}
          {/* COMPOSITION 02 — TWO SMALLER IMAGES (Chai & Bakery/Food Detail) */}
          {/* ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                02 — THE RITUAL
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
              {renderPhotoCard(GALLERY_ITEMS[1], 1, 'aspect-[4/3] sm:aspect-[16/11]')}
              {renderPhotoCard(GALLERY_ITEMS[2], 2, 'aspect-[4/3] sm:aspect-[16/11]')}
            </div>
          </motion.div>

          {/* ----------------------------------------------------------------------- */}
          {/* COMPOSITION 03 — FULL-WIDTH CINEMATIC IMAGE (Interior & Room) */}
          {/* ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                03 — THE ROOM
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06]" />
            </div>
            {renderPhotoCard(GALLERY_ITEMS[3], 3, 'aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/9]')}
          </motion.div>

          {/* ----------------------------------------------------------------------- */}
          {/* COMPOSITION 04 — THREE-IMAGE COMPOSITION (People, Library Interior, Detail) */}
          {/* ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                04 — THE DETAIL
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
              {renderPhotoCard(GALLERY_ITEMS[4], 4, 'aspect-[4/3] sm:aspect-[16/12]')}
              {renderPhotoCard(GALLERY_ITEMS[5], 5, 'aspect-[4/3] sm:aspect-[16/12]')}
              {renderPhotoCard(GALLERY_ITEMS[6], 6, 'aspect-[4/3] sm:aspect-[16/12]')}
            </div>
          </motion.div>

          {/* ----------------------------------------------------------------------- */}
          {/* COMPOSITION 05 — LARGE EVENING COMPOSITION (Evening Ambience & DHA-4 Rooftop) */}
          {/* ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                05 — THE EVENING
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-stretch">
              {/* Left: Atmospheric Evening Interior (5 cols) */}
              <div className="lg:col-span-5 flex flex-col">
                {renderPhotoCard(GALLERY_ITEMS[7], 7, 'aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] h-full')}
              </div>
              {/* Right: Dominant Rooftop & Terrace (7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                {renderPhotoCard(GALLERY_ITEMS[8], 8, 'aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/11] h-full')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {selectedImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photograph preview"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn select-none"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex(null);
            }}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 z-50 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
            aria-label="Close image preview"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          {/* Previous image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : null));
            }}
            className="flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2.5 sm:p-3.5 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 z-50 items-center justify-center cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white border border-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          {/* Next image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % GALLERY_ITEMS.length : null));
            }}
            className="flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2.5 sm:p-3.5 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 z-50 items-center justify-center cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white border border-white/10"
            aria-label="Next image"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>

          {/* Lightbox Content Container */}
          <div
            className="max-w-5xl max-h-[88vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={GALLERY_ITEMS[selectedImageIndex].imageUrl}
              alt={GALLERY_ITEMS[selectedImageIndex].alt}
              className="max-w-full max-h-[72vh] object-contain rounded-sm shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-5 text-center max-w-2xl px-4">
              <span className="text-[10px] tracking-[0.24em] uppercase text-neutral-400 font-medium block mb-1">
                {GALLERY_ITEMS[selectedImageIndex].theme} • {selectedImageIndex + 1} / {GALLERY_ITEMS.length}
              </span>
              <p className="text-[15px] sm:text-[17px] text-white font-light font-serif">
                {GALLERY_ITEMS[selectedImageIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

