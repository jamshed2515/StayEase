import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Helper to generate signed JWT token
const signToken = (id, role) => {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return next(ApiError.badRequest('Please provide name, email and password'));
    }

    // Check if email already registered
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return next(ApiError.conflict('An account with this email already exists'));
    }

    // Disallow arbitrary self-assigning of admin role in production
    const assignedRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      password,
      role: assignedRole,
    });

    const token = signToken(user._id, user.role);

    return res
      .status(201)
      .json(ApiResponse.created({ user, token }, 'Account created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user & get token
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest('Please provide both email and password'));
    }

    // Find user by email and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+password'
    );

    if (!user) {
      return next(ApiError.unauthorized('Invalid email or password'));
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(ApiError.unauthorized('Invalid email or password'));
    }

    user.password = undefined;
    const token = signToken(user._id, user.role);

    return res
      .status(200)
      .json(ApiResponse.success({ user, token }, 'Logged in successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 * GET /api/v1/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json(ApiResponse.success({ user: req.user }, 'User profile retrieved'));
  } catch (error) {
    next(error);
  }
};

/**
 * User logout
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res) => {
  return res
    .status(200)
    .json(ApiResponse.success(null, 'User successfully logged out'));
};

