import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const READY_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Returns real-time MongoDB connection details
 */
export const getDbStatus = () => {
  const readyStateCode = mongoose.connection.readyState;
  return {
    isConnected: readyStateCode === 1,
    readyState: readyStateCode,
    statusText: READY_STATES[readyStateCode] || 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    port: mongoose.connection.port || null,
  };
};

/**
 * Connect to MongoDB with resilient error handling
 */
export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      logger.database(`Connected to MongoDB host: ${mongoose.connection.host}, database: ${mongoose.connection.name}`);
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Configure connection options
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000, // Timeout after 4s to avoid blocking server boot
    });

    return conn;
  } catch (error) {
    logger.warn(
      `MongoDB connection failed (${error.message}). Server continues in offline database mode. Ensure MongoDB is running at: ${env.MONGODB_URI}`
    );
    return null;
  }
};

