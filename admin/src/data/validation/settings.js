/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import { isValidURL } from '../../utils';

export const validateSettings = async (settings) => {
  const errors = {};

  if (!isValidURL(settings?.dsURL)) {
    errors.dsURL =
      'Invalid Document Server Address. Use http(s)://<domain>.<zone>';
  }

  if (!settings.dsSecret) {
    errors.dsSecret = 'Please specify Document Server JWT';
  }

  return errors;
};
