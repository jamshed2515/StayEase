import React from 'react';
import { Filter, RotateCcw, Search, Star, Check } from 'lucide-react';
import { Button } from '../common/Button';

const CITIES = ['All', 'Udaipur', 'Jaipur', 'Goa', 'Kerala', 'Mumbai', 'Shimla', 'Varanasi', 'Agra'];
const CATEGORIES = ['All', 'Heritage Palace', 'Resort', 'Hotel', 'Villa'];
const COMMON_AMENITIES = [
  'Free High-Speed Wi-Fi',
  'Lake Facing Pool',
  'Luxury Spa',
  'Fine Dining',
  '24/7 Personal Butler',
  'Airport Transfer',
  'Valet Parking',
  'Air Conditioning',
];

export const HotelFilterSidebar = ({ filters, setFilters, onReset, className = '' }) => {
  const handleCityChange = (city) => {
    setFilters((prev) => ({ ...prev, city: city === 'All' ? '' : city }));
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({ ...prev, category: category === 'All' ? '' : category }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated };
    });
  };

  return (
    <div className={`bg-white rounded-3xl p-6 border border-sand-200/90 shadow-card space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sand-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-600" />
          <h3 className="font-serif text-lg font-bold text-navy-900">Filter Hotels</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-navy-500 hover:text-primary-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* 1. Destination / City */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-700">
          Destination
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CITIES.map((c) => {
            const isSelected = (!filters.city && c === 'All') || filters.city === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => handleCityChange(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-sand-100 text-navy-700 hover:bg-sand-200'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Property Category */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-700">
          Property Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = (!filters.category && cat === 'All') || filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium text-center border transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50/70 text-primary-800 font-semibold shadow-xs'
                    : 'border-sand-200 text-navy-700 hover:bg-sand-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range Per Night */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
            Price Range / Night
          </label>
          <span className="text-xs font-semibold text-primary-700">
            ₹{filters.minPrice ? Number(filters.minPrice).toLocaleString() : '15,000'} -{' '}
            ₹{filters.maxPrice ? Number(filters.maxPrice).toLocaleString() : '2,00,000'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-navy-400 font-medium">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
              className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-navy-400 font-medium">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
              className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
            />
          </div>
        </div>
      </div>

      {/* 4. Guest Rating */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-700">
          Minimum Rating
        </label>
        <div className="space-y-1.5">
          {[
            { label: 'Any Rating', val: '' },
            { label: '4.9+ Exceptional', val: '4.9' },
            { label: '4.8+ Superb', val: '4.8' },
            { label: '4.5+ Wonderful', val: '4.5' },
          ].map((r) => {
            const isSelected = (filters.minRating || '') === r.val;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => setFilters((p) => ({ ...p, minRating: r.val }))}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary-50 text-primary-900 border border-primary-200'
                    : 'text-navy-700 hover:bg-sand-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-gold-500 text-gold-500' : 'text-gold-400'}`} />
                  <span>{r.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Amenities Checkboxes */}
      <div className="space-y-3 pt-2 border-t border-sand-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-navy-700">
          Key Amenities
        </label>
        <div className="space-y-2">
          {COMMON_AMENITIES.map((amenity) => {
            const checked = (filters.amenities || []).includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-2.5 text-xs text-navy-700 cursor-pointer select-none hover:text-navy-950"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-sand-300"
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
