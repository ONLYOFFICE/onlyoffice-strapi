/*
 * (c) Copyright Ascensio System SIA 2023
 *
 * MIT Licensed
 */
import { prefixPluginTranslations } from '@strapi/helper-plugin';

import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

import pluginId, {
  pluginName,
  pluginDescription,
  pluginRequired,
  pluginDisplayName,
} from './pluginId';
import permissions from './permissions';

import { getTrad } from './utils';

export default {
  register(app) {
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: getTrad(`${pluginId}.plugin.name`),
          defaultMessage: 'ONLYOFFICE PLUGIN',
        },
      },
      [
        {
          intlLabel: {
            id: getTrad(`${pluginId}.plugin.configuration`),
            defaultMessage: 'Configuration',
          },
          id: 'settings',
          to: `/settings/${pluginId}`,
          Component: async () => {
            return import('./pages/OnlyofficeSettings');
          },
          permissions: permissions.settings,
        },
      ]
    );

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: getTrad(`${pluginId}.plugin.displayName`),
        defaultMessage: pluginDisplayName,
      },
      Component: async () => {
        return await import('./pages/App');
      },
      permissions: permissions.pluginUpload,
    });

    app.registerPlugin({
      blockerComponent: null,
      blockerComponentProps: {},
      description: pluginDescription,
      injectedComponents: [],
      isRequired: pluginRequired,
      layout: null,
      preventComponentRendering: false,
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      pluginName,
    });
  },

  bootstrap() {},

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./i18n/${locale}.json`)
          .then(({ default: data }) => {
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
