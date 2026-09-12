import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import { useCafe } from '../../context/CafeContext';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { isAdminAuthenticated, loginAdmin } = useCafe();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately to /admin
  useEffect(() => {
    if (isAdminAuthenticated) {
      onNavigate('/admin');
    }
  }, [isAdminAuthenticated, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailInput.trim()) {
      setErrorMsg('Please enter your administrator email.');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMsg('Please enter your administrator password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await loginAdmin(emailInput, passwordInput);
      if (success) {
        setEmailInput('');
        setPasswordInput('');
        onNavigate('/admin');
      } else {
        setErrorMsg('Incorrect email or password. Please verify and try again.');
      }
    } catch {
      setErrorMsg('An unexpected authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] text-[#F5F4F0] flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Background Subtle Vignette */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 35%, rgba(45, 38, 30, 0.4) 0%, rgba(3, 3, 4, 0.95) 75%, #030304 100%)',
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/[0.05]">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-200" />
          <span>Return to Storefront</span>
        </button>

        <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 font-mono">
          SECURE PORTAL
        </span>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-md w-full bg-[#0a0a0d] border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl space-y-6">
          
          {/* Lock Icon */}
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6 stroke-[1.8]" />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-semibold block">
              CHAAYÉ KHANA PORTAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal tracking-tight">
              Staff &amp; Management
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto font-light">
              Restricted administrative portal. Enter authorized credentials (email and password) to access catalog management and operational settings.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-2 text-left">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. dha4@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-[#030304] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/80 transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-2 text-left">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#030304] border border-neutral-800 text-white text-sm font-mono placeholder:font-sans placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/80 transition-all"
                />
                <KeyRound className="w-4 h-4 text-neutral-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] disabled:opacity-50 text-stone-950 font-bold text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate &amp; Enter</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="pt-4 border-t border-neutral-900 text-center text-[11px] text-neutral-600">
            End-to-end encrypted session • SHA-256 Authentication
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} Chaayé Khana • Private Administration
      </footer>
    </div>
  );
};
