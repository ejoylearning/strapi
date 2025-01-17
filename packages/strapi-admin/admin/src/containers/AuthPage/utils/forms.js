import * as yup from 'yup';
import { translatedErrors } from '@toanz/strapi-helper-plugin';
import Login from 'ee_else_ce/containers/AuthPage/components/Login';
import ForgotPassword from '../components/ForgotPassword';
import ForgotPasswordSuccess from '../components/ForgotPasswordSuccess';
import Oops from '../components/Oops';
import Register from '../components/Register';
import ResetPassword from '../components/ResetPassword';

const forms = {
  'forgot-password': {
    Component: ForgotPassword,
    endPoint: 'forgot-password',
    fieldsToDisable: [],
    fieldsToOmit: [],
    schema: yup.object().shape({
      email: yup.string().email(translatedErrors.email).required(translatedErrors.required),
    }),
    inputsPrefix: '',
  },
  'forgot-password-success': {
    Component: ForgotPasswordSuccess,
    endPoint: '',
    fieldsToDisable: [],
    fieldsToOmit: [],
    schema: null,
    inputsPrefix: '',
  },
  login: {
    Component: Login,
    endPoint: 'login',
    fieldsToDisable: [],
    fieldsToOmit: ['rememberMe'],
    schema: yup.object().shape({
      email: yup.string().email(translatedErrors.email).required(translatedErrors.required),
      password: yup.string().required(translatedErrors.required),
      rememberMe: yup.bool().nullable(),
    }),
    inputsPrefix: '',
  },
  oops: {
    Component: Oops,
    endPoint: null,
    fieldsToDisable: [],
    fieldsToOmit: [],
    schema: null,
    inputsPrefix: '',
  },
  register: {
    Component: Register,
    endPoint: 'register',
    fieldsToDisable: ['email'],
    fieldsToOmit: ['userInfo.confirmPassword', 'userInfo.news', 'userInfo.email'],
    schema: yup.object().shape({
      userInfo: yup.object().shape({
        firstname: yup.string().required(translatedErrors.required),
        lastname: yup.string().required(translatedErrors.required),
        password: yup
          .string()
          .min(8, translatedErrors.minLength)
          .matches(/[a-z]/, 'components.Input.error.contain.lowercase')
          .matches(/[A-Z]/, 'components.Input.error.contain.uppercase')
          .matches(/\d/, 'components.Input.error.contain.number')
          .required(translatedErrors.required),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password'), null], 'components.Input.error.password.noMatch')
          .required(translatedErrors.required),
      }),
      registrationToken: yup.string().required(translatedErrors.required),
    }),
    inputsPrefix: 'userInfo.',
  },
  'register-admin': {
    Component: Register,
    endPoint: 'register-admin',
    noSignin: true,
    fieldsToDisable: [],
    fieldsToOmit: ['confirmPassword', 'news'],
    schema: yup.object().shape({
      firstname: yup.string().required(translatedErrors.required),
      lastname: yup.string().required(translatedErrors.required),
      password: yup
        .string()
        .min(8, translatedErrors.minLength)
        .matches(/[a-z]/, 'components.Input.error.contain.lowercase')
        .matches(/[A-Z]/, 'components.Input.error.contain.uppercase')
        .matches(/\d/, 'components.Input.error.contain.number')
        .required(translatedErrors.required),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'components.Input.error.password.noMatch')
        .required(translatedErrors.required),
    }),
    inputsPrefix: '',
  },
  'reset-password': {
    Component: ResetPassword,
    endPoint: 'reset-password',
    fieldsToDisable: [],
    fieldsToOmit: ['confirmPassword'],
    schema: yup.object().shape({
      password: yup
        .string()
        .min(8, translatedErrors.minLength)
        .matches(/[a-z]/, 'components.Input.error.contain.lowercase')
        .matches(/[A-Z]/, 'components.Input.error.contain.uppercase')
        .matches(/\d/, 'components.Input.error.contain.number')
        .required(translatedErrors.required),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'components.Input.error.password.noMatch')
        .required(translatedErrors.required),
    }),
  },
};

export default forms;
