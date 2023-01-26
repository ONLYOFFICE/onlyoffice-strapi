/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
const permissions = {
  read: [{ action: 'plugin::upload.read', subject: null }],
  update: [{ action: 'plugin::upload.assets.update', subject: null }],
  create: [{ action: 'plugin::upload.assets.create', subject: null }],
  settings: [{ action: 'plugin::upload.settings.read', subject: null }],
};

export default permissions;
