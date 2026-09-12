/**
 * SPA Router helper to synchronize window.location and pushState navigation
 */

export const getNormalizedPath = (): string => {
  if (typeof window === 'undefined') return '/';
  
  // Check pathname first
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (pathname === '/admin') {
    return pathname;
  }

  // Also support hash paths for nested preview iframes e.g. /#/admin
  const hash = window.location.hash.toLowerCase().replace(/^#/, '').replace(/\/+$/, '');
  if (hash === '/admin' || hash === 'admin') return '/admin';

  return pathname;
};

export const navigateTo = (path: string) => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
};
