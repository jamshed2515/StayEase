import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingContext';
import { Button } from '../common/Button';
import { Card, CardContent } from '../common/Card';

export const BookingWidget = ({ hotel, selectedRoom }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addBooking } = useBookings();

  // Dates default to today and +4 days
  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(nextWeekStr);
  const [guests, setGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Compute number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const calculatedNights = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));

  const activeRoom = selectedRoom || (hotel?.rooms && hotel.rooms[0]);
  const roomPrice = activeRoom?.price || hotel?.pricePerNight || 25000;
  const subtotal = calculatedNights * roomPrice;
  const taxesAndFees = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + taxesAndFees;

  const handleBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const hotelId = hotel._id || hotel.id;
      const roomId = activeRoom?._id || activeRoom?.id;

      const newBooking = {
        hotelId,
        hotelName: hotel.name,
        hotelImage: hotel.coverImage,
        city: hotel.city,
        country: hotel.country,
        roomId,
        roomName: activeRoom?.name || 'Deluxe Suite',
        guestName: user ? user.name : 'Alexander Wright',
        guestEmail: user ? user.email : 'guest@stayease.com',
        guestPhone: user ? user.phone : '+91 91234 56789',
        checkIn,
        checkOut,
        nights: calculatedNights,
        guests: Number(guests),
        pricePerNight: roomPrice,
        totalPrice: subtotal,
        taxesAndFees,
        finalAmount: grandTotal,
        paymentMethod: 'Credit Card •••• 4242',
        specialRequests: 'StayEase luxury hospitality package requested.',
      };

      await addBooking(newBooking);
      setIsSubmitting(false);
      setSuccessNotice(true);

      setTimeout(() => {
        navigate('/my-bookings');
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(
        err.message || 'Unable to confirm booking. The suite may already be reserved for these dates.'
      );
    }
  };

  return (
    <Card className="border-sand-200/90 shadow-card-hover rounded-3xl overflow-hidden sticky top-28 bg-white">
      {/* Card Header Banner */}
      <div className="bg-sand-100/70 p-6 border-b border-sand-200">
        <div className="flex items-baseline justify-between mb-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-serif text-navy-950">
              ₹{roomPrice.toLocaleString()}
            </span>
            <span className="text-xs text-navy-600 font-medium">/ night</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Best Rate Guaranteed
          </span>
        </div>
        <p className="text-xs text-navy-500">
          Selected Suite: <span className="font-semibold text-navy-800">{activeRoom?.name}</span>
        </p>
      </div>

      <CardContent className="p-6 space-y-5">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reservation Unavailable</p>
              <p className="text-[11px] text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {successNotice ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-serif text-base font-bold text-emerald-900">
              Reservation Confirmed!
            </h4>
            <p className="text-xs text-emerald-700">
              Redirecting you to your bookings dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="space-y-4">
            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-sand-50 border border-sand-200">
              <div className="p-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                  Check-In
                </label>
                <div className="flex items-center gap-1.5 text-navy-900">
                  <Calendar className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                  <input
                    type="date"
                    required
                    value={checkIn}
                    min={todayStr}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 border-l border-sand-200">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                  Check-Out
                </label>
                <div className="flex items-center gap-1.5 text-navy-900">
                  <Calendar className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Guests Count */}
            <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-1">
                Guests
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600 shrink-0" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-navy-900 focus:outline-none cursor-pointer"
                >
                  <option value={1}>1 Adult Guest</option>
                  <option value={2}>2 Adult Guests</option>
                  <option value={3}>3 Guests (2 Adults, 1 Child)</option>
                  <option value={4}>4 Guests (Family Suite)</option>
                </select>
              </div>
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-2 pt-2 border-t border-sand-100 text-xs">
              <div className="flex justify-between text-navy-600">
                <span>
                  ₹{roomPrice.toLocaleString()} × {calculatedNights} nights
                </span>
                <span className="font-semibold text-navy-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span className="flex items-center gap-1">
                  Taxes & Luxury Hospitality Fees (12%)
                  <Info className="w-3 h-3 text-navy-400" />
                </span>
                <span className="font-semibold text-navy-900">₹{taxesAndFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>StayEase Concierge Benefit</span>
                <span className="text-emerald-700 font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-navy-950 pt-2 border-t border-sand-200">
                <span>Total Due</span>
                <span className="font-serif text-lg text-primary-800">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="teal"
              size="lg"
              isLoading={isSubmitting}
              className="w-full rounded-2xl shadow-md h-12 text-sm"
              leftIcon={CreditCard}
            >
              {isAuthenticated ? 'Reserve & Confirm Stay' : 'Log In to Reserve'}
            </Button>

            <p className="text-[11px] text-center text-navy-500 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>You won&apos;t be billed until your reservation is verified</span>
            </p>
          </form>
        )}

        {/* Guarantees */}
        <div className="pt-3 border-t border-sand-100 space-y-2 text-xs text-navy-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Free cancellation up to 48 hours before check-in</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-500 shrink-0" />
            <span>Complimentary welcome champagne upon arrival</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
