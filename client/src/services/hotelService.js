import api from '../api/axiosInstance';
import { INITIAL_HOTELS } from '../data/hotelsData';
import { POPULAR_DESTINATIONS } from '../data/destinationsData';

export const hotelService = {
  /**
   * Fetch hotels from real backend API with query filters
   */
  async getHotels(filters = {}) {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.city && filters.city !== 'All') params.city = filters.city;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.sort) params.sort = filters.sort;
      if (filters.featured) params.featured = filters.featured;
      if (filters.amenities && filters.amenities.length > 0) {
        params.amenities = filters.amenities.join(',');
      }

      const response = await api.get('/hotels', { params });
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API unavailable, falling back to local dataset:', err.message);
    }

    // Resilient fallback to local dataset if offline
    let results = [...INITIAL_HOTELS];
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      results = results.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.country.toLowerCase().includes(q)
      );
    }
    if (filters.city && filters.city !== 'All') {
      results = results.filter((h) => h.city.toLowerCase() === filters.city.toLowerCase());
    }
    return results;
  },

  /**
   * Fetch single hotel by ID from backend API
   */
  async getHotelById(id) {
    try {
      const response = await api.get(`/hotels/${id}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`Failed to fetch hotel ${id} from API, attempting local fallback:`, err.message);
    }

    const fallback = INITIAL_HOTELS.find((h) => h.id === id);
    if (!fallback) {
      throw new Error(`Hotel with ID ${id} not found.`);
    }
    return fallback;
  },

  /**
   * Create a new hotel (Admin only)
   */
  async createHotel(hotelData) {
    const response = await api.post('/hotels', hotelData);
    return response.data.data;
  },

  /**
   * Update hotel details (Admin only)
   */
  async updateHotel(id, hotelData) {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data.data;
  },

  /**
   * Delete hotel (Admin only)
   */
  async deleteHotel(id) {
    const response = await api.delete(`/hotels/${id}`);
    return response.data.data;
  },

  /**
   * Fetch featured hotels
   */
  async getFeaturedHotels() {
    try {
      const response = await api.get('/hotels', { params: { featured: true } });
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }
    return INITIAL_HOTELS.filter((h) => h.featured);
  },

  /**
   * Popular destinations
   */
  async getPopularDestinations() {
    return POPULAR_DESTINATIONS;
  },
};
