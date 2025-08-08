/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import jwt from 'jsonwebtoken';

export default ({ strapi }) => ({
  async verifyDocumentServerToken(token) {
    const secret = await strapi.plugin('onlyoffice').service('settings').getSettings('dsSecret');

    if (!secret) throw new Error('empty documnet serrver secret is not allowed');

    const decoded = jwt.verify(token, secret);
    return decoded;
  },
});
