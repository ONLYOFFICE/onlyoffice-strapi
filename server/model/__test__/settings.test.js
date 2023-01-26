/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
const { makeSettings } = require('../index');

describe('Settings model builder', () => {
  test('Null settings model', () => {
    try {
      expect(makeSettings({}));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE settings must have a valid document server url');
    }
  });
  test('Invalid settings dsURL', () => {
    try {
      expect(makeSettings({
        dsURL: 'example.com',
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE settings must have a valid document server url');
    }
  });
  test('Invalid settings dsSecret', () => {
    try {
      expect(makeSettings({
        dsURL: 'https://example.com',
        dsSecret: ''
      }));
    } catch (e) {
      expect(e.message).toBe('ONLYOFFICE settings must have no or a valid secret (>3 letters)');
    }
  });
  test('Valid settings model', () => {
    expect(makeSettings({
      dsURL: 'https://example.com',
      dsSecret: 'secret'
    }));
  });
});
