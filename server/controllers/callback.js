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
const jwt = require('jsonwebtoken');
/**
 * callback.js controller
 *
 * @description: onlyoffice document server handlers
 */

const readTokenFromBody = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

const readTokenFromHeader = (headers, secret) => {
  const jwtHeader = 'Authorization';
  const authorization = headers[jwtHeader.toLowerCase()];
  const prefix = 'Bearer ';
  if (authorization && authorization.startsWith(prefix)) {
    const token = authorization.substring(prefix.length);
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  }
  return null;
};

const readBody = async (req) => {
  const ooConfig = await getService('onlyoffice').getOnlyofficeData('editorConfig');
  if (ooConfig.docServConfig.docJwtSecret !== '') {
    if (req.body.token) {
      return readTokenFromBody(req.body.token, ooConfig.docServConfig.docJwtSecret);
    } else {
      const checkJwtHeaderRes = readTokenFromHeader(req.header, ooConfig.docServConfig.docJwtSecret);
      if (checkJwtHeaderRes) {
        if (checkJwtHeaderRes.payload) {
          return checkJwtHeaderRes.payload;
        }
      }
    }
  }
  return req.body;
};

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  async entrypoint(ctx) {
    const token = await getService('onlyoffice').decodeToken(ctx);
    if (token === null) return ctx.unauthorized();

    try {
      const editorFile = await strapi.plugins[
        'upload'
        ].services.upload.findOne(ctx.params.file);

      const fileInfo = {
        id: editorFile.id,
        caption: editorFile.caption,
        name: editorFile.name,
        alternativeText: editorFile.alternativeText
      }

      const callbackPayload = await readBody(ctx.request);
      if (callbackPayload === null) {
        ctx.send({error: 1, message: 'No callback payload'});
        return;
      }

      switch (callbackPayload.status) {
        case 0: {
          ctx.send({error: 1, message: 'ONLYOFFICE has reported that no doc with the specified key can be found'});
          return;
        }
        case 1: {
          ctx.send({error: 0, message: 'User has entered/exited ONLYOFFICE'});
          return;
        }
        case 2: {
          try {
            const formData = await getService('onlyoffice').generateFormData(fileInfo, callbackPayload);
            await getService('onlyoffice').submitFormData(formData, `Bearer ${token}`, fileInfo.id);
          } catch (e) {
            ctx.send({error: 1, message: 'Process save failed'});
          }
          return;
        }
        case 3: {
          ctx.send({error: 1, message: 'ONLYOFFICE has reported that saving the document has failed'});
          return;
        }
        case 4: {
          ctx.send({error: 0, message: 'No document updates'});
          return;
        }
      }
      ctx.send({
        error: 0,
      });

    } catch (e) {
      return ctx.badRequest(null, e.message);
    }
  },
};
