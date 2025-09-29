/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import buildMakeConfig from './config';
import buildMakeSettings from './settings';
import buildMakeFile from './file';

import { isValidURL } from '../utils';
import { isFileEditable, isFileSupported, getFileType } from '../utils/file';

const makeConfig = buildMakeConfig({ isFileEditable, isFileSupported, getFileType, isValidUrl: isValidURL });
const makeSettings = buildMakeSettings({ isValidUrl: isValidURL });
const makeFile = buildMakeFile();

export {
  makeConfig,
  makeSettings,
  makeFile,
};
