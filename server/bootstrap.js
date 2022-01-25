/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
/* eslint-disable no-unreachable */
'use strict';

const ONLYOFFICE_ACTIONS = [
  {
    section: 'plugins',
    displayName: 'Set or update ONLYOFFICE plugin settings',
    uid: 'settings.update',
    pluginName: 'onlyoffice',
  },
  {
    section: 'plugins',
    displayName: 'Access the ONLYOFFICE plugin settings page',
    uid: 'settings.read',
    pluginName: 'onlyoffice',
  },
];

/**
 *
 * @param {{strapi: import("@strapi/strapi").Strapi}} args
 */
module.exports = async ({strapi}) => {
  await strapi.admin.services.permission.actionProvider.registerMany(ONLYOFFICE_ACTIONS);

  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'onlyoffice',
  });

  const editorConfig = await pluginStore.get({key: 'editorConfig'});

  const docServConfig = {
    docJwtSecret: '',
    docServUrl: null
  }

  if (!editorConfig) {
    pluginStore.set({key: 'editorConfig', value: {docServConfig: docServConfig}});
  }

};
