/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
export function isValidURL(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
