/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
const DOCUMENT_EXTS = [
  'doc',
  'docx',
  'docm',
  'dot',
  'dotx',
  'dotm',
  'odt',
  'fodt',
  'ott',
  'rtf',
  'txt',
  'html',
  'htm',
  'mht',
  'xml',
  'pdf',
  'djvu',
  'fb2',
  'epub',
  'xps',
  'oxps',
];
const SPREADSHEET_EXTS = [
  'xls',
  'xlsx',
  'xlsm',
  'xlt',
  'xltx',
  'xltm',
  'ods',
  'fods',
  'ots',
  'csv',
];
const PRESENTATION_EXTS = [
  'pps',
  'ppsx',
  'ppsm',
  'ppt',
  'pptx',
  'pptm',
  'pot',
  'potx',
  'potm',
  'odp',
  'fodp',
  'otp',
];

const EDITABLE_EXTS = ['docx', 'pptx', 'xlsx'];
const OPENABLE_EXTS =
  DOCUMENT_EXTS.concat(SPREADSHEET_EXTS).concat(PRESENTATION_EXTS);

const WORD = 'word';
const SLIDE = 'slide';
const CELL = 'cell';

const isFileEditable = (ext) => {
  const e = ext.toLowerCase().replace('.', '');
  return EDITABLE_EXTS.includes(e);
};

const isFileSupported = (ext) => {
  const e = ext.toLowerCase().replace('.', '');
  return OPENABLE_EXTS.includes(e);
};

const getFileType = (ext) => {
  const e = ext.toLowerCase().replace('.', '');
  return DOCUMENT_EXTS.includes(e)
    ? WORD
    : SPREADSHEET_EXTS.includes(e)
      ? CELL
      : PRESENTATION_EXTS.includes(e)
        ? SLIDE
        : null;
};

module.exports = {
  isFileEditable,
  isFileSupported,
  getFileType,
};
