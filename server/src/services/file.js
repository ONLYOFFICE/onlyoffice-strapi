/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import _ from 'lodash';
import axios from 'axios';
import mime from 'mime-types';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { Readable } from 'stream';
import { contentTypes as contentTypesUtils } from '@strapi/utils';

import { makeFile } from '../model';

const { CREATED_BY_ATTRIBUTE } = contentTypesUtils.constants;

export default ({ strapi }) => ({
  async checkAccessAndGetFileInfo(ability, id) {
    const file = await strapi.plugin('upload').service('upload').findOne(id, [CREATED_BY_ATTRIBUTE]);

    if (_.isNil(file)) {
      throw new Error('Not found');
    }

    if (!ability) {
      throw new Error('No permission ability provided');
    }

    const canRead = await this.allowedFileAccess(ability, 'plugin::upload.read');
    if (!canRead) {
      throw new Error('Forbidden');
    }

    return makeFile({ ...file });
  },

  async allowedFileAccess(ability, action) {
    try {
      if (!ability) {
        return false;
      }

      if (action.includes('plugin::upload')) {
        return ability.can(action) || ability.can('plugin::upload.read');
      }

      return ability.can(action);
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  },

  async createFile(fileInfo, url, user = {}) {
    const response = await axios({
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        Accept: mime.lookup(url),
      },
      url
    });

    const fileSize = parseInt(response.headers?.['content-length']) || response.data?.length || 0;

    const tempDir = os.tmpdir();
    const fileName = fileInfo?.title || path.basename(url);
    const fileExt = path.extname(url) || mime.extension(mime.lookup(url)) || '';
    const tempFilePath = path.join(tempDir, `${fileName}${fileExt ? '.' + fileExt : ''}`);

    fs.writeFileSync(tempFilePath, Buffer.from(response.data));

    const file = {
      filepath: tempFilePath,
      originalFilename: fileName,
      mimetype: mime.lookup(url) || 'application/octet-stream',
      size: fileSize,
    };

    const uploadService = strapi.service('plugin::upload.upload');

    const fileData = {
      name: fileInfo?.title || path.basename(url),
      type: mime.lookup(url) || 'application/octet-stream',
      size: fileSize,
      stream: Readable.from(Buffer.from(response.data)),
    };

    try {
      const result = await uploadService.upload({
        data: { fileInfo: fileData },
        files: file
      }, { user });

      return result;
    } finally {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (error) {
        console.error('Failed to clean up temporary file:', error);
      }
    }
  },

  async updateFile(fileInfo, url) {
    const response = await axios({
      method: 'GET',
      responseType: 'arraybuffer',
      url,
    });

    const fileSize = parseInt(response.headers?.['content-length']) || response.data?.length || 0;
    const fileName = fileInfo.name || path.basename(url);
    const tempFilePath = path.join(os.tmpdir(), `${Date.now()}_${fileName}`);
    const uploadService = strapi.service('plugin::upload.upload');

    fs.writeFileSync(tempFilePath, Buffer.from(response.data));

    try {
      const updatedFile = await uploadService.replace(fileInfo.id, {
        data: {
          fileInfo: {
            name: fileName,
            size: fileSize,
          }
        },
        file: {
          filepath: tempFilePath,
          originalFilename: fileName,
          mimetype: mime.lookup(url) || fileInfo.mime || 'application/octet-stream',
          size: fileSize,
        }
      });

      return updatedFile;
    } finally {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (error) {
        console.error('Failed to clean up temporary file:', error);
      }
    }
  }
});
