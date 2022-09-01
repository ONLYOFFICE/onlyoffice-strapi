/*
 * (c) Copyright Ascensio System SIA 2022
 *
 * MIT Licensed
 */
import { auth } from '@strapi/helper-plugin';

const useAuthentication = () => {
  return {
    Authorization: `Bearer ${auth.getToken()}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
};

export default useAuthentication;
