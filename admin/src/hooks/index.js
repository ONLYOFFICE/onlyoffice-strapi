/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import useSearch from './useSearch';
import usePermissions from './usePermissions';
import useAuthentication from './useAuthentication';
import useQueryParams from './useQueryParams';

const fetchOnlyofficeSettings = useSearch('/onlyoffice/settings', { cacheTime: 0 });

export { fetchOnlyofficeSettings, useSearch, usePermissions, useAuthentication, useQueryParams };
