/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import { isValidURL } from '../../utils';

export const buildValidateSettings = (errorMessages) => {
  return async (settings) => {
    const errors = {};

    if (!settings?.dsURL || !isValidURL(settings.dsURL)) { errors.dsURL = errorMessages.dsURL; }

    if (!settings?.dsSecret || settings.dsSecret.trim().length === 0) { errors.dsSecret = errorMessages.dsSecret; }

    return errors;
  }
}
