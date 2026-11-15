import axios from 'axios';

// Determine base API URL from Vite environment or default fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Pre-configured Axios instance for StayEase API requests
 */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach authentication token if available
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('stayease_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access errors (e.g., SSR or restricted iframe)
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize data extraction & error handling
api.interceptors.response.use(
  (response) => {
    // Return the response directly or response.data for convenience
    return response;
  },
  (error) => {
    // Standardize error message extraction
    const customError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'Unable to connect to StayEase servers. Please check your connection.',
      errors: error.response?.data?.errors || [],
      raw: error,
    };

    // If 401 Unauthorized, can trigger session expiry actions
    if (customError.status === 401) {
      // Optional: localStorage.removeItem('stayease_token');
    }

    return Promise.reject(customError);
  }
);

export default api;

