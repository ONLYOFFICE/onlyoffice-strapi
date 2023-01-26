/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import byteSize from 'byte-size';
import cell from '../assets/cell.ico';
import slide from '../assets/slide.ico';
import word from '../assets/word.ico';

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

export const STRAPI_FILE_FILTER =
  '&filters[$and][0][mime][$not][$contains][0]=image&filters[$and][0][mime][$not][$contains][1]=video';

export const formatFileSize = (bytes, decimals = 0) => {
  const { value, unit } = byteSize(bytes * 1000, { precision: decimals });
  if (!unit) {
    return bytes;
  }
  return `${value}${unit.toUpperCase()}`;
};

export const omitExt = (filename) => {
  const name = filename.substring(0, filename.lastIndexOf('.'));
  return name;
};

export const isFileEditable = (ext) => {
  const e = ext.toLowerCase().replace('.', '');
  return EDITABLE_EXTS.includes(e);
};

export const isFileOpenable = (ext) => {
  const e = ext.toLowerCase().replace('.', '');
  return OPENABLE_EXTS.includes(e);
};

export const getFileType = (ext) => {
  const e = ext.toLowerCase().replace('.', '');
  return DOCUMENT_EXTS.includes(e)
    ? WORD
    : SPREADSHEET_EXTS.includes(e)
      ? CELL
      : PRESENTATION_EXTS.includes(e)
        ? SLIDE
        : null;
};

export const getFileFavicon = (ext) => {
  const e = ext.toLowerCase().replace('.', '') || ext;
  return DOCUMENT_EXTS.includes(e)
    ? word
    : SPREADSHEET_EXTS.includes(e)
      ? cell
      : PRESENTATION_EXTS.includes(e)
        ? slide
        : word;
}

export const sanitizeFile = (file) => {
  if (file.size) file.size = formatFileSize(file.size);
  if (file.ext) file.ext = file.ext.toString().toLowerCase().replace('.', '');
  return file;
};
