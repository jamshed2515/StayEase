import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const HotelCard = ({ hotel, className = '' }) => {
  const hotelId = hotel._id || hotel.id;
  const {
    name,
    city,
    country,
    rating,
    reviewCount,
    category,
    pricePerNight,
    originalPrice,
    coverImage,
    featured,
    amenities = [],
  } = hotel;

  return (
    <Card
      hover
      className={`overflow-hidden group flex flex-col h-full bg-white border border-sand-200/90 shadow-card ${className}`}
    >
      {/* Hotel Image with Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
        <img
          src={coverImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Badge variant="navy" className="bg-navy-900/85 backdrop-blur-md text-white font-medium text-[11px]">
              {city}
            </Badge>
            {featured && (
              <Badge variant="gold" dot className="bg-white/95 backdrop-blur-md text-[11px] font-semibold text-gold-900">
                Featured
              </Badge>
            )}
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-navy-700 hover:text-rose-500 hover:bg-white transition-all shadow-sm"
            aria-label="Save to favorites"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-navy-900/85 backdrop-blur-md text-white text-xs">
          <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
          <span className="font-semibold text-white">{rating}</span>
          <span className="text-navy-300">({reviewCount})</span>
        </div>
      </div>

      {/* Hotel Content */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1 text-xs text-navy-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
            <span className="truncate">{city}, {country}</span>
          </div>

          <Link to={`/hotels/${hotelId}`}>
            <h3 className="font-serif text-lg font-bold text-navy-900 group-hover:text-primary-700 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Quick Amenities */}
          <div className="flex items-center gap-2 mt-2.5 text-xs text-navy-600 overflow-hidden">
            {amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="bg-sand-100 text-navy-700 px-2 py-0.5 rounded-md text-[11px] font-medium truncate"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
          <div>
            {originalPrice && (
              <span className="text-xs text-navy-400 line-through mr-1.5">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-serif text-navy-900">
                ₹{pricePerNight.toLocaleString()}
              </span>
              <span className="text-xs text-navy-500 font-medium">/ night</span>
            </div>
          </div>

          <Link to={`/hotels/${hotelId}`}>
            <Button
              variant="teal"
              size="sm"
              rightIcon={ArrowRight}
              className="rounded-xl shadow-teal/20"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
