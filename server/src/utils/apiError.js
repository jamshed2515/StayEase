import { HttpStatusCodes } from '../constants/httpStatusCodes.js';

/**
 * Standardized Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR,
    message = 'An unexpected error occurred',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(HttpStatusCodes.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = 'Unauthorized access', errors = []) {
    return new ApiError(HttpStatusCodes.UNAUTHORIZED, message, errors);
  }

  static forbidden(message = 'Access forbidden', errors = []) {
    return new ApiError(HttpStatusCodes.FORBIDDEN, message, errors);
  }

  static notFound(message = 'Resource not found', errors = []) {
    return new ApiError(HttpStatusCodes.NOT_FOUND, message, errors);
  }

  static conflict(message = 'Resource conflict', errors = []) {
    return new ApiError(HttpStatusCodes.CONFLICT, message, errors);
  }

  static internal(message = 'Internal server error', errors = []) {
    return new ApiError(HttpStatusCodes.INTERNAL_SERVER_ERROR, message, errors);
  }
}

