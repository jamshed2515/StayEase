import api from '../api/axiosInstance';

/**
 * Service to interact with the backend health-check endpoints
 */
export const healthService = {
  /**
   * Fetch full health check status
   */
  async getHealth() {
    const startTime = performance.now();
    const response = await api.get('/health');
    const latency = Math.round(performance.now() - startTime);

    return {
      ...response.data,
      latencyMs: latency,
    };
  },

  /**
   * Quick ping test
   */
  async ping() {
    const startTime = performance.now();
    const response = await api.get('/health/ping');
    const latency = Math.round(performance.now() - startTime);

    return {
      ...response.data,
      latencyMs: latency,
    };
  },
};

