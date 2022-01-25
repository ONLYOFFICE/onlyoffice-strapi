/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
module.exports = [
  {
    method: 'POST',
    path: '/callback',
    handler: 'callbackController.entrypoint',
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
];
