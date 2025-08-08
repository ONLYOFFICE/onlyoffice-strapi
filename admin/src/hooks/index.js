/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import useSearch from './useSearch';
import usePermissions from './usePermissions';
import useAuthentication from './useAuthentication';
import useQueryParams from './useQueryParams';

import { PLUGIN_ID } from '../pluginId';

const fetchSettings = useSearch(`/${PLUGIN_ID}/settings`, { cacheTime: 0 });

export { fetchSettings, useSearch, usePermissions, useAuthentication, useQueryParams };
