/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
const buildMakeConfig = require('./config');
const buildMakeSettings = require('./settings');
const buildMakeFile = require('./file');

const fileUtils = require('../utils/file');
const isValidUrl = require('../utils/url');

const makeConfig = buildMakeConfig({ ...fileUtils, generateDocKey: () => {}, isValidUrl });
const makeSettings = buildMakeSettings({ isValidUrl });
const makeFile = buildMakeFile();

module.exports = {
  makeConfig,
  makeSettings,
  makeFile,
};
