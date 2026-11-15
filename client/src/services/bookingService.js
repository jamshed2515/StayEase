import api from '../api/axiosInstance';

export const bookingService = {
  /**
   * Create a new booking in MongoDB
   */
  async createBooking(bookingData) {
    const response = await api.post('/bookings', bookingData);
    return response.data.data;
  },

  /**
   * Get logged-in user's bookings
   */
  async getMyBookings() {
    const response = await api.get('/bookings/my-bookings');
    return response.data.data;
  },

  /**
   * Admin: Get all bookings
   */
  async getAllBookings(params = {}) {
    const response = await api.get('/bookings', { params });
    return response.data.data;
  },

  /**
   * Cancel booking
   */
  async cancelBooking(bookingId) {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data.data;
  },

  /**
   * Admin: Update booking status
   */
  async updateBookingStatus(bookingId, status) {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status });
    return response.data.data;
  },

  /**
   * Admin: Delete booking
   */
  async deleteBooking(bookingId) {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data.data;
  },

  /**
   * Admin: System metrics
   */
  async getAdminStats() {
    const response = await api.get('/bookings/stats');
    return response.data.data;
  },
};

