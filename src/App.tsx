import React, { useState, useEffect } from 'react';
import { AboutSection } from './components/AboutSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { BrandLoader } from './components/BrandLoader';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { ItemModal } from './components/ItemModal';
import { MenuSection } from './components/MenuSection';
import { Navbar } from './components/Navbar';
import { NotFoundPage } from './components/NotFoundPage';
import { FAQSection } from './components/FAQSection';
import { CafeProvider, useCafe } from './context/CafeContext';
import { getNormalizedPath, navigateTo } from './utils/router';
import { SEOHead } from './components/SEOHead';

const AppRouter: React.FC = () => {
  const { currentView, setCurrentView, selectedItemForModal, setSelectedItemForModal, isAdminAuthenticated } = useCafe();
  const [currentPath, setCurrentPath] = useState<string>(() => getNormalizedPath());

  useEffect(() => {
    const handleLocationChange = () => {
      const path = getNormalizedPath();
      setCurrentPath(path);

      // Support query parameters e.g. /?view=menu, /?view=about, /?view=gallery, /?view=contact
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const viewParam = params?.get('view');

      if (viewParam === 'menu' || path === '/menu') {
        setCurrentView('menu');
      } else if (viewParam === 'about' || path === '/about') {
        setCurrentView('about');
      } else if (viewParam === 'contact' || path === '/contact' || path === '/branches') {
        setCurrentView('contact');
      } else if (viewParam === 'gallery' || path === '/gallery') {
        setCurrentView('home');
        setTimeout(() => {
          const galleryEl = document.getElementById('gallery-section');
          if (galleryEl) {
            galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 1600, behavior: 'smooth' });
          }
        }, 120);
      } else if (path === '/' || path === '') {
        if (!viewParam) {
          setCurrentView('home');
        }
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [setCurrentView]);

  const handleNavigate = (path: string) => {
    navigateTo(path);
    setCurrentPath(getNormalizedPath());
  };

  // Protected Admin Dashboard (/admin)
  if (currentPath.startsWith('/admin')) {
    if (!isAdminAuthenticated) {
      return (
        <>
          <SEOHead currentPath={currentPath} />
          <AdminLoginPage onNavigate={handleNavigate} />
        </>
      );
    }
    return (
      <>
        <SEOHead currentPath={currentPath} />
        <AdminDashboard onNavigate={handleNavigate} />
      </>
    );
  }

  // Check for 404 on unrecognized routes
  const recognizedPaths = ['', '/', '/menu', '/about', '/contact', '/gallery', '/branches'];
  const isUnrecognized = !recognizedPaths.includes(currentPath);

  if (isUnrecognized) {
    return (
      <>
        <SEOHead currentPath="/404" />
        <NotFoundPage
          onBackToHome={() => {
            handleNavigate('/');
            setCurrentView('home');
          }}
        />
      </>
    );
  }

  // Public Chaayé Khana Restaurant Website (/)
  return (
    <div className="min-h-screen flex flex-col bg-[#030304] text-white font-sans selection:bg-neutral-800 selection:text-white">
      {/* Subtle Film Grain Texture Overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Minimal Branded Loading Screen */}
      <BrandLoader />

      {/* Dynamic SEO Meta & Head Management */}
      <SEOHead currentPath={currentPath} />

      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <FAQSection />
          </>
        )}
        {currentView === 'menu' && <MenuSection />}
        {currentView === 'about' && <AboutSection />}
        {currentView === 'contact' && <ContactSection />}
        {currentView === 'branches' && <ContactSection />}
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Detailed Food Item Customization / Information Modal */}
      {selectedItemForModal && (
        <ItemModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CafeProvider>
      <AppRouter />
    </CafeProvider>
  );
};

export default App;
