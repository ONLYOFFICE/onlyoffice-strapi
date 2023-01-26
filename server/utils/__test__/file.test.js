/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
const { isFileEditable, isFileSupported, getFileType } = require('../file');

describe('File utility', () => {
  describe('Detect editable files', () => {
    test('OOXML file', () => {
      expect(isFileEditable('docx')).toBeTruthy();
    });
    test('OOXML file (dot format)', () => {
      expect(isFileEditable('.docx')).toBeTruthy();
    });
    test('Office file', () => {
      expect(isFileEditable('xls')).toBeFalsy();
    });
    test('Office file (dot format)', () => {
      expect(isFileEditable('.xls')).toBeFalsy();
    });
  });
  describe('Detect supported files', () => {
    test('OOXML file', () => {
      expect(isFileSupported('docx')).toBeTruthy();
    });
    test('OOXML file (dot format)', () => {
      expect(isFileSupported('.docx')).toBeTruthy();
    });
    test('Office file', () => {
      expect(isFileSupported('xls')).toBeTruthy();
    });
    test('Office file (dot format)', () => {
      expect(isFileSupported('.xls')).toBeTruthy();
    });
    test('Unknown file', () => {
      expect(isFileSupported('rar')).toBeFalsy();
    });
    test('Unknown file (dot format)', () => {
      expect(isFileSupported('.rar')).toBeFalsy();
    });
  });
  describe('Get file type', () => {
    test('OOXML word file', () => {
      expect(getFileType('docx')).toBe('word');
    });
    test('OOXML word file (dot format)', () => {
      expect(getFileType('.docx')).toBe('word');
    });
    test('OOXML cell file', () => {
      expect(getFileType('xlsx')).toBe('cell');
    });
    test('OOXML cell file (dot format)', () => {
      expect(getFileType('.xlsx')).toBe('cell');
    });
    test('OOXML slide file', () => {
      expect(getFileType('pptx')).toBe('slide');
    });
    test('OOXML slide file (dot format)', () => {
      expect(getFileType('.pptx')).toBe('slide');
    });
    test('Office word file', () => {
      expect(getFileType('doc')).toBe('word');
    });
    test('Office word file (dot format)', () => {
      expect(getFileType('.doc')).toBe('word');
    });
    test('Office cell file', () => {
      expect(getFileType('xls')).toBe('cell');
    });
    test('Office cell file (dot format)', () => {
      expect(getFileType('.xls')).toBe('cell');
    });
    test('Office slide file', () => {
      expect(getFileType('ppt')).toBe('slide');
    });
    test('Office slide file (dot format)', () => {
      expect(getFileType('.ppt')).toBe('slide');
    });
    test('Unknown file', () => {
      expect(getFileType('rar')).toBeNull();
    });
    test('Unknown file (dot format)', () => {
      expect(getFileType('.rar')).toBeNull();
    });
  });
});
