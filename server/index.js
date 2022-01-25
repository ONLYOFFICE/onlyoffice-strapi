/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
'use strict';

const controllers = require('./controllers');
const routes = require('./routes');
const bootstrap = require('./bootstrap');
const config = require('./config');

module.exports = {
  config,
  controllers,
  routes,
  bootstrap,
};
