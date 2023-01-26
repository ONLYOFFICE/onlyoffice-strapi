/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
'use strict';
const _ = require('lodash');
const axios = require('axios');
const mime = require('mime-types');
const { Readable } = require('stream');
const { contentTypes: contentTypesUtils } = require('@strapi/utils');
const { NotFoundError, ForbiddenError } = require('@strapi/utils').errors;
const { CREATED_BY_ATTRIBUTE } = contentTypesUtils.constants;

const { makeFile } = require('../model');

const fileModel = 'plugin::upload.file'

module.exports = ({ strapi }) => ({
  /**
   * Validates user permissions and returns a file model instance
   * @param {object} ability
   * @param {string} id
   * @returns File model instance
   */
  async checkAccessAndGetFileInfo(ability, id) {
    const file = await strapi.plugin('upload').service('upload').findOne(id, [CREATED_BY_ATTRIBUTE]);

    if (_.isNil(file)) {
      throw new NotFoundError();
    }

    const pm = strapi.admin.services.permission.createPermissionsManager({ ability, action: 'plugin::upload.read', model: fileModel, });

    const creatorId = _.get(file, [CREATED_BY_ATTRIBUTE, 'id']);
    const author = creatorId ? await strapi.admin.services.user.findOne(creatorId, ['roles']) : null;

    const fileWithRoles = _.set(_.cloneDeep(file), 'createdBy', author);

    if (pm.ability.cannot(pm.action, pm.toSubject(fileWithRoles))) {
      throw new ForbiddenError();
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
    const pm = await strapi.admin.services.permission.createPermissionsManager({
      ability,
      action,
      model: fileModel,
    });

    return pm.isAllowed;
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
      header: {
        'Content-Type': 'application/json',
        Accept: mime.lookup(url),
      },
      url
    });
    const metas = {}
    const file = await strapi.plugins.upload.services.upload.formatFileInfo(
      {
        filename: fileInfo?.title,
        type: mime.lookup(url),
        size: response.headers?.['content-length'],
      },
      { name: fileInfo?.title },
      metas,
    );
    file.getStream = () => Readable.from(response.data);
    await strapi.plugins.upload.services.upload.uploadFileAndPersist(file, { user });
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
    const entity = { ...fileInfo };
    entity.getStream = () => Readable.from(response.data);
    await strapi.plugin('upload').service('provider').upload(entity);
    const fileValues = { ...fileInfo };
    await strapi.entityService.update('plugin::upload.file', fileInfo.id, { data: fileValues });
  }
});
