/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
'use strict';

const controllers = require('./controllers');
const routes = require('./routes');
const bootstrap = require('./bootstrap');
const config = require('./config');
const services = require('./services');

module.exports = {
  config,
  controllers,
  routes,
  bootstrap,
  services,
};
