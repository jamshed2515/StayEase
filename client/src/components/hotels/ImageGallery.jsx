import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';

export const ImageGallery = ({ images = [], hotelName = 'Hotel' }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative space-y-3">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden aspect-[16/9] max-h-[520px]">
        {/* Main Large Image */}
        <div
          className="md:col-span-2 md:row-span-2 relative cursor-pointer group overflow-hidden bg-sand-200"
          onClick={() => {
            setSelectedIdx(0);
            setLightboxOpen(true);
          }}
        >
          <img
            src={images[0]}
            alt={`${hotelName} showcase`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>

        {/* Supporting Thumbnails */}
        {images.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="hidden md:block relative cursor-pointer group overflow-hidden bg-sand-200"
            onClick={() => {
              setSelectedIdx(idx + 1);
              setLightboxOpen(true);
            }}
          >
            <img
              src={img}
              alt={`${hotelName} view ${idx + 2}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="absolute bottom-6 right-6">
        <Button
          variant="outline"
          size="sm"
          leftIcon={Camera}
          onClick={() => setLightboxOpen(true)}
          className="bg-white/95 backdrop-blur-md shadow-md border-sand-300 hover:bg-white text-navy-900"
        >
          View All {images.length} Photos
        </Button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm font-semibold">{hotelName}</p>
              <p className="text-xs text-navy-400">
                Photo {selectedIdx + 1} of {images.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close photo gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image with Prev / Next */}
          <div className="relative flex-1 flex items-center justify-center my-4">
            <button
              type="button"
              onClick={() =>
                setSelectedIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
              }
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={images[selectedIdx]}
              alt={`${hotelName} expanded view`}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              type="button"
              onClick={() =>
                setSelectedIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedIdx === idx ? 'border-primary-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

