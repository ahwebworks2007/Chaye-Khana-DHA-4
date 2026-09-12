import React from 'react';
import { DigitalMenuSection } from './DigitalMenuSection';
import { useCafe } from '../context/CafeContext';

export const MenuSection: React.FC = () => {
  const { selectedCategoryId } = useCafe();

  return (
    <div className="min-h-screen bg-[#030304] pt-12 md:pt-16">
      <h1 className="sr-only">Chaayé Khana DHA-4 Menu — Artisanal Tea, Breakfast & Dining in Rawalpindi</h1>
      <DigitalMenuSection initialCategoryId={selectedCategoryId !== 'all' ? selectedCategoryId : 'breakfast'} />
    </div>
  );
};

