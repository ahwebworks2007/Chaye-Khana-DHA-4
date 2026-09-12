import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Utensils,
  BookOpen,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Shield,
  ClipboardList,
  Package,
  LogOut,
  Lock,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { navigateTo } from '../utils/router';

export const ProfileDropdown: React.FC = () => {
  const {
    setCurrentView,
    cafeSettings,
    isAdminAuthenticated,
    logoutAdmin,
  } = useCafe();

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('ck_customer_logged') === 'true';
  });
  const [customerIdentifier, setCustomerIdentifier] = useState<string>(() => {
    return localStorage.getItem('ck_customer_id') || '';
  });

  // Login inline form state
  const [showCustomerLoginForm, setShowCustomerLoginForm] = useState(false);
  const [customerEmailOrPhone, setCustomerEmailOrPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active simulated tracking order state
  const [showTracker, setShowTracker] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowCustomerLoginForm(false);
        setShowTracker(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowCustomerLoginForm(false);
        setShowTracker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle Customer Login action
  const handleCustomerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const query = customerEmailOrPhone.trim();
    if (!query) {
      setLoginError('Please enter email or phone.');
      return;
    }

    // Simulate login
    localStorage.setItem('ck_customer_logged', 'true');
    localStorage.setItem('ck_customer_id', query);
    setIsCustomerLoggedIn(true);
    setCustomerIdentifier(query);
    setShowCustomerLoginForm(false);
    setCustomerEmailOrPhone('');
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('ck_customer_logged');
    localStorage.removeItem('ck_customer_id');
    setIsCustomerLoggedIn(false);
    setCustomerIdentifier('');
    setShowTracker(false);
  };

  const handleAdminLogoutAction = () => {
    logoutAdmin();
    setIsOpen(false);
    navigateTo('/');
  };

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      {/* Profile Trigger: Simple, Elegant Outline Profile Icon */}
      <button
        id="profile-menu-toggle"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setShowCustomerLoginForm(false);
          setShowTracker(false);
        }}
        className={`relative p-2 rounded-full text-neutral-400 hover:text-white transition-all duration-300 ease-out cursor-pointer flex items-center justify-center focus:outline-hidden ${
          isOpen ? 'text-white bg-white/[0.04]' : 'hover:bg-white/[0.04]'
        }`}
        aria-label="Guest Inquiries & Details"
        title="Guest Inquiries & Details"
      >
        <User className="w-[18px] h-[18px] stroke-[1.6] transition-transform duration-300 group-hover:scale-105" />
        
        {/* Subtle dot indicator if logged in */}
        {(isAdminAuthenticated || isCustomerLoggedIn) && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse border border-[#030304]" />
        )}
      </button>

      {/* Luxury Minimal Dropdown Menu */}
      {isOpen && (
        <div
          id="profile-dropdown-panel"
          className="absolute right-0 top-full mt-3 w-64 rounded-2xl bg-[#0a0a0c]/98 border border-neutral-800/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] py-2.5 z-50 transition-all duration-200 text-white animate-fadeIn"
        >
          {/* Header Status */}
          <div className="px-4 py-2 border-b border-neutral-800/60 mb-1.5">
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-amber-500/90 block">
              {isAdminAuthenticated 
                ? 'ADMINISTRATOR SESSION' 
                : isCustomerLoggedIn 
                  ? 'CUSTOMER PROFILE' 
                  : 'GUEST SERVICES'}
            </span>
            <p className="text-xs font-medium text-neutral-200 mt-0.5 truncate">
              {isAdminAuthenticated 
                ? 'Management Portal Active' 
                : isCustomerLoggedIn 
                  ? customerIdentifier 
                  : 'DHA Phase 4 • Rawalpindi'}
            </p>
          </div>

          <div className="px-1.5 space-y-0.5 text-xs">
            {/* INLINE CUSTOMER LOGIN FORM PANEL */}
            {showCustomerLoginForm ? (
              <form onSubmit={handleCustomerLoginSubmit} className="p-3 space-y-3 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => setShowCustomerLoginForm(false)}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-500 hover:text-white transition-colors cursor-pointer mb-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={customerEmailOrPhone}
                    onChange={(e) => setCustomerEmailOrPhone(e.target.value)}
                    placeholder="Enter email or phone..."
                    className="w-full px-2.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-hidden focus:border-amber-500/80 focus:bg-black transition-all font-sans font-light"
                    autoFocus
                  />
                </div>
                {loginError && (
                  <p className="text-[10px] text-rose-400 font-light">{loginError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Confirm Login
                </button>
              </form>
            ) : showTracker ? (
              /* INLINE CUSTOM FLOW: SIMULATED ORDER TRACKER PANEL */
              <div className="p-3 space-y-3.5 animate-fadeIn text-left">
                <button
                  type="button"
                  onClick={() => setShowTracker(false)}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-500 hover:text-white transition-colors cursor-pointer mb-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                
                <div className="border-l-2 border-amber-500/80 pl-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-400">ORDER #CK-4921</span>
                    <span className="text-[10px] font-medium tracking-wide text-amber-500 uppercase">Preparing</span>
                  </div>
                  <h4 className="font-medium text-xs text-neutral-200">Karak Chai &amp; Flaky Croissant</h4>
                  <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-2/3 rounded-full animate-pulse" />
                  </div>
                  <p className="text-[10px] text-neutral-400 font-light">
                    Freshly brewing tea. Approx. 6 mins remaining.
                  </p>
                </div>

                <div className="bg-neutral-950/60 p-2 border border-neutral-800/40 rounded-lg space-y-1">
                  <span className="text-[9px] font-semibold text-neutral-500 block uppercase tracking-wider">DELIVERY TO</span>
                  <p className="text-[10px] text-neutral-300 font-light line-clamp-1">Sector F, DHA Phase 4, Rawalpindi</p>
                </div>
              </div>
            ) : (
              /* STANDARD MENU OPTIONS LIST */
              <>
                {/* 1. Customer Login -> customer access (only visible if not already logged in as customer/admin) */}
                {!isCustomerLoggedIn && !isAdminAuthenticated && (
                  <button
                    id="dropdown-customer-login"
                    onClick={() => setShowCustomerLoginForm(true)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                      <span>Customer Login</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 2. Admin Control Panel -> admin access (visible to admins, or anyone to trigger admin login screen) */}
                <button
                  id="dropdown-admin-portal"
                  onClick={() => {
                    setIsOpen(false);
                    if (isAdminAuthenticated) {
                      navigateTo('/admin');
                    } else {
                      navigateTo('/admin/login');
                    }
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                    <span>Admin Control Panel</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* 3. Orders -> admin only (visible only to authenticated admins) */}
                {isAdminAuthenticated && (
                  <button
                    id="dropdown-admin-orders"
                    onClick={() => {
                      setIsOpen(false);
                      navigateTo('/admin');
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ClipboardList className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                      <span>Orders</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 4. Track your order -> customers and admins */}
                {(isCustomerLoggedIn || isAdminAuthenticated) ? (
                  <button
                    id="dropdown-track-order"
                    onClick={() => {
                      setShowTracker(true);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                      <span>Track your order</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                ) : (
                  // If guest tries to click track, show a prompt
                  <button
                    id="dropdown-track-order-guest"
                    onClick={() => {
                      setShowCustomerLoginForm(true);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-neutral-500 hover:text-neutral-300 hover:bg-neutral-850/30 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                      <span>Track your order</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 5. Logout Customer -> customer only */}
                {isCustomerLoggedIn && (
                  <button
                    id="dropdown-customer-logout"
                    onClick={handleCustomerLogout}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/25 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogOut className="w-3.5 h-3.5 text-rose-400/80 group-hover:text-rose-300 transition-colors" />
                      <span>Logout Customer</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-rose-400 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* 6. Logout Admin -> admin only */}
                {isAdminAuthenticated && (
                  <button
                    id="dropdown-admin-logout"
                    onClick={handleAdminLogoutAction}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/25 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogOut className="w-3.5 h-3.5 text-rose-400/80 group-hover:text-rose-300 transition-colors" />
                      <span>Logout Admin</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-rose-400 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )}

                {/* Timings & Direct Phone */}
                <div className="pt-2.5 mt-2 border-t border-neutral-800/60 px-3.5 py-1.5 space-y-1.5 text-[11px] text-neutral-400 text-left">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-neutral-500 shrink-0" />
                    <span>Daily: 8:00 AM – 1:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-neutral-500 shrink-0" />
                    <a
                      href={`tel:${cafeSettings.phone}`}
                      className="text-neutral-300 hover:text-white transition-colors"
                    >
                      {cafeSettings.phone}
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
