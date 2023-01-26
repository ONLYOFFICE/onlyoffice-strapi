/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/settings',
    handler: 'settings.getSettings',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::upload.settings.read'],
          },
        },
      ],
    },
  },
  {
    method: 'GET',
    path: '/settings/address',
    handler: 'settings.getDocumentServerAddress',
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'settings.updateSettings',
    config: {
      policies: [
        'admin::isAuthenticatedAdmin',
        {
          name: 'admin::hasPermissions',
          config: {
            actions: ['plugin::upload.settings.read'],
          },
        },
      ],
    },
  }
];
