/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
import * as yup from 'yup';
import { translatedErrors } from '@strapi/helper-plugin';

const schema = yup.object().shape({
  docServUrl: yup.string().required(translatedErrors.required),
  docJwtSecret: yup.string().required(translatedErrors.required)
});

export default schema;
