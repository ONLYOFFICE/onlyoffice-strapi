/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { makeSettings } from '../model';
import { isValidURL } from '../utils';

export default ({ strapi }) => ({
  getStore() {
    return strapi.store({ type: 'plugin', name: 'onlyoffice' });
  },

  async validateDocumentServerVersion({ dsURL, dsSecret }) {
    if (!isValidURL(dsURL)) return false;

    try {
      const url = dsURL.endsWith('/') ? `${dsURL.substring(0, dsURL.length - 1)}/coauthoring/CommandService.ashx` : `${dsURL}/coauthoring/CommandService.ashx`;
      const body = (dsSecret && dsSecret.length) ? { token: jwt.sign({ c: 'version' }, dsSecret, { expiresIn: '1m' }) } : { c: 'version' };
      const info = await axios.post(url, JSON.stringify(body));

      if (info.data.error !== 0) return false;
      const version = parseFloat(info.data.version);

      return version > 7;
    } catch {
      return false;
    }
  },

  async updateSettings(body) {
    const settings = makeSettings({ ...body });
    const valid = await this.validateDocumentServerVersion({ ...settings });

    if (!valid) {
      throw new Error('Could not fetch ONLYOFFICE Document Server / Invalid Document Server Version (expected 7.x.x)');
    }

    await this.getStore().set({ key: 'editor', value: settings });
  },

  async getSettings(key = null) {
    const info = await this.getStore().get({ key: 'editor' });

    if (key) {
      return info[key];
    }

    return info;
  }
});
