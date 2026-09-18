import React, { useState, useEffect } from 'react';
import { useCafe } from '../context/CafeContext';
import { ProfileDropdown } from './ProfileDropdown';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cafeSettings,
  } = useCafe();

  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll depth for smooth sticky header transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation click handler
  const handleNavClick = (view: 'home' | 'menu' | 'about' | 'contact' | 'gallery') => {
    if (view === 'gallery') {
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          const galleryEl = document.getElementById('gallery-section');
          if (galleryEl) {
            galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 1600, behavior: 'smooth' });
          }
        }, 120);
      } else {
        const galleryEl = document.getElementById('gallery-section');
        if (galleryEl) {
          galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 1600, behavior: 'smooth' });
        }
      }
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Essential single-location navigation links
  const navLinks = [
    { label: 'Home', id: 'home', action: () => handleNavClick('home'), isActive: currentView === 'home' },
    { label: 'Menu', id: 'menu', action: () => handleNavClick('menu'), isActive: currentView === 'menu' },
    { label: 'Our Story', id: 'about', action: () => handleNavClick('about'), isActive: currentView === 'about' },
    { label: 'Gallery', id: 'gallery', action: () => handleNavClick('gallery'), isActive: false },
    { label: 'Visit Us', id: 'contact', action: () => handleNavClick('contact'), isActive: currentView === 'contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out select-none ${
        isScrolled
          ? 'bg-[#030304]/95 backdrop-blur-md border-b border-white/[0.08] py-2.5 sm:py-3.5'
          : 'bg-[#030304]/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-white/[0.05] py-3 sm:py-5'
      }`}
    >
      <div className="max-w-[1300px] mx-auto px-4 sm:px-10 lg:px-16 w-full">
        {/* TOP ROW: Logo, Desktop Navigation, and Profile/Tracker */}
        <div className="flex items-center justify-between">
          {/* LEFT: Clean Logo Wordmark */}
          <div className="flex-1 flex items-center justify-start">
            <button
              id="header-logo-btn"
              onClick={() => handleNavClick('home')}
              className="group flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer focus:outline-hidden"
              aria-label="Chaayé Khana Home"
            >
              {cafeSettings.logo && (
                <img
                  src={cafeSettings.logo}
                  alt="Chaayé Khana Logo"
                  referrerPolicy="no-referrer"
                  className={`object-cover rounded-full border border-white/20 transition-all duration-300 ${
                    isScrolled ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-7 h-7 sm:w-8 sm:h-8'
                  }`}
                />
              )}
              <span
                className={`font-serif tracking-[0.24em] text-white font-normal uppercase transition-all duration-300 block ${
                  isScrolled ? 'text-xs sm:text-sm md:text-base' : 'text-sm sm:text-base md:text-lg'
                }`}
              >
                CHAAYÉ KHANA
              </span>
            </button>
          </div>

          {/* CENTER: Desktop Minimal Navigation Links (md and larger) */}
          <nav className="hidden md:flex items-center justify-center gap-7 lg:gap-9">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={link.action}
                className={`relative py-1 text-xs uppercase tracking-[0.14em] transition-colors duration-200 cursor-pointer focus:outline-hidden ${
                  link.isActive
                    ? 'text-white font-medium'
                    : 'text-neutral-400 hover:text-white font-normal'
                }`}
              >
                <span>{link.label}</span>
                {/* Subtle Underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ease-out ${
                    link.isActive
                      ? 'w-full opacity-100'
                      : 'w-0 opacity-0 hover:w-full hover:opacity-100'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* RIGHT: Essential Utility Controls */}
          <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
            {/* Profile / Order Tracker & Staff Dropdown */}
            <ProfileDropdown />
          </div>
        </div>

        {/* MOBILE NAVIGATION BAR: Stays permanently at the TOP of the page on mobile */}
        <nav
          id="mobile-top-navbar"
          aria-label="Mobile Navigation"
          className="flex md:hidden items-center justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pt-2.5 mt-2 border-t border-white/[0.06] -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {navLinks.map((link) => (
            <button
              key={`mobile-top-${link.id}`}
              id={`mobile-nav-link-${link.id}`}
              onClick={link.action}
              className={`relative shrink-0 py-1 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 cursor-pointer focus:outline-hidden ${
                link.isActive
                  ? 'text-white font-medium'
                  : 'text-neutral-400 hover:text-white font-normal'
              }`}
            >
              <span>{link.label}</span>
              {/* Subtle Underline */}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ease-out ${
                  link.isActive
                    ? 'w-full opacity-100'
                    : 'w-0 opacity-0 hover:w-full hover:opacity-100'
                }`}
              />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
