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
'use strict';

const axios = require("axios");
const mime = require("mime-types");
const FormData = require("form-data");
const CryptoJS = require("crypto-js");

const getOnlyofficeData = async (key) => {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'onlyoffice',
    key: key,
  })
    .get();
};

module.exports = ({ strapi }) => ({
  getOnlyofficeData,

  async generateFormData(fileInfo, payload) {
    const file = await axios({
      method: "get",
      responseType: "arraybuffer",
      headers: {
        'Content-Type': 'application/json',
        'Accept': mime.lookup(payload.url),
      },
      url: payload.url,
    });

    const formData = new FormData();

    formData.append('files', file.data, {
      contentType: mime.lookup(payload.url),
      filename: fileInfo.name,
    });

    formData.append(
      'fileInfo',
      JSON.stringify({
        alternativeText: fileInfo.alternativeText,
        caption: fileInfo.caption,
        name: fileInfo.name,
      })
    );

    return formData;
  },

  async submitFormData(formData, token, id = null) {
    let proto = 'http:'
    try {
      await axios.get(`${proto}//${strapi.config.host}:${strapi.config.port}`);
    } catch (e) {
      proto = 'https:';
    }

    const path = id ? `/upload?id=${id}` : '/upload';
    formData.submit({
        host: strapi.config.host,
        port: strapi.config.port,
        protocol: proto,
        path: path,
        headers: {
          Authorization: token
        }
      }
    );
  },

  async decodeToken(ctx) {
    const encodedToken = ctx.request.query.token;
    const uuid = await getOnlyofficeData('uuid');

    const token = CryptoJS.AES.decrypt(encodedToken, uuid.onlyofficeKey).toString(CryptoJS.enc.Utf8);
    try {
      await strapi.plugins[
        'users-permissions'
        ].services.jwt.verify(token);

      return token;
    } catch (e) {
      try {
        const {isValid} = strapi.service(`admin::token`).decodeJwtToken(token);
        if (!isValid) return null;
        return token;
      } catch (e) {
        return null;
      }
    }
  },

  getTokenFromRequest(ctx) {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(/\s+/);

      if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
        return null;
      }
      return parts[1];
    }
    return null;
  },

});
