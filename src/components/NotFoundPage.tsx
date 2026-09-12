import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface NotFoundPageProps {
  onBackToHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#030304] text-white font-sans selection:bg-neutral-800 selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-28 sm:py-36 px-6 relative overflow-hidden">
        {/* Subtle Luxury Radial Vignette */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(35, 30, 24, 0.4) 0%, rgba(3, 3, 4, 0.95) 70%, #030304 100%)',
          }}
        />

        <div className="max-w-xl mx-auto text-center relative z-10 space-y-6">
          {/* Eyebrow / Code */}
          <span className="text-neutral-400 font-serif text-6xl sm:text-7xl lg:text-8xl tracking-tight block font-light">
            404
          </span>

          {/* Heading */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight tracking-tight">
            Page not found.
          </h1>

          {/* Subtitle */}
          <p className="text-neutral-400 text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
            The moment you're looking for seems to have wandered.
          </p>

          {/* Back to Home CTA */}
          <div className="pt-4">
            <button
              id="not-found-back-home-btn"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-neutral-700 hover:border-white text-white hover:text-black hover:bg-white text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-300 ease-out cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO HOME</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
