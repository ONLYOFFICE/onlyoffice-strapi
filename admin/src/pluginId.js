/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
const pluginPkg = require('../../package.json');
const pluginId = pluginPkg.name.replace(
  /^strapi-plugin-/i,
  ''
);

module.exports = pluginId;
