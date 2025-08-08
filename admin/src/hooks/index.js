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

const fetchOnlyofficeSettings = useSearch(`/${PLUGIN_ID}/settings`, { cacheTime: 0 });

export { fetchOnlyofficeSettings, useSearch, usePermissions, useAuthentication, useQueryParams };
