import React, { useState } from 'react';
import { MapPin, Calendar, Users, Search, Star, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const HeroSection = () => {
  const [destination, setDestination] = useState('Santorini, Greece');
  const [dates, setDates] = useState('Jun 12 - Jun 18');
  const [guests, setGuests] = useState('2 Guests, 1 Suite');

  return (
    <section className="relative overflow-hidden bg-sand-50 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 -z-10 w-80 h-80 bg-navy-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="gold" dot>
              Curated World-Class Hospitality
            </Badge>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-navy-950 leading-[1.15]">
            Where Extraordinary Stays Become <span className="italic text-gold-600">Timeless</span> Memories
          </h1>
          <p className="text-base sm:text-lg text-navy-600 leading-relaxed max-w-2xl mx-auto">
            Discover a hand-picked collection of luxury suites, private seaside villas, and boutique
            sanctuaries crafted for the discerning traveler.
          </p>
        </div>

        {/* Booking Search Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-card border border-sand-200/80 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Destination */}
            <div className="p-3 rounded-2xl hover:bg-sand-50 transition-colors border border-transparent hover:border-sand-200">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                Destination
              </label>
              <div className="flex items-center gap-2 text-navy-900 font-medium">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where would you like to escape?"
                  className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-navy-400 text-navy-900"
                />
              </div>
            </div>

            {/* Check-In / Check-Out */}
            <div className="p-3 rounded-2xl hover:bg-sand-50 transition-colors border border-transparent hover:border-sand-200">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                Dates
              </label>
              <div className="flex items-center gap-2 text-navy-900 font-medium">
                <Calendar className="w-4 h-4 text-gold-500 shrink-0" />
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="Select dates"
                  className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-navy-400 text-navy-900"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="p-3 rounded-2xl hover:bg-sand-50 transition-colors border border-transparent hover:border-sand-200">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                Guests & Suites
              </label>
              <div className="flex items-center gap-2 text-navy-900 font-medium">
                <Users className="w-4 h-4 text-gold-500 shrink-0" />
                <input
                  type="text"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="Guests count"
                  className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-navy-400 text-navy-900"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="p-1">
              <Button
                variant="primary"
                size="lg"
                className="w-full h-14 rounded-2xl shadow-md text-base"
                leftIcon={Search}
              >
                Search Stays
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 border border-sand-200/60 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 shrink-0">
              <Star className="w-5 h-5 fill-gold-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-navy-900">Exquisite Standards</h4>
              <p className="text-xs text-navy-600">Forbes 5-star & Michelin key certified hotels</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 border border-sand-200/60 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-navy-900">Best Rate Guarantee</h4>
              <p className="text-xs text-navy-600">Direct booking privilege and complimentary upgrades</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/70 border border-sand-200/60 shadow-subtle">
            <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-700 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-navy-900">24/7 Dedicated Concierge</h4>
              <p className="text-xs text-navy-600">Personalized itineraries & airport VIP transfer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

