import { useCallback, useEffect, useState } from "react";

export const useFetch = (fetcher, dependencies = [], options = {}) => {
  const { immediate = true, fallback = null } = options;
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetcher();
      setData(response?.data ?? response);
      return response?.data ?? response;
    } catch (fetchError) {
      setError(fetchError);
      throw fetchError;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => null);
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
};
