import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import rooftopImage from '../assets/images/chaaye_khana_rooftop_1788985644536.jpg';

interface GalleryItem {
  id: string;
  type: 'standard' | 'wide';
  category: string;
  caption: string;
  alt: string;
  imageUrl: string;
  aspectClass: string;
  gridClass: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  // ROW 1: [ Photo ] [ Photo ]
  {
    id: 'item-1',
    type: 'standard',
    category: 'MORNING RITUALS',
    caption: 'Freshly prepared artisanal breakfast spread.',
    alt: 'Freshly prepared breakfast spread with sourdough toast, eggs, and warm tea at Chaayé Khana DHA-4',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85',
    aspectClass: 'aspect-[4/3] sm:aspect-[16/11]',
    gridClass: 'col-span-1',
  },
  {
    id: 'item-2',
    type: 'standard',
    category: 'CHAI CULTURE',
    caption: 'Signature Karak Chai, brewed slow in copper.',
    alt: 'Authentic rich Karak Chai poured into traditional ceramic teaware at Chaayé Khana DHA-4',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85',
    aspectClass: 'aspect-[4/3] sm:aspect-[16/11]',
    gridClass: 'col-span-1',
  },

  // ROW 2: [ BIG PHOTO ]
  {
    id: 'item-3',
    type: 'wide',
    category: 'DHA-4 ROOFTOP & TERRACE',
    caption: 'Panoramic open-air dining under city night lights.',
    alt: 'Chaayé Khana DHA-4 open-air rooftop terrace dining at night with ambient lighting and city views',
    imageUrl: rooftopImage,
    aspectClass: 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/10]',
    gridClass: 'col-span-1 sm:col-span-2',
  },

  // ROW 3: [ Photo ] [ Photo ]
  {
    id: 'item-4',
    type: 'standard',
    category: 'THE LIBRARY & LOUNGE',
    caption: 'Warm wooden corners made for quiet reading & conversation.',
    alt: 'Cozy wooden library dining lounge at Chaayé Khana DHA-4 with books and armchairs',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    aspectClass: 'aspect-[4/3] sm:aspect-[16/11]',
    gridClass: 'col-span-1',
  },
  {
    id: 'item-5',
    type: 'standard',
    category: 'KITCHEN & BAKERY',
    caption: 'Handcrafted pastries and warm culinary specialties.',
    alt: 'Artisanal freshly prepared gourmet dish and bakery specialties at Chaayé Khana DHA-4',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85',
    aspectClass: 'aspect-[4/3] sm:aspect-[16/11]',
    gridClass: 'col-span-1',
  },

  // ROW 4: [ BIG PHOTO ]
  {
    id: 'item-6',
    type: 'wide',
    category: 'EVENING AMBIENCE',
    caption: 'Warm moments, tea poured slowly, and unforgettable memories.',
    alt: 'Atmospheric evening ambiance and cozy warm lamps at Chaayé Khana DHA-4 in Rawalpindi',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1600&q=85',
    aspectClass: 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/10]',
    gridClass: 'col-span-1 sm:col-span-2',
  },
];

export const GallerySection: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Keyboard navigation for Lightbox & body scroll lock
  useEffect(() => {
    if (selectedImageIndex === null) return;

    // Prevent background scrolling while open
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

  return (
    <section
      id="gallery-section"
      className="scroll-mt-20 sm:scroll-mt-24 relative w-full bg-[#030304] text-white pt-24 sm:pt-32 pb-32 sm:pb-40 border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-14">
        {/* ========================================================================= */}
        {/* 1. SECTION HEADING */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          {/* Eyebrow */}
          <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.24em] uppercase text-neutral-400 block mb-3.5">
            OUR GALLERY
          </span>

          {/* Main Heading */}
          <h2 className="font-serif font-normal text-white text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.08] tracking-[-0.01em]">
            Moments at Chaayé Khana.
          </h2>

          {/* Supporting Text */}
          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[16.5px] leading-[1.7] text-[#AFAFAF] max-w-[650px] mx-auto font-light">
            A glimpse into the food, people and moments that make every visit memorable.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. ALTERNATING EDITORIAL GRID: [PHOTO] [PHOTO] / [BIG PHOTO] */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-7 items-stretch">
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${item.caption}`}
              onClick={() => setSelectedImageIndex(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedImageIndex(index);
                }
              }}
              className={`group relative overflow-hidden bg-[#09090b] cursor-pointer rounded-[2px] border border-white/[0.06] hover:border-white/20 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white transition-all duration-500 select-none ${item.gridClass}`}
            >
              {/* Image Frame with Aspect Ratio */}
              <div className={`w-full ${item.aspectClass} overflow-hidden`}>
                <img
                  src={item.imageUrl}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.025] motion-reduce:transform-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Atmospheric Vignette & Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 lg:p-7 z-10 pointer-events-none transition-all duration-400 ease-out transform translate-y-1 sm:translate-y-2 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
                <span className="block text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/70 font-medium mb-1.5">
                  {item.category}
                </span>
                <p className={`font-serif text-white font-normal ${item.type === 'wide' ? 'text-[18px] sm:text-[22px]' : 'text-[15px] sm:text-[17px]'} leading-snug`}>
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {selectedImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
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
              className="max-w-full max-h-[74vh] object-contain rounded-sm shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-5 text-center">
              <span className="text-[10px] tracking-[0.22em] uppercase text-white/60 font-medium block mb-1">
                {GALLERY_ITEMS[selectedImageIndex].category} • {selectedImageIndex + 1} / {GALLERY_ITEMS.length}
              </span>
              <p className="text-[15px] text-white font-light font-serif">
                {GALLERY_ITEMS[selectedImageIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
