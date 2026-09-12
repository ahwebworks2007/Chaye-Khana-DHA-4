import React, { useEffect, useState, useRef } from 'react';

export const FullWidthPhotoSection: React.FC = () => {
  const [scrollYOffset, setScrollYOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if reduced motion is preferred
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    // Subtle parallax effect on desktop only
    const handleScroll = () => {
      if (window.innerWidth < 768) return;
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // When section is in viewport, calculate subtle offset (-15px to +15px)
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const subtleOffset = (progress - 0.5) * 24; // 12px max translation
        setScrollYOffset(subtleOffset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="crafted-slow-mornings-section"
      className="relative w-full h-[520px] sm:h-[580px] md:h-[660px] lg:h-[720px] min-h-[500px] max-h-[760px] overflow-hidden bg-black select-none group border-t border-b border-white/[0.06]"
    >
      {/* Background Image Container with Subtle Parallax & Hover Zoom */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=2400&q=88"
          alt="Atmospheric Chaayé Khana artisanal breakfast and slow morning tea setting"
          className="w-full h-full object-cover object-[center_65%] md:object-[center_60%] transition-transform duration-[1000ms] ease-out md:group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:transform-none"
          style={{
            transform: scrollYOffset ? `translate3d(0, ${scrollYOffset}px, 0)` : undefined,
          }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Atmospheric Dark Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
        <div className="pointer-events-none absolute inset-0 bg-black/20" />
      </div>

      {/* Center-Aligned Editorial Typography Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-8 max-w-[900px] mx-auto pt-6 md:pt-10">
        {/* Subtle Eyebrow */}
        <span className="uppercase text-[10.5px] sm:text-[11px] tracking-[0.24em] text-white/80 font-medium mb-[18px] block">
          CHAAYÉ KHANA
        </span>

        {/* Main Headline */}
        <h2 className="font-serif font-normal text-white text-[34px] sm:text-[46px] md:text-[58px] lg:text-[66px] leading-[1.05] tracking-[0.01em] max-w-[820px]">
          CRAFTED FOR SLOW MORNINGS
        </h2>

        {/* Supporting Text */}
        <p className="mt-[22px] text-[14.5px] sm:text-[16px] leading-[1.6] text-white/85 max-w-[500px] font-light">
          Start the day with something worth lingering over.
        </p>
      </div>
    </section>
  );
};
