/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
module.exports = function buildMakeFile() {
  return function makeFile({ name, ext, hash, updatedAt }) {
    if (!name || !name.length) {
      throw new Error('ONLYOFFICE File must have a valid name');
    }

    if (!ext || !ext.length) {
      throw new Error('ONLYOFFICE File must have a valid extension');
    }

    if (!hash || !hash.length) {
      throw new Error('ONLYOFFICE File must have a valid hash');
    }

    if (!updatedAt) {
      throw new Error('ONLYOFFICE File must have a valid updatedAt date');
    }

    return Object.freeze({
      name,
      ext,
      hash,
      updatedAt: new Date(updatedAt).getTime().toString(),
    });
  }
}
