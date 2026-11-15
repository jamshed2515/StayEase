import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Share2,
  Heart,
  ShieldCheck,
  Award,
  ChevronLeft,
  Coffee,
  Wifi,
  Sparkles,
  Check,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { hotelService } from '../services/hotelService';
import { ImageGallery } from '../components/hotels/ImageGallery';
import { RoomCard } from '../components/hotels/RoomCard';
import { BookingWidget } from '../components/hotels/BookingWidget';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';

export const HotelDetailsPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hotelService.getHotelById(id);
        setHotel(data);
        if (data.rooms && data.rooms.length > 0) {
          setSelectedRoom(data.rooms[0]);
        }
      } catch (err) {
        setError(err.message || 'Hotel details could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" color="gold" />
        <p className="text-xs text-navy-500 font-medium">Loading luxury suite details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 bg-white rounded-3xl border border-sand-200 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-navy-900">Hotel Not Found</h2>
        <p className="text-xs text-navy-600">{error || 'The requested property does not exist.'}</p>
        <Link to="/hotels">
          <Button variant="teal" size="sm" leftIcon={ChevronLeft}>
            Back to Hotels
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/hotels"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 hover:text-navy-950 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Explore Hotels</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sand-300 bg-white text-xs font-medium text-navy-700 hover:bg-sand-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sand-300 bg-white text-xs font-medium text-navy-700 hover:bg-sand-50 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Save to Wishlist</span>
          </button>
        </div>
      </div>

      {/* Hotel Title & Location Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="teal" size="sm">
            {hotel.category}
          </Badge>
          {hotel.featured && (
            <Badge variant="gold" dot size="sm">
              Featured Luxury Stay
            </Badge>
          )}
          <div className="flex items-center gap-1.5 text-xs text-navy-700 ml-auto sm:ml-0 font-medium">
            <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
            <span className="font-bold">{hotel.rating}</span>
            <span className="text-navy-400">({hotel.reviewCount} verified reviews)</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-950">
          {hotel.name}
        </h1>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-navy-600">
          <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
          <span>{hotel.address}</span>
          <span className="text-sand-300">•</span>
          <span className="text-emerald-700 font-medium">Exceptional Location (9.9/10)</span>
        </div>
      </div>

      {/* Large Image Gallery */}
      <ImageGallery
        images={hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.coverImage]}
        hotelName={hotel.name}
      />

      {/* Main Content Layout: Overview & Rooms (Left 65%) vs Booking Widget (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description & Overview */}
          <section className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-sand-200/90 shadow-card">
            <h2 className="font-serif text-2xl font-bold text-navy-950">About This Sanctuary</h2>
            <p className="text-sm text-navy-700 leading-relaxed font-light">
              {hotel.description}
            </p>
            <div className="pt-4 border-t border-sand-100 flex flex-wrap gap-6 text-xs text-navy-600">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-600" />
                <span>Forbes 5-Star Partner</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Enhanced Hygiene Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span>VIP Arrival Champagne</span>
              </div>
            </div>
          </section>

          {/* Amenities Grid */}
          <section className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-sand-200/90 shadow-card">
            <h2 className="font-serif text-2xl font-bold text-navy-950">
              Exclusive Amenities & Services
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {hotel.amenities.map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs text-navy-800 font-medium"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Available Rooms & Suites */}
          <section className="space-y-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy-950">
                Select Your Suite or Villa
              </h2>
              <p className="text-xs text-navy-500 mt-1">
                Prices include high-speed Wi-Fi, daily breakfast, and access to all spa facilities.
              </p>
            </div>

            <div className="space-y-4">
              {(hotel.rooms || []).map((room) => (
                <RoomCard
                  key={room._id || room.id}
                  room={room}
                  isSelected={(selectedRoom?._id || selectedRoom?.id) === (room._id || room.id)}
                  onSelect={(r) => setSelectedRoom(r)}
                />
              ))}
            </div>
          </section>

          {/* Guest Reviews & Rating Breakdowns */}
          <section className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-sand-200/90 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-gold-500 text-gold-500" />
                <h2 className="font-serif text-2xl font-bold text-navy-950">
                  {hotel.rating} Overall Rating
                </h2>
                <span className="text-xs text-navy-500 font-medium">
                  ({hotel.reviewCount} guest reviews)
                </span>
              </div>
            </div>

            {/* Score Breakdowns */}
            {hotel.scores && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-6 border-b border-sand-100">
                {Object.entries(hotel.scores).map(([category, score]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize text-navy-600 font-medium">{category}</span>
                      <span className="font-bold text-navy-900">{score}</span>
                    </div>
                    <div className="h-1.5 w-full bg-sand-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Individual Reviews */}
            <div className="space-y-6">
              {hotel.reviews && hotel.reviews.length > 0 ? (
                hotel.reviews.map((rev, idx) => (
                  <div key={rev._id || rev.id || idx} className="space-y-3 pb-6 border-b border-sand-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={rev.author}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
                        />
                        <div>
                          <p className="text-xs font-bold text-navy-950">{rev.author}</p>
                          <p className="text-[11px] text-navy-500">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gold-500">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-gold-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-navy-700 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-navy-500 italic py-2">
                  No guest reviews yet. Be the first verified traveler to experience this sanctuary.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right Sticky Booking Panel */}
        <div className="lg:col-span-1">
          <BookingWidget hotel={hotel} selectedRoom={selectedRoom} />
        </div>
      </div>
    </div>
  );
};

