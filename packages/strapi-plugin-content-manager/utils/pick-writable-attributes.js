'use strict';

const { omit } = require('lodash/fp');
const { getNonWritableAttributes } = require('@toanz/strapi-utils').contentTypes;

module.exports = (model) => omit(getNonWritableAttributes(strapi.getModel(model)));
