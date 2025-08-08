/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import jwt from 'jsonwebtoken';

export default ({ strapi }) => ({
  /**
   * Extracts DSJwt secret and verifies tokens
   * @param {string} token
   * @returns Verified and decoded JWT payload
   */
  async verifyDocumentServerToken(token) {
    const secret = await strapi.plugin('onlyoffice').service('settings').getSettings('dsSecret');

    if (!secret) throw new Error('empty documnet serrver secret is not allowed');

    const decoded = jwt.verify(token, secret);
    return decoded;
  },
});
