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
module.exports = [
  {
    method: 'POST',
    path: '/callback/:file',
    handler: 'callbackController.entrypoint',
    config: { auth: false },
  },
  {
    method: 'GET',
    path: '/getOnlyofficeSettings',
    handler: 'onlyofficeController.getEditorSettings',
    config: {
      policies: [
        {name: 'admin::hasPermissions', config: {actions: ['plugin::onlyoffice-strapi.settings.update']}}
      ]
    }
  },
  {
    method: 'PUT',
    path: '/updateOnlyofficeSettings',
    handler: 'onlyofficeController.updateEditorSettings',
    config: {
      policies: [
        {name: 'admin::hasPermissions', config: {actions: ['plugin::onlyoffice-strapi.settings.update']}}
      ]
    }
  },
  {
    method: 'GET',
    path: '/getEditorUrl',
    handler: 'onlyofficeController.getEditorUrl',
  },
  {
    method: 'POST',
    path: '/editorApi/:type',
    handler: 'onlyofficeController.editorApi'
  },
  {
    method: 'GET',
    path: '/findAllFiles',
    handler: 'onlyofficeController.findAllFiles',
  },
  {
    method: 'GET',
    path: '/getFile/:file',
    handler: 'onlyofficeController.getFile',
    config: { auth: false },
  },
  {
    method: 'GET',
    path: '/editorConfig/:file/:locale',
    handler: 'onlyofficeController.getConfig',
  },
];
