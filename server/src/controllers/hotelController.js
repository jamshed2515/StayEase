import { Hotel } from '../models/Hotel.js';
import { Room } from '../models/Room.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Get all hotels with query filters, search, and sorting
 * GET /api/v1/hotels
 */
export const getHotels = async (req, res, next) => {
  try {
    const {
      search,
      city,
      category,
      minPrice,
      maxPrice,
      minRating,
      amenities,
      sort,
      featured,
    } = req.query;

    const query = {};

    // Destination & Keyword Search
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (featured === 'true' || featured === true) {
      query.featured = true;
    }

    // Price Filtering
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Rating Filtering
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Amenities Filtering
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    // Sorting
    let sortOption = { featured: -1, createdAt: -1 };
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOption = { pricePerNight: 1 };
          break;
        case 'price-desc':
          sortOption = { pricePerNight: -1 };
          break;
        case 'rating-desc':
          sortOption = { rating: -1 };
          break;
        case 'reviews-desc':
          sortOption = { reviewCount: -1 };
          break;
        default:
          sortOption = { featured: -1, createdAt: -1 };
          break;
      }
    }

    const hotels = await Hotel.find(query).sort(sortOption).populate('rooms');

    return res
      .status(200)
      .json(ApiResponse.success(hotels, `Found ${hotels.length} hotels`));
  } catch (error) {
    next(error);
  }
};

/**
 * Get single hotel by ID with rooms
 * GET /api/v1/hotels/:id
 */
export const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('rooms');

    if (!hotel) {
      return next(ApiError.notFound(`Hotel with ID ${req.params.id} not found`));
    }

    return res
      .status(200)
      .json(ApiResponse.success(hotel, 'Hotel details retrieved'));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new hotel (Admin only)
 * POST /api/v1/hotels
 */
export const createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);

    // If initial rooms were passed in payload, create them as well
    if (req.body.rooms && Array.isArray(req.body.rooms) && req.body.rooms.length > 0) {
      const roomDocs = req.body.rooms.map((r) => ({
        ...r,
        hotel: hotel._id,
      }));
      await Room.insertMany(roomDocs);
    }

    const populatedHotel = await Hotel.findById(hotel._id).populate('rooms');

    return res
      .status(201)
      .json(ApiResponse.created(populatedHotel, 'Hotel created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update hotel details (Admin only)
 * PUT /api/v1/hotels/:id
 */
export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('rooms');

    if (!hotel) {
      return next(ApiError.notFound(`Hotel with ID ${req.params.id} not found`));
    }

    return res
      .status(200)
      .json(ApiResponse.success(hotel, 'Hotel updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a hotel (Admin only)
 * DELETE /api/v1/hotels/:id
 */
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return next(ApiError.notFound(`Hotel with ID ${req.params.id} not found`));
    }

    // Cascade delete associated rooms
    await Room.deleteMany({ hotel: req.params.id });

    return res
      .status(200)
      .json(ApiResponse.success(null, 'Hotel and associated rooms removed'));
  } catch (error) {
    next(error);
  }
};

