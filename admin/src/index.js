/*
* (c) Copyright Ascensio System SIA 2022
*
* MIT Licensed
*/
import {prefixPluginTranslations} from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import pluginPermissions from "./permissions";
import reducers from "./reducers";


const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const name = pluginPkg.strapi.name;
const displayName = pluginPkg.strapi.displayName;

export default {
  register(app) {
    app.addReducers(reducers);

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: displayName,
      },
      Component: async () => {
        return await import('./pages/App');
      },
      permissions: []
    });

    app.registerPlugin({
      blockerComponent: null,
      blockerComponentProps: {},
      description: pluginDescription,
      injectedComponents: [],
      isRequired: pluginPkg.strapi.required || false,
      layout: null,
      preventComponentRendering: false,
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    app.addSettingsLink('global', {
      id: `${pluginId}-settings`,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: displayName,
      },
      to: `/settings/${pluginId}`,
      Component: async () => {
        return await import('./pages/OnlyofficeSettings');
      },
      permissions: pluginPermissions.settings,
    });
  },

  async registerTrads({locales}) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({default: data}) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );
    return Promise.resolve(importedTrads);
  },

};
