/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import axios from 'axios';
import { useState, useEffect } from 'react';

import useAuthentication from './useAuthentication';

const fetchData = async (url, headers, query = null) => {
  try {
    const response = await axios.get(url, {
      headers,
      params: query || {},
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export default function useSearch(url, options = {}) {
  return function (query = null, headers = useAuthentication()) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
      if (options.enabled === false) return;

      const loadData = async () => {
        setIsLoading(true);
        setIsError(false);

        try {
          const result = await fetchData(url, headers, query);
          setData(result);
        } catch (error) {
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }, [url, options.enabled]);

    return {
      data,
      isLoading,
      isError,
    };
  };
}
