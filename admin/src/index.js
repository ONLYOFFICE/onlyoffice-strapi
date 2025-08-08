import { Initializer } from './components/Initializer';
import PluginIcon from './components/PluginIcon';

import permissions from './permissions';

import { PLUGIN_ID } from './pluginId';

export default {
  register(app) {
    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}.plugin.name`,
          defaultMessage: 'ONLYOFFICE PLUGIN',
        },
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}.plugin.configuration`,
            defaultMessage: 'Configuration',
          },
          id: 'settings',
          to: `plugins/${PLUGIN_ID}/settings`,
          Component: async () => {
            return import('./pages/OnlyofficeSettings');
          },
          permissions: permissions.settings,
        },
      ]
    );

    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: () => import('./pages/App'),
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./i18n/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
