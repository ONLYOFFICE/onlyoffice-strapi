/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import axios from 'axios';
import { useQuery } from 'react-query';

import useAuthentication from './useAuthentication';

const doGet = async (url, headers, query = null) => {
  const searchParams = query ? Object.fromEntries(new URLSearchParams(query)) : null;
  const params = searchParams
    ? { ...(!!searchParams && searchParams) }
    : { ...(query && { ...query }) };

  const response = await axios.get(url, {
    headers,
    params,
  });

  return response.data;
};

export default function useSearch(url, options) {
  return function (
    query = null,
    headers = useAuthentication(),
  ) {
    const { data, isLoading, isError, isFetching } = useQuery(
      [query, headers],
      () => doGet(url, headers, query),
      { ...options },
    );

    return {
      data,
      isLoading,
      isFetching,
      isError,
    };
  };
}
