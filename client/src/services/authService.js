import api from '../api/axiosInstance';

export const authService = {
  /**
   * Log in user
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  /**
   * Register new user
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  },

  /**
   * Get currently logged-in user profile
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};

