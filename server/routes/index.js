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
    path: '/callback',
    handler: 'callbackController.entrypoint',
    config: { auth: false },
  },
  {
    method: 'GET',
    path: '/getOnlyofficeSettings',
    handler: 'onlyofficeController.getEditorSettings',
  },
  {
    method: 'PUT',
    path: '/updateOnlyofficeSettings',
    handler: 'onlyofficeController.updateEditorSettings',
    config: {
      policies: [
        {name: 'admin::hasPermissions', config: {actions: ['plugin::onlyoffice.settings.update']}}
      ]
    }
  },
  {
    method: 'POST',
    path: '/editorApi/:type',
    handler: 'onlyofficeController.editorApi'
  },
];
