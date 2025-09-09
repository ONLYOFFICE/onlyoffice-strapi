/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */

export default {
  openapi: '3.0.0',
  info: {
    version: '1.1.0',
    title: 'ONLYOFFICE',
    description:
      'The ONLYOFFICE plugin allows users to view, edit, and co-author office documents, spreadsheets, and presentations added to the Strapi Media Library using ONLYOFFICE Docs.',
    contact: {
      name: 'Ascensio System SIA',
      email: 'integration@onlyoffice.com',
      url: 'https://www.onlyoffice.com',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/ONLYOFFICE/onlyoffice-strapi/blob/main/LICENSE',
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
