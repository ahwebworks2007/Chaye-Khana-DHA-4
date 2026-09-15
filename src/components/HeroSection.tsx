import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  MapPin,
  Utensils,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { DigitalMenuSection } from './DigitalMenuSection';
import { FullWidthPhotoSection } from './FullWidthPhotoSection';
import { TheArtOfChaiSection } from './TheArtOfChaiSection';
import { GallerySection } from './GallerySection';
import { PeopleAndHospitalitySection } from './PeopleAndHospitalitySection';
import { VisitUsSection } from './VisitUsSection';
import { FromTheKitchenSection } from './FromTheKitchenSection';
import rooftopImage from '../assets/images/chaaye_khana_rooftop_1788985644536.jpg';
import heroBackground from '../assets/images/hero_background_1789169162945.jpg';

export const HeroSection: React.FC = () => {
  const { cafeSettings, setCurrentView, activeBranch } = useCafe();
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('breakfast');

  // Sophisticated subtle scroll transition (desktop only, clamped, zero scroll-jacking)
  const [bgOffset, setBgOffset] = useState<number>(0);
  const [textExitOffset, setTextExitOffset] = useState<number>(0);
  const [heroOpacity, setHeroOpacity] = useState<number>(1);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Disable parallax calculations on mobile/touch to maximize battery, smoothness, and stability
    if (window.innerWidth < 1024) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < 900) {
            // Background stays visually grounded with ultra-subtle anchored drift (max 24px)
            const bg = Math.min(24, scrollY * 0.04);
            setBgOffset(bg);

            // Hero text & 3D smoothly move upward as user scrolls down (max 40px)
            const textOffset = Math.min(40, scrollY * 0.08);
            setTextExitOffset(textOffset);

            // Subtle gentle fade as the hero reaches the transition boundary
            const opacity = Math.max(0.2, 1 - scrollY / 850);
            setHeroOpacity(opacity);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#050507] text-white selection:bg-white selection:text-black">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Full-Screen Immersive Editorial Presentation */}
      {/* ========================================================================= */}
      <section className="relative min-h-[calc(100svh-4.5rem)] lg:min-h-screen flex items-center border-b border-neutral-900 overflow-hidden bg-[#030304]">
        {/* Atmospheric Cinematic Restaurant Background Layer */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
          aria-hidden="true"
          style={{
            transform: bgOffset > 0 ? `translateY(${bgOffset}px)` : undefined,
            willChange: 'transform',
          }}
        >
          {/* Base cinematic restaurant interior photograph (Full Bleed, Edge-to-Edge) */}
          <img
            src={heroBackground}
            alt="Artisanal breakfast spread with croissant, eggs, and Karak chai at Chaayé Khana"
            loading="eager"
            fetchPriority="high"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100 transition-transform duration-700 ease-out motion-reduce:transform-none"
          />

          {/* Subtle Dark Readability Overlay: Desktop: ~20% overlay, Mobile: ~28% overlay */}
          <div className="absolute inset-0 bg-black/28 lg:bg-black/20" />
          
          {/* Gentle left-to-right fade-out gradient to aid text readability without hiding the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent lg:from-black/45 lg:via-black/15 lg:to-transparent" />
          
          {/* Bottom transition gradient to ease seamless reveal into next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030304]/80" />
        </div>

        {/* Hero Interactive Foreground Container */}
        <div
          className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 lg:py-32 w-full relative z-10 transition-opacity duration-300"
          style={{
            transform: textExitOffset > 0 ? `translateY(-${textExitOffset}px)` : undefined,
            opacity: heroOpacity,
            willChange: 'transform, opacity',
          }}
        >
          <div className="max-w-3xl space-y-6 sm:space-y-8 text-left">
            {/* 1. Small Eyebrow */}
            <div className="transition-all duration-700 delay-100 ease-out">
              <span className="text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block">
                DHA-4 • RAWALPINDI
              </span>
            </div>

            {/* 2. Main Brand / Title */}
            <div className="transition-all duration-700 delay-150 ease-out">
              <span className="text-[14px] sm:text-[15px] uppercase tracking-[0.32em] text-[#D8D4CD] font-medium block">
                CHAAYÉ KHANA
              </span>
            </div>

            {/* 3. Primary Headline */}
            <div className="transition-all duration-700 delay-200 ease-out">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-normal leading-[1.08] tracking-tight">
                Where Tea, Food &amp; Conversation Meet
              </h1>
            </div>

            {/* 4. Short Refined Description */}
            <div className="transition-all duration-700 delay-300 ease-out">
              <p className="text-neutral-400 text-base sm:text-lg max-w-lg leading-relaxed font-light">
                An elevated dining experience crafted around exceptional food, signature chai and unforgettable moments.
              </p>
            </div>

            {/* 5. Primary CTA: EXPLORE MENU (Single CTA) */}
            <div className="pt-2 flex items-center transition-all duration-700 delay-500 ease-out">
              <button
                id="hero-explore-menu-btn"
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-[2px] border border-white/30 hover:border-white text-white hover:text-black hover:bg-white text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 ease-out text-center cursor-pointer select-none"
              >
                EXPLORE MENU
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR PHILOSOPHY: Premium Editorial Split Composition */}
      {/* ========================================================================= */}
      <section
        id="our-philosophy-section"
        aria-label="Our Philosophy"
        className="relative z-20 bg-[#030304] text-white py-24 sm:py-32 lg:py-36 px-6 sm:px-10 lg:px-16 overflow-hidden border-t border-white/[0.06]"
      >
        <div className="max-w-[1300px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Text Content (~45% width / col-span-5) */}
            <div className="lg:col-span-5 text-left space-y-6 sm:space-y-8">
              {/* Small Eyebrow */}
              <span className="text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block">
                OUR PHILOSOPHY
              </span>

              {/* Main Headline */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.08] tracking-tight">
                AN EXPERIENCE BREWED AROUND FOOD, TEA &amp; CONVERSATION.
              </h2>

              {/* Supporting Copy */}
              <p className="text-neutral-400 text-base sm:text-lg lg:text-[19px] leading-relaxed font-light max-w-xl">
                &ldquo;From slow mornings over chai to memorable meals shared with the people who matter, every moment at Chaayé Khana is made to be enjoyed.&rdquo;
              </p>
            </div>

            {/* Right Column: Large Premium Editorial Image (~55% width / col-span-7) */}
            <div className="lg:col-span-7 relative">
              <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[560px] rounded-[2px] border border-white/[0.08] overflow-hidden bg-neutral-950 group">
                <img
                  src={rooftopImage}
                  alt="Atmospheric dining and chai culture at Chaayé Khana DHA-4"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE EXPERIENCE: 3 Curated Culinary & Atmosphere Chapters */}
      {/* ========================================================================= */}
      <section
        id="signature-experience-section"
        className="relative bg-[#030304] text-white py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-16 overflow-hidden border-t border-white/[0.06]"
      >
        <div className="max-w-[1300px] mx-auto w-full">
          {/* Editorial Section Header */}
          <div className="text-center max-w-[750px] mx-auto mb-16 sm:mb-20 lg:mb-24">
            {/* Small Editorial Eyebrow */}
            <span className="uppercase text-[11px] sm:text-[12px] tracking-[0.28em] text-neutral-400 font-medium mb-5 block">
              SIGNATURE EXPERIENCE
            </span>

            {/* Main Section Heading */}
            <h2 className="font-serif font-normal text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.08] tracking-tight mb-5">
              Moments worth slowing down for.
            </h2>

            {/* Supporting Text */}
            <p className="text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed text-[#AFAFAF] max-w-[620px] mx-auto font-light">
              From slow breakfasts to carefully brewed chai and chef-crafted favourites, discover what makes every visit memorable.
            </p>
          </div>

          {/* 3 Giant Premium Photographic Moments */}
          <div className="space-y-10 sm:space-y-14 lg:space-y-16">
            {/* MOMENT 1: BREAKFAST */}
            <div
              id="signature-card-breakfast"
              role="button"
              tabIndex={0}
              aria-label="Explore Breakfast Menu"
              onClick={() => {
                const el = document.getElementById('menu-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
                const tab = document.getElementById('menu-tab-breakfast');
                if (tab) tab.click();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const el = document.getElementById('menu-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  const tab = document.getElementById('menu-tab-breakfast');
                  if (tab) tab.click();
                }
              }}
              className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] rounded-[2px] overflow-hidden bg-neutral-950 border border-white/[0.08] hover:border-white/20 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white transition-all duration-700 cursor-pointer group select-none"
            >
              <img
                src="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1800&q=85"
                alt="Artisanal breakfast table setting and morning food at Chaayé Khana DHA-4"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/40" />

              {/* Editorial Typography Overlay */}
              <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-8 sm:left-12 lg:left-16 right-8 sm:right-12 lg:right-16 text-left transform group-hover:translate-y-[-2px] transition-transform duration-500 ease-out">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block mb-3">
                  MORNING RITUAL
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight uppercase mb-3">
                  BREAKFAST
                </h3>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#D0D0D0] font-light max-w-lg">
                  Slow mornings, generous plates and comforting favourites.
                </p>
              </div>
            </div>

            {/* MOMENT 2: TEA & COFFEE */}
            <div
              id="signature-card-tea-coffee"
              role="button"
              tabIndex={0}
              aria-label="Explore Tea and Coffee Menu"
              onClick={() => {
                const el = document.getElementById('menu-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
                const tab = document.getElementById('menu-tab-teas-coffees');
                if (tab) tab.click();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const el = document.getElementById('menu-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  const tab = document.getElementById('menu-tab-teas-coffees');
                  if (tab) tab.click();
                }
              }}
              className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] rounded-[2px] overflow-hidden bg-neutral-950 border border-white/[0.08] hover:border-white/20 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white transition-all duration-700 cursor-pointer group select-none"
            >
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1800&q=85"
                alt="Signature steaming Karak Chai served in fine teaware at Chaayé Khana DHA-4"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/40" />

              {/* Editorial Typography Overlay */}
              <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-8 sm:left-12 lg:left-16 right-8 sm:right-12 lg:right-16 text-left transform group-hover:translate-y-[-2px] transition-transform duration-500 ease-out">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block mb-3">
                  HERITAGE BREWS
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight uppercase mb-3">
                  TEA &amp; COFFEE
                </h3>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#D0D0D0] font-light max-w-lg">
                  Signature chai, handcrafted coffee and moments worth lingering over.
                </p>
              </div>
            </div>

            {/* MOMENT 3: CHEF'S SPECIALS */}
            <div
              id="signature-card-chefs-specials"
              role="button"
              tabIndex={0}
              aria-label="Explore Chef's Specials Menu"
              onClick={() => {
                const el = document.getElementById('menu-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
                const tab = document.getElementById('menu-tab-chefs-specials');
                if (tab) tab.click();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const el = document.getElementById('menu-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  const tab = document.getElementById('menu-tab-chefs-specials');
                  if (tab) tab.click();
                }
              }}
              className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] rounded-[2px] overflow-hidden bg-neutral-950 border border-white/[0.08] hover:border-white/20 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white transition-all duration-700 cursor-pointer group select-none"
            >
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&q=85"
                alt="Chef-crafted gourmet entree served fresh at Chaayé Khana DHA-4"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/40" />

              {/* Editorial Typography Overlay */}
              <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-8 sm:left-12 lg:left-16 right-8 sm:right-12 lg:right-16 text-left transform group-hover:translate-y-[-2px] transition-transform duration-500 ease-out">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block mb-3">
                  CULINARY HIGHLIGHTS
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight uppercase mb-3">
                  CHEF&apos;S SPECIALS
                </h3>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-[#D0D0D0] font-light max-w-lg">
                  Thoughtfully prepared dishes inspired by the kitchen&apos;s finest flavours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 4: PREMIUM DIGITAL MENU */}
      {/* ========================================================================= */}
      <DigitalMenuSection />

      {/* ========================================================================= */}
      {/* 5. SECTION 5: FULL-WIDTH FOOD CINEMA */}
      {/* ========================================================================= */}
      <FullWidthPhotoSection />

      {/* ========================================================================= */}
      {/* 6. SECTION 6: THE ART OF CHAI */}
      {/* ========================================================================= */}
      <TheArtOfChaiSection />

      {/* ========================================================================= */}
      {/* 7. SECTION 7: FROM THE KITCHEN (Chef's Specials) */}
      {/* ========================================================================= */}
      <FromTheKitchenSection />

      {/* ========================================================================= */}
      {/* 8. SECTION 8: OUR STORY (Editorial Storytelling Section) */}
      {/* ========================================================================= */}
      <section
        id="restaurant-story"
        className="scroll-mt-20 sm:scroll-mt-24 py-28 sm:py-36 lg:py-44 border-b border-white/[0.06] bg-[#050506]"
      >
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Story Imagery Composition */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-[2px] border border-white/[0.06] bg-neutral-950">
                  <img
                    src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
                    alt="Artisanal orthodox loose leaf tea brewing at Chaayé Khana"
                    className="h-64 sm:h-72 w-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.025]"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 rounded-[2px] bg-[#09090b] border border-white/[0.06] text-xs space-y-1.5">
                  <span className="text-white font-medium block text-[13.5px]">Direct Estate Sourcing</span>
                  <p className="text-[#AFAFAF] leading-relaxed text-[11.5px] font-light">
                    Preserving artisanal orthodox tea picking and seasonal flushes from high mountain micro-climates.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8 sm:pt-10">
                <div className="p-5 rounded-[2px] bg-[#09090b] border border-white/[0.06] text-xs space-y-1.5">
                  <span className="text-white font-medium block text-[13.5px]">DHA-4 Rooftop &amp; Lounge</span>
                  <p className="text-[#AFAFAF] leading-relaxed text-[11.5px] font-light">
                    Good food, good vibes, great company under open evening skies with panoramic city views.
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-[2px] border border-white/[0.06] bg-neutral-950 shadow-xl">
                  <img
                    src={rooftopImage}
                    alt="Chaayé Khana DHA-4 open-air rooftop terrace lounge with panoramic views"
                    className="h-64 sm:h-72 w-full object-cover transition-transform duration-1000 ease-out hover:scale-[1.025]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Story Narrative */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block">
                OUR STORY &amp; HERITAGE
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.12] tracking-tight">
                Where tea is an art form, and hospitality is timeless.
              </h2>

              <p className="text-[#AFAFAF] text-[15px] sm:text-[16px] leading-[1.75] font-light">
                For years, {cafeSettings.cafeName} has stood as a beloved Pakistani institution, reimagining how tea and casual gourmet dining are experienced. We set out with a singular purpose: to elevate tea drinking from a rushed convenience into a mindful culinary art.
              </p>

              <p className="text-[#AFAFAF] text-[14px] sm:text-[15px] leading-[1.75] font-light">
                Step inside our {activeBranch.area} location and you are greeted by the comforting aroma of freshly simmered karak tea, freshly ground espresso, and warm morning sourdough. Surrounded by walls lined with world literature and soft, ambient jazz, guests discover a place to pause, converse, and savor honest food crafted from the finest ingredients.
              </p>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-7 py-3.5 rounded-[2px] border border-white/30 hover:border-white text-white hover:bg-white/[0.04] text-xs font-medium uppercase tracking-[0.18em] inline-flex items-center gap-2.5 transition-all duration-300 cursor-pointer select-none"
                >
                  <span>DISCOVER OUR HERITAGE</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION 9: PEOPLE & HOSPITALITY */}
      {/* ========================================================================= */}
      <PeopleAndHospitalitySection />

      {/* ========================================================================= */}
      {/* 10. SECTION 10: OUR GALLERY */}
      {/* ========================================================================= */}
      <GallerySection />

      {/* ========================================================================= */}
      {/* 11. SECTION 11: VISIT US SECTION */}
      {/* ========================================================================= */}
      <VisitUsSection />
    </div>
  );
};
