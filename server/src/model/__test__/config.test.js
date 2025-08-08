/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import { makeConfig } from '../index';

describe('Config model builder', () => {
  test('Null config fileName', () => {
    try {
      expect(makeConfig({}));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid file name');
    }
  });
  test('Null config fileExt', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid/supported file extension')
    }
  });
  test('Invalid config fileExt', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
        fileExt: 'rar',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid/supported file extension');
    }
  });
  test('Null config download url', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
        fileExt: 'docx',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid download url');
    }
  });
  test('Invalid config download url', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
        fileExt: 'docx',
        url: 'example.com',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid download url');
    }
  });
  test('Null config callback url', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
        fileExt: 'docx',
        url: 'https://example.com',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid callback url');
    }
  });
  test('Invalid config callback url', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
        fileExt: 'docx',
        url: 'https://example.com',
        callback: 'example.com',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid callback url');
    }
  });
  test('Invalid config user', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
        fileExt: 'docx',
        url: 'https://example.com',
        callback: 'https://example.com',
        user: {},
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid user id');
    }
  });
  test('Invalid config user', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
        fileExt: 'docx',
        url: 'https://example.com',
        callback: 'https://example.com',
        user: {},
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects a valid user id');
    }
  });
  test('Invalid config user name', () => {
    try {
      expect(makeConfig({
        fileName: 'test.docx',
        fileExt: 'docx',
        url: 'https://example.com',
        callback: 'https://example.com',
        user: {
          id: 1,
        },
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE Config expects valid first and last names');
    }
  });
  test('Valid config', () => {
    expect(makeConfig({
      fileName: 'test.docx',
      fileExt: 'docx',
      url: 'https://example.com',
      callback: 'https://example.com',
      user: {
        id: 1,
        firstname: 'User',
        lastname: 'Mock',
      },
    })).toBeDefined();
  });
});
