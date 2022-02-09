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
const { getService } = require('../utils');

module.exports = {
  async editorApi(ctx) {
    const type = ctx.params.type;
    const data = ctx.request.body;
    const { authorization } = ctx.request.header;
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
      const config = await strapi.store({
        environment: '',
        type: 'plugin',
        name: 'onlyoffice',
        key: 'editorConfig',
      })
        .get();

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
};
