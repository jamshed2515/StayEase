import { Router } from 'express';
import { getHealth, ping } from '../controllers/healthController.js';

const router = Router();

// GET /api/v1/health
router.get('/', getHealth);

// GET /api/v1/health/ping
router.get('/ping', ping);

export default router;

