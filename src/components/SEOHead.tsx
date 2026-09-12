import React, { useEffect } from 'react';
import { useCafe } from '../context/CafeContext';

interface SEOHeadProps {
  currentPath?: string;
}

interface PageSEOConfig {
  title: string;
  description: string;
  canonicalPath: string;
  ogType: string;
  image?: string;
  breadcrumbs: { name: string; url: string }[];
}

const SEO_CONFIGS: Record<string, PageSEOConfig> = {
  home: {
    title: 'Chaayé Khana DHA-4 | Tea, Food & Dining in Rawalpindi',
    description:
      'Experience Chaayé Khana DHA-4 — a premium dining destination for signature chai, breakfast, delicious food and memorable moments in Rawalpindi.',
    canonicalPath: '/',
    ogType: 'restaurant',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85',
    breadcrumbs: [
      { name: 'Home', url: 'https://chaayekhanadha4.com/' },
    ],
  },
  menu: {
    title: 'Menu | Chaayé Khana DHA-4',
    description:
      'Explore the complete Chaayé Khana DHA-4 menu. Featuring artisanal Karak chai, specialty teas, breakfast platters, savory entrees, burgers and bakery classics in Rawalpindi.',
    canonicalPath: '/?view=menu',
    ogType: 'restaurant.menu',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85',
    breadcrumbs: [
      { name: 'Home', url: 'https://chaayekhanadha4.com/' },
      { name: 'Menu', url: 'https://chaayekhanadha4.com/?view=menu' },
    ],
  },
  about: {
    title: 'Our Story | Chaayé Khana DHA-4',
    description:
      'Discover the heritage and craft of Chaayé Khana DHA-4. Built on an uncompromising passion for authentic tea brewing, honest culinary traditions, and warm hospitality.',
    canonicalPath: '/?view=about',
    ogType: 'article',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    breadcrumbs: [
      { name: 'Home', url: 'https://chaayekhanadha4.com/' },
      { name: 'Our Story', url: 'https://chaayekhanadha4.com/?view=about' },
    ],
  },
  gallery: {
    title: 'Gallery | Chaayé Khana DHA-4',
    description:
      'Browse the photo gallery of Chaayé Khana DHA-4 — artisanal tea rituals, evening rooftop dining, library lounges, and freshly prepared kitchen moments.',
    canonicalPath: '/?view=gallery',
    ogType: 'website',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85',
    breadcrumbs: [
      { name: 'Home', url: 'https://chaayekhanadha4.com/' },
      { name: 'Gallery', url: 'https://chaayekhanadha4.com/?view=gallery' },
    ],
  },
  contact: {
    title: 'Visit Chaayé Khana DHA-4 | Location & Contact',
    description:
      'Visit Chaayé Khana DHA-4 in Sector C/F Commercial Area, Rawalpindi. Find operating hours, physical address, reservations, and front desk contact details.',
    canonicalPath: '/?view=contact',
    ogType: 'restaurant',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    breadcrumbs: [
      { name: 'Home', url: 'https://chaayekhanadha4.com/' },
      { name: 'Visit Us', url: 'https://chaayekhanadha4.com/?view=contact' },
    ],
  },
  branches: {
    title: 'Branches | Chaayé Khana DHA-4',
    description:
      'Explore Chaayé Khana branches across Pakistan. Search our locations in Rawalpindi, Islamabad, Lahore, Karachi, and Peshawar to find the nearest outlet.',
    canonicalPath: '/?view=branches',
    ogType: 'website',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    breadcrumbs: [
      { name: 'Home', url: 'https://chaayekhanadha4.com/' },
      { name: 'Branches', url: 'https://chaayekhanadha4.com/?view=branches' },
    ],
  },
  '404': {
    title: 'Page Not Found | Chaayé Khana DHA-4',
    description: 'The page you are looking for could not be found at Chaayé Khana DHA-4.',
    canonicalPath: '/404',
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', url: 'https://chaayekhanadha4.com/' },
      { name: '404 Not Found', url: 'https://chaayekhanadha4.com/404' },
    ],
  },
};

export const SEOHead: React.FC<SEOHeadProps> = ({ currentPath }) => {
  const { currentView } = useCafe();

  useEffect(() => {
    // If on private admin routes, ensure strict noindex, nofollow and private title
    if (currentPath && (currentPath.startsWith('/admin') || currentPath === '/admin/login')) {
      document.title = 'Staff Portal | Chaayé Khana DHA-4';
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow, noarchive');
      return;
    }

    // Public website view SEO
    const activeKey = currentView in SEO_CONFIGS ? currentView : 'home';
    const config = SEO_CONFIGS[activeKey];
    const baseUrl = 'https://chaayekhanadha4.com';
    const fullCanonicalUrl = `${baseUrl}${config.canonicalPath}`;

    // 1. Document Title
    document.title = config.title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Primary Meta Tags
    setMetaTag('name', 'description', config.description);
    setMetaTag('name', 'robots', 'index, follow');

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', config.title);
    setMetaTag('property', 'og:description', config.description);
    setMetaTag('property', 'og:url', fullCanonicalUrl);
    setMetaTag('property', 'og:type', config.ogType);
    setMetaTag('property', 'og:site_name', 'Chaayé Khana DHA-4');
    setMetaTag('property', 'og:locale', 'en_PK');
    if (config.image) {
      setMetaTag('property', 'og:image', config.image);
    }

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', config.title);
    setMetaTag('name', 'twitter:description', config.description);
    if (config.image) {
      setMetaTag('name', 'twitter:image', config.image);
    }

    // 6. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 7. Dynamic BreadcrumbList Schema
    const breadcrumbSchemaId = 'breadcrumb-json-ld';
    let breadcrumbScript = document.getElementById(breadcrumbSchemaId);
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.setAttribute('type', 'application/ld+json');
      breadcrumbScript.setAttribute('id', breadcrumbSchemaId);
      document.head.appendChild(breadcrumbScript);
    }

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: config.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };

    breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
  }, [currentView, currentPath]);

  return null;
};
