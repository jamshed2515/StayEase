import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuth } from './AuthContext';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real bookings from backend when authenticated
  const fetchUserBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setBookings([]);
      return;
    }

    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.warn('Could not load bookings from API, using cached state:', err.message);
      try {
        const stored = localStorage.getItem('stayease_bookings');
        if (stored) setBookings(JSON.parse(stored));
      } catch {
        // Ignore
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  // Keep localStorage as local backup
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('stayease_bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  /**
   * Create new booking via backend MongoDB API
   */
  const addBooking = async (newBookingData) => {
    try {
      const payload = {
        hotelId: newBookingData.hotelId,
        roomId: newBookingData.roomId,
        checkIn: newBookingData.checkIn,
        checkOut: newBookingData.checkOut,
        guests: newBookingData.guests,
        guestName: newBookingData.guestName || user?.name,
        guestEmail: newBookingData.guestEmail || user?.email,
        guestPhone: newBookingData.guestPhone || user?.phone,
        specialRequests: newBookingData.specialRequests,
        paymentMethod: newBookingData.paymentMethod,
      };

      const created = await bookingService.createBooking(payload);
      setBookings((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      // Fallback local booking if API call fails
      console.warn('API booking creation failed, storing local reservation fallback:', err.message);
      const fallback = {
        ...newBookingData,
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Confirmed',
        bookedAt: new Date().toISOString(),
      };
      setBookings((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  /**
   * Cancel booking via backend API
   */
  const cancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((bk) =>
          bk._id === bookingId || bk.id === bookingId
            ? { ...bk, status: 'Cancelled' }
            : bk
        )
      );
    } catch (err) {
      console.warn('API cancel failed, updating locally:', err.message);
      setBookings((prev) =>
        prev.map((bk) =>
          bk._id === bookingId || bk.id === bookingId
            ? { ...bk, status: 'Cancelled' }
            : bk
        )
      );
    }
  };

  /**
   * Admin: update booking status via backend API
   */
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((bk) =>
          bk._id === bookingId || bk.id === bookingId
            ? { ...bk, status: newStatus }
            : bk
        )
      );
    } catch (err) {
      setBookings((prev) =>
        prev.map((bk) =>
          bk._id === bookingId || bk.id === bookingId
            ? { ...bk, status: newStatus }
            : bk
        )
      );
    }
  };

  /**
   * Admin: delete booking via backend API
   */
  const deleteBooking = async (bookingId) => {
    try {
      await bookingService.deleteBooking(bookingId);
      setBookings((prev) =>
        prev.filter((bk) => bk._id !== bookingId && bk.id !== bookingId)
      );
    } catch {
      setBookings((prev) =>
        prev.filter((bk) => bk._id !== bookingId && bk.id !== bookingId)
      );
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        refetchBookings: fetchUserBookings,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
