/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
/* eslint-disable no-unreachable */
'use strict';

const { v4: uuidv4 } = require('uuid');

const ONLYOFFICE_ACTIONS = [
  {
    section: 'plugins',
    displayName: 'Set or update ONLYOFFICE plugin settings',
    uid: 'settings.update',
    pluginName: 'onlyoffice',
  }
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
  const uuid = await pluginStore.get({key: 'uuid'});

  const onlyofficeKey = uuidv4();
  const docServConfig = {
    docJwtSecret: '',
    docServUrl: null
  }

  if (!uuid) {
    pluginStore.set({key: 'uuid', value: {onlyofficeKey: onlyofficeKey}});
  }

  if (!editorConfig) {
    pluginStore.set({key: 'editorConfig', value: {docServConfig: docServConfig}});
  }

};
