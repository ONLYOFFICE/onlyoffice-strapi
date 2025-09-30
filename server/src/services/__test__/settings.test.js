/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
import settings from '../settings';

const storeSet = jest.fn();
global.strapi = {
  dirs: {
    public: 'publicDir',
  },
  config: {
    get: () => ({ provider: 'local' }),
  },
  plugins: {},
  store: () => ({
    get: () => ({
      editor: {
        dsURL: 'https://example.com',
        dsSecret: 'secret',
      },
    }),
    set: storeSet,
  }),
};

describe('ONLYOFFICE x Strapi file service', () => {
  test('Get dsURL from store', () => {
    expect(global.strapi.store().get().editor.dsURL).toBe('https://example.com');
  });
  test('Get dsSecret from store', () => {
    expect(global.strapi.store().get().editor.dsSecret).toBe('secret');
  });
  describe('File service getSettings by key', () => {
    const service = settings({ strapi: global.strapi });
    test('Get dsURL', async () => {
      expect((await service.getSettings('editor')).dsURL).toBe('https://example.com');
    });
    test('Get dsSecret', async () => {
      expect((await service.getSettings('editor')).dsSecret).toBe('secret');
    })
  });
});
