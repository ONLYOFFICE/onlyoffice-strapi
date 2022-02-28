/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
"use strict";
const {getService, isFileEditable, isFileOpenable, getFileType} = require('../utils');
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");

module.exports = {
  async editorApi(ctx) {
    const type = ctx.params.type;
    const data = ctx.request.body;
    const {authorization} = ctx.request.header;
    switch (type) {
      case 'saveas': {
        const fileInfo = {
          alternativeText: data.title,
          caption: data.title,
          name: data.title,
        };
        try {
          const formData = await getService('onlyoffice').generateFormData(fileInfo, data);
          await getService('onlyoffice').submitFormData(formData, authorization);
          ctx.send({ok: true});
        } catch (e) {
          ctx.badRequest(null, e.message);
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
      ctx.badRequest(null, e.message);
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
    const allFiles = await strapi.plugins[
      'upload'
      ].services.upload.findMany(ctx.query);
    let tmp = [];
    allFiles.forEach((file) => {
      if (isFileOpenable(file.ext) || isFileEditable(file.ext)) {
        file.edit = isFileEditable(file.ext);
        tmp.push(file);
      }
    });
    return ctx.send(tmp);
  },

  async getFile(ctx) {
    const token = await getService('onlyoffice').decodeToken(ctx);
    if (token === null) ctx.unauthorized();
  },

  async getConfig(ctx) {
    const ooConfig = await getService('onlyoffice').getOnlyofficeData('editorConfig');
    const editorFile = await strapi.plugins[
      'upload'
      ].services.upload.findOne(ctx.params.file);

    const authToken = await getService('onlyoffice').getTokenFromRequest(ctx);
    if (authToken === null) ctx.unauthorized();
    const uuid = await getService('onlyoffice').getOnlyofficeData('uuid');

    const encodedToken = CryptoJS.AES.encrypt(authToken, uuid.onlyofficeKey).toString();
    const userData = ctx.state.user;
    const url = `${ctx.request.header.host}/onlyoffice/getFile/${editorFile.id}?token=${encodedToken}`;
    const documentType = getFileType(editorFile.ext);
    const userCanEdit = true;
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
          edit: userCanEdit && fileEditable
        }
      },
      editorConfig: {
        mode: userCanEdit && fileEditable ? 'edit' : 'view',
        callbackUrl: `${ctx.request.header.host}/onlyoffice/callback/${editorFile.id}?token=${encodedToken}`,
        user: {
          id: userData.id.toString(),
          name: `${userData.firstname} ${userData.lastname}`
        },
        lang: userData.preferedLanguage || 'en',
        customization: {
          forcesave: false
        }
      },
    };

    if (ooConfig.docServConfig.docJwtSecret !== '') {
      config.token = jwt.sign(config, ooConfig.docServConfig.docJwtSecret);
    }
    return ctx.send(config);
  }

};
