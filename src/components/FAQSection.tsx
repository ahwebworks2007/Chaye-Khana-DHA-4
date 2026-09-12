import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What are your opening hours and locations?",
    answer: "We are open seven days a week, serving you from 8:00 AM to 12:00 AM (Midnight) on weekdays, and extending up to 1:00 AM on weekends to accommodate late-night cravings. Our primary signature lounge is located in DHA Phase 4, with several branches nationwide."
  },
  {
    question: "Do all branches offer the signature Rooftop Terrace?",
    answer: "Our DHA Phase 4 branch features our award-winning open-air Rooftop Terrace & Lounge under the evening skies with panoramic city views. While other locations offer unique indoor and sidewalk-cafe aesthetics, DHA Phase 4 stands out with its dedicated rooftop tea experience."
  },
  {
    question: "What makes the Chaayé Khana 'Art of Chai' unique?",
    answer: "We treat tea as a mindful culinary craft. Our leaves are sourced directly from premier estates worldwide, blended by master artisans, and simmered with pure milk and dynamic spices. From our premium Karak Chai to authentic Kashmiri pink tea, every cup is custom-brewed to order."
  },
  {
    question: "Do you accommodate private events, meetings, or remote working?",
    answer: "Yes, indeed. Chaayé Khana is designed as a sanctuary for conversation and productivity. We offer premium executive rooms and meeting spaces equipped with high-speed internet, literature-lined walls, and bespoke tea/dining catering options."
  },
  {
    question: "Are there vegetarian, vegan, and gluten-free selections on the menu?",
    answer: "Absolutely. We pride ourselves on an inclusive culinary experience. Our menu features several vegetarian breakfast platters, healthy light salads, and gluten-free artisanal bakery options. Please mention any dietary requirements to your server."
  },
  {
    question: "Is secure parking and valet service available at DHA-4?",
    answer: "Yes, we provide secure, complimentary valet services and dedicated on-street parking to ensure your visit starts and ends with absolute comfort and peace of mind."
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq-section"
      className="bg-[#030304] text-white py-24 sm:py-32 relative overflow-hidden border-t border-white/[0.06] select-none"
    >
      {/* Editorial Decorative Background Light/Dark Gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 90%, rgba(139, 92, 26, 0.12) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-[11px] sm:text-xs font-medium tracking-[0.35em] text-neutral-400 uppercase block mb-4">
            QUESTIONS &amp; ANSWERS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Everything you need to know about our signature brewing, reservations, private spaces, and general guest experience.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border transition-all duration-300 ${
                  isOpen
                    ? 'border-amber-500/40 bg-[#09090b]/60'
                    : 'border-white/[0.06] bg-[#09090b]/20 hover:border-white/10 hover:bg-[#09090b]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 sm:py-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className={`w-4 h-4 shrink-0 transition-colors duration-300 ${
                      isOpen ? 'text-amber-500' : 'text-neutral-500'
                    }`} />
                    <span className="text-[15px] sm:text-base font-medium tracking-wide text-stone-200 hover:text-white transition-colors duration-200">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-amber-500' : 'rotate-0'
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[14px] sm:text-[15px] leading-relaxed text-neutral-400 font-light pl-14 pr-10 border-t border-white/[0.04] pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
