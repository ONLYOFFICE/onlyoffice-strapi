/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
export default function buildMakeSettings({ isValidUrl }) {
  return function makeSettings({
    dsURL,
    dsSecret,
  }) {
    if (!isValidUrl(dsURL)) {
      throw new Error('ONLYOFFICE settings must have a valid document server url');
    }
    if (!dsSecret || !dsSecret.length || dsSecret.length < 3) {
      throw new Error('ONLYOFFICE settings must have no or a valid secret (>3 letters)');
    }

    return Object.freeze({
      dsURL,
      dsSecret,
    });
  }
}
