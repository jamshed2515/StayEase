import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/User.js';

/**
 * Protect routes: Requires valid JWT Bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      ApiError.unauthorized('Not authorized to access this route. Please log in.')
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(
        ApiError.unauthorized('The user belonging to this token no longer exists.')
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      ApiError.unauthorized('Invalid or expired authentication token. Please log in again.')
    );
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles Allowed roles (e.g. 'admin', 'user')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `User role '${req.user?.role || 'guest'}' is not authorized to access this resource`
        )
      );
    }
    next();
  };
};

/**
 * Optional authentication: attaches req.user if valid token present, but does not block
 */
export const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid optional tokens
  }
  next();
};

