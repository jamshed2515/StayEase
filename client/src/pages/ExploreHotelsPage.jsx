import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';
import { HotelCard } from '../components/hotels/HotelCard';
import { HotelFilterSidebar } from '../components/hotels/HotelFilterSidebar';
import { hotelService } from '../services/hotelService';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';

export const ExploreHotelsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from query params if present
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    amenities: [],
    sort: 'featured',
  });

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync search query changes from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null && urlSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: urlSearch }));
    }
  }, [searchParams]);

  // Fetch / filter hotels
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const data = await hotelService.getHotels(filters);
        setHotels(data);
      } catch (err) {
        console.error('Failed to load hotels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      city: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      amenities: [],
      sort: 'featured',
    });
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filters.search) {
      setSearchParams({ search: filters.search });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-700">
          <Compass className="w-4 h-4" />
          <span>Curated Global Portfolio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950">
          Explore Luxury Hotels & Suites
        </h1>
        <p className="text-sm text-navy-600 max-w-2xl">
          Discover hand-vetted cliffside villas, private tropical sanctuaries, and historic city palaces across the globe.
        </p>
      </div>

      {/* Top Search & Sort Control Bar */}
      <div className="bg-white p-4 rounded-3xl border border-sand-200/90 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by hotel, city, or country..."
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-sand-50 border border-sand-200 text-xs sm:text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:border-primary-600"
            />
          </div>
          <Button type="submit" variant="teal" size="sm" className="h-10 px-4 rounded-xl">
            Search
          </Button>
        </form>

        {/* Right Controls: Sort & Mobile Filter Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-sand-100 text-xs font-semibold text-navy-800"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary-600" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-4 h-4 text-navy-400" />
            <span className="text-xs font-medium text-navy-500 hidden sm:inline">Sort By:</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
              className="bg-sand-50 border border-sand-200 text-xs font-semibold text-navy-800 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-600 cursor-pointer"
            >
              <option value="featured">Featured & Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Guest Rating</option>
              <option value="reviews-desc">Most Reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block md:col-span-1 sticky top-28">
          <HotelFilterSidebar
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end md:hidden animate-in fade-in">
            <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                <h3 className="font-serif text-lg font-bold">Filter Hotels</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-navy-500 hover:bg-sand-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <HotelFilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />
              <Button
                variant="teal"
                className="w-full"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Hotels Grid */}
        <div className="md:col-span-3 space-y-6">
          {/* Results Count bar */}
          <div className="flex items-center justify-between text-xs text-navy-600">
            <span>
              Showing <strong className="text-navy-950 font-semibold">{hotels.length}</strong> luxury properties
              {filters.city && ` in ${filters.city}`}
            </span>
            {(filters.city || filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.minRating) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-primary-700 hover:underline font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-sand-200">
              <Spinner size="lg" color="gold" className="mx-auto" />
              <p className="text-xs text-navy-500">Curating luxury hotel matches...</p>
            </div>
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="py-20 px-6 text-center space-y-4 bg-white rounded-3xl border border-sand-200">
              <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center text-navy-400 mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  No Hotels Found Matching Your Criteria
                </h3>
                <p className="text-xs text-navy-500 max-w-md mx-auto">
                  We could not find any properties matching all your filters. Try widening your price range, clearing amenities, or changing the destination.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

