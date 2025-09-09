/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
export const SettingsInputScheme = [
  {
    name: 'dsURL',
    required: true,
    type: 'text',
    label: {
      id: 'settings.docserv-url',
      defaultMessage: 'Document Server Address',
    },
  },
  {
    name: 'dsSecret',
    required: true,
    type: 'password',
    label: {
      id: 'settings.docserv-jwtsecret',
      defaultMessage: 'JWT Secret',
    },
  },
];
