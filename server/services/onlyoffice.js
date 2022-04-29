/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
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

module.exports = ({strapi}) => ({
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
    const encodedToken = decodeURIComponent(ctx.request.query.token);
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

  async decodeCallbackToken(token) {
    const encodedToken = decodeURIComponent(token);
    const uuid = await getOnlyofficeData('uuid');

    return CryptoJS.AES.decrypt(encodedToken, uuid.onlyofficeKey).toString(CryptoJS.enc.Utf8);
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

  findFileByHash(hash) {
    return strapi.query('plugin::upload.file').findOne({where: {hash: hash}});
  },

  async incrementIndex(filename) {
    const reg = new RegExp(/( \((([0-9])+)\)(\.[^\/.]*)?)$/);
    const resReg = reg.test(filename);
    const ext = filename.substring(filename.lastIndexOf('.'));
    const basename = resReg ? filename.replace(filename.match(reg)[0], '') : filename.replace(ext, '');

    let files = await strapi.entityService.findMany('plugin::upload.file', {
      filters: {
        name: {
          $startsWith: basename
        },
        ext: ext
      }
    });

    if (files.length !== 0) {
      const elemToDelete = [];
      for (let i = 0; i < files.length; i++) {
        let matchedFilename = files[i].name.match(reg);
        matchedFilename = matchedFilename ? files[i].name.replace(matchedFilename[0], ext) : files[i].name;
        if (matchedFilename !== `${basename}${ext}`) {
          elemToDelete.push(i);
        }
      }
      for (let index of elemToDelete) {
        files.splice(index, 1);
      }
      const fileIndexes = [];
      for (let i = 0; i < files.length; i++) {
        const match = files[i].name.match(reg);
        if (match && match[2]) {
          fileIndexes.push(parseInt(match[2]));
        }
      }
      for (let i = 0; i < fileIndexes.length + 1; i++) {
        if (!fileIndexes.includes(i + 1)) {
          filename = `${basename} (${i + 1})${ext}`;
          break;
        }
      }
    }

    return filename;
  },

});
