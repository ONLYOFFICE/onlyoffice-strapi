/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import React from 'react';
import { useLocation } from 'react-router-dom';

export default function useQueryParams() {
  const { search } = useLocation();

  return React.useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]);
};
