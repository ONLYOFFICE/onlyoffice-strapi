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
const layout = [
  [
    {
      intlLabel: {
        id: 'onlyoffice.settings.docserv-url',
        defaultMessage: 'Document server address',
      },
      name: 'docServUrl',
      type: 'text',
      size: {
        col: 6,
        xs: 12,
      },
      required: true,
    },
    {
      intlLabel: {
        id: 'onlyoffice.settings.docserv-jwtsecret',
        defaultMessage: 'Document server JWT secret',
      },
      description: {
        id: 'onlyoffice.settings.docserv-jwtsecret-desc',
        defaultMessage: 'Secret key (leave blank to disable)',
      },
      name: 'docJwtSecret',
      type: 'text',
      size: {
        col: 6,
        xs: 12,
      },
    },
  ]
];

export default layout;
