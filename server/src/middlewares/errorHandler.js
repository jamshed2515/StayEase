import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { HttpStatusCodes } from '../constants/httpStatusCodes.js';
import { logger } from '../utils/logger.js';

/**
 * Centralized Error Handling Middleware for Express
 */
export const errorHandler = (err, req, res, _next) => {
  let error = err;

  // If error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR;
    let message = error.message || 'Internal Server Error';

    // Handle Mongoose Bad ObjectId (CastError)
    if (error.name === 'CastError') {
      message = `Invalid resource identifier: ${error.path}`;
      statusCode = HttpStatusCodes.BAD_REQUEST;
      error = new ApiError(statusCode, message);
    }
    // Handle Mongoose Validation Error
    else if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map((val) => val.message);
      message = `Validation failed: ${messages.join(', ')}`;
      statusCode = HttpStatusCodes.BAD_REQUEST;
      error = new ApiError(statusCode, message, messages);
    }
    // Handle Mongoose Duplicate Key Error
    else if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      message = `Duplicate value entered for ${field}. Please use another value.`;
      statusCode = HttpStatusCodes.CONFLICT;
      error = new ApiError(statusCode, message);
    }
    // Handle JWT Errors
    else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid authentication token. Please log in again.';
      statusCode = HttpStatusCodes.UNAUTHORIZED;
      error = new ApiError(statusCode, message);
    } else if (error.name === 'TokenExpiredError') {
      message = 'Authentication token expired. Please log in again.';
      statusCode = HttpStatusCodes.UNAUTHORIZED;
      error = new ApiError(statusCode, message);
    } else {
      error = new ApiError(statusCode, message, [], err.stack);
    }
  }

  // Log error details for server diagnostics
  logger.error(
    `[${req.method}] ${req.originalUrl} - ${error.statusCode} ${error.message}`
  );

  const responsePayload = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors && error.errors.length > 0 ? error.errors : undefined,
    timestamp: new Date().toISOString(),
    ...(env.isDevelopment && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(responsePayload);
};

