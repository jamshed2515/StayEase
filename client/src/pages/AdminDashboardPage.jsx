import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  BookmarkCheck,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  ShieldCheck,
  X,
  RefreshCw,
} from 'lucide-react';
import { hotelService } from '../services/hotelService';
import { bookingService } from '../services/bookingService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card, CardHeader, CardTitle } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Spinner } from '../components/common/Spinner';

export const AdminDashboardPage = () => {
  const [activeSection, setActiveSection] = useState('overview'); // overview | hotels | rooms | bookings
  const [loading, setLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    totalHotels: 0,
    totalCustomers: 0,
  });

  // Hotels State
  const [hotelsList, setHotelsList] = useState([]);

  // Bookings State
  const [allBookings, setAllBookings] = useState([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  // Add Hotel Modal State
  const [newHotelModalOpen, setNewHotelModalOpen] = useState(false);
  const [isSubmittingHotel, setIsSubmittingHotel] = useState(false);
  const [newHotelData, setNewHotelData] = useState({
    name: '',
    city: '',
    country: 'India',
    address: '',
    pricePerNight: '',
    category: 'Heritage Palace',
    coverImage:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: '',
  });

  // Fetch all backend data
  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      try {
        const statsData = await bookingService.getAdminStats();
        if (statsData) setStats(statsData);
      } catch (err) {
        console.warn('Stats fetch fallback:', err.message);
      }

      // 2. Fetch Hotels
      try {
        const hotelsData = await hotelService.getHotels();
        if (hotelsData) setHotelsList(hotelsData);
      } catch (err) {
        console.warn('Hotels fetch fallback:', err.message);
      }

      // 3. Fetch Bookings
      try {
        const bookingsData = await bookingService.getAllBookings();
        if (bookingsData) setAllBookings(bookingsData);
      } catch (err) {
        console.warn('Bookings fetch fallback:', err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Filter Bookings locally or refetch
  const filteredBookings = allBookings.filter((b) => {
    const matchesSearch =
      (b.hotelName && b.hotelName.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.guestName && b.guestName.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.bookingNumber && b.bookingNumber.toLowerCase().includes(bookingSearch.toLowerCase())) ||
      (b.id && b.id.toLowerCase().includes(bookingSearch.toLowerCase()));

    const matchesStatus =
      bookingStatusFilter === 'all' ||
      b.status?.toLowerCase() === bookingStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Handle Booking Status Update
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      setAllBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId || b.id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    }
  };

  // Handle Booking Delete
  const handleDeleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this reservation record?')) return;
    try {
      await bookingService.deleteBooking(bookingId);
      setAllBookings((prev) =>
        prev.filter((b) => b._id !== bookingId && b.id !== bookingId)
      );
    } catch (err) {
      alert(`Could not delete reservation: ${err.message}`);
    }
  };

  // Handle Create Hotel
  const handleAddHotelSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingHotel(true);

    try {
      const payload = {
        name: newHotelData.name.trim(),
        city: newHotelData.city.trim(),
        country: newHotelData.country.trim() || 'India',
        address: newHotelData.address.trim() || `${newHotelData.city}, India`,
        pricePerNight: Number(newHotelData.pricePerNight),
        category: newHotelData.category,
        coverImage: newHotelData.coverImage.trim(),
        description: newHotelData.description.trim(),
        rating: 4.9,
        reviewCount: 1,
        featured: true,
        amenities: [
          'Free High-Speed Wi-Fi',
          'Luxury Spa & Wellness',
          '24/7 Dedicated Butler',
          'Fine Dining Restaurant',
        ],
        rooms: [
          {
            name: 'Royal Heritage Deluxe Suite',
            bedType: '1 King Bed',
            capacity: 2,
            size: '56 m²',
            price: Number(newHotelData.pricePerNight),
            image: newHotelData.coverImage,
            features: ['Panoramic View', 'Artisan Breakfast Included', 'Deep Soaking Tub'],
          },
        ],
      };

      const created = await hotelService.createHotel(payload);
      setHotelsList((prev) => [created, ...prev]);
      setNewHotelModalOpen(false);
      setNewHotelData({
        name: '',
        city: '',
        country: 'India',
        address: '',
        pricePerNight: '',
        category: 'Heritage Palace',
        coverImage:
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        description: '',
      });
    } catch (err) {
      alert(`Failed to publish hotel: ${err.message}`);
    } finally {
      setIsSubmittingHotel(false);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (hotel) => {
    const hotelId = hotel._id || hotel.id;
    const updatedStatus = !hotel.featured;
    try {
      await hotelService.updateHotel(hotelId, { featured: updatedStatus });
      setHotelsList((prev) =>
        prev.map((h) =>
          h._id === hotelId || h.id === hotelId ? { ...h, featured: updatedStatus } : h
        )
      );
    } catch (err) {
      alert(`Could not toggle featured status: ${err.message}`);
    }
  };

  // Delete Hotel
  const handleDeleteHotel = async (hotelId) => {
    if (!confirm('Are you sure you want to remove this property from the StayEase catalog?')) return;
    try {
      await hotelService.deleteHotel(hotelId);
      setHotelsList((prev) => prev.filter((h) => h._id !== hotelId && h.id !== hotelId));
    } catch (err) {
      alert(`Could not remove hotel: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 pb-20">
      {/* Top Banner */}
      <div className="bg-navy-950 text-white border-b border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
                  StayEase Administration Portal
                </h1>
                <Badge variant="teal" size="sm">
                  MongoDB Connected
                </Badge>
              </div>
              <p className="text-xs text-navy-300">
                Manage global luxury properties, suite inventories, and real-time reservation statuses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={RefreshCw}
              onClick={loadAdminData}
              isLoading={loading}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Refresh Data
            </Button>
            <Button
              variant="teal"
              size="sm"
              leftIcon={Plus}
              onClick={() => setNewHotelModalOpen(true)}
            >
              Add New Hotel
            </Button>
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Exit to Website
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-4 border border-sand-200 shadow-card space-y-1.5 sticky top-28">
            <button
              type="button"
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'overview'
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-navy-700 hover:bg-sand-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview Stats</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('hotels')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'hotels'
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-navy-700 hover:bg-sand-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hotel Portfolio ({hotelsList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('rooms')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'rooms'
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-navy-700 hover:bg-sand-100'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Room Management</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('bookings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'bookings'
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-navy-700 hover:bg-sand-100'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Bookings ({allBookings.length})</span>
            </button>
          </div>

          {/* Main Content Body */}
          <div className="lg:col-span-4 space-y-8">
            {/* 1. OVERVIEW STATISTICS CARDS */}
            {(activeSection === 'overview' || activeSection === 'bookings') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5 border-sand-200">
                  <div className="flex items-center justify-between text-navy-500 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Total Revenue
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-navy-950">
                    ₹{(stats.totalRevenue || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Live MongoDB Total</span>
                  </div>
                </Card>

                <Card className="p-5 border-sand-200">
                  <div className="flex items-center justify-between text-navy-500 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Total Bookings
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                      <BookmarkCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-navy-950">
                    {stats.totalBookings || allBookings.length}
                  </div>
                  <div className="text-[11px] text-navy-500 mt-1">
                    {stats.confirmedBookings || 0} active itineraries
                  </div>
                </Card>

                <Card className="p-5 border-sand-200">
                  <div className="flex items-center justify-between text-navy-500 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      VIP Customers
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-navy-950">
                    {stats.totalCustomers || 2}
                  </div>
                  <div className="text-[11px] text-navy-500 mt-1">
                    Verified registered members
                  </div>
                </Card>

                <Card className="p-5 border-sand-200">
                  <div className="flex items-center justify-between text-navy-500 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Active Hotels
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-navy-950">
                    {stats.totalHotels || hotelsList.length}
                  </div>
                  <div className="text-[11px] text-navy-500 mt-1">Indian luxury sanctuaries</div>
                </Card>
              </div>
            )}

            {/* 2. RECENT BOOKINGS MANAGEMENT TABLE */}
            {(activeSection === 'overview' || activeSection === 'bookings') && (
              <Card className="rounded-3xl border border-sand-200 shadow-card overflow-hidden">
                <CardHeader className="p-6 border-b border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Recent Guest Reservations (Database)</CardTitle>
                    <p className="text-xs text-navy-500 mt-0.5">
                      Direct MongoDB reservation records with live status update capability.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-navy-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search guest or hotel..."
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-primary-600"
                      />
                    </div>

                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                      className="text-xs font-semibold text-navy-800 border border-sand-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </CardHeader>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sand-50 text-navy-500 uppercase tracking-wider font-semibold border-b border-sand-200">
                      <tr>
                        <th className="py-3.5 px-4">Booking Ref</th>
                        <th className="py-3.5 px-4">Guest Details</th>
                        <th className="py-3.5 px-4">Property & Suite</th>
                        <th className="py-3.5 px-4">Dates</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100 text-navy-800">
                      {filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => {
                          const bookingId = b._id || b.id;
                          const totalAmt = b.finalAmount || b.totalPrice || 0;
                          return (
                            <tr key={bookingId} className="hover:bg-sand-50/50 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-primary-700">
                                {b.bookingNumber || b.id}
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-semibold text-navy-950">{b.guestName}</p>
                                <p className="text-[11px] text-navy-400">{b.guestEmail}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="font-semibold text-navy-900">{b.hotelName}</p>
                                <p className="text-[11px] text-navy-500">{b.roomName}</p>
                              </td>
                              <td className="py-3.5 px-4 text-navy-600">
                                <span>
                                  {b.checkIn?.split?.('T')?.[0] || b.checkIn} to{' '}
                                  {b.checkOut?.split?.('T')?.[0] || b.checkOut}
                                </span>
                                <span className="block text-[11px] text-navy-400">
                                  {b.nights} nights • {b.guests} guests
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-bold font-serif text-navy-950 text-sm">
                                ₹{totalAmt.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleStatusChange(bookingId, e.target.value)}
                                  className={`text-[11px] font-semibold rounded-lg px-2 py-1 border cursor-pointer focus:outline-none ${
                                    b.status === 'Confirmed'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : b.status === 'Completed'
                                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                                      : 'bg-rose-50 text-rose-800 border-rose-300'
                                  }`}
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBooking(bookingId)}
                                  className="p-1.5 rounded-lg text-navy-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-navy-400">
                            No reservations found matching current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* 3. HOTEL MANAGEMENT SECTION */}
            {(activeSection === 'overview' || activeSection === 'hotels') && (
              <Card className="rounded-3xl border border-sand-200 shadow-card p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-navy-950">
                      Hotel Portfolio Directory (MongoDB)
                    </h3>
                    <p className="text-xs text-navy-500 mt-0.5">
                      Configure featured properties, pricing, and live room inventories.
                    </p>
                  </div>
                  <Button
                    variant="teal"
                    size="sm"
                    leftIcon={Plus}
                    onClick={() => setNewHotelModalOpen(true)}
                  >
                    Add Hotel
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotelsList.map((hotel) => {
                    const hotelId = hotel._id || hotel.id;
                    return (
                      <div
                        key={hotelId}
                        className="p-4 rounded-2xl border border-sand-200 bg-sand-50/50 flex gap-4 items-center justify-between hover:bg-white hover:border-sand-300 transition-all"
                      >
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          <img
                            src={hotel.coverImage}
                            alt={hotel.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                          <div className="overflow-hidden">
                            <h4 className="font-serif text-sm font-bold text-navy-950 truncate">
                              {hotel.name}
                            </h4>
                            <p className="text-xs text-navy-500">
                              {hotel.city}, {hotel.country} • ₹{hotel.pricePerNight?.toLocaleString()} / night
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[11px] font-semibold text-gold-700">
                                ★ {hotel.rating}
                              </span>
                              <span className="text-[11px] text-navy-400">
                                ({hotel.rooms?.length || 3} room types)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(hotel)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition-all ${
                              hotel.featured
                                ? 'bg-gold-50 text-gold-800 border-gold-300'
                                : 'bg-white text-navy-500 border-sand-300'
                            }`}
                          >
                            {hotel.featured ? 'Featured' : 'Standard'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHotel(hotelId)}
                            className="p-1.5 rounded-lg text-navy-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Hotel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* 4. ROOM INVENTORY MANAGEMENT */}
            {(activeSection === 'overview' || activeSection === 'rooms') && (
              <Card className="rounded-3xl border border-sand-200 shadow-card p-6 space-y-6">
                <div className="border-b border-sand-200 pb-4">
                  <h3 className="font-serif text-xl font-bold text-navy-950">
                    Suites & Villa Inventory
                  </h3>
                  <p className="text-xs text-navy-500 mt-0.5">
                    Overview of all bookable suites, capacities, bed specifications, and night tariffs.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sand-50 text-navy-500 uppercase tracking-wider font-semibold border-b border-sand-200">
                      <tr>
                        <th className="py-3 px-4">Suite Name</th>
                        <th className="py-3 px-4">Hotel Property</th>
                        <th className="py-3 px-4">Bed & Capacity</th>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Nightly Rate</th>
                        <th className="py-3 px-4">Features</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100 text-navy-800">
                      {hotelsList.flatMap((h) =>
                        (h.rooms || []).map((r) => (
                          <tr key={r._id || r.id} className="hover:bg-sand-50/50">
                            <td className="py-3 px-4 font-semibold text-navy-950">
                              {r.name}
                            </td>
                            <td className="py-3 px-4 text-navy-600">{h.name}</td>
                            <td className="py-3 px-4">
                              {r.bedType} ({r.capacity} Guests)
                            </td>
                            <td className="py-3 px-4 text-navy-500">{r.size}</td>
                            <td className="py-3 px-4 font-serif font-bold text-navy-950">
                              ₹{r.price?.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-navy-500">
                              {(r.features || []).join(', ')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add New Hotel Modal */}
      {newHotelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sand-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <h3 className="font-serif text-xl font-bold text-navy-950">
                Add New Luxury Hotel (MongoDB)
              </h3>
              <button
                type="button"
                onClick={() => setNewHotelModalOpen(false)}
                className="p-1 rounded-full text-navy-400 hover:bg-sand-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHotelSubmit} className="space-y-4">
              <Input
                label="Hotel Name"
                required
                placeholder="e.g. The Leela Palace, Bengaluru"
                value={newHotelData.name}
                onChange={(e) =>
                  setNewHotelData((p) => ({ ...p, name: e.target.value }))
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City / Destination"
                  required
                  placeholder="e.g. Bengaluru"
                  value={newHotelData.city}
                  onChange={(e) =>
                    setNewHotelData((p) => ({ ...p, city: e.target.value }))
                  }
                />
                <Input
                  label="Country"
                  required
                  placeholder="India"
                  value={newHotelData.country}
                  onChange={(e) =>
                    setNewHotelData((p) => ({ ...p, country: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Starting Price / Night (₹)"
                  type="number"
                  required
                  placeholder="28000"
                  value={newHotelData.pricePerNight}
                  onChange={(e) =>
                    setNewHotelData((p) => ({ ...p, pricePerNight: e.target.value }))
                  }
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700">
                    Category
                  </label>
                  <select
                    value={newHotelData.category}
                    onChange={(e) =>
                      setNewHotelData((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full bg-white border border-sand-300 text-navy-900 text-sm rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary-600"
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Heritage Palace">Heritage Palace</option>
                  </select>
                </div>
              </div>

              <Input
                label="Street Address"
                placeholder="23 Airport Road, HAL, Bengaluru"
                value={newHotelData.address}
                onChange={(e) =>
                  setNewHotelData((p) => ({ ...p, address: e.target.value }))
                }
              />

              <Input
                label="Cover Image URL"
                required
                placeholder="https://images.unsplash.com/..."
                value={newHotelData.coverImage}
                onChange={(e) =>
                  setNewHotelData((p) => ({ ...p, coverImage: e.target.value }))
                }
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700">
                  Property Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the architectural luxury and amenities..."
                  value={newHotelData.description}
                  onChange={(e) =>
                    setNewHotelData((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full bg-white border border-sand-300 text-navy-900 text-sm rounded-xl p-3 focus:outline-none focus:border-primary-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewHotelModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="teal"
                  size="sm"
                  type="submit"
                  isLoading={isSubmittingHotel}
                >
                  Publish to MongoDB
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
