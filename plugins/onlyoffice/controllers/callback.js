"use strict";
const axios = require("axios");
const mime = require("mime-types");
const FormData = require("form-data");
const _ = require("lodash");
const fs = require("fs");
const path = require('path');
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

  entrypoint: async (ctx) => {
    const payload = ctx.request.body;
    if (payload.status === 2) {
      console.log(payload);
      const uploadToken = ctx.request.query.token;
      const originalName = ctx.request.query.originalName;
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
      formData.append("files", file.data, {
        contentType: mime.lookup(payload.url),
        filename: originalName,
      });

      formData.submit({
        host: 'localhost',
        port: 6540,
        protocol: 'http:',
        path: '/upload',
        headers: {
          Authorization: `Bearer ${uploadToken}`
        }
      });
    }
    ctx.send({
      error: 0,
    });
  },
};
