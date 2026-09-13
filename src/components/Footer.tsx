import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Instagram } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

export const Footer: React.FC = () => {
  const { cafeSettings, setCurrentView, currentView, activeBranch } = useCafe();

  const handleNavClick = (view: 'home' | 'menu' | 'about' | 'gallery' | 'visit') => {
    if (view === 'home') {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'menu') {
      setCurrentView('menu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'about') {
      if (currentView === 'home') {
        const storyEl = document.getElementById('restaurant-story');
        if (storyEl) {
          storyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          setCurrentView('about');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setCurrentView('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'gallery') {
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById('gallery-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else window.scrollTo({ top: 1800, behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('gallery-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 1800, behavior: 'smooth' });
      }
    } else if (view === 'visit') {
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          const el = document.getElementById('visit-us-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else window.scrollTo({ top: 3000, behavior: 'smooth' });
        }, 120);
      } else {
        const el = document.getElementById('visit-us-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 3000, behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const instagramUrl =
    cafeSettings.socialsConfig?.find((s) => s.platform.toLowerCase() === 'instagram')?.url ||
    'https://instagram.com/chaayekhana';

  const navItems = [
    { label: 'HOME', action: () => handleNavClick('home') },
    { label: 'MENU', action: () => handleNavClick('menu') },
    { label: 'OUR STORY', action: () => handleNavClick('about') },
    { label: 'GALLERY', action: () => handleNavClick('gallery') },
    { label: 'VISIT US', action: () => handleNavClick('visit') },
  ];

  return (
    <footer
      id="main-footer"
      aria-label="Chaayé Khana Editorial Footer"
      className="relative w-full bg-[#030304] text-[#F5F4F0] pt-28 sm:pt-36 lg:pt-48 pb-14 sm:pb-18 border-t border-white/[0.06] overflow-hidden select-none"
    >
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10 flex flex-col justify-between">
        
        {/* ========================================================================= */}
        {/* 1. PRIMARY BRAND TYPOGRAPHY: CHAAYÉ / KHANA (TWO INTENTIONAL GIANT LINES) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-full pb-14 sm:pb-20 lg:pb-24"
        >
          <div className="flex flex-col tracking-tight select-none">
            <span
              className="font-serif font-normal text-white/[0.96] leading-[0.88] uppercase text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[130px] xl:text-[156px] block tracking-[0.02em]"
              style={{ textShadow: '0 4px 50px rgba(0,0,0,0.9)' }}
            >
              CHAAYÉ
            </span>
            <span
              className="font-serif font-normal text-[#E2DDD5]/90 leading-[0.88] uppercase text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[130px] xl:text-[156px] block tracking-[0.02em] mt-1 sm:mt-2"
              style={{ textShadow: '0 4px 50px rgba(0,0,0,0.9)' }}
            >
              KHANA
            </span>
          </div>
        </motion.div>

        {/* Subtle hairline divider */}
        <div className="w-full h-[1px] bg-white/[0.07]" />

        {/* ========================================================================= */}
        {/* 2. REFINED SMALL NAVIGATION ROW */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="py-10 sm:py-12 lg:py-14"
        >
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-8 sm:gap-x-12 lg:gap-x-16 gap-y-4 text-[12px] sm:text-[13px] font-mono tracking-[0.24em] text-neutral-400"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="group uppercase transition-colors duration-300 hover:text-white cursor-pointer select-none focus:outline-hidden inline-flex items-center"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Subtle hairline divider */}
        <div className="w-full h-[1px] bg-white/[0.07]" />

        {/* ========================================================================= */}
        {/* 3. CONTACT / LOCATION / TIMINGS / INSTAGRAM EDITORIAL ROW */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="py-12 sm:py-14 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 text-[13px] sm:text-[14px] text-neutral-300 font-light"
        >
          {/* Location */}
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase block">
              DESTINATION
            </span>
            <p className="text-white font-normal uppercase tracking-wider text-[13px]">
              {activeBranch.area.toUpperCase()} &bull; {activeBranch.city.toUpperCase()}
            </p>
            <p className="text-neutral-400 text-[12px] leading-relaxed pt-0.5">
              Sector F, Commercial Area
            </p>
          </div>

          {/* Timings */}
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase block">
              HOURS
            </span>
            <p className="text-white font-normal font-mono text-[13px] tracking-wide">
              {cafeSettings.openingHoursDisplay || '08:00 — 00:00 MIDNIGHT'}
            </p>
            <p className="text-neutral-400 text-[12px] pt-0.5">
              Open Daily for Dining
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase block">
              TELEPHONE
            </span>
            <a
              href={`tel:${cafeSettings.phone}`}
              className="text-white hover:text-neutral-300 font-mono text-[13px] tracking-wide transition-colors block"
            >
              {cafeSettings.phone || '+92 51 111 242 293'}
            </a>
            <p className="text-neutral-400 text-[12px] pt-0.5">
              Direct Inquiries
            </p>
          </div>

          {/* Instagram Link */}
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-neutral-400 uppercase block">
              EDITORIAL &amp; SOCIAL
            </span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-white hover:text-neutral-300 font-mono text-[13px] tracking-[0.18em] uppercase transition-colors"
              aria-label="Chaayé Khana Instagram"
            >
              <Instagram className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
              <span>INSTAGRAM</span>
            </a>
            <p className="text-neutral-400 text-[12px] pt-0.5">
              @chaayekhana
            </p>
          </div>
        </motion.div>

        {/* Subtle hairline divider */}
        <div className="w-full h-[1px] bg-white/[0.05]" />

        {/* ========================================================================= */}
        {/* 4. MINIMAL COPYRIGHT & BACK TO TOP */}
        {/* ========================================================================= */}
        <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-[12px] text-neutral-400 font-light font-mono tracking-wider">
          <p>&copy; {new Date().getFullYear()} CHAAY&Eacute; KHANA. ALL RIGHTS RESERVED.</p>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer text-[10.5px] sm:text-[11px] tracking-[0.2em] uppercase focus:outline-hidden"
            aria-label="Back to top of page"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform group-hover:-translate-y-0.5 duration-200" />
          </button>
        </div>

      </div>
    </footer>
  );
};
