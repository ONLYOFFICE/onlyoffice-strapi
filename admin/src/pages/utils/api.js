/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import {request} from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import axiosInstance from "../../utils/axiosInstance";

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
  const searchParams = new URLSearchParams(search);
  const data = await axiosInstance.get(`/${pluginId}/findAllFiles${search}`);
  const tmp = data.data;

  const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
  const filesCount = tmp.length;
  const pageSize = searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')) : 10;
  const pageCount = (filesCount <= 10 ? 1 : Math.floor(filesCount / pageSize)) + (filesCount >= 10 && filesCount % pageSize !== 0 ? 1 : 0);
  const pagination = {
    page: page,
    pageCount: pageCount,
    pageSize: pageSize,
    total: filesCount,
  }
  const start = page === 1 ? 0 : (page - 1)*pageSize;
  const end = pageSize*(page);
  const files = tmp.slice(start, end);

  return {results: files, pagination: pagination};
};

const updateEditorSettings = async ({body}) => {
  await request(`/${pluginId}/updateOnlyofficeSettings`, {method: 'PUT', body});
}

export {fetchEditorSettings, updateEditorSettings, fetchFiles};
