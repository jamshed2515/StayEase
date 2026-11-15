import { Router } from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController.js';
import {
  getRoomsByHotel,
  createRoom,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// Nested routes for rooms under a hotel
router.get('/:hotelId/rooms', getRoomsByHotel);
router.post('/:hotelId/rooms', protect, authorize('admin'), createRoom);

// Public hotel endpoints
router.get('/', getHotels);
router.get('/:id', getHotelById);

// Admin-protected hotel management
router.post('/', protect, authorize('admin'), createHotel);
router.put('/:id', protect, authorize('admin'), updateHotel);
router.delete('/:id', protect, authorize('admin'), deleteHotel);

export default router;

