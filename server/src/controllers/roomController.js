import { Room } from '../models/Room.js';
import { Hotel } from '../models/Hotel.js';
import { Booking } from '../models/Booking.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Check if a specific room is available for given dates
 * GET /api/v1/rooms/:id/availability?checkIn=...&checkOut=...
 */
export const checkRoomAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return next(
        ApiError.badRequest('Please provide both checkIn and checkOut dates')
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return next(ApiError.badRequest('Invalid date format'));
    }

    const conflictingBooking = await Booking.findOne({
      room: id,
      status: 'Confirmed',
      $and: [
        { checkIn: { $lt: checkOutDate } },
        { checkOut: { $gt: checkInDate } },
      ],
    });

    const isAvailable = !conflictingBooking;

    return res.status(200).json(
      ApiResponse.success(
        {
          roomId: id,
          isAvailable,
          checkIn,
          checkOut,
          conflictingBooking: conflictingBooking
            ? {
                checkIn: conflictingBooking.checkIn.toISOString().split('T')[0],
                checkOut: conflictingBooking.checkOut.toISOString().split('T')[0],
              }
            : null,
        },
        isAvailable ? 'Room is available' : 'Room is already booked for these dates'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all rooms (or filter by hotel query)
 * GET /api/v1/rooms
 */
export const getAllRooms = async (req, res, next) => {
  try {
    const { hotelId } = req.query;
    const filter = hotelId ? { hotel: hotelId } : {};
    const rooms = await Room.find(filter).populate('hotel', 'name city country');

    return res
      .status(200)
      .json(ApiResponse.success(rooms, `Found ${rooms.length} rooms`));
  } catch (error) {
    next(error);
  }
};

/**
 * Get rooms belonging to a specific hotel
 * GET /api/v1/hotels/:hotelId/rooms
 */
export const getRoomsByHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const rooms = await Room.find({ hotel: hotelId });

    return res
      .status(200)
      .json(ApiResponse.success(rooms, `Rooms for hotel ${hotelId}`));
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new room to a hotel (Admin only)
 * POST /api/v1/hotels/:hotelId/rooms OR POST /api/v1/rooms
 */
export const createRoom = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId || req.body.hotel;

    if (!hotelId) {
      return next(ApiError.badRequest('Hotel ID must be specified for the room'));
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return next(ApiError.notFound(`Hotel with ID ${hotelId} not found`));
    }

    const room = await Room.create({
      ...req.body,
      hotel: hotelId,
    });

    return res
      .status(201)
      .json(ApiResponse.created(room, 'Room added to hotel successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update room details (Admin only)
 * PUT /api/v1/rooms/:id
 */
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return next(ApiError.notFound(`Room with ID ${req.params.id} not found`));
    }

    return res
      .status(200)
      .json(ApiResponse.success(room, 'Room updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a room (Admin only)
 * DELETE /api/v1/rooms/:id
 */
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return next(ApiError.notFound(`Room with ID ${req.params.id} not found`));
    }

    return res
      .status(200)
      .json(ApiResponse.success(null, 'Room removed successfully'));
  } catch (error) {
    next(error);
  }
};

