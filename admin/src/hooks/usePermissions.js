/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import { useMemo } from 'react';
import { useRBAC } from '@strapi/strapi/admin';

import permissions from '../permissions';

const usePermissions = () => {
  const pluginPermissions = useMemo(() => {
    return Object.values(permissions).flat();
  }, []);
  const { allowedActions, isLoading } = useRBAC(pluginPermissions);

  return { ...allowedActions, isLoading };
};

export default usePermissions;
