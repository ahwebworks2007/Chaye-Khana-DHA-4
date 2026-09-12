import React from 'react';
import { Instagram, MapPin, Phone, Clock, ArrowUp, Facebook, Youtube, MessageSquare } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

export const Footer: React.FC = () => {
  const { cafeSettings, setCurrentView, currentView } = useCafe();

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

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5" />;
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5" />;
      default:
        return <ArrowUp className="w-3.5 h-3.5 rotate-45" />;
    }
  };

  const socials = cafeSettings.socialsConfig || [
    { platform: 'instagram', url: 'https://instagram.com/chaayekhana', isEnabled: true },
    { platform: 'facebook', url: 'https://facebook.com/chaayekhana', isEnabled: true },
    { platform: 'tiktok', url: 'https://tiktok.com/@chaayekhana', isEnabled: false },
    { platform: 'youtube', url: 'https://youtube.com/@chaayekhana', isEnabled: true }
  ];

  const enabledSocials = socials.filter(s => s.isEnabled && s.url);
  const hasWhatsapp = !!cafeSettings.whatsapp;
  const whatsappClean = cafeSettings.whatsapp ? cafeSettings.whatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <footer
      id="main-footer"
      className="relative w-full bg-[#020203] text-[#F5F4F0] pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 border-t border-white/[0.06] overflow-hidden select-none"
    >
      {/* Very subtle ambient gradient highlight */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,255,255,0.015),transparent)]" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-14 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. TOP EDITORIAL ROW: NAVIGATION + ESSENTIAL CONTACT DETAILS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-20 sm:pb-24 border-b border-white/[0.06]">
          
          {/* Navigation Column (Clean horizontal or column links) */}
          <div className="md:col-span-4 lg:col-span-4 space-y-6">
            <span className="text-[10.5px] sm:text-[11px] font-medium tracking-[0.24em] uppercase text-[#8E8E93] block">
              EXPLORE
            </span>
            <nav className="flex flex-col space-y-3.5">
              {[
                { label: 'Home', action: () => handleNavClick('home') },
                { label: 'Menu', action: () => handleNavClick('menu') },
                { label: 'Our Story', action: () => handleNavClick('about') },
                { label: 'Gallery', action: () => handleNavClick('gallery') },
                { label: 'Visit Us', action: () => handleNavClick('visit') },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="group text-left text-[14.5px] sm:text-[15.5px] text-[#AFAFAF] hover:text-[#F5F4F0] font-light tracking-[0.02em] transition-all duration-300 inline-flex items-center gap-2 cursor-pointer focus:outline-hidden"
                >
                  <span className="w-0 h-[1px] bg-white/60 transition-all duration-300 group-hover:w-3" />
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Information & Hours */}
          <div className="md:col-span-8 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Address & Direct Phone */}
            <div className="space-y-6">
              <div>
                <span className="text-[10.5px] sm:text-[11px] font-medium tracking-[0.24em] uppercase text-[#8E8E93] block mb-3">
                  LOCATION &amp; INQUIRIES
                </span>
                <div className="space-y-2 text-[#D6D4CD] font-light text-[14px] sm:text-[15px] leading-relaxed">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#8E8E93] shrink-0 mt-0.5" />
                    <span>{cafeSettings.address}</span>
                  </p>
                  <p className="flex items-center gap-2.5 pt-1">
                    <Phone className="w-4 h-4 text-[#8E8E93] shrink-0" />
                    <a
                      href={`tel:${cafeSettings.phone}`}
                      className="text-[#F5F4F0] hover:text-white transition-colors"
                    >
                      {cafeSettings.phone}
                    </a>
                  </p>
                </div>
              </div>

              {/* Instagram & Social */}
              <div className="pt-2">
                <span className="text-[10.5px] sm:text-[11px] font-medium tracking-[0.24em] uppercase text-[#8E8E93] block mb-3">
                  SOCIAL
                </span>
                <div className="flex flex-wrap gap-2">
                  {enabledSocials.map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[2px] border border-white/10 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] text-[#D6D4CD] hover:text-white transition-all duration-300 text-[12px] font-medium tracking-[0.14em] uppercase"
                      aria-label={`Chaayé Khana ${s.platform}`}
                    >
                      {getSocialIcon(s.platform)}
                      <span>{s.platform}</span>
                    </a>
                  ))}
                  {hasWhatsapp && whatsappClean && (
                    <a
                      href={`https://wa.me/${whatsappClean}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[2px] border border-emerald-500/10 hover:border-emerald-500/30 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] text-[#D6D4CD] hover:text-[#10B981] transition-all duration-300 text-[12px] font-medium tracking-[0.14em] uppercase"
                      aria-label="Chaayé Khana WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Operating Timings & Atmosphere */}
            <div className="space-y-6">
              <div>
                <span className="text-[10.5px] sm:text-[11px] font-medium tracking-[0.24em] uppercase text-[#8E8E93] block mb-3">
                  HOURS OF HOSPITALITY
                </span>
                <div className="space-y-1.5 text-[#D6D4CD] font-light text-[14px] sm:text-[15px]">
                  <p className="flex items-center gap-2.5 text-[#F5F4F0] font-normal">
                    <Clock className="w-4 h-4 text-[#8E8E93] shrink-0" />
                    <span>{cafeSettings.openingHoursDisplay}</span>
                  </p>
                  <p className="text-[13px] text-[#8E8E93] pt-1">
                    Breakfast, All-Day Dining, High Tea &amp; Rooftop Evenings
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10.5px] sm:text-[11px] font-medium tracking-[0.24em] uppercase text-[#8E8E93] block mb-2">
                  DINE-IN ATMOSPHERE
                </span>
                <p className="text-[13px] text-[#AFAFAF] font-light leading-relaxed">
                  Tea Salon • Library Lounge • Rooftop Terrace • Handcrafted Bakery
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN GRAND BRAND STATEMENT: "CHAAYÉ KHANA" */}
        {/* ========================================================================= */}
        <div className="pt-16 sm:pt-20 pb-12 sm:pb-16 text-center overflow-hidden">
          <div
            className="font-serif font-normal text-[#F5F4F0]/95 leading-none tracking-[0.14em] sm:tracking-[0.20em] lg:tracking-[0.24em] uppercase text-[40px] sm:text-[68px] md:text-[92px] lg:text-[118px] xl:text-[138px] transition-all duration-700"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.8)' }}
          >
            CHAAYÉ KHANA
          </div>
          <p className="mt-4 sm:mt-5 text-[11px] sm:text-[12px] uppercase tracking-[0.32em] text-[#8E8E93] font-light">
            DHA-4 • {cafeSettings.city ? cafeSettings.city.toUpperCase() : 'RAWALPINDI'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM UTILITY BAR: COPYRIGHT, BACK TO TOP */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#71717A] font-light">
          <p>© {new Date().getFullYear()} Chaayé Khana. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 text-[#AFAFAF] hover:text-[#F5F4F0] transition-colors cursor-pointer text-[11px] tracking-[0.16em] uppercase"
            aria-label="Back to top of page"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#8E8E93] group-hover:text-white transition-transform group-hover:-translate-y-0.5 duration-200" />
          </button>
        </div>

      </div>
    </footer>
  );
};
