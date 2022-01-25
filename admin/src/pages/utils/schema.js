import * as yup from 'yup';

const schema = yup.object().shape({
  docServUrl: yup.string(),
  docJwtSecret: yup.string(),
});

export default schema;
