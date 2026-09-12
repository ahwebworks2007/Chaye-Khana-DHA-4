import React, { useEffect, useState } from 'react';

export const BrandLoader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // When the component mounts (DOM ready), start graceful fade-out immediately
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 450);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      id="brand-loader"
      aria-hidden="true"
      className={`fixed inset-0 z-[100000] bg-[#030304] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500 ease-out select-none ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-3">
        <span className="font-serif tracking-[0.34em] text-white text-xl sm:text-2xl uppercase block font-light">
          CHAAYÉ KHANA
        </span>
        <span className="text-[10px] tracking-[0.38em] uppercase text-neutral-400 font-light block">
          DHA-4 • RAWALPINDI
        </span>
      </div>
    </div>
  );
};
