/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import { isValidURL } from '../url';

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
