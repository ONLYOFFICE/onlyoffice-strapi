/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
export default {
  async handle(ctx) {
    try {
      const body = ctx.request?.body;
      const token = body?.token || (ctx.request.header?.authorization?.split(/\s+/)?.[1]) || ctx.request.header?.Authorization?.split(/\s+/)?.[1];
      if (!token || !body) throw new Error('invalid callback request payload');

      const callback = await strapi.plugin('onlyoffice').service('jwt').verifyDocumentServerToken(token);

      if (callback.status === 3 || callback.status === 7) {
        throw new Error('could not save a file');
      }

      if (callback.status === 2) {
        const fileID = callback.key.split('_')[0];
        const fileInfo = await strapi.plugin('upload').service('upload').findOne(fileID);
        await strapi.plugin('onlyoffice').service('file').updateFile(fileInfo, callback.url);
      }

      return ctx.send({ error: 0 });
    } catch (err) {
      return ctx.send({ error: 1 });
    }
  }
};
