/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import axios from 'axios';

import { PLUGIN_ID } from '../pluginId';

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

const getAuthHeaders = () => {
  try {
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwtToken='));

    if (jwtCookie) {
      return {
        Authorization: `Bearer ${jwtCookie.split('=')[1]}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
    }
  } catch (error) {
    console.warn('Failed to get jwt token from cookie:', error);
  }

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
};

export const buildOnRequestSave = (successCallback, failedCallback) => {
  return function onRequestSave(e) {
    const data = {
      url: e?.data?.url,
      title: e?.data?.title,
    };

    axios.post(`${window.location.origin}/${PLUGIN_ID}/file/saveas`, data, {
      headers: getAuthHeaders(),
    })
      .then((res) => successCallback(res))
      .catch((err) => failedCallback(err));
  };
};
