/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
'use strict';
const jwt = require('jsonwebtoken');
const { makeConfig, makeSettings } = require('../model');
const { detectAgent } = require('../utils');

module.exports = {
  async getEditor(ctx) {
    try {
      const credentials = makeSettings({ ...await strapi.plugin('onlyoffice').service('settings').getSettings() });
      const host = `${ctx.secure ? 'https:' : 'http:'}//${ctx.request.header.host}`;
      const { userAbility: ability, user } = ctx.state;

      const file = await strapi.plugin('onlyoffice').service('file').checkAccessAndGetFileInfo(ability, ctx.params.file);
      const dtoken = await strapi.plugin('users-permissions').services.jwt.issue({ id: ctx.params.file }, { expiresIn: '3m' });

      const config = makeConfig({
        fileName: file.name,
        fileExt: file.ext.replace('.', ''),
        url: `${host}/onlyoffice/file?token=${dtoken}`,
        callback: `${host}/onlyoffice/callback`,
        user,
        userCanEdit: await strapi.plugin('onlyoffice').service('file').allowedFileAccess(ability, 'plugin::upload.assets.update'),
        userCanDownload: await strapi.plugin('onlyoffice').service('file').allowedFileAccess(ability, 'plugin::upload.assets.download'),
        lang: ctx.state.user.preferedLanguage || ctx.params.locale,
        docKey: `${ctx.params.file}_${file.hash}${file.updatedAt}`,
        type: detectAgent(ctx.header['user-agent']) || 'desktop',
      });

      const signedConfig = {
        ...config,
        token: jwt.sign(config, credentials.dsSecret, { expiresIn: '3m' }),
        server: credentials.dsURL,
      };

      return ctx.send(signedConfig);
    } catch (err) {
      return ctx.forbidden(null, err.message);
    }
  },
};
