import * as yup from 'yup';
import { translatedErrors } from '@toanz/strapi-helper-plugin';

const schema = yup.object().shape({
  firstname: yup.string().required(translatedErrors.required),
  lastname: yup.string().required(translatedErrors.required),
  email: yup.string().email(translatedErrors.email).required(translatedErrors.required),
  roles: yup.array().min(1, translatedErrors.min).required(translatedErrors.required),
});

export default schema;
