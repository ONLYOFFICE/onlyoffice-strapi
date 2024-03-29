/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
module.exports = function isValidURL(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
