import { ApiResponse } from '../utils/apiResponse.js';
import { getDbStatus } from '../config/db.js';
import { env } from '../config/env.js';

const startTime = Date.now();

/**
 * Controller for comprehensive system health check
 */
export const getHealth = (req, res) => {
  const dbStatus = getDbStatus();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage();

  const healthData = {
    service: 'StayEase Hotel Booking Backend API',
    status: 'healthy',
    environment: env.NODE_ENV,
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.statusText,
      connected: dbStatus.isConnected,
      host: dbStatus.host || 'N/A',
      name: dbStatus.name || 'N/A',
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
    },
  };

  return res.status(200).json(ApiResponse.success(healthData, 'StayEase API is operating normally'));
};

/**
 * Lightweight ping endpoint
 */
export const ping = (req, res) => {
  return res.status(200).json(ApiResponse.success({ ping: 'pong' }, 'Pong'));
};

