import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Shield,
  Info,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { navigateTo } from '../utils/router';

interface ProfileDropdownProps {
  isAdminContext?: boolean;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isAdminContext = false }) => {
  const {
    activeBranch,
    cafeSettings,
  } = useCafe();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        id="profile-dropdown-trigger"
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 rounded-[2px] border border-white/10 hover:border-white/25 text-neutral-400 hover:text-white bg-transparent hover:bg-white/[0.04] transition-all duration-300 cursor-pointer focus:outline-hidden flex items-center justify-center select-none"
        aria-label="Chaayé Khana Info & Staff Portal"
        title="Location & Staff Portal"
      >
        <Info className="w-3.5 h-3.5 stroke-[1.75]" />
      </button>

      {/* DROPDOWN LUXURY POPUP PANEL */}
      {isOpen && (
        <div
          id="profile-dropdown-panel"
          className="absolute right-0 top-full mt-3 w-80 sm:w-88 rounded-[2px] border border-white/10 bg-[#09090b]/95 backdrop-blur-xl shadow-2xl py-4 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="space-y-4">
            {/* Cafe Location Header */}
            <div className="pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-serif uppercase tracking-widest text-white">
                  {cafeSettings.cafeName || activeBranch.name}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                {cafeSettings.address || activeBranch.address}
              </p>
            </div>

            {/* Cafe Operating Contact Details */}
            <div className="space-y-2 pt-1 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{cafeSettings.openingHoursDisplay || activeBranch.openingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <a
                  href={`tel:${cafeSettings.phone || activeBranch.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {cafeSettings.phone || activeBranch.phone}
                </a>
              </div>
            </div>

            {/* Staff / Admin Portal Link */}
            <div className="pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                id="dropdown-staff-portal-btn"
                onClick={() => {
                  setIsOpen(false);
                  navigateTo('/admin');
                }}
                className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] rounded-[2px] text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Staff / Admin Portal</span>
                </span>
                <span className="text-[10px] uppercase font-mono text-neutral-400">/admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
