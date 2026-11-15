import { HttpStatusCodes } from '../constants/httpStatusCodes.js';

/**
 * Standardized API Response formatter
 */
export class ApiResponse {
  constructor(statusCode = HttpStatusCodes.OK, data = null, message = 'Success') {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success(data = null, message = 'Success', statusCode = HttpStatusCodes.OK) {
    return new ApiResponse(statusCode, data, message);
  }

  static created(data = null, message = 'Created successfully') {
    return new ApiResponse(HttpStatusCodes.CREATED, data, message);
  }
}

