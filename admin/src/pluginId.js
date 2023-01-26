/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
const pluginPkg = require('../../package.json');

const pluginId = pluginPkg.strapi.name;
const pluginVersion = pluginPkg.version;
const pluginName = pluginPkg.strapi.name;
const pluginDisplayName = pluginPkg.strapi.displayName;
const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const pluginRequired = pluginPkg.strapi.required || false;

export {
  pluginId,
  pluginVersion,
  pluginName,
  pluginDisplayName,
  pluginDescription,
  pluginRequired,
};

export default pluginId;
