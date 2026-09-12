import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Phone, ArrowUpRight } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import ladiesTuesdayImage from '../assets/images/ladies_tuesday_promo_1789219305663.jpg';

export const VisitUsSection: React.FC = () => {
  const { cafeSettings, setCurrentView } = useCafe();

  const handleViewLocation = () => {
    // Open Google Maps location from dynamic settings
    const mapsUrl = cafeSettings.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=Chaaye+Khana+DHA+Phase+4+Rawalpindi';
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleContactUs = () => {
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="visit-us-section"
      className="scroll-mt-20 sm:scroll-mt-24 relative w-full bg-[#040405] text-white py-24 sm:py-32 lg:py-36 border-t border-neutral-900 overflow-hidden"
    >
      {/* Subtle ambient gradient in the background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.02),transparent)]" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: LOCATION INFORMATION & BUTTONS */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6 flex flex-col justify-center space-y-8"
          >
            {/* Eyebrow */}
            <div>
              <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.24em] uppercase text-neutral-400 block mb-3.5">
                VISIT US
              </span>

              {/* Main Heading */}
              <h2 className="font-serif font-normal text-white text-[34px] sm:text-[44px] lg:text-[50px] leading-[1.1] tracking-[-0.01em]">
                CHAAYÉ KHANA — DHA-4
              </h2>

              {/* Location Line */}
              <div className="mt-3 flex items-center gap-2 text-neutral-300 font-light text-[15px] sm:text-[16px]">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>{cafeSettings.address}</span>
              </div>
            </div>

            {/* Narrative / Context */}
            <p className="text-[#AFAFAF] text-[15px] sm:text-[16px] leading-[1.75] font-light max-w-xl">
              Immerse yourself in timeless hospitality, artisanal tea brewing, and all-day culinary excellence. From quiet morning library corners to open-air rooftop evenings, our DHA-4 lounge welcomes you with warm wood, fresh aromas, and good conversations.
            </p>

            {/* Essential Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-white/[0.06]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-400 text-[11px] uppercase tracking-[0.2em] font-medium">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Hours of Hospitality</span>
                </div>
                <p className="text-white text-[14px] sm:text-[15px] font-light">
                  {cafeSettings.openingHoursDisplay}
                </p>
                <p className="text-neutral-500 text-[12px] font-light">
                  Breakfast, Lunch, High Tea & Dinner
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-400 text-[11px] uppercase tracking-[0.2em] font-medium">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Direct Inquiries</span>
                </div>
                <a
                  href={`tel:${cafeSettings.phone}`}
                  className="text-white text-[14px] sm:text-[15px] font-light block hover:text-neutral-300 transition-colors"
                >
                  {cafeSettings.phone}
                </a>
                <p className="text-neutral-500 text-[12px] font-light">
                  Dine-in, Takeaway & Table Queries
                </p>
              </div>
            </div>

            {/* Premium Rectangular Action Buttons (No Pill Shapes, Clean Editorial Styling) */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* VIEW LOCATION BUTTON */}
              <button
                type="button"
                onClick={handleViewLocation}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-transparent border border-white/20 hover:border-white text-white hover:bg-white/[0.04] text-[12px] sm:text-[12.5px] font-medium tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[2px] select-none"
              >
                <span>VIEW LOCATION</span>
                <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>

              {/* CONTACT US BUTTON */}
              <button
                type="button"
                onClick={handleContactUs}
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-transparent border border-white/20 hover:border-white text-white hover:bg-white/[0.04] text-[12px] sm:text-[12.5px] font-medium tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer rounded-[2px] select-none"
              >
                <span>CONTACT US</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/50 group-hover:bg-white transition-colors" />
              </button>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: LARGE PHOTOREALISTIC INTERIOR IMAGE */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6 w-full"
          >
            <div className="group relative w-full overflow-hidden rounded-[2px] border border-white/[0.06] bg-[#09090b] shadow-2xl">
              {/* Immersive Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] w-full overflow-hidden">
                <img
                  src={ladiesTuesdayImage}
                  alt="Ladies Tuesday - Free tea for all ladies every Tuesday, all day at Chaayé Khana DHA Phase 4"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle cinematic gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none" />

                {/* Ambient Interior Badge */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-[2px] border border-white/10">
                    <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/90 font-medium block">
                      LADIES TUESDAY PROMO
                    </span>
                    <span className="text-[12px] sm:text-[13px] text-white/70 font-light block">
                      Free Tea • All Day
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
