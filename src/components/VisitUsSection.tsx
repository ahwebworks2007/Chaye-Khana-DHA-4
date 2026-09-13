import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowUpRight, Navigation, Phone, Clock } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import rooftopImage from '../assets/images/chaaye_khana_rooftop_1788985644536.jpg';

export const VisitUsSection: React.FC = () => {
  const { cafeSettings } = useCafe();

  // Verified exact Google Maps Destination URL
  const destinationMapsUrl =
    cafeSettings.googleMapsUrl ||
    'https://www.google.com/maps/place/Chaay%C3%A9+Khana+Sector+F+Commercial+Area+DHA+Phase+4+Rawalpindi/@33.5651,73.0982,17z';

  // Verified exact Google Maps Directions URL targeting DHA-4 coordinates
  const directionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=33.5651,73.0982&destination_name=Chaay%C3%A9+Khana+DHA+Phase+4';

  const handleOpenGoogleMaps = () => {
    window.open(destinationMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleGetDirections = () => {
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="visit-us-section"
      aria-label="Find Your Way to Us - DHA Phase 4"
      className="scroll-mt-20 sm:scroll-mt-24 relative w-full bg-[#040405] text-white py-28 sm:py-36 lg:py-44 border-t border-white/[0.06] overflow-hidden select-none"
    >
      {/* Subtle ambient lighting texture */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,255,255,0.02),transparent)]" />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: LARGE CINEMATIC DESTINATION PHOTOGRAPH (55-60% width) */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 flex flex-col space-y-3"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                DESTINATION • DHA PHASE 4
              </span>
              <div className="h-[1px] flex-1 bg-white/[0.06]" />
            </div>

            <div className="group relative w-full overflow-hidden rounded-[2px] border border-white/[0.08] bg-[#09090b] shadow-2xl">
              {/* Image Frame with Aspect Ratio */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/11] w-full overflow-hidden">
                <img
                  src={rooftopImage}
                  alt="Chaayé Khana DHA Phase 4 open-air rooftop terrace and dining destination in Rawalpindi"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle cinematic gradient vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none" />

                {/* Ambient destination caption */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 z-10 pointer-events-none flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-neutral-400 font-medium block mb-1">
                      SECTOR F • COMMERCIAL AREA
                    </span>
                    <p className="font-serif text-white font-normal text-[16px] sm:text-[19px] leading-snug">
                      Open-Air Rooftop &amp; Timber Dining Lounge
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 whitespace-nowrap">
                    RAWALPINDI
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: EDITORIAL INFORMATION, REFINED MAP PANEL & ACTIONS */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-5 flex flex-col justify-center space-y-7 sm:space-y-8 text-left"
          >
            {/* 1. Header: Eyebrow + Main Heading + Destination Philosophy */}
            <div className="space-y-3.5">
              <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.28em] uppercase text-neutral-400 block">
                FIND YOUR WAY TO US
              </span>

              <h2 className="font-serif font-normal text-white text-[32px] sm:text-[44px] xl:text-[48px] leading-[1.08] tracking-tight">
                DHA PHASE 4
              </h2>

              <p className="text-[#AFAFAF] text-[15px] sm:text-[16px] leading-[1.75] font-light pt-1">
                A tranquil destination in the heart of Sector F. Step in from the avenue into an unhurried sanctuary of timber architecture, fresh tea aromas, and warm hospitality.
              </p>

              {/* Destination Statement */}
              <div className="pt-1 flex items-center gap-3">
                <div className="w-6 h-[1px] bg-neutral-600" />
                <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-[#D8D4CD] font-medium">
                  &ldquo;Come for the chai. Stay for the conversation.&rdquo;
                </span>
              </div>
            </div>

            {/* 2. Practical Location & Timing Details (Minimal, No heavy card clutter) */}
            <div className="space-y-4 pt-2 border-t border-white/[0.08]">
              {/* Address */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase block">
                  ADDRESS
                </span>
                <p className="text-white text-[14px] sm:text-[15px] font-light leading-relaxed">
                  {cafeSettings.address || 'Sector F, Commercial Area, DHA Phase 4, Rawalpindi / Islamabad'}
                </p>
              </div>

              {/* Timings */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase block">
                  OPEN DAILY
                </span>
                <p className="text-white text-[14px] sm:text-[15px] font-light flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{cafeSettings.openingHoursDisplay || 'Monday – Sunday: 8:00 AM – 12:00 Midnight'}</span>
                </p>
              </div>

              {/* Phone / Inquiries */}
              <div className="space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase block">
                  DIRECT INQUIRIES
                </span>
                <a
                  href={`tel:${cafeSettings.phone}`}
                  className="text-white text-[14px] sm:text-[15px] font-light flex items-center gap-2 hover:text-neutral-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{cafeSettings.phone || '+92 51 111 242 293'}</span>
                </a>
              </div>
            </div>

            {/* 3. Refined Location Visual Treatment (Subtle Dark Map Panel with Coordinate Grid & Red Marker) */}
            <div
              onClick={handleOpenGoogleMaps}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenGoogleMaps();
                }
              }}
              title="Open Google Maps Location"
              className="group relative overflow-hidden rounded-[2px] border border-white/[0.08] bg-[#0a0a0c] p-4 sm:p-5 hover:border-white/25 transition-all duration-300 cursor-pointer select-none"
            >
              {/* Minimal architectural map grid background */}
              <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {/* Subtle recognized red map marker */}
                  <div className="w-9 h-9 rounded-[2px] bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin className="w-4 h-4 text-red-500 fill-red-500/20" />
                  </div>
                  <div>
                    <span className="text-[11px] tracking-[0.2em] uppercase text-white font-medium block">
                      CHAAYÉ KHANA DHA-4
                    </span>
                    <span className="text-[10px] font-mono tracking-wider text-neutral-400 block mt-0.5">
                      33.5651° N • 73.0982° E
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-neutral-400 group-hover:text-white text-[11px] font-mono tracking-wider uppercase transition-colors">
                  <span className="hidden sm:inline">EXPLORE MAP</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* 4. Action Buttons (Monochromatic, Rectangular, No Pills) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-3.5">
              {/* GOOGLE MAPS ACTION */}
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-transparent border border-white/25 hover:border-white text-white hover:bg-white/[0.05] text-[11.5px] sm:text-[12px] font-medium tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[2px] select-none"
              >
                <span>GOOGLE MAPS</span>
                <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>

              {/* GET DIRECTIONS ACTION */}
              <button
                type="button"
                onClick={handleGetDirections}
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-black hover:bg-[#eae6df] border border-white text-[11.5px] sm:text-[12px] font-medium tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[2px] select-none"
              >
                <Navigation className="w-3.5 h-3.5 text-black" />
                <span>GET DIRECTIONS</span>
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
