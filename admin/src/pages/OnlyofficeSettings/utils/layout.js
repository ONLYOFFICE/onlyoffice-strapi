/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
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
