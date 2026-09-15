import React, { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { ProfileDropdown } from './ProfileDropdown';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cafeSettings,
  } = useCafe();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll depth for smooth sticky header transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile overlay is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Navigation click handler
  const handleNavClick = (view: 'home' | 'menu' | 'about' | 'contact' | 'gallery') => {
    setMobileMenuOpen(false);

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
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out select-none ${
          isScrolled
            ? 'bg-[#030304]/95 backdrop-blur-md border-b border-white/[0.08] py-3.5'
            : 'bg-transparent border-b border-white/[0.05] py-5'
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="flex items-center justify-between">
            {/* LEFT: Clean Logo Wordmark */}
            <div className="flex-1 flex items-center justify-start">
              <button
                id="header-logo-btn"
                onClick={() => handleNavClick('home')}
                className="group flex items-center gap-3 text-left cursor-pointer focus:outline-hidden"
                aria-label="Chaayé Khana Home"
              >
                {cafeSettings.logo && (
                  <img
                    src={cafeSettings.logo}
                    alt="Chaayé Khana Logo"
                    referrerPolicy="no-referrer"
                    className={`object-cover rounded-full border border-white/20 transition-all duration-300 ${
                      isScrolled ? 'w-7 h-7' : 'w-8 h-8'
                    }`}
                  />
                )}
                <span
                  className={`font-serif tracking-[0.24em] text-white font-normal uppercase transition-all duration-300 block ${
                    isScrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                  }`}
                >
                  CHAAYÉ KHANA
                </span>
              </button>
            </div>

            {/* CENTER: Desktop Minimal Navigation Links */}
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

              {/* Mobile Hamburger Toggle (hidden on desktop) */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer focus:outline-hidden"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 stroke-[1.5]" />
                ) : (
                  <MenuIcon className="w-5 h-5 stroke-[1.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE LUXURY OVERLAY MENU */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-overlay"
          className="fixed inset-0 z-40 bg-[#030304]/98 backdrop-blur-xl flex flex-col justify-between pt-24 pb-12 px-8 sm:px-12 md:hidden select-none"
        >
          {/* Navigation Links List */}
          <div className="relative z-10 flex flex-col space-y-6 sm:space-y-7 my-auto">
            <span className="text-[10px] uppercase tracking-[0.32em] text-neutral-400 font-medium block mb-2">
              NAVIGATION
            </span>

            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`mobile-nav-${link.id}`}
                onClick={link.action}
                className={`text-left text-2xl sm:text-3xl font-serif tracking-tight transition-colors duration-200 flex items-center justify-between cursor-pointer focus:outline-hidden ${
                  link.isActive
                    ? 'text-white italic'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`h-[1px] bg-white transition-all duration-300 ${
                    link.isActive ? 'w-8' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Bottom Brand / Location Note */}
          <div className="relative z-10 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400 font-light">
            <div>
              <span className="text-white font-medium block">CHAAYÉ KHANA</span>
              <span className="text-[11px] text-neutral-400">{cafeSettings.address}</span>
            </div>
            <span className="text-[11px] text-neutral-400">
              {cafeSettings.openingHoursDisplay}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
