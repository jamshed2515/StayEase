import { Booking } from '../models/Booking.js';
import { Room } from '../models/Room.js';
import { Hotel } from '../models/Hotel.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Create a new hotel booking
 * POST /api/v1/bookings
 */
export const createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!hotelId || !roomId || !checkIn || !checkOut) {
      return next(
        ApiError.badRequest(
          'Please provide hotelId, roomId, checkIn, and checkOut dates'
        )
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate date logic
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return next(ApiError.badRequest('Invalid check-in or check-out date format'));
    }

    if (checkInDate < today) {
      return next(ApiError.badRequest('Check-in date cannot be in the past'));
    }

    if (checkOutDate <= checkInDate) {
      return next(
        ApiError.badRequest('Check-out date must be at least one day after check-in')
      );
    }

    // Fetch Room & Hotel
    const room = await Room.findById(roomId);
    if (!room) {
      return next(ApiError.notFound(`Room with ID ${roomId} not found`));
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return next(ApiError.notFound(`Hotel with ID ${hotelId} not found`));
    }

    // Check room availability & prevent overlapping confirmed reservations
    const overlappingReservation = await Booking.findOne({
      room: roomId,
      status: 'Confirmed',
      $and: [
        { checkIn: { $lt: checkOutDate } },
        { checkOut: { $gt: checkInDate } },
      ],
    });

    if (overlappingReservation) {
      return next(
        ApiError.conflict(
          `This suite is already reserved from ${overlappingReservation.checkIn.toISOString().split('T')[0]} to ${overlappingReservation.checkOut.toISOString().split('T')[0]}. Please select alternate dates or another suite.`
        )
      );
    }

    // Calculate nights & pricing
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));
    const pricePerNight = room.price;
    const totalPrice = nights * pricePerNight;
    const taxesAndFees = Math.round(totalPrice * 0.12); // 12% luxury tax & fees
    const finalAmount = totalPrice + taxesAndFees;

    // Generate unique booking number
    let bookingNumber = Booking.generateBookingNumber();
    // Ensure uniqueness
    while (await Booking.findOne({ bookingNumber })) {
      bookingNumber = Booking.generateBookingNumber();
    }

    // Create booking
    const booking = await Booking.create({
      bookingNumber,
      user: req.user._id,
      hotel: hotel._id,
      room: room._id,
      hotelName: hotel.name,
      hotelImage: hotel.coverImage,
      city: hotel.city,
      country: hotel.country,
      roomName: room.name,
      guestName: guestName || req.user.name,
      guestEmail: guestEmail || req.user.email,
      guestPhone: guestPhone || req.user.phone || '',
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: Number(guests) || 2,
      pricePerNight,
      totalPrice,
      taxesAndFees,
      finalAmount,
      status: 'Confirmed',
      paymentMethod: paymentMethod || 'Visa •••• 4242',
      specialRequests: specialRequests || '',
    });

    return res
      .status(201)
      .json(ApiResponse.created(booking, 'Reservation confirmed successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's bookings
 * GET /api/v1/bookings/my-bookings
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res
      .status(200)
      .json(ApiResponse.success(bookings, `Found ${bookings.length} reservations`));
  } catch (error) {
    next(error);
  }
};

/**
 * Get single booking by ID
 * GET /api/v1/bookings/:id
 */
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(ApiError.notFound(`Booking with ID ${req.params.id} not found`));
    }

    // Verify ownership if not admin
    if (
      req.user.role !== 'admin' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return next(
        ApiError.forbidden('You are not authorized to view this reservation')
      );
    }

    return res
      .status(200)
      .json(ApiResponse.success(booking, 'Booking details retrieved'));
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel a booking
 * PATCH /api/v1/bookings/:id/cancel
 */
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(ApiError.notFound(`Booking with ID ${req.params.id} not found`));
    }

    // Verify ownership if not admin
    if (
      req.user.role !== 'admin' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return next(
        ApiError.forbidden('You are not authorized to cancel this reservation')
      );
    }

    if (booking.status === 'Cancelled') {
      return next(ApiError.badRequest('This booking is already cancelled'));
    }

    booking.status = 'Cancelled';
    await booking.save();

    return res
      .status(200)
      .json(ApiResponse.success(booking, 'Reservation successfully cancelled'));
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all bookings with filtering & search
 * GET /api/v1/bookings
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = { $regex: new RegExp(`^${status.trim()}$`, 'i') };
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { bookingNumber: { $regex: q, $options: 'i' } },
        { guestName: { $regex: q, $options: 'i' } },
        { guestEmail: { $regex: q, $options: 'i' } },
        { hotelName: { $regex: q, $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(ApiResponse.success(bookings, `Found ${bookings.length} reservations`));
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update booking status
 * PATCH /api/v1/bookings/:id/status
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return next(ApiError.badRequest('Invalid booking status'));
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return next(ApiError.notFound(`Booking with ID ${req.params.id} not found`));
    }

    return res
      .status(200)
      .json(ApiResponse.success(booking, `Status updated to ${status}`));
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete booking
 * DELETE /api/v1/bookings/:id
 */
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return next(ApiError.notFound(`Booking with ID ${req.params.id} not found`));
    }

    return res
      .status(200)
      .json(ApiResponse.success(null, 'Booking record deleted'));
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: System overview metrics
 * GET /api/v1/bookings/stats
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const totalHotels = await Hotel.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });

    // Aggregate total revenue from non-cancelled bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    return res.status(200).json(
      ApiResponse.success(
        {
          totalBookings,
          confirmedBookings,
          totalRevenue,
          totalHotels,
          totalCustomers,
        },
        'Overview statistics retrieved'
      )
    );
  } catch (error) {
    next(error);
  }
};

