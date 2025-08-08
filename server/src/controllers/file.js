/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
export default {
  async download(ctx) {
    const token = ctx.request.query?.token;

    if (!token) return ctx.unauthorized();

    try {
      const decoded = await strapi.plugin('users-permissions').services.jwt.verify(token);

      if (!decoded?.id) throw new Error('invalid file id');
      const file = await strapi.plugin('upload').service('upload').findOne(decoded.id);

      ctx.response.redirect(file.url);
    } catch {
      return ctx.forbidden();
    }
  },

  async saveAs(ctx) {
    const body = ctx.request.body;
    const { user } = ctx.state;
    try {
      await strapi.plugin('onlyoffice').service('file').createFile({ title: body?.title }, body?.url, user);
      return ctx.send();
    } catch (err) {
      return ctx.badRequest();
    }
  }
};
