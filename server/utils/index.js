/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
const isValidURL = require('./url');
const detectAgent = require('./agent');
const {
  isFileEditable,
  isFileSupported,
  getFileType,
} = require('./file');

module.exports = {
  isValidURL,
  isFileEditable,
  isFileSupported,
  getFileType,
  detectAgent,
};
