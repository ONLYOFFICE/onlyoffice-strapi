/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import { useAuth } from '@strapi/strapi/admin';

const useAuthentication = () => {
  try {
    const token = useAuth('useAuthentication', (state) => {
      return state.token;
    });

    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.warn('Failed to get authentication token:', error);
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }
};

export default useAuthentication;
