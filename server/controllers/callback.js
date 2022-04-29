/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
"use strict";
const { getService, readBody } = require('../utils');
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
    const token = await getService('onlyoffice').decodeToken(ctx);
    if (token === null) return ctx.unauthorized();

    try {
      const editorFile = await getService('onlyoffice').findFileByHash(ctx.params.file);

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

      const decodedCallbackToken = await getService('onlyoffice').decodeCallbackToken(ctx.request.query.calltoken);
      const searchParams = new URLSearchParams(decodedCallbackToken);
      if (parseInt(searchParams.get('id')) !== editorFile.id) return ctx.unauthorized();

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
            if (searchParams.get('edit') === 'false') return ctx.unauthorized();

            const formData = await getService('onlyoffice').generateFormData(fileInfo, callbackPayload);
            await getService('onlyoffice').submitFormData(formData, `Bearer ${token}`, fileInfo.id);
            ctx.send({error: 0});
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

    } catch (e) {
      return ctx.badRequest(null, e.message);
    }
  },
};
