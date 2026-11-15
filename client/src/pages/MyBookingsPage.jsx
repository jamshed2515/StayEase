import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  Compass,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useBookings } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card, CardContent } from '../components/common/Card';

const TABS = ['All Bookings', 'Confirmed', 'Completed', 'Cancelled'];

const formatDate = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string' && dateVal.includes('T')) {
    return dateVal.split('T')[0];
  }
  return dateVal;
};

export const MyBookingsPage = () => {
  const { bookings, cancelBooking, loading } = useBookings();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  // Filter bookings based on tab
  const filteredBookings = bookings.filter((bk) => {
    if (activeTab === 'All Bookings') return true;
    return bk.status?.toLowerCase() === activeTab.toLowerCase();
  });

  const confirmCancel = async () => {
    if (cancellingBookingId) {
      await cancelBooking(cancellingBookingId);
      setCancellingBookingId(null);
    }
  };

  const getStatusBadge = (status = '') => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return (
          <Badge variant="success" dot size="sm">
            Confirmed & Verified
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="info" dot size="sm">
            Completed Stay
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" dot size="sm">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-700 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Guest Reservations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">
            My Luxury Bookings
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1">
            Review your upcoming itineraries, past escapes, and reservation vouchers for{' '}
            <span className="font-semibold text-navy-900">{user?.name || 'Valued Guest'}</span>.
          </p>
        </div>

        <Link to="/hotels">
          <Button variant="teal" size="sm" rightIcon={Compass}>
            Book Another Stay
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sand-200 pb-2 overflow-x-auto">
        {TABS.map((tab) => {
          const count =
            tab === 'All Bookings'
              ? bookings.length
              : bookings.filter((b) => b.status?.toLowerCase() === tab.toLowerCase()).length;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-navy-600 hover:bg-sand-100 hover:text-navy-950'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-sand-200 text-navy-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((bk) => {
            const bookingId = bk._id || bk.id;
            const hotelTargetId = bk.hotel?._id || bk.hotelId || bk.hotel || '';
            const totalPaid = bk.finalAmount || bk.totalPrice || 0;

            return (
              <Card
                key={bookingId}
                className="p-6 rounded-3xl border border-sand-200 shadow-card hover:shadow-card-hover transition-all bg-white"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                  {/* Left: Hotel Image & Basic Details */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="w-full sm:w-44 h-36 rounded-2xl overflow-hidden bg-sand-200 shrink-0">
                      <img
                        src={bk.hotelImage}
                        alt={bk.hotelName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-primary-700">
                          {bk.bookingNumber || bk.id}
                        </span>
                        {getStatusBadge(bk.status)}
                      </div>

                      <Link to={`/hotels/${hotelTargetId}`}>
                        <h3 className="font-serif text-xl font-bold text-navy-950 hover:text-primary-700 transition-colors">
                          {bk.hotelName}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1.5 text-xs text-navy-600">
                        <MapPin className="w-3.5 h-3.5 text-primary-600" />
                        <span>{bk.city}, {bk.country}</span>
                      </div>

                      <p className="text-xs font-medium text-navy-700">
                        Suite: <span className="font-bold text-navy-950">{bk.roomName}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-navy-600 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary-600" />
                          <span>
                            {formatDate(bk.checkIn)} — {formatDate(bk.checkOut)} ({bk.nights} nights)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>{bk.guests} Guests</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Payment & Action */}
                  <div className="w-full lg:w-auto lg:text-right flex flex-col justify-between self-stretch pt-4 lg:pt-0 border-t lg:border-t-0 border-sand-100">
                    <div className="space-y-1">
                      <span className="text-xs text-navy-500">Total Paid (Taxes incl.)</span>
                      <div className="font-serif text-2xl font-bold text-navy-950">
                        ₹{totalPaid.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-navy-400 block">
                        Paid via {bk.paymentMethod || 'Credit Card'}
                      </span>
                    </div>

                    <div className="pt-4 flex items-center lg:justify-end gap-2">
                      <Link to={`/hotels/${hotelTargetId}`}>
                        <Button variant="outline" size="sm">
                          View Property
                        </Button>
                      </Link>

                      {bk.status?.toLowerCase() === 'confirmed' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setCancellingBookingId(bookingId)}
                        >
                          Cancel Stay
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-16 text-center border border-sand-200 shadow-card space-y-4 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center text-navy-400 mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-navy-950">
              No Bookings Found in {activeTab}
            </h3>
            <p className="text-xs text-navy-600">
              You haven&apos;t made any reservations under this category yet. Explore our luxury collection of handpicked hotels and book your next escape.
            </p>
          </div>
          <Link to="/hotels">
            <Button variant="teal" size="md" rightIcon={ArrowRight} className="mt-2">
              Explore Available Hotels
            </Button>
          </Link>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sand-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-navy-950">
                Cancel Reservation?
              </h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                In accordance with the StayEase 48-hour free cancellation policy, a full refund will be credited to your original payment method.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancellingBookingId(null)}
              >
                Keep Reservation
              </Button>
              <Button variant="danger" size="sm" onClick={confirmCancel}>
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
