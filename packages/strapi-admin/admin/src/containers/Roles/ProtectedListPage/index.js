import React from 'react';
import { CheckPagePermissions } from '@toanz/strapi-helper-plugin';
import adminPermissions from '../../../permissions';
import ListPage from '../ListPage';

const ProtectedListPage = () => (
  <CheckPagePermissions permissions={adminPermissions.settings.roles.main}>
    <ListPage />
  </CheckPagePermissions>
);

export default ProtectedListPage;
