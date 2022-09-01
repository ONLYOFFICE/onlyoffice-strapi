/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
'use strict';

module.exports = {
  async updateSettings(ctx) {
    try {
      await strapi.plugin('onlyoffice').service('settings').updateSettings(ctx.request.body);
      return ctx.send({ ok: true });
    } catch (err) {
      return ctx.badRequest(null, err.message);
    }
  },

  async getSettings(ctx) {
    try {
      const info = await strapi.plugin('onlyoffice').service('settings').getSettings();
      return ctx.send(info);
    } catch (err) {
      return ctx.badRequest(null, err.message);
    }
  },

  async getDocumentServerAddress(ctx) {
    try {
      const dsURL = await strapi.plugin('onlyoffice').service('settings').getSettings('dsURL');
      return ctx.send({ url: dsURL });
    } catch (err) {
      return ctx.badRequest(null, err.message);
    }
  }
};
