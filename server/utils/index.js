/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
'use strict';
const jwt = require('jsonwebtoken');

const EDIT_FORMATS = ['.docx', '.pptx', '.xlsx'];

const DOCUMENT_EXTS = ['.doc', '.docx', '.docm', '.dot', '.dotx', '.dotm', '.odt', '.fodt', '.ott', '.rtf', '.txt', '.html', '.htm', '.mht', '.xml', '.pdf', '.djvu', '.fb2', '.epub', '.xps', '.oxps'];
const SPREADSHEET_EXTS = ['.xls', '.xlsx', '.xlsm', '.xlt', '.xltx', '.xltm', '.ods', '.fods', '.ots', '.csv'];
const PRESENTATION_EXTS = ['.pps', '.ppsx', '.ppsm', '.ppt', '.pptx', '.pptm', '.pot', '.potx', '.potm', '.odp', '.fodp', '.otp'];

const getService = name => {
  return strapi.plugin('onlyoffice').service(name);
};
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
  getService,
  readBody,
  readTokenFromHeader,
  readTokenFromBody,

  isFileEditable: (ext) => {
    return EDIT_FORMATS.includes(ext);
  },

  isFileOpenable: (ext) => {
    return DOCUMENT_EXTS.concat(SPREADSHEET_EXTS).concat(PRESENTATION_EXTS).includes(ext);
  },

  getFileType: (ext) => {
    return DOCUMENT_EXTS.includes(ext) ? 'word' : SPREADSHEET_EXTS.includes(ext) ? 'cell' : PRESENTATION_EXTS.includes(ext) ? 'slide' : null;
  },
};
