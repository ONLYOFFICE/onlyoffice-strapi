/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
'use strict';
/**
 *
 * @param {{strapi: import("@strapi/strapi").Strapi}} args
 */
module.exports = async ({ strapi }) => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'onlyoffice',
  });

  const editor = await pluginStore.get({ key: 'editor' });

  if (!editor) {
    const ds = { dsURL: '', dsSecret: '' };
    pluginStore.set({ key: 'editor', value: ds });
  }
};
