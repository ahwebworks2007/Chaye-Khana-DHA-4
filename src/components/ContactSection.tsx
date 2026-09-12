import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCafe } from '../context/CafeContext';

export const ContactSection: React.FC = () => {
  const { cafeSettings } = useCafe();

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('Table Reservation / General Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    setIsSubmitted(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMessage('');
    }, 2000);
  };

  const handleOpenMaps = () => {
    const mapsUrl = cafeSettings.googleMapsUrl || 'https://www.google.com/maps/search/?api=1&query=Chaaye+Khana+DHA+Phase+4+Rawalpindi';
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const hasWhatsapp = !!cafeSettings.whatsapp;
  const whatsappClean = cafeSettings.whatsapp ? cafeSettings.whatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <div className="bg-[#030304] text-white min-h-[90vh] selection:bg-white selection:text-black pt-12 md:pt-16 pb-24 sm:pb-32 border-b border-neutral-900">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-10 lg:px-14 space-y-16 sm:space-y-24">
        
        {/* ========================================================================= */}
        {/* 1. HEADER */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-2xl mx-auto pt-6"
        >
          <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.24em] text-neutral-400 font-medium block mb-3.5">
            CONNECT WITH US
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.12] tracking-tight">
            Visit Us &amp; Inquiries
          </h1>
          <p className="mt-4 sm:mt-5 text-[#AFAFAF] text-sm sm:text-base leading-relaxed font-light">
            Whether reserving a table, inquiring about rooftop gatherings, or connecting with our hospitality team — we look forward to welcoming you.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* 2. QUICK CONTACT CARDS */}
        {/* ========================================================================= */}
        <div className={`grid grid-cols-1 ${hasWhatsapp ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          {/* Direct Phone Card */}
          <div className="p-7 rounded-[3px] bg-[#09090b] border border-white/[0.06] flex flex-col justify-between hover:border-white/20 transition-colors duration-300">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
                <Phone className="w-4 h-4 text-neutral-300" />
              </div>
              <h2 className="font-serif text-lg text-white font-normal">Direct Hospitality Desk</h2>
              <p className="text-xs sm:text-[13px] text-[#AFAFAF] leading-relaxed font-light">
                Call our front desk for immediate table bookings, private dining queries, or directions.
              </p>
            </div>
            <a
              href={`tel:${cafeSettings.phone}`}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-[2px] border border-white/20 hover:border-white text-white hover:bg-white/[0.04] text-[12px] uppercase tracking-[0.18em] font-medium transition-all duration-300 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call {cafeSettings.phone}</span>
            </a>
          </div>

          {/* WhatsApp Support Card */}
          {hasWhatsapp && (
            <div className="p-7 rounded-[3px] bg-[#09090b] border border-white/[0.06] flex flex-col justify-between hover:border-white/20 transition-colors duration-300">
              <div className="space-y-3.5">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-neutral-300" />
                </div>
                <h2 className="font-serif text-lg text-white font-normal">WhatsApp Concierge</h2>
                <p className="text-xs sm:text-[13px] text-[#AFAFAF] leading-relaxed font-light">
                  Direct WhatsApp assistance for reservations, special dietary requirements, and queries.
                </p>
              </div>
              <a
                href={`https://wa.me/${whatsappClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-[2px] border border-white/20 hover:border-white text-white hover:bg-white/[0.04] text-[12px] uppercase tracking-[0.18em] font-medium transition-all duration-300 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          )}

          {/* Location & Directions */}
          <div className="p-7 rounded-[3px] bg-[#09090b] border border-white/[0.06] flex flex-col justify-between hover:border-white/20 transition-colors duration-300">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
                <MapPin className="w-4 h-4 text-neutral-300" />
              </div>
              <h2 className="font-serif text-lg text-white font-normal">Location &amp; Maps</h2>
              <p className="text-xs sm:text-[13px] text-[#AFAFAF] leading-relaxed font-light">
                {cafeSettings.address}. Easy parking and convenient access.
              </p>
            </div>
            <button
              onClick={handleOpenMaps}
              className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-[2px] border border-white/20 hover:border-white text-white hover:bg-white/[0.04] text-[12px] uppercase tracking-[0.18em] font-medium transition-all duration-300 cursor-pointer focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DETAILS: SCHEDULE & INQUIRY FORM */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Hours & Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#09090b] p-7 rounded-[3px] border border-white/[0.06] space-y-5">
              <h2 className="font-serif text-xl text-white font-normal flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>Operating Timings</span>
              </h2>

              <div className="space-y-3 text-xs sm:text-[13px] text-[#AFAFAF] divide-y divide-white/[0.06]">
                <div className="flex justify-between items-baseline pt-2">
                  <span className="font-light">Monday – Sunday</span>
                  <span className="text-white font-normal">{cafeSettings.openingHoursDisplay}</span>
                </div>
                <div className="flex justify-between items-baseline pt-3">
                  <span className="font-light">Artisanal Breakfast</span>
                  <span className="text-white font-normal">8:00 AM – 3:00 PM</span>
                </div>
                <div className="flex justify-between items-baseline pt-3">
                  <span className="font-light">All-Day Dining &amp; Mains</span>
                  <span className="text-white font-normal">12:00 PM – 1:00 AM</span>
                </div>
                <div className="flex justify-between items-baseline pt-3">
                  <span className="font-light">Bakery &amp; Tea Salon</span>
                  <span className="text-white font-normal">All Day Service</span>
                </div>
              </div>

              <div className="pt-2 text-[12px] text-neutral-400 font-light border-t border-white/[0.06]">
                Tea Salon • Library Lounge • Rooftop Terrace • Handcrafted Bakery
              </div>
            </div>

            <div className="bg-[#09090b] p-7 rounded-[3px] border border-white/[0.06] space-y-3.5">
              <h2 className="font-serif text-xl text-white font-normal flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span>Physical Destination</span>
              </h2>
              <p className="text-xs sm:text-[13px] text-[#AFAFAF] leading-relaxed font-light">
                {cafeSettings.address}
              </p>
              <div className="pt-2 text-[12px] text-neutral-400 space-y-1 font-light">
                <p>• Valet &amp; customer parking directly outside</p>
                <p>• Indoor climate-controlled seating &amp; open-air rooftop</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#09090b] p-7 sm:p-9 rounded-[3px] border border-white/[0.06] space-y-6">
            <div>
              <h2 className="font-serif text-2xl text-white font-normal">
                Send an Inquiry
              </h2>
              <p className="text-xs sm:text-[13px] text-[#AFAFAF] mt-1 font-light">
                Our hospitality concierge will respond promptly to your request.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-[3px] bg-white/[0.03] border border-white/20 text-center space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 text-neutral-200 mx-auto" />
                <h3 className="font-serif text-lg text-white">Inquiry Received</h3>
                <p className="text-xs sm:text-[13px] text-[#AFAFAF] max-w-sm mx-auto font-light">
                  Thank you for connecting with Chaayé Khana DHA-4. A member of our team will get in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-light block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Tariq Khan"
                      className="w-full px-4 py-3 rounded-[2px] bg-black/50 border border-white/10 text-white placeholder:text-neutral-600 text-sm focus:outline-hidden focus:border-white/40 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-light block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full px-4 py-3 rounded-[2px] bg-black/50 border border-white/10 text-white placeholder:text-neutral-600 text-sm focus:outline-hidden focus:border-white/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-light block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full px-4 py-3 rounded-[2px] bg-black/50 border border-white/10 text-white placeholder:text-neutral-600 text-sm focus:outline-hidden focus:border-white/40 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-light block">
                    Topic
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-[2px] bg-[#09090b] border border-white/10 text-white text-sm focus:outline-hidden focus:border-white/40 transition-colors"
                  >
                    <option value="Table Reservation / General Inquiry">Table Reservation / General Inquiry</option>
                    <option value="Rooftop Event / Gathering">Rooftop Event / Gathering</option>
                    <option value="Special Dietary Inquiry">Special Dietary Inquiry</option>
                    <option value="Feedback / Experience">Feedback / Experience</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-light block">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Please specify date, party size, or any details..."
                    className="w-full px-4 py-3 rounded-[2px] bg-black/50 border border-white/10 text-white placeholder:text-neutral-600 text-sm focus:outline-hidden focus:border-white/40 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-[2px] border border-white/30 hover:border-white text-white hover:text-black hover:bg-white text-[12px] uppercase tracking-[0.2em] font-medium transition-all duration-300 ease-out cursor-pointer flex items-center justify-center gap-2.5 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-white"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT INQUIRY</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
