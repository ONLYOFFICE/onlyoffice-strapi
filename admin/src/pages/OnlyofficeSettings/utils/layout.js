/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
const layout = [
  [
    {
      intlLabel: {
        id: 'onlyoffice.settings.docserv-url',
        defaultMessage: 'Document Server Address',
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
        defaultMessage: 'Document Server JWT Secret',
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
