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

module.exports = ({ strapi }) => ({
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
});
