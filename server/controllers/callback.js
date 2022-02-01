/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
"use strict";
const axios = require("axios");
const mime = require("mime-types");
const FormData = require("form-data");
/**
 * callback.js controller
 *
 * @description: onlyoffice document server handlers
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  async entrypoint(ctx) {
    const token = ctx.request.query.token;
    try {
      const {isValid, payload} = strapi.service(`admin::token`).decodeJwtToken(token);
      const {id} = await strapi.plugins[
        'users-permissions'
        ].services.jwt.verify(token);

      if (!isValid || id !== payload.id) {
        return ctx.unauthorized();
      }

      const fileInfo = JSON.parse(ctx.request.query.fileInfo);

      const callbackPayload = ctx.request.body;
      if (callbackPayload.status === 2) {
        const file = await axios({
          method: "get",
          responseType: "arraybuffer",
          headers: {
            'Content-Type': 'application/json',
            'Accept': mime.lookup(callbackPayload.url),
          },
          url: callbackPayload.url,
        });

        const formData = new FormData();
        formData.append('files', file.data, {
          contentType: mime.lookup(callbackPayload.url),
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

        let proto = 'http:'
        try {
          await axios.get(`${proto}//${strapi.config.host}:${strapi.config.port}`);
        } catch (e) {
          proto = 'https:';
        }

        formData.submit({
            host: strapi.config.host,
            port: strapi.config.port,
            protocol: proto,
            path: `/upload?id=${fileInfo.id}`,
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

    } catch (e) {
      return ctx.unauthorized();
    }

    ctx.send({
      error: 0,
    });

  },
};
