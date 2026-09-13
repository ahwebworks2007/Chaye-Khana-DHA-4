import React, { useState, useEffect, useRef } from 'react';

interface ChaiChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
}

const chapters: ChaiChapter[] = [
  {
    id: 'leaf',
    number: '01',
    title: 'THE LEAF',
    subtitle: 'Harvested with care',
    description: 'Selected single-estate orthodox tea leaves sourced globally for supreme depth, fragrance and character.',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1600&q=88',
    alt: 'Detailed macro view of premium tea leaves for Chaayé Khana signature chai'
  },
  {
    id: 'brew',
    number: '02',
    title: 'THE BREW',
    subtitle: 'Simmered with patience',
    description: 'Slowly simmered with aromatic spices, fresh milk and unwavering dedication until the rich amber essence awakens.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=88',
    alt: 'Chai being prepared with simmering milk, spices, and rising steam'
  },
  {
    id: 'pour',
    number: '03',
    title: 'THE POUR',
    subtitle: 'The ritual of the stream',
    description: 'The satisfying warm amber stream cascading gracefully into fine ceramic cups, releasing a comforting aroma.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=88',
    alt: 'Chai being poured into a fine ceramic cup at Chaayé Khana'
  },
  {
    id: 'moment',
    number: '04',
    title: 'THE MOMENT',
    subtitle: 'Where conversations linger',
    description: 'The finished cup resting on a beautifully composed table, inviting guests to pause, gather and savor the present.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=88',
    alt: 'Finished cup of chai on a calm table setting ready to be enjoyed'
  }
];

export const TheArtOfChaiSection: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Optional scroll observer to progress chapters automatically or let user click/scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top <= windowHeight * 0.6 && rect.bottom >= windowHeight * 0.4) {
        const progress = Math.max(0, Math.min(1, (windowHeight * 0.6 - rect.top) / (rect.height * 0.8)));
        const index = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));
        setActiveChapterIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReducedMotion]);

  const activeChapter = chapters[activeChapterIndex];

  return (
    <section
      ref={sectionRef}
      id="art-of-chai-section"
      className="relative w-full bg-[#030304] text-white py-24 sm:py-32 lg:py-40 border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Intro Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.28em] uppercase text-neutral-400 block mb-4">
            THE ART OF CHAI
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08] tracking-tight mb-6">
            Brewed with patience.<br />
            Served with warmth.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg lg:text-[18px] leading-relaxed font-light max-w-2xl mx-auto">
            &ldquo;Tea has always been more than a drink at Chaayé Khana. It is a moment to pause, gather and connect. From the first pour to the final sip, every cup is prepared to be savoured.&rdquo;
          </p>
        </div>

        {/* DESKTOP / TABLET CINEMATIC SPLIT EXPERIENCE */}
        <div className="hidden lg:grid grid-cols-12 gap-16 items-center">
          
          {/* Left Visual Stage (58% / col-span-7) */}
          <div className="lg:col-span-7 relative h-[620px] xl:h-[680px] rounded-[2px] border border-white/[0.08] overflow-hidden bg-neutral-950 shadow-2xl">
            {chapters.map((chap, idx) => (
              <div
                key={chap.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  idx === activeChapterIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={chap.image}
                  alt={chap.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.02] motion-reduce:transform-none"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
              </div>
            ))}

            {/* Stage Counter Overlay */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-[2px] border border-white/10 text-xs tracking-[0.2em] uppercase text-white/80 font-light">
              <span className="text-[#D8D4CD] font-medium">{activeChapter.number}</span>
              <span className="text-neutral-600">/</span>
              <span>04 — {activeChapter.title}</span>
            </div>
          </div>

          {/* Right Storytelling & Chapter Markers (42% / col-span-5) */}
          <div className="lg:col-span-5 space-y-10 pl-4 xl:pl-8 text-left">
            
            {/* Chapter Markers list */}
            <div className="space-y-4" role="tablist" aria-label="The Art of Chai Chapters">
              {chapters.map((chap, idx) => {
                const isActive = idx === activeChapterIndex;
                return (
                  <button
                    key={chap.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`w-full text-left py-4 px-5 rounded-[2px] transition-all duration-300 cursor-pointer flex items-center justify-between border ${
                      isActive
                        ? 'bg-white/[0.04] border-white/20 text-white'
                        : 'bg-transparent border-white/[0.04] text-neutral-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`text-xs font-mono tracking-[0.2em] ${isActive ? 'text-[#D8D4CD]' : 'text-neutral-500'}`}>
                        {chap.number}
                      </span>
                      <span className="font-serif text-lg tracking-wide">
                        {chap.title}
                      </span>
                    </div>
                    <div className={`h-[1px] transition-all duration-300 ${isActive ? 'w-10 bg-white' : 'w-4 bg-neutral-700'}`} />
                  </button>
                );
              })}
            </div>

            {/* Active Chapter Details */}
            <div className="pt-6 border-t border-white/[0.08] min-h-[160px]">
              <span className="text-[10px] uppercase tracking-[0.28em] text-neutral-400 font-medium block mb-2">
                {chapSubtitle(activeChapter.id)}
              </span>
              <h3 className="font-serif text-2xl text-white font-normal mb-3">
                {activeChapter.title}
              </h3>
              <p className="text-[#B8B8B8] text-base leading-relaxed font-light">
                {activeChapter.description}
              </p>
            </div>

          </div>

        </div>

        {/* MOBILE / TABLET VERTICAL STORYTELLING SEQUENCE */}
        <div className="lg:hidden space-y-16">
          {chapters.map((chap) => (
            <div key={chap.id} className="space-y-6 text-left border-b border-white/[0.06] pb-16 last:border-b-0 last:pb-0">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono tracking-[0.2em] text-[#D8D4CD]">{chap.number}</span>
                <span className="text-neutral-600">—</span>
                <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">{chap.title}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                {chap.subtitle}
              </h3>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
                {chap.description}
              </p>
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-[2px] border border-white/[0.08] overflow-hidden bg-neutral-950">
                <img
                  src={chap.image}
                  alt={chap.alt}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

function chapSubtitle(id: string): string {
  switch (id) {
    case 'leaf': return '01 — THE RITUAL OF SELECTION';
    case 'brew': return '02 — THE SLOW SIMMER';
    case 'pour': return '03 — THE WARM POUR';
    case 'moment': return '04 — THE GATHERING';
    default: return 'THE ART OF CHAI';
  }
}
