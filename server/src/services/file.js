/*
 * (c) Copyright Ascensio System SIA 2023
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
  /**
   * Validates user permissions and returns a file model instance
   * @param {object} ability
   * @param {string} id
   * @returns File model instance
   */
  async checkAccessAndGetFileInfo(ability, id) {
    const file = await strapi.plugin('upload').service('upload').findOne(id, [CREATED_BY_ATTRIBUTE]);

    if (_.isNil(file)) {
      throw new Error('Not found');
    }

    // For Strapi v5, we need to check permissions differently
    // The ability object should contain the user's permissions
    if (!ability) {
      throw new Error('No permission ability provided');
    }

    // Check if user can read upload files
    const canRead = await this.allowedFileAccess(ability, 'plugin::upload.read');
    if (!canRead) {
      throw new Error('Forbidden');
    }

    return makeFile({ ...file });
  },

  /**
   * Validates user ability to perform actions
   * @param {*} ability
   * @param {*} action
   * @returns Boolean flag isAllowed
   */
  async allowedFileAccess(ability, action) {
    try {
      // In Strapi v5, we check permissions directly on the ability object
      if (!ability) {
        return false;
      }

      // Check if the ability has the required permission
      // For upload permissions, we need to check if the user has access to the upload plugin
      if (action.includes('plugin::upload')) {
        // Check if user has access to upload plugin
        return ability.can(action) || ability.can('plugin::upload.read');
      }

      return ability.can(action);
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  },

  /**
   * Downloads a new file and persists the file to Strapi upload plugin
   * @param {object} fileInfo
   * @param {string} url
   */
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

  /**
   * Downloads file changes and persists the file to Strapi upload plugin
   * @param {object} fileInfo
   * @param {string} url
   */
  async updateFile(fileInfo, url) {
    const response = await axios({
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        Accept: mime.lookup(url),
      },
      url,
    });

    // Calculate file size in bytes
    const fileSize = parseInt(response.headers?.['content-length']) || response.data?.length || 0;

    // Update the file using entity service with new file data
    const updatedFile = await strapi.entityService.update('plugin::upload.file', fileInfo.id, {
      data: {
        size: parseFloat(fileSize), // Convert to decimal for Strapi
        updatedAt: new Date(),
      },
      files: {
        buffer: Buffer.from(response.data),
        name: fileInfo.name,
        type: mime.lookup(url) || 'application/octet-stream',
      },
    });

    return updatedFile;
  }
});
