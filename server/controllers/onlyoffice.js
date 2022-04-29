/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
"use strict";
const {getService, isFileEditable, isFileOpenable, getFileType, readTokenFromHeader} = require('../utils');
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const axios = require('axios');
const fileModel = 'plugin::upload.file';

module.exports = {
  async editorApi(ctx) {
    const type = ctx.params.type;
    const data = ctx.request.body;
    const {authorization} = ctx.request.header;
    switch (type) {
      case 'saveas': {
        const title = await getService('onlyoffice').incrementIndex(data.title);
        const fileInfo = {
          alternativeText: title,
          caption: title,
          name: title,
        };
        try {
          const formData = await getService('onlyoffice').generateFormData(fileInfo, data);
          await getService('onlyoffice').submitFormData(formData, authorization);
          ctx.send({ok: true, title: title});
        } catch (e) {
          return ctx.badRequest(null, e.message);
        }
        break;
      }
    }
  },

  async getEditorSettings(ctx) {
    try {
      const config = await getService('onlyoffice').getOnlyofficeData('editorConfig');

      ctx.send({
        docServConfig: config.docServConfig
      });

    } catch (e) {
      return ctx.badRequest(null, e.message);
    }
  },

  async getEditorUrl(ctx) {
    try {
      const config = await getService('onlyoffice').getOnlyofficeData('editorConfig');

      ctx.send({
        docServUrl: config.docServConfig.docServUrl
      });

    } catch (e) {
      return ctx.badRequest(null, e.message);
    }
  },

  async updateEditorSettings(ctx) {
    const docServConfig = ctx.request.body;
    const pluginStore = strapi.store({type: 'plugin', name: 'onlyoffice'});

    const config = {
      docServConfig: Object(docServConfig)
    };

    await pluginStore.set({key: 'editorConfig', value: config});

    return ctx.send({ok: true});
  },

  async findAllFiles(ctx) {
    const { userAbility: ability } = ctx.state;

    const pm = strapi.admin.services.permission.createPermissionsManager({
      ability: ability,
      action: 'plugin::upload.read',
      model: fileModel,
    });

    if (!pm.isAllowed) {
      return ctx.forbidden();
    }

    let query = pm.addPermissionsQueryTo(ctx.query);
    const results = await strapi.entityService.findMany(fileModel, query);
    const sanitized = await pm.sanitizeOutput(results);

    let tmp = [];
    sanitized.forEach((file) => {
      if (isFileOpenable(file.ext) || isFileEditable(file.ext)) {
        file.edit = isFileEditable(file.ext);
        tmp.push(file);
      }
    });
    return ctx.send(tmp);
  },

  async getFile(ctx) {
    const token = await getService('onlyoffice').decodeToken(ctx);
    if (token === null) return ctx.unauthorized();

    const ooConfig = await getService('onlyoffice').getOnlyofficeData('editorConfig');
    if (ooConfig.docServConfig.docJwtSecret !== '') {
        const checkJwtHeaderRes = readTokenFromHeader(ctx.request.header, ooConfig.docServConfig.docJwtSecret);
        if (!checkJwtHeaderRes) {
          return ctx.badRequest(403, 'Validation error');
      }
    }

    try {
      const editorFile = await getService('onlyoffice').findFileByHash(ctx.params.file);
      ctx.response.redirect(editorFile.url);
    } catch (err) {
      return ctx.badRequest(null, 'File not found');
    }
  },

  async getConfig(ctx) {
    const ooConfig = await getService('onlyoffice').getOnlyofficeData('editorConfig');

    const editorUrl = ooConfig.docServConfig.docServUrl;
    try {
      await axios({
        method: "get",
        timeout: 5*1000,
        url: `${editorUrl}${editorUrl.charAt(editorUrl.length - 1) === '/' ? '' : '/'}web-apps/apps/api/documents/api.js`,
      });
    } catch (e) {
      return ctx.badRequest(null, 'Docs API unreachable');
    }

    const editPermission = 'plugin::upload.assets.update';
    const downloadPermission = 'plugin::upload.assets.download';
    const { userAbility: ability } = ctx.state;

    let proto = 'http:'
    try {
      await axios.get(`${proto}//${ctx.request.header.host}`);
    } catch (e) {
      proto = 'https:';
    }

    const editorFile = await strapi.plugins[
      'upload'
      ].services.upload.findOne(ctx.params.file);

    const authToken = await getService('onlyoffice').getTokenFromRequest(ctx);
    if (authToken === null) ctx.unauthorized();
    const uuid = await getService('onlyoffice').getOnlyofficeData('uuid');

    const encodedToken = encodeURIComponent(CryptoJS.AES.encrypt(authToken, uuid.onlyofficeKey).toString());
    const userData = ctx.state.user;

    const pm = strapi.admin.services.permission.createPermissionsManager({
      ability: ability,
      action: editPermission,
      model: fileModel,
    });

    const pmDownload = strapi.admin.services.permission.createPermissionsManager({
      ability: ability,
      action: downloadPermission,
      model: fileModel,
    });

    const url = `${proto}//${ctx.request.header.host}/onlyoffice/getFile/${editorFile.hash}?token=${encodedToken}`;
    const documentType = getFileType(editorFile.ext);

    let userCanEdit = pm.isAllowed;
    const callbackToken = userCanEdit ? encodeURIComponent(CryptoJS.AES.encrypt(`?edit=${userCanEdit ? 'can' : 'false'}&id=${editorFile.id}`, uuid.onlyofficeKey).toString())  : '';

    const fileEditable = isFileEditable(editorFile.ext);

    const docKey = editorFile.hash + new Date(editorFile.updatedAt).getTime().toString();
    const config = {
      documentType: documentType,
      document: {
        fileType: editorFile.ext.replace('.', ''),
        key: docKey,
        title: editorFile.name,
        url: url,
        permissions: {
          edit: userCanEdit && fileEditable,
          download: pmDownload.isAllowed
        }
      },
      editorConfig: {
        mode: userCanEdit && fileEditable ? 'edit' : 'view',
        callbackUrl: `${proto}//${ctx.request.header.host}/onlyoffice/callback/${editorFile.hash}?token=${encodedToken}&calltoken=${callbackToken}`,
        user: {
          id: userData.id.toString(),
          name: `${userData.firstname} ${userData.lastname}`
        },
        lang: userData.preferedLanguage || ctx.params.locale,
        customization: {
          forcesave: false,
          goback: {
            blank: false,
            url: ''
          }
        }
      },
    };

    if (ooConfig.docServConfig.docJwtSecret !== '') {
      config.token = jwt.sign(config, ooConfig.docServConfig.docJwtSecret);
    }
    return ctx.send(config);
  }

};
