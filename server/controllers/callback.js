/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
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

  async entrypoint (ctx) {
    const token = ctx.request.query.token;

    const payload = ctx.request.body;
    if (payload.status === 2) {
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
    }

    ctx.send({
      error: 0,
    });

  },
};
