/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
export const SettingsInputScheme = [
  {
    name: 'dsURL',
    required: true,
    type: 'text',
    label: {
      id: 'onlyoffice.settings.docserv-url',
      defaultMessage: 'Document Server Address',
    },
  },
  {
    name: 'dsSecret',
    required: true,
    type: 'password',
    label: {
      id: 'onlyoffice.settings.docserv-jwtsecret',
      defaultMessage: 'JWT Secret',
    },
  },
];
