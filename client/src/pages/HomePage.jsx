import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Clock,
  Compass,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { HotelCard } from '../components/hotels/HotelCard';
import { hotelService } from '../services/hotelService';
import { INITIAL_HOTELS } from '../data/hotelsData';
import { POPULAR_DESTINATIONS } from '../data/destinationsData';

export const HomePage = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Guests');
  const [featuredHotels, setFeaturedHotels] = useState(INITIAL_HOTELS.filter((h) => h.featured));

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await hotelService.getFeaturedHotels();
        if (data && data.length > 0) {
          setFeaturedHotels(data);
        }
      } catch (err) {
        console.warn('Could not load featured hotels from API:', err.message);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('search', destination);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Cinematic Gradient Overlay */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury StayEase Hotel Panorama"
            className="w-full h-full object-cover brightness-[0.78]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sand-50 via-navy-950/40 to-navy-950/70" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white space-y-8 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              World-Class Luxury Hospitality
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3 max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.12]">
              Find Your Perfect Stay, <span className="text-teal-300 italic">Anywhere.</span>
            </h1>
            <p className="text-base sm:text-xl text-sand-100 max-w-2xl mx-auto font-light leading-relaxed">
              Curated boutique hotels, private cliffside villas, and five-star sanctuaries tailored to your unforgettable escape.
            </p>
          </div>

          {/* Functional Search Bar */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/40 text-navy-900 text-left">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
              {/* Destination */}
              <div className="p-3 rounded-2xl bg-sand-50 hover:bg-sand-100/70 transition-colors border border-sand-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                  Destination
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to? (e.g. Santorini, Bali)"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-navy-900 placeholder:text-navy-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Check-In */}
              <div className="p-3 rounded-2xl bg-sand-50 hover:bg-sand-100/70 transition-colors border border-sand-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                  Check-In
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Check-Out */}
              <div className="p-3 rounded-2xl bg-sand-50 hover:bg-sand-100/70 transition-colors border border-sand-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                  Check-Out
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Guests & Search Button */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="submit"
                  variant="teal"
                  size="lg"
                  className="w-full h-14 rounded-2xl shadow-lg font-semibold text-base"
                  leftIcon={Search}
                >
                  Explore Stays
                </Button>
              </div>
            </form>
          </div>

          {/* Quick stats / guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-sand-200 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>Over 1,200+ Luxury Verified Hotels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>Free Cancellation on Most Stays</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-300" />
              <span>Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-200 pb-4">
          <div>
            <Badge variant="teal" size="sm" className="mb-2">
              Iconic Getaways
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
              Popular Destinations
            </h2>
            <p className="text-sm text-navy-600 mt-1">
              Explore the world’s most sought-after cultural, coastal, and mountain sanctuaries.
            </p>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <Link
              key={dest.id}
              to={`/hotels?search=${encodeURIComponent(dest.name)}`}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block"
            >
              <img
                src={dest.image}
                alt={dest.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />

              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-navy-900 shadow-sm">
                  {dest.propertyCount} Properties
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                  {dest.country}
                </span>
                <h3 className="font-serif text-2xl font-bold">{dest.name}</h3>
                <p className="text-xs text-sand-200 line-clamp-1">{dest.tagline}</p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-sand-300">From ₹{dest.startingPrice?.toLocaleString()} / night</span>
                  <span className="flex items-center gap-1 text-teal-300 font-semibold group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED HOTELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-200 pb-4">
          <div>
            <Badge variant="gold" size="sm" dot className="mb-2">
              Editor&apos;s Signature Choice
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
              Featured Luxury Stays
            </h2>
            <p className="text-sm text-navy-600 mt-1">
              Hand-vetted properties offering Michelin dining, private pools, and bespoke concierge hospitality.
            </p>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            <span>Browse All {INITIAL_HOTELS.length} Hotels</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE STAYEASE */}
      <section className="bg-sand-100/70 py-20 border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="teal" size="sm">
              The StayEase Distinction
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
              Why Discerning Travelers Choose Us
            </h2>
            <p className="text-sm text-navy-600">
              We transcend generic booking engines by guaranteeing personal verification, white-glove support, and exclusive guest privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-card space-y-4 hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-700">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950">
                Forbes 5-Star Vetted
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                Every property in our portfolio is rigorously inspected for architectural uniqueness, cleanliness, and discrete service.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-card space-y-4 hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950">
                Best Rate Guarantee
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                Book with total confidence. We match any verified public rate and include complimentary room upgrades when available.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-card space-y-4 hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950">
                24/7 Dedicated Concierge
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                From private yacht transfers to hard-to-get Michelin table bookings, our travel specialists are on call day and night.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-card space-y-4 hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-800">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-950">
                Flexible Cancellations
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                Plans change. Enjoy hassle-free, one-click cancellations and date modifications up to 48 hours prior to arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GUEST TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="navy" size="sm">
            Guest Experiences
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
            Treasured Memories, Shared
          </h2>
          <p className="text-sm text-navy-600">
            Read what luxury travelers and global executives have to say about their stays booked through StayEase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 border border-sand-200/90 shadow-card space-y-4 relative flex flex-col justify-between">
            <Quote className="w-8 h-8 text-sand-300 absolute top-6 right-6 pointer-events-none" />
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-navy-700 leading-relaxed italic">
                &ldquo;Booking our cliffside Santorini suite via StayEase was seamless. The private plunge pool, the sunset view, and the complimentary airport transfer made it unforgettable.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-sand-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Eleanor Vance"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
              />
              <div>
                <p className="text-xs font-bold text-navy-950">Eleanor Vance</p>
                <p className="text-[11px] text-navy-500">Stayed at The Azure Cliff Resort</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-sand-200/90 shadow-card space-y-4 relative flex flex-col justify-between">
            <Quote className="w-8 h-8 text-sand-300 absolute top-6 right-6 pointer-events-none" />
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-navy-700 leading-relaxed italic">
                &ldquo;StayEase&apos;s concierge helped us secure the private riverboat arrival in Kyoto. It felt like stepping back in time with modern five-star comfort. Outstanding service.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-sand-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Marcus Lindqvist"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
              />
              <div>
                <p className="text-xs font-bold text-navy-950">Marcus Lindqvist</p>
                <p className="text-[11px] text-navy-500">Stayed at Kyoto Hoshinoya</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-sand-200/90 shadow-card space-y-4 relative flex flex-col justify-between">
            <Quote className="w-8 h-8 text-sand-300 absolute top-6 right-6 pointer-events-none" />
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-navy-700 leading-relaxed italic">
                &ldquo;The luxury hotel selection on StayEase is second to none. We will never book through generic aggregators again. Clean, polished, and genuinely premium.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-sand-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="Julian Sterling"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
              />
              <div>
                <p className="text-xs font-bold text-navy-950">Julian Sterling</p>
                <p className="text-[11px] text-navy-500">Stayed at Palais Saint-Germain Paris</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-4 relative z-10">
            <Badge variant="teal" size="sm">
              StayEase Privilege
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Ready for Your Next Extraordinary Escape?
            </h2>
            <p className="text-sm text-sand-200">
              Join thousands of discerning travelers who discover handpicked luxury suites, villas, and exclusive perks through StayEase.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/hotels">
                <Button variant="teal" size="lg" rightIcon={ArrowRight}>
                  Explore All Hotels
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white">
                  Join Member Club
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

