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
import { VisitUsSection } from './VisitUsSection';
import rooftopImage from '../assets/images/chaaye_khana_rooftop_1788985644536.jpg';
import heroBackground from '../assets/images/hero_background_1789169162945.jpg';

export const HeroSection: React.FC = () => {
  const { cafeSettings, setCurrentView, activeBranch } = useCafe();
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('breakfast');

  // Extremely subtle slow cinematic parallax (clamped strictly to 10-12px, desktop only, respects reduced-motion)
  const [parallaxOffset, setParallaxOffset] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Disable parallax on mobile/tablet to maximize performance and smoothness
    if (window.innerWidth < 1024) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Maximum 12px slow cinematic drift within the hero viewport
          if (scrollY < 1000) {
            const offset = Math.min(12, Math.max(0, scrollY * 0.025));
            setParallaxOffset(offset);
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
      <section className="relative min-h-[calc(100vh-4.5rem)] lg:min-h-screen flex items-center border-b border-neutral-900 overflow-hidden bg-[#030304]">
        {/* Atmospheric Cinematic Restaurant Background Layer */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
          aria-hidden="true"
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

          {/* Subtle Dark Readability Overlay: Desktop: ~18% overlay, Mobile: ~28% overlay */}
          <div className="absolute inset-0 bg-black/28 lg:bg-black/18" />
          
          {/* Gentle left-to-right fade-out gradient to aid text readability without hiding the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent lg:from-black/35 lg:via-transparent lg:to-transparent" />
          
          {/* Bottom transition gradient to ease transition to the next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030304]/60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 lg:py-24 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Brand + Headline + Short Description + Two CTAs */}
            <div className="lg:col-span-6 space-y-8 text-left">
              {/* 1. Brand Name */}
              <div className="transition-all duration-700 delay-100 ease-out">
                <span className="text-[11px] uppercase tracking-[0.24em] text-neutral-400 font-medium block">
                  CHAAYÉ KHANA
                </span>
              </div>

              {/* 2. Main Headline */}
              <div className="transition-all duration-700 delay-200 ease-out">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-normal leading-[1.08] tracking-tight">
                  Where Tea, Food &amp; Conversation Meet
                </h1>
              </div>

              {/* 3. Short Refined Description */}
              <div className="transition-all duration-700 delay-300 ease-out">
                <p className="text-neutral-400 text-base sm:text-lg max-w-lg leading-relaxed font-light">
                  An elevated dining experience crafted around exceptional food, signature chai and unforgettable moments.
                </p>
              </div>

              {/* 4. Two CTAs: Primary (EXPLORE MENU) & Secondary (DISCOVER OUR STORY) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 sm:gap-7 transition-all duration-700 delay-500 ease-out">
                {/* Primary CTA: EXPLORE MENU */}
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

                {/* Secondary CTA: DISCOVER OUR STORY */}
                <button
                  id="hero-discover-story-btn"
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group flex items-center justify-center sm:justify-start gap-2.5 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer py-3.5 select-none"
                >
                  <span className="border-b border-transparent group-hover:border-neutral-400 pb-0.5 transition-all duration-300">
                    DISCOVER OUR STORY
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </button>
              </div>
            </div>

            {/* Right Side: Spacer to display the cinematic restaurant background's breakfast composition */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-0 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CINEMATIC INTRODUCTION: Single-Column Luxury Editorial Section */}
      {/* ========================================================================= */}
      <section
        id="philosophy-section"
        className="relative bg-[#030304] text-white pt-[70px] pb-[80px] px-6 md:pt-[90px] md:pb-[100px] md:px-10 lg:pt-[120px] lg:pb-[140px] lg:px-[60px] overflow-hidden"
      >
        <div className="max-w-[1200px] mx-auto w-full">
          {/* Editorial Text Block */}
          <div className="max-w-[850px] text-left">
            {/* Small Eyebrow Label */}
            <span className="uppercase text-[11px] sm:text-[12px] tracking-[0.24em] text-neutral-400 font-medium mb-[18px] block transition-opacity duration-700">
              OUR PHILOSOPHY
            </span>

            {/* Large Editorial Headline */}
            <h2 className="font-serif font-normal text-white tracking-[-0.02em] leading-[1.08] text-[38px] md:text-[48px] md:leading-[1.08] md:max-w-[720px] lg:text-[64px] lg:leading-[1.05] lg:max-w-[850px] mb-[28px] transition-all duration-700 delay-100">
              An experience brewed around food, tea &amp; conversation.
            </h2>

            {/* Short Supporting Paragraph */}
            <p className="text-[16px] sm:text-[17px] leading-[1.7] text-[#B8B8B8] max-w-[650px] font-light mb-[70px] transition-all duration-700 delay-200">
              From slow mornings over chai to memorable meals shared with the people who matter, every moment at Chaayé Khana is made to be enjoyed.
            </p>
          </div>

          {/* Large Cinematic Editorial Centerpiece Image */}
          <div className="relative w-full max-w-[1200px] h-[420px] md:h-[500px] lg:h-[620px] rounded-[2px] border border-white/[0.06] overflow-hidden bg-neutral-950 transition-all duration-700 delay-300 group">
            <img
              src={rooftopImage}
              alt="Atmospheric rooftop dining and artisanal tea conversation at Chaayé Khana DHA-4"
              className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out md:group-hover:scale-[1.015] motion-reduce:transition-none"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {/* Subtle atmospheric vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE EXPERIENCE: 3 Curated Culinary & Atmosphere Chapters */}
      {/* ========================================================================= */}
      <section
        id="signature-experience-section"
        className="relative bg-[#030304] text-white pt-[70px] pb-[80px] px-6 md:pt-[90px] md:pb-[100px] md:px-10 lg:pt-[140px] lg:pb-[150px] lg:px-[60px] overflow-hidden border-t border-white/[0.06]"
      >
        <div className="max-w-[1280px] mx-auto w-full">
          {/* Editorial Section Header */}
          <div className="text-center max-w-[750px] mx-auto">
            {/* Small Editorial Eyebrow */}
            <span className="uppercase text-[11px] sm:text-[12px] tracking-[0.24em] text-neutral-400 font-medium mb-[18px] block">
              SIGNATURE EXPERIENCE
            </span>

            {/* Main Section Heading */}
            <h2 className="font-serif font-normal text-white text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.08] tracking-[-0.01em] mb-[22px]">
              Moments worth slowing down for.
            </h2>

            {/* Supporting Text */}
            <p className="text-[15px] sm:text-[16px] leading-[1.7] text-[#AFAFAF] max-w-[620px] mx-auto font-light mb-[65px]">
              From slow breakfasts to carefully brewed chai and chef-crafted favourites, discover what makes every visit memorable.
            </p>
          </div>

          {/* 3-Column Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[18px] lg:gap-[24px]">
            {/* CARD 1: BREAKFAST */}
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
              className="relative w-full h-[430px] md:h-[450px] lg:h-[520px] rounded-[2px] overflow-hidden bg-neutral-950 border border-white/[0.06] hover:border-white/20 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white transition-all duration-500 cursor-pointer group select-none"
            >
              <img
                src="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1000&q=85"
                alt="Artisanal breakfast table setting and tea service at Chaayé Khana DHA-4"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out md:group-hover:scale-[1.025] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Dark Ambient Gradient Behind Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-500 md:group-hover:from-black/90 md:group-hover:via-black/50" />

              {/* Text Overlay */}
              <div className="absolute bottom-[28px] sm:bottom-[32px] left-[24px] sm:left-[30px] right-[24px] sm:right-[30px] text-left transform md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
                <h3 className="font-serif text-[21px] lg:text-[22px] font-normal text-white tracking-[0.08em] uppercase mb-1.5">
                  BREAKFAST
                </h3>
                <p className="text-[13.5px] sm:text-[14px] leading-[1.5] text-[#D0D0D0] font-light max-w-[300px]">
                  Slow mornings, generous plates and comforting favourites.
                </p>
              </div>
            </div>

            {/* CARD 2: TEA & COFFEE */}
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
              className="relative w-full h-[430px] md:h-[450px] lg:h-[520px] rounded-[2px] overflow-hidden bg-neutral-950 border border-white/[0.06] hover:border-white/20 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white transition-all duration-500 cursor-pointer group select-none"
            >
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=85"
                alt="Signature steaming Karak Chai served in fine teaware at Chaayé Khana DHA-4"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out md:group-hover:scale-[1.025] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Dark Ambient Gradient Behind Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-500 md:group-hover:from-black/90 md:group-hover:via-black/50" />

              {/* Text Overlay */}
              <div className="absolute bottom-[28px] sm:bottom-[32px] left-[24px] sm:left-[30px] right-[24px] sm:right-[30px] text-left transform md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
                <h3 className="font-serif text-[21px] lg:text-[22px] font-normal text-white tracking-[0.08em] uppercase mb-1.5">
                  TEA &amp; COFFEE
                </h3>
                <p className="text-[13.5px] sm:text-[14px] leading-[1.5] text-[#D0D0D0] font-light max-w-[300px]">
                  Signature chai, handcrafted coffee and moments worth lingering over.
                </p>
              </div>
            </div>

            {/* CARD 3: CHEF'S SPECIALS */}
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
              className="relative w-full h-[430px] md:h-[450px] lg:h-[520px] rounded-[2px] overflow-hidden bg-neutral-950 border border-white/[0.06] hover:border-white/20 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white transition-all duration-500 cursor-pointer group select-none"
            >
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85"
                alt="Chef-crafted gourmet entree served fresh at Chaayé Khana DHA-4"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out md:group-hover:scale-[1.025] motion-reduce:transition-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Dark Ambient Gradient Behind Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-500 md:group-hover:from-black/90 md:group-hover:via-black/50" />

              {/* Text Overlay */}
              <div className="absolute bottom-[28px] sm:bottom-[32px] left-[24px] sm:left-[30px] right-[24px] sm:right-[30px] text-left transform md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
                <h3 className="font-serif text-[21px] lg:text-[22px] font-normal text-white tracking-[0.08em] uppercase mb-1.5">
                  CHEF&apos;S SPECIALS
                </h3>
                <p className="text-[13.5px] sm:text-[14px] leading-[1.5] text-[#D0D0D0] font-light max-w-[300px]">
                  Thoughtfully prepared dishes inspired by the kitchen&apos;s finest flavours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 5: PREMIUM DIGITAL MENU */}
      {/* ========================================================================= */}
      <DigitalMenuSection />

      {/* ========================================================================= */}
      {/* 5. SECTION 6: FULL-WIDTH FOOD PHOTOGRAPHY */}
      {/* ========================================================================= */}
      <FullWidthPhotoSection />

      {/* ========================================================================= */}
      {/* 6. SECTION 7: THE ART OF CHAI */}
      {/* ========================================================================= */}
      <TheArtOfChaiSection />

      {/* ========================================================================= */}
      {/* 7. SECTION 8: PREMIUM INSTAGRAM-STYLE GALLERY */}
      {/* ========================================================================= */}
      <GallerySection />

      {/* ========================================================================= */}
      {/* 8. RESTAURANT STORY: Editorial Storytelling Section */}
      {/* ========================================================================= */}
      <section
        id="restaurant-story"
        className="scroll-mt-20 sm:scroll-mt-24 py-24 sm:py-32 lg:py-36 border-b border-white/[0.06] bg-[#050506]"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-14">
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
              <span className="text-[11px] uppercase tracking-[0.24em] text-neutral-400 font-medium block">
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
      {/* 9. SECTION 9: VISIT US SECTION */}
      {/* ========================================================================= */}
      <VisitUsSection />
    </div>
  );
};
