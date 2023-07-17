import * as yup from 'yup';
import { translatedErrors } from '@akemona-org/strapi-helper-plugin';

const schema = yup.object().shape({
  name: yup.string().required(translatedErrors.required),
  description: yup.string().required(translatedErrors.required),
});

export default schema;
