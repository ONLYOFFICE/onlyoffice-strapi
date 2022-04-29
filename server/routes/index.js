/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
module.exports = [
  {
    method: 'POST',
    path: '/callback/:file',
    handler: 'callbackController.entrypoint',
    config: { auth: false },
  },
  {
    method: 'GET',
    path: '/getOnlyofficeSettings',
    handler: 'onlyofficeController.getEditorSettings',
    config: {
      policies: [
        {name: 'admin::hasPermissions', config: {actions: ['plugin::onlyoffice.settings.update']}}
      ]
    }
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
    method: 'GET',
    path: '/getEditorUrl',
    handler: 'onlyofficeController.getEditorUrl',
  },
  {
    method: 'POST',
    path: '/editorApi/:type',
    handler: 'onlyofficeController.editorApi'
  },
  {
    method: 'GET',
    path: '/findAllFiles',
    handler: 'onlyofficeController.findAllFiles',
  },
  {
    method: 'GET',
    path: '/getFile/:file',
    handler: 'onlyofficeController.getFile',
    config: { auth: false },
  },
  {
    method: 'GET',
    path: '/editorConfig/:file/:locale',
    handler: 'onlyofficeController.getConfig',
  },
];
