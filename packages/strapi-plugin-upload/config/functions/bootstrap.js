'use strict';

const { convertToStrapiError } = require('../../errors');

module.exports = async () => {
  // set plugin store
  const configurator = strapi.store({
    type: 'plugin',
    name: 'upload',
    key: 'settings',
  });

  strapi.plugins.upload.provider = createProvider(strapi.plugins.upload.config || {});

  // if provider config does not exist set one by default
  const config = await configurator.get();

  if (!config) {
    await configurator.set({
      value: {
        sizeOptimization: true,
        responsiveDimensions: true,
      },
    });
  }

  await pruneObsoleteRelations();
  await registerPermissionActions();
};

const wrapFunctionForErrors =
  (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      throw convertToStrapiError(err);
    }
  };

const createProvider = ({ provider, providerOptions, actionOptions = {} }) => {
  try {
    const providerInstance = require(`@toanz/strapi-provider-upload-${provider}`).init(
      providerOptions
    );

    return Object.assign(Object.create(baseProvider), {
      ...providerInstance,
      upload: wrapFunctionForErrors((file, options = actionOptions.upload) => {
        return providerInstance.upload(file, options);
      }),
      delete: wrapFunctionForErrors((file, options = actionOptions.delete) => {
        return providerInstance.delete(file, options);
      }),
    });
  } catch (err) {
    strapi.log.error(err);
    throw new Error(
      `The provider package isn't installed. Please run \`npm install @toanz/strapi-provider-upload-${provider}\``
    );
  }
};

const baseProvider = {
  extend(obj) {
    Object.assign(this, obj);
  },
  upload() {
    throw new Error('Provider upload method is not implemented');
  },
  delete() {
    throw new Error('Provider delete method is not implemented');
  },
};

const pruneObsoleteRelations = async () => {
  const { upload: plugin } = strapi.plugins;
  const modelIsNotDefined = !plugin || !plugin.models || !plugin.models.file;

  if (modelIsNotDefined) {
    return Promise.resolve();
  }

  await strapi.query('file', 'upload').custom(pruneObsoleteRelationsQuery)();
};

const pruneObsoleteRelationsQuery = ({ model }) => {
  if (model.orm !== 'mongoose') {
    return Promise.resolve();
  }

  const models = Array.from(strapi.db.models.values());
  const modelsId = models.map((model) => model.globalId);

  return model.updateMany(
    { related: { $elemMatch: { kind: { $nin: modelsId } } } },
    { $pull: { related: { kind: { $nin: modelsId } } } }
  );
};

const registerPermissionActions = async () => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the Media Library',
      uid: 'read',
      pluginName: 'upload',
    },
    {
      section: 'plugins',
      displayName: 'Create (upload)',
      uid: 'assets.create',
      subCategory: 'assets',
      pluginName: 'upload',
    },
    {
      section: 'plugins',
      displayName: 'Update (crop, details, replace) + delete',
      uid: 'assets.update',
      subCategory: 'assets',
      pluginName: 'upload',
    },
    {
      section: 'plugins',
      displayName: 'Download',
      uid: 'assets.download',
      subCategory: 'assets',
      pluginName: 'upload',
    },
    {
      section: 'plugins',
      displayName: 'Copy link',
      uid: 'assets.copy-link',
      subCategory: 'assets',
      pluginName: 'upload',
    },
    {
      section: 'settings',
      displayName: 'Access the Media Library settings page',
      uid: 'settings.read',
      category: 'media library',
      pluginName: 'upload',
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
