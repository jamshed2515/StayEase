import React from 'react';
import { Users, BedDouble, Maximize2, Check, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const RoomCard = ({ room, isSelected = false, onSelect }) => {
  const { id, name, bedType, capacity, size, price, image, features = [] } = room;

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col md:flex-row gap-5 transition-all ${
        isSelected
          ? 'border-primary-600 bg-primary-50/30 ring-2 ring-primary-500/30 shadow-md'
          : 'border-sand-200 bg-white hover:border-sand-300 shadow-subtle'
      }`}
    >
      {/* Room Image */}
      <div className="w-full md:w-56 h-44 rounded-xl overflow-hidden bg-sand-200 shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Room Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-serif text-lg font-bold text-navy-950">{name}</h4>
            {isSelected && (
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 border border-primary-300 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Selected
              </span>
            )}
          </div>

          {/* Quick Specs */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-navy-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary-600" />
              <span>Up to {capacity} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-primary-600" />
              <span>{bedType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-primary-600" />
              <span>{size}</span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {features.map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-sand-100 text-navy-700"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Selection */}
        <div className="pt-4 mt-2 border-t border-sand-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-serif text-navy-900">₹{price.toLocaleString()}</span>
              <span className="text-xs text-navy-500 font-medium">/ night</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">Includes taxes & service fees</p>
          </div>

          <Button
            variant={isSelected ? 'teal' : 'outline'}
            size="sm"
            onClick={() => onSelect(room)}
          >
            {isSelected ? 'Room Selected' : 'Choose This Suite'}
          </Button>
        </div>
      </div>
    </div>
  );
};

