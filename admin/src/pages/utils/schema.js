/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import * as yup from 'yup';

const schema = yup.object().shape({
  docServUrl: yup.string(),
  docJwtSecret: yup.string(),
});

export default schema;
