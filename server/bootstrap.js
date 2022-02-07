/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/* eslint-disable no-unreachable */
'use strict';

const ONLYOFFICE_ACTIONS = [
  {
    section: 'plugins',
    displayName: 'Set or update ONLYOFFICE plugin settings',
    uid: 'settings.update',
    pluginName: 'onlyoffice',
  }
];

/**
 *
 * @param {{strapi: import("@strapi/strapi").Strapi}} args
 */
module.exports = async ({strapi}) => {
  await strapi.admin.services.permission.actionProvider.registerMany(ONLYOFFICE_ACTIONS);

  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'onlyoffice',
  });

  const editorConfig = await pluginStore.get({key: 'editorConfig'});

  const docServConfig = {
    docJwtSecret: '',
    docServUrl: null
  }

  if (!editorConfig) {
    pluginStore.set({key: 'editorConfig', value: {docServConfig: docServConfig}});
  }

};
