/**
 * Copyright (c) Ascensio System SIA 2022. All rights reserved.
 * http://www.onlyoffice.com
 **/
import * as yup from 'yup';

const schema = yup.object().shape({
  docServUrl: yup.string(),
  docJwtSecret: yup.string(),
});

export default schema;
