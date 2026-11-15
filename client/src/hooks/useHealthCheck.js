import { useState, useEffect, useCallback } from 'react';
import { healthService } from '../services/healthService';

/**
 * Custom hook to monitor API health and database connectivity
 */
export const useHealthCheck = (autoCheck = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await healthService.getHealth();
      setData(result);
      setLastChecked(new Date());
    } catch (err) {
      setError(err);
      setData(null);
      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoCheck) {
      checkHealth();
    }
  }, [autoCheck, checkHealth]);

  return {
    data,
    loading,
    error,
    lastChecked,
    refetch: checkHealth,
  };
};

