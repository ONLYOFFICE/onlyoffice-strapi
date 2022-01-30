/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
import {request} from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import {axiosInstance} from "../../../../../../../.cache/admin/src/core/utils";
import {isFileEditable, isFileViewable} from "../../utils/fileUtility";

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

const fetchFiles = async (search = '') => {
  const data = await axiosInstance.get(`/upload/files${search}`);
  const tmp = [];
  data.data.results.forEach((file) => {
    if (isFileViewable(file.ext) || isFileEditable(file.ext)) {
      tmp.push(file);
    }
  });
  return {results: tmp, pagination: data.data.pagination}
};

const updateEditorSettings = async ({body}) => {
  await request(`/${pluginId}/updateOnlyofficeSettings`, {method: 'PUT', body});
}

export {fetchEditorSettings, updateEditorSettings, fetchFiles};
