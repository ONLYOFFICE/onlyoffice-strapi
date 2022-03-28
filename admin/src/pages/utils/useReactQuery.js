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
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNotification } from '@strapi/helper-plugin';
import { fetchEditorSettings, updateEditorSettings } from './api';
import getTrad from '../../utils/getTrad';

const useReactQuery = () => {
  const queryClient = useQueryClient();
  const toggleNotification = useNotification();
  const { isLoading, data } = useQuery('get-onlyoffice-settings', () =>
    fetchEditorSettings(toggleNotification)
  );

  const handleError = err => {
    toggleNotification({
      type: 'warning',
      message: err.response.payload.message,
    });
  };

  const handleSuccess = (type, tradId) => {
    queryClient.invalidateQueries('get-onlyoffice-settings');
    toggleNotification({
      type,
      message: { id: getTrad(tradId) },
    });
  };

  const submitMutation = useMutation(updateEditorSettings, {
    onSuccess: () => handleSuccess('success', 'onlyoffice-strapi.notification.success.submit'),
    onError: handleError,
  });

  return { isLoading, data, submitMutation };
};

export default useReactQuery;
