/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import getTrad from './getTrad';
import { pipe, compose, Maybe } from './func';
import { isValidURL, sanitizeURL } from './url';
import {
  getFileFavicon,
  getFileType,
  isFileEditable,
  isFileOpenable,
  formatFileSize,
  sanitizeFile,
  omitExt,
  STRAPI_FILE_FILTER,
  getFileIconType,
} from './file';

export {
  getTrad,
  formatFileSize,
  getFileFavicon,
  getFileType,
  isFileEditable,
  isFileOpenable,
  sanitizeFile,
  omitExt,
  STRAPI_FILE_FILTER,
  getFileIconType,
  pipe,
  compose,
  Maybe,
  isValidURL,
  sanitizeURL,
};
