/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import axios from 'axios';

import { useAuthentication } from '../hooks';
import { pluginId } from '../pluginId';

export const innerAlert = (message) => {
  if (console && console.log) {
    console.log(message);
  };
};

export const onAppReady = () => {
  innerAlert('Document editor ready');
};

export const onError = (e) => {
  if (e) {
    innerAlert(e.data);
  };
};

export const buildOnRequestSave = (successCallback, failedCallback) => {
  return function onRequestSave(e) {
    const data = {
      url: e?.data?.url,
      title: e?.data?.title,
    };

    axios.post(`${window.location.origin}/${pluginId}/file/saveas`, data, {
      headers: useAuthentication(),
    })
      .then((res) => successCallback(res))
      .catch((err) => failedCallback(err));
  };
};
