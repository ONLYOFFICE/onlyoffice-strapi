/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
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
    onSuccess: () => handleSuccess('success', 'onlyoffice.notification.success.submit'),
    onError: handleError,
  });

  return { isLoading, data, submitMutation };
};

export default useReactQuery;
