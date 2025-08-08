/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
const bootstrap = async ({ strapi }) => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'onlyoffice',
  });

  const editor = await pluginStore.get({ key: 'editor' });

  if (!editor) {
    const ds = { dsURL: '', dsSecret: '' };
    pluginStore.set({ key: 'editor', value: ds });
  }
};

export default bootstrap;
