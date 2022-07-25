/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
'use strict';
const settingsRoutes = require('./settings');
const onlyofficeRoutes = require('./onlyoffice');

module.exports = [
  ...settingsRoutes,
  ...onlyofficeRoutes,
];
