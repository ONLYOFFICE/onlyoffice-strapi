/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import { useMemo } from 'react';
import { useRBAC } from '@strapi/helper-plugin';
import permissions from '../permissions';

const usePermissions = () => {
  const pluginPermissions = useMemo(() => permissions, []);
  const { allowedActions, isLoading } = useRBAC(pluginPermissions);

  return { ...allowedActions, isLoading };
};

export default usePermissions;
