import { Router } from 'express';
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  checkRoomAvailability,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getAllRooms);
router.get('/:id/availability', checkRoomAvailability);
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

export default router;

