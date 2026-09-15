import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import rooftopImage from '../assets/images/chaaye_khana_rooftop_1788985644536.jpg';

interface EditorialStoryChapter {
  id: string;
  chapterNumber: string;
  chapterTitle: string;
  subTitle: string;
  items: {
    id: string;
    caption: string;
    alt: string;
    imageUrl: string;
    aspectRatioClass: string;
  }[];
}

const EDITORIAL_CHAPTERS: EditorialStoryChapter[] = [
  // 01 — FOOD
  {
    id: 'food',
    chapterNumber: '01',
    chapterTitle: 'FOOD',
    subTitle: 'Culinary craft, morning sourdough and artisanal plating.',
    items: [
      {
        id: 'gallery-food-01',
        caption: 'Artisanal morning table with freshly baked sourdough, farm eggs and condiments.',
        alt: 'Plated gourmet breakfast spread with sourdough bread, fresh eggs and tea at Chaayé Khana DHA-4',
        imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=2000&q=85',
        aspectRatioClass: 'aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10]',
      },
      {
        id: 'gallery-food-02',
        caption: 'Handcrafted golden flaky pastries and morning bakery selections.',
        alt: 'Freshly baked artisanal croissants and pastries at Chaayé Khana',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
        aspectRatioClass: 'aspect-[4/3] sm:aspect-[4/3] lg:aspect-[1/1]',
      },
    ],
  },

  // 02 — CHAI
  {
    id: 'chai',
    chapterNumber: '02',
    chapterTitle: 'CHAI',
    subTitle: 'Simmered slow in copper kettles with single-estate orthodox leaves.',
    items: [
      {
        id: 'gallery-chai-01',
        caption: 'Signature Karak Chai poured with artisanal precision into handcrafted teaware.',
        alt: 'Authentic rich Karak Chai poured into traditional ceramic teaware with steam at Chaayé Khana',
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1800&q=85',
        aspectRatioClass: 'aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/9]',
      },
    ],
  },

  // 03 — PEOPLE
  {
    id: 'people',
    chapterNumber: '03',
    chapterTitle: 'PEOPLE',
    subTitle: 'Unrushed conversations, quiet reading and genuine hospitality.',
    items: [
      {
        id: 'gallery-people-01',
        caption: 'Shared laughter and authentic moments over tea and comforting food.',
        alt: 'Guests enjoying tea, conversation, and hospitality at Chaayé Khana DHA-4',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=85',
        aspectRatioClass: 'aspect-[16/10] sm:aspect-[16/9] lg:aspect-[18/9]',
      },
    ],
  },

  // 04 — INTERIOR
  {
    id: 'interior',
    chapterNumber: '04',
    chapterTitle: 'INTERIOR',
    subTitle: 'Natural oak, vintage bookshelves and intimate dining spaces.',
    items: [
      {
        id: 'gallery-interior-01',
        caption: 'The main hall — a serene haven of natural wood, warm lamplight and curated books.',
        alt: 'Atmospheric dining hall of Chaayé Khana with timber architecture, bookshelves, and tables',
        imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2000&q=85',
        aspectRatioClass: 'aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/10]',
      },
      {
        id: 'gallery-interior-02',
        caption: 'The library nook designed for slow contemplation and quiet moments.',
        alt: 'Library reading nook and vintage bookshelves at Chaayé Khana',
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
        aspectRatioClass: 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10]',
      },
    ],
  },

  // 05 — DETAIL
  {
    id: 'detail',
    chapterNumber: '05',
    chapterTitle: 'DETAIL',
    subTitle: 'Tactile ceramics, raw textures and the quiet craft of the pour.',
    items: [
      {
        id: 'gallery-detail-01',
        caption: 'Handcrafted ceramic teacups and mindful brewing details.',
        alt: 'Close-up detail of handcrafted ceramic teacup and artisanal tea setting',
        imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1600&q=85',
        aspectRatioClass: 'aspect-[16/10] sm:aspect-[21/9] lg:aspect-[21/8]',
      },
    ],
  },

  // 06 — EVENING
  {
    id: 'evening',
    chapterNumber: '06',
    chapterTitle: 'EVENING',
    subTitle: 'Open-air terrace dining under the evening sky.',
    items: [
      {
        id: 'gallery-evening-01',
        caption: 'Intimate evening dining glowing under warm ambient light.',
        alt: 'Atmospheric evening dining ambience with warm lamps at Chaayé Khana DHA-4',
        imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1600&q=85',
        aspectRatioClass: 'aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3]',
      },
      {
        id: 'gallery-evening-02',
        caption: 'The DHA-4 open-air rooftop terrace illuminated for evening gatherings.',
        alt: 'Chaayé Khana DHA-4 open-air rooftop terrace dining at night with ambient lighting and city views',
        imageUrl: rooftopImage,
        aspectRatioClass: 'aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/11]',
      },
    ],
  },
];

// Flat list for lightbox navigation
const ALL_GALLERY_IMAGES = EDITORIAL_CHAPTERS.flatMap((chapter) =>
  chapter.items.map((item) => ({
    ...item,
    chapterNumber: chapter.chapterNumber,
    chapterTitle: chapter.chapterTitle,
  }))
);

