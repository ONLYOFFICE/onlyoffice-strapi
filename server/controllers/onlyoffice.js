/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
"use strict";

module.exports = {

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
