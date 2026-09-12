import React, { useState, useEffect, useMemo } from 'react';
import { Search, Navigation, MapPin, Phone, Clock, ExternalLink, Compass } from 'lucide-react';
import { CK_BRANCHES, Branch } from '../data/branchesData';

interface BranchWithDistance extends Branch {
  distance?: number;
}

export const BranchesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('All');

  // Earth's radius in kilometers for accurate Haversine calculation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get distinct cities for minimal, high-end filter pills
  const cities = useMemo(() => {
    const list = Array.from(new Set(CK_BRANCHES.map((b) => b.city)));
    return ['All', ...list];
  }, []);

  // Request browser geolocation on user action
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        // Clear any previous error
        setLocationError(null);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location access was not enabled. Search for your city or area instead.');
        } else {
          setLocationError('Could not retrieve your location. Please try searching instead.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Automatically trigger location fetch if "near me" is typed in search bar
  useEffect(() => {
    if (searchQuery.toLowerCase().trim() === 'near me' && !userLocation && !isLocating) {
      handleUseLocation();
    }
  }, [searchQuery, userLocation, isLocating]);

  // Search and sort implementation
  const processedBranches = useMemo(() => {
    let branches: BranchWithDistance[] = CK_BRANCHES.map((branch) => {
      if (userLocation) {
        return {
          ...branch,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            branch.lat,
            branch.lng
          ),
        };
      }
      return branch;
    });

    // Apply text search
    const query = searchQuery.toLowerCase().trim();
    if (query && query !== 'near me') {
      branches = branches.filter((b) => {
        return (
          b.name.toLowerCase().includes(query) ||
          b.city.toLowerCase().includes(query) ||
          b.area.toLowerCase().includes(query) ||
          b.address.toLowerCase().includes(query)
        );
      });
    }

    // Apply high-end City Pill Filter (only when "near me" is not the active search query override)
    if (selectedCity !== 'All' && query !== 'near me') {
      branches = branches.filter((b) => b.city === selectedCity);
    }

    // Sort by distance if user location is available
    if (userLocation) {
      branches.sort((a, b) => {
        const distA = a.distance ?? Infinity;
        const distB = b.distance ?? Infinity;
        return distA - distB;
      });
    }

    return branches;
  }, [searchQuery, userLocation, selectedCity]);

  return (
    <section 
      id="branches-locator-section"
      className="bg-[#030304] min-h-screen text-white pt-24 pb-20 relative select-none"
    >
      {/* Background Decorative Element */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(40, 34, 28, 0.3) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        {/* --- Header Section --- */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] sm:text-xs font-medium tracking-[0.35em] text-neutral-400 uppercase block mb-4">
            OUR BRANCHES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-6">
            Find Your Nearest Chaayé Khana
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Explore our branches and find the Chaayé Khana closest to you.
          </p>
        </div>

        {/* --- Search and Locator Control Panel --- */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input Container */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search branch or location..."
                aria-label="Search branches by name, city, area or location"
                className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-none py-3.5 pl-12 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-white/30 focus:bg-neutral-900/60 transition-all font-sans font-light tracking-wide"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Use My Location button */}
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={isLocating}
              className={`py-3.5 px-6 border rounded-none text-xs sm:text-[13px] tracking-wider uppercase font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                userLocation
                  ? 'bg-white text-black border-white hover:bg-neutral-100'
                  : 'bg-[#0a0a0c] border-white/[0.08] text-neutral-300 hover:border-white/20 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {isLocating ? (
                <>
                  <Compass className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{userLocation ? 'Location Enabled' : 'Use My Location'}</span>
                </>
              )}
            </button>
          </div>

          {/* Location error / success info alerts */}
          {locationError && (
            <p className="mt-4 text-xs text-amber-500/90 font-light flex items-center gap-1.5 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {locationError}
            </p>
          )}

          {userLocation && !locationError && (
            <div className="mt-4 flex items-center justify-between animate-fadeIn">
              <p className="text-xs text-neutral-400 font-light flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Branches sorted by proximity to your current location.</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setUserLocation(null);
                  if (searchQuery.toLowerCase().trim() === 'near me') {
                    setSearchQuery('');
                  }
                }}
                className="text-[11px] text-neutral-500 hover:text-white underline transition-colors cursor-pointer"
              >
                Reset Distance
              </button>
            </div>
          )}

          {/* City filtering pills (hidden when typing "near me" or when location is active) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-b border-white/[0.04] pb-6">
            <span className="text-[11px] tracking-wider text-neutral-500 uppercase mr-2">Filter City:</span>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setSelectedCity(city);
                  // clear search query if it's "near me" or custom query that blocks
                  if (searchQuery === 'near me') setSearchQuery('');
                }}
                className={`px-3 py-1 text-xs tracking-wider uppercase transition-all cursor-pointer ${
                  selectedCity === city && searchQuery.toLowerCase().trim() !== 'near me'
                    ? 'border-b border-white text-white font-medium'
                    : 'text-neutral-500 hover:text-neutral-300 border-b border-transparent'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* --- Branch Listing Results Grid --- */}
        <div className="max-w-5xl mx-auto">
          {processedBranches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {processedBranches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-[#070709] border border-white/[0.05] p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.12]"
                >
                  <div>
                    {/* Branch Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl tracking-tight text-white mb-1">
                          {branch.name}
                        </h3>
                        <p className="text-xs text-neutral-400 font-light tracking-wider uppercase">
                          {branch.city} / {branch.area}
                        </p>
                      </div>

                      {/* Distance Badge */}
                      {branch.distance !== undefined && (
                        <span className="shrink-0 bg-white/[0.04] border border-white/10 text-white font-mono text-[11px] px-2.5 py-1 tracking-wider">
                          {branch.distance < 1 
                            ? `${(branch.distance * 1000).toFixed(0)} m` 
                            : `${branch.distance.toFixed(1)} km`}{' '}
                          away
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 my-6">
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-neutral-300 font-light leading-relaxed">
                          {branch.address}
                        </p>
                      </div>

                      {/* Timings */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                        <p className="text-xs text-neutral-300 font-light">
                          {branch.openingHours}
                        </p>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                        <a
                          href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                          className="text-xs text-neutral-300 hover:text-white transition-colors font-light"
                        >
                          {branch.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Get Directions Action Button */}
                  <div className="pt-4 border-t border-white/[0.04] mt-4">
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs tracking-widest text-neutral-400 hover:text-white uppercase font-light transition-colors group"
                    >
                      <span>GET DIRECTIONS</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-white/[0.06] bg-[#070709]/50">
              <MapPin className="w-8 h-8 text-neutral-600 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-white mb-2">No branches found</h3>
              <p className="text-xs text-neutral-400 font-light">
                Try searching by city, area, or branch name instead.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
