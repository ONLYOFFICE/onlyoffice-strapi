/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
'use strict';

module.exports = {
  openapi: "3.0.0",
  info: {
    version: '1.0.0',
    title: 'ONLYOFFICE',
    description: '',
    contact: {
      name: 'TEAM',
      email: 'contact-email@something.io',
      url: 'mywebsite.io',
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
    url: 'https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html',
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
