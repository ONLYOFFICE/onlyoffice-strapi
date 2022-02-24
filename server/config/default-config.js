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
'use strict';

module.exports = {
  openapi: "3.0.0",
  info: {
    version: '1.0.0',
    title: 'ONLYOFFICE',
    description: '',
    contact: {
      name: 'Ascensio System SIA',
      email: 'integration@onlyoffice.com',
      url: 'https://www.onlyoffice.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  'x-strapi-config': {
    path: '/onlyoffice',
    showGeneratedFiles: true,
  },
  servers: [],
  externalDocs: {
    description: 'Find out more',
    url: 'https://www.onlyoffice.com',
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
