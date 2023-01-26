/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import { isValidURL } from '../../utils';

export const buildValidateSettings = (errors) => {
  return async (settings) => {
    if (isValidURL(settings?.dsURL)) delete errors.dsURL;

    if (settings.dsSecret) delete errors.dsSecret;

    return errors;
  }
}
