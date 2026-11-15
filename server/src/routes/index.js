import { Router } from 'express';
import authRoutes from './authRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import roomRoutes from './roomRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import healthRoutes from './healthRoutes.js';

const apiRouter = Router();

// Mount API v1 modules
apiRouter.use('/auth', authRoutes);
apiRouter.use('/hotels', hotelRoutes);
apiRouter.use('/rooms', roomRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/health', healthRoutes);

export default apiRouter;
