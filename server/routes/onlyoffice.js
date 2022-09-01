/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/editor/:file/:locale',
    handler: 'editor.getEditor',
  },
  {
    method: 'GET',
    path: '/file',
    handler: 'file.download',
    config: { auth: false },
  },
  {
    method: 'POST',
    path: '/file/saveas',
    handler: 'file.saveAs',
  },
  {
    method: 'POST',
    path: '/callback',
    handler: 'callback.handle',
    config: { auth: false },
  }
];
