/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
import {
  EDIT_FORMATS,
  VIEW_FORMATS,
  DOCUMENT_EXTS,
  SPREADSHEET_EXTS,
  PRESENTATION_EXTS
} from '../constants/constants';
import byteSize from 'byte-size';

module.exports = {
  isFileEditable: (ext) => {
    return EDIT_FORMATS.includes(ext);
  },

  isFileViewable: (ext) => {
    return VIEW_FORMATS.includes(ext);
  },

  getFileType: (ext) => {
    return DOCUMENT_EXTS.includes(ext) ? 'word' : SPREADSHEET_EXTS.includes(ext) ? 'cell' : PRESENTATION_EXTS.includes(ext) ? 'slide' : null;
  },

  formatBytes: (receivedBytes, decimals = 0) => {
    const {value, unit} = byteSize(receivedBytes * 1000, {precision: decimals});
    if (!unit) {
      return '0B';
    }
    return `${value}${unit.toUpperCase()}`;
  }
}
