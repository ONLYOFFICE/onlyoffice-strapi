/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
const { makeFile } = require('../index');

describe('File model builder', () => {
  test('Null file', () => {
    try {
      expect(makeFile({}));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE File must have a valid name');
    }
  });
  test('Null file extension', () => {
    try {
      expect(makeFile({
        name: 'test.docx',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE File must have a valid extension')
    }
  });
  test('Null file hash', () => {
    try {
      expect(makeFile({
        name: 'test.docx',
        ext: 'docx',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE File must have a valid hash');
    }
  });
  test('Null file updatedAt', () => {
    try {
      expect(makeFile({
        name: 'test.docx',
        ext: 'docx',
        hash: 'asdc',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE File must have a valid updatedAt date');
    }
  });
  test('Valid file model', () => {
    expect(makeFile({
      name: 'test.docx',
      ext: 'docx',
      hash: 'asdc',
      updatedAt: new Date().toString(),
    }));
  });
});
