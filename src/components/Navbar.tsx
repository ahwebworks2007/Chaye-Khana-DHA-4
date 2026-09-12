import React, { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  X,
  Sun,
  Moon,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { ProfileDropdown } from './ProfileDropdown';
import { CK_BRANCHES } from '../data/branchesData';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cafeSettings,
    theme,
    toggleTheme,
    publicBranchId,
    setPublicBranchId,
    activeBranch,
  } = useCafe();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  // Monitor scroll depth for smooth sticky header transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click to close branch dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const container = document.getElementById('public-branch-selector-container');
      if (container && !container.contains(e.target as Node)) {
        setBranchDropdownOpen(false);
      }
    };
    if (branchDropdownOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [branchDropdownOpen]);

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
  const handleNavClick = (view: 'home' | 'menu' | 'about' | 'contact' | 'gallery' | 'branches') => {
    setMobileMenuOpen(false);

    if (view === 'gallery') {
      if (currentView !== 'home') {
        setCurrentView('home');
        // Allow time for home view to render before scrolling to gallery
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

  // Nav links configuration
  const navLinks = [
    { label: 'Home', id: 'home', action: () => handleNavClick('home'), isActive: currentView === 'home' },
    { label: 'Menu', id: 'menu', action: () => handleNavClick('menu'), isActive: currentView === 'menu' },
    { label: 'Our Story', id: 'about', action: () => handleNavClick('about'), isActive: currentView === 'about' },
    { label: 'Gallery', id: 'gallery', action: () => handleNavClick('gallery'), isActive: false },
    { label: 'Visit Us', id: 'contact', action: () => handleNavClick('contact'), isActive: currentView === 'contact' },
    { label: 'Branches', id: 'branches', action: () => handleNavClick('branches'), isActive: currentView === 'branches' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out select-none ${
          isScrolled
            ? 'bg-[#030304]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-black/30 backdrop-blur-xs border-b border-white/[0.05] py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
          <div className="flex items-center justify-between h-auto">
            {/* LEFT: Logo Wordmark */}
            <div className="flex-1 flex items-center justify-start">
              <button
                id="header-logo-btn"
                onClick={() => handleNavClick('home')}
                className="group flex items-center gap-3.5 text-left cursor-pointer focus:outline-hidden"
                aria-label="Chaayé Khana Home"
              >
                {cafeSettings.logo && (
                  <img
                    src={cafeSettings.logo}
                    alt="Chaayé Khana Logo"
                    referrerPolicy="no-referrer"
                    className={`object-cover rounded-full border border-white/20 shadow-md transition-all duration-300 ${
                      isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                    }`}
                  />
                )}
                <span
                  className={`font-serif tracking-[0.28em] text-white font-normal uppercase transition-all duration-300 block ${
                    isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                  }`}
                >
                  CHAAYÉ KHANA
                </span>
              </button>
            </div>

            {/* CENTER: Desktop Clean Navigation Links */}
            <nav className="hidden md:flex items-center justify-center gap-7 lg:gap-10">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={link.action}
                  className={`relative py-1.5 text-xs sm:text-[13px] tracking-wider transition-all duration-300 ease-out cursor-pointer group focus:outline-hidden ${
                    link.isActive
                      ? 'text-white font-medium'
                      : 'text-neutral-400 hover:text-white font-normal'
                  }`}
                >
                  <span>{link.label}</span>

                  {/* Smooth Thin Underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300 ease-out ${
                      link.isActive
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  />
                </button>
              ))}
            </nav>

            {/* RIGHT: Profile Icon & Mobile Hamburger Toggle */}
            <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
              {/* Branch Selector */}
              <div className="relative inline-block text-left" id="public-branch-selector-container">
                <button
                  id="public-branch-selector"
                  onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                  aria-expanded={branchDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.03] text-neutral-300 hover:text-white text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-white/40"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C49B66]" />
                  <span className="max-w-[120px] sm:max-w-[160px] truncate">{activeBranch.name.replace('Chaayé Khana – ', '').replace('Chaayé Khana — ', '')}</span>
                  <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-300 ${branchDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {branchDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-white/[0.08] bg-[#0c0c0d]/98 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.95)] py-2 z-50 animate-fadeIn max-h-[300px] overflow-hidden flex flex-col">
                    <div className="px-4 py-1.5 border-b border-white/[0.05] mb-1.5">
                      <span className="text-[10px] tracking-widest text-neutral-500 uppercase block font-semibold">Select Branch</span>
                    </div>
                    <div className="overflow-y-auto max-h-[220px] custom-scrollbar divide-y divide-white/[0.03]">
                      {CK_BRANCHES.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setPublicBranchId(b.id);
                            setBranchDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium tracking-wide transition-colors flex items-center justify-between hover:bg-white/[0.04] ${
                            b.id === publicBranchId ? 'text-[#C49B66] font-semibold bg-white/[0.02]' : 'text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <span>{b.name.replace('Chaayé Khana – ', '').replace('Chaayé Khana — ', '')}</span>
                          {b.id === publicBranchId && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C49B66]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Day/Night Theme Toggle */}
              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300 cursor-pointer focus:outline-hidden flex items-center justify-center"
                aria-label={theme === 'dark' ? 'Switch to Day mode' : 'Switch to Night mode'}
                title={theme === 'dark' ? 'Switch to Day mode' : 'Switch to Night mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-[18px] h-[18px] sm:w-[20px] h-[20px] transition-transform hover:rotate-45 duration-500" />
                ) : (
                  <Moon className="w-[18px] h-[18px] sm:w-[20px] h-[20px] transition-transform hover:-rotate-12 duration-500" />
                )}
              </button>

              {/* Profile Dropdown Icon */}
              <ProfileDropdown />

              {/* Mobile Hamburger Toggle (hidden on desktop) */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer focus:outline-hidden"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 stroke-[1.6]" />
                ) : (
                  <MenuIcon className="w-5 h-5 stroke-[1.6]" />
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
          className="fixed inset-0 z-40 bg-[#030304]/98 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-12 px-8 sm:px-12 md:hidden transition-all duration-300 animate-fadeIn"
        >
          {/* Subtle Ambient Vignette */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(40, 34, 28, 0.4) 0%, transparent 70%)',
            }}
          />

          {/* Navigation Links List */}
          <div className="relative z-10 flex flex-col space-y-6 sm:space-y-8 my-auto">
            <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-medium block mb-2">
              Navigation
            </span>

            {navLinks.map((link, idx) => (
              <button
                key={link.id}
                id={`mobile-nav-${link.id}`}
                onClick={link.action}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`text-left text-2xl sm:text-3xl font-serif tracking-tight transition-all duration-300 flex items-center justify-between group cursor-pointer focus:outline-hidden ${
                  link.isActive
                    ? 'text-white italic'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`h-[1px] bg-white transition-all duration-300 ${
                    link.isActive ? 'w-8' : 'w-0 group-hover:w-6'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Bottom Brand / Location Tagline */}
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
