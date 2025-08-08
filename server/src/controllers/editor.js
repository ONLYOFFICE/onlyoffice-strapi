/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import jwt from 'jsonwebtoken';
import { makeConfig, makeSettings } from '../model';
import { detectAgent } from '../utils';

export default {
  async getEditor(ctx) {
    try {
      const credentials = makeSettings({ ...await strapi.plugin('onlyoffice').service('settings').getSettings() });
      const host = `${ctx.secure ? 'https:' : 'http:'}//${ctx.request.header.host}`;
      const { userAbility: ability, user } = ctx.state;

      if (!user || !ability) {
        return ctx.forbidden(null, 'Authentication required');
      }

      const file = await strapi.plugin('onlyoffice').service('file').checkAccessAndGetFileInfo(ability, ctx.params.file);
      const dtoken = await strapi.plugin('users-permissions').services.jwt.issue({ id: ctx.params.file }, { expiresIn: '3m' });

      const config = makeConfig({
        fileName: file.name,
        fileExt: file.ext.replace('.', ''),
        url: `${host}/onlyoffice/file?token=${dtoken}`,
        callback: `${host}/onlyoffice/callback`,
        user,
        userCanEdit: await strapi.plugin('onlyoffice').service('file').allowedFileAccess(ability, 'plugin::upload.read'),
        userCanDownload: await strapi.plugin('onlyoffice').service('file').allowedFileAccess(ability, 'plugin::upload.read'),
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
      console.error('Editor error:', err);
      return ctx.forbidden(null, err.message);
    }
  },
};
