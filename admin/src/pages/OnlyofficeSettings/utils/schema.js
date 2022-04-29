/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import * as yup from 'yup';
import { translatedErrors } from '@strapi/helper-plugin';

const schema = yup.object().shape({
  docServUrl: yup.string().required(translatedErrors.required),
  docJwtSecret: yup.string()
});

export default schema;
