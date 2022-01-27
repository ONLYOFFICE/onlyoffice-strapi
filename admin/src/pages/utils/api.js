/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
import { request } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';

const fetchEditorSettings = async toggleNotification => {
  try {
    const data = await request(`/${pluginId}/getOnlyofficeSettings`, { method: 'GET' });
    return data;
  } catch (err) {
    toggleNotification({
      type: 'warning',
      message: { id: 'notification.error' },
    });
    return null;
  }
};

const updateEditorSettings = async ({ body }) => {
  await request(`/${pluginId}/updateOnlyofficeSettings`, {method: 'PUT', body});
}

export { fetchEditorSettings, updateEditorSettings };
