/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
const isValidURL = require('../url');

describe('URL utility', () => {
  test('Valid https URL', () => {
    expect(isValidURL('https://example.com')).toBeTruthy();
  });
  test('Valid http URL', () => {
    expect(isValidURL('http://example.com')).toBeTruthy();
  });
  test('Invalid URL', () => {
    expect(isValidURL('example.com')).toBeFalsy();
  });
});
