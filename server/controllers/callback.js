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
const axios = require("axios");
const { getService } = require('../utils');
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
        const formData = await getService('onlyoffice').generateFormData(fileInfo, callbackPayload);
        await getService('onlyoffice').submitFormData(formData, `Bearer ${token}`, fileInfo.id);
      }

    } catch (e) {
      return ctx.unauthorized();
    }

    ctx.send({
      error: 0,
    });

  },
};
