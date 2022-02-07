/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import {request} from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import axiosInstance from "../../utils/axiosInstance";
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