export const GallerySection: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % ALL_GALLERY_IMAGES.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + ALL_GALLERY_IMAGES.length) % ALL_GALLERY_IMAGES.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedImageIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || selectedImageIndex === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diffX > 50) {
      setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + ALL_GALLERY_IMAGES.length) % ALL_GALLERY_IMAGES.length : null));
    } else if (diffX < -50) {
      setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % ALL_GALLERY_IMAGES.length : null));
    }
    touchStartXRef.current = null;
  };

  const openLightboxById = (id: string) => {
    const idx = ALL_GALLERY_IMAGES.findIndex((img) => img.id === id);
    if (idx !== -1) {
      setSelectedImageIndex(idx);
    }
  };

  return (
    <section
      id="gallery-section"
      className="scroll-mt-20 sm:scroll-mt-24 relative w-full bg-[#030304] text-white pt-24 sm:pt-32 lg:pt-40 pb-32 sm:pb-40 border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* ========================================================================= */}
        {/* SECTION HEADER: Visual Editorial Intro */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.28em] uppercase text-neutral-400 block mb-4">
            OUR GALLERY
          </span>

          <h2 className="font-serif font-normal text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.08] tracking-tight mb-4">
            Moments at Chaayé Khana
          </h2>

          <p className="text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed text-[#AFAFAF] max-w-[620px] mx-auto font-light">
            A visual narrative through food, tea, people, architecture, and quiet evening moments.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* EDITORIAL VISUAL STORY SEQUENCE: FOOD → CHAI → PEOPLE → INTERIOR → DETAIL → EVENING */}
        {/* ========================================================================= */}
        <div className="space-y-24 sm:space-y-32 lg:space-y-36">
          {EDITORIAL_CHAPTERS.map((chapter) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Chapter Header Line */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/[0.08] pb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] sm:text-[12px] font-mono tracking-[0.24em] text-neutral-400 uppercase">
                    {chapter.chapterNumber} —
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-normal uppercase tracking-wide">
                    {chapter.chapterTitle}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md text-left sm:text-right">
                  {chapter.subTitle}
                </p>
              </div>

              {/* Asymmetric Chapter Image Composition */}
              {chapter.items.length === 1 ? (
                /* Single Full-Hero Image */
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`View photograph: ${chapter.items[0].caption}`}
                  onClick={() => openLightboxById(chapter.items[0].id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightboxById(chapter.items[0].id);
                    }
                  }}
                  className="group relative overflow-hidden bg-neutral-950 cursor-pointer rounded-[2px] border border-white/[0.07] hover:border-white/20 transition-colors duration-500 select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
                >
                  <div className={`w-full ${chapter.items[0].aspectRatioClass} overflow-hidden`}>
                    <img
                      src={chapter.items[0].imageUrl}
                      alt={chapter.items[0].alt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400 pointer-events-none" />
                  <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-8 right-5 sm:right-8 z-10 pointer-events-none">
                    <p className="text-xs sm:text-sm text-white/90 font-light font-serif">
                      {chapter.items[0].caption}
                    </p>
                  </div>
                </div>
              ) : chapter.id === 'food' ? (
                /* Food: 8 cols large spread + 4 cols culinary detail */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`View photograph: ${chapter.items[0].caption}`}
                    onClick={() => openLightboxById(chapter.items[0].id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxById(chapter.items[0].id);
                      }
                    }}
                    className="lg:col-span-8 group relative overflow-hidden bg-neutral-950 cursor-pointer rounded-[2px] border border-white/[0.07] hover:border-white/20 transition-colors duration-500 select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
                  >
                    <div className="w-full h-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[280px] lg:min-h-[420px] overflow-hidden">
                      <img
                        src={chapter.items[0].imageUrl}
                        alt={chapter.items[0].alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400 pointer-events-none" />
                    <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-8 right-5 z-10 pointer-events-none">
                      <p className="text-xs sm:text-sm text-white/90 font-light font-serif">
                        {chapter.items[0].caption}
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`View photograph: ${chapter.items[1].caption}`}
                    onClick={() => openLightboxById(chapter.items[1].id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxById(chapter.items[1].id);
                      }
                    }}
                    className="lg:col-span-4 group relative overflow-hidden bg-neutral-950 cursor-pointer rounded-[2px] border border-white/[0.07] hover:border-white/20 transition-colors duration-500 select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
                  >
                    <div className="w-full h-full aspect-[4/3] lg:aspect-auto min-h-[240px] lg:min-h-[420px] overflow-hidden">
                      <img
                        src={chapter.items[1].imageUrl}
                        alt={chapter.items[1].alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400 pointer-events-none" />
                    <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-6 right-5 z-10 pointer-events-none">
                      <p className="text-xs sm:text-sm text-white/90 font-light font-serif">
                        {chapter.items[1].caption}
                      </p>
                    </div>
                  </div>
                </div>
              ) : chapter.id === 'interior' ? (
                /* Interior: 7 cols main timber dining room + 5 cols library nook */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`View photograph: ${chapter.items[0].caption}`}
                    onClick={() => openLightboxById(chapter.items[0].id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxById(chapter.items[0].id);
                      }
                    }}
                    className="lg:col-span-7 group relative overflow-hidden bg-neutral-950 cursor-pointer rounded-[2px] border border-white/[0.07] hover:border-white/20 transition-colors duration-500 select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
                  >
                    <div className="w-full h-full aspect-[16/10] sm:aspect-[16/10] min-h-[260px] lg:min-h-[380px] overflow-hidden">
                      <img
                        src={chapter.items[0].imageUrl}
                        alt={chapter.items[0].alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400 pointer-events-none" />
                    <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-8 right-5 z-10 pointer-events-none">
                      <p className="text-xs sm:text-sm text-white/90 font-light font-serif">
                        {chapter.items[0].caption}
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`View photograph: ${chapter.items[1].caption}`}
                    onClick={() => openLightboxById(chapter.items[1].id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxById(chapter.items[1].id);
                      }
                    }}
                    className="lg:col-span-5 group relative overflow-hidden bg-neutral-950 cursor-pointer rounded-[2px] border border-white/[0.07] hover:border-white/20 transition-colors duration-500 select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
                  >
                    <div className="w-full h-full aspect-[4/3] sm:aspect-[16/10] min-h-[240px] lg:min-h-[380px] overflow-hidden">
                      <img
                        src={chapter.items[1].imageUrl}
                        alt={chapter.items[1].alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400 pointer-events-none" />
                    <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-6 right-5 z-10 pointer-events-none">
                      <p className="text-xs sm:text-sm text-white/90 font-light font-serif">
                        {chapter.items[1].caption}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Evening: 5 cols glowing dining room + 7 cols open-air rooftop terrace */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`View photograph: ${chapter.items[0].caption}`}
                    onClick={() => openLightboxById(chapter.items[0].id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxById(chapter.items[0].id);
                      }
                    }}
                    className="lg:col-span-5 group relative overflow-hidden bg-neutral-950 cursor-pointer rounded-[2px] border border-white/[0.07] hover:border-white/20 transition-colors duration-500 select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
                  >
                    <div className="w-full h-full aspect-[4/3] sm:aspect-[16/11] min-h-[260px] lg:min-h-[380px] overflow-hidden">
                      <img
                        src={chapter.items[0].imageUrl}
                        alt={chapter.items[0].alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400 pointer-events-none" />
                    <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-6 right-5 z-10 pointer-events-none">
                      <p className="text-xs sm:text-sm text-white/90 font-light font-serif">
                        {chapter.items[0].caption}
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`View photograph: ${chapter.items[1].caption}`}
                    onClick={() => openLightboxById(chapter.items[1].id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxById(chapter.items[1].id);
                      }
                    }}
                    className="lg:col-span-7 group relative overflow-hidden bg-neutral-950 cursor-pointer rounded-[2px] border border-white/[0.07] hover:border-white/20 transition-colors duration-500 select-none focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
                  >
                    <div className="w-full h-full aspect-[16/10] sm:aspect-[16/10] min-h-[260px] lg:min-h-[380px] overflow-hidden">
                      <img
                        src={chapter.items[1].imageUrl}
                        alt={chapter.items[1].alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-400 pointer-events-none" />
                    <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-8 right-5 z-10 pointer-events-none">
                      <p className="text-xs sm:text-sm text-white/90 font-light font-serif">
                        {chapter.items[1].caption}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MINIMAL EDITORIAL LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {selectedImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photograph preview"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
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
            <X size={20} strokeWidth={1.5} />
          </button>

          {/* Previous image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + ALL_GALLERY_IMAGES.length) % ALL_GALLERY_IMAGES.length : null));
            }}
            className="flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2.5 sm:p-3.5 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 z-50 items-center justify-center cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white border border-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          {/* Next image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % ALL_GALLERY_IMAGES.length : null));
            }}
            className="flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2.5 sm:p-3.5 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 z-50 items-center justify-center cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white border border-white/10"
            aria-label="Next image"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>

          {/* Lightbox Content Container */}
          <div
            className="max-w-5xl max-h-[88vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={ALL_GALLERY_IMAGES[selectedImageIndex].imageUrl}
              alt={ALL_GALLERY_IMAGES[selectedImageIndex].alt}
              className="max-w-full max-h-[72vh] object-contain rounded-[2px] shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-5 text-center max-w-2xl px-4">
              <span className="text-[10px] tracking-[0.24em] uppercase text-neutral-400 font-medium block mb-1">
                {ALL_GALLERY_IMAGES[selectedImageIndex].chapterNumber} — {ALL_GALLERY_IMAGES[selectedImageIndex].chapterTitle} &bull; {selectedImageIndex + 1} / {ALL_GALLERY_IMAGES.length}
              </span>
              <p className="text-[14px] sm:text-[16px] text-white font-light font-serif">
                {ALL_GALLERY_IMAGES[selectedImageIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
