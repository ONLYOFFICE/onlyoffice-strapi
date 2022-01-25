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

  fileLastUpdated: (lastModified) => {
    let modifiedTime = '';
    lastModified = new Date(lastModified).getTime();
    let timeDiff = Math.floor((new Date().getTime() - lastModified) / 1000 % 60);
    switch (timeDiff) {
      case timeDiff < 60: {
        modifiedTime = `${timeDiff} seconds`;
        break;
      }
      case timeDiff >= 60 && timeDiff < 60 * 60: {
        modifiedTime = `${Math.floor(timeDiff / 60)} minutes`;
        break;
      }
      case timeDiff >= 60*60 && timeDiff < 60 * 60: {
        modifiedTime = `${Math.floor(timeDiff / (60*60))} hours`;
        break;
      }
      case timeDiff >= 60*60*24 && timeDiff < 60*60*24*7: {
        modifiedTime = `${Math.floor(timeDiff / (60*60*24))} days`;
        break;
      }
    }
    return `${modifiedTime} ago`;
  }

}